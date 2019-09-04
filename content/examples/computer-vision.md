+++
date = "2019-03-26T21:56:55+01:00"
title = "Computer Vision"
tags = ["example"]
categories = ["general"]
draft = false
description = "Triangulation"
weight = 1
author = "Christoph Schmidt"
+++



We want to reconstruct a three-dimensional object from two-dimensional images. Think of an object, maybe a [dinosaur], that is captured by $n$ cameras from different angles. Suppose we have the following information available:

- the configuration of the cameras (in the form of [camera][pinhole camera model] [matrices][camera matrix]);
- sets of 2D points in the $n$ two-dimensional images, where each set corresponds to one 3D point.

(Actually, the second bullet is the more challenging part in reconstructing three-dimensional objects. We assume that this task has already been done.)

The goal is to compute the following 3D picture

<p style="text-align:center;"><img src="/images/dino.png" width="700px"/></p>

In theory, it suffices to have two matching 2D points and the configuration of the cameras to *exactly* reconstruct the corresponding 3D point. In practice, there is lens distortion, pixelation, the algorithm matching the 2D points is not working fully precise and so on. This is why we are looking for 3D points that minimize the euclidean distance regarding their 2D image points. We want to solve an optimization problem.

This post is restricted to the case $n=2$, i.e. we want to reconstruct 3D points from images captured by two cameras at a time. We take the [dinosaur] data set from the Visual Geometry Group
Department of Engineering Science at the University of Oxford. This contains a list of [36 cameras](jl-files/cameras.jl) as $3\times 4$ matrices and a corresponding list of [pictures taken from 4983 world points](jl-files/pictures.jl). (The use the code below one must download the files from these links.)

Let $x\in\mathbb{R}^3$ be a 3D point. Then, taking a picture $u=(u_1,u_2)\in\mathbb{R}^2$ of $x$ is modeled as

$$\lambda \, \begin{pmatrix} u_1 \\\ u_2 \\\ 1 \end{pmatrix} = A \, \begin{pmatrix}x_1 \\\ x_2 \\\ x_3  \\\ 1\end{pmatrix},$$

where $A\in \mathbb{R}^{3\times 4}$ is the camera matrix and $\lambda \in \mathbb{R}, \lambda \neq 0$, is a scalar. This is called the pinhole camera model. Let us write $y(x)$ for the right hand side of this equation.

If $p = (p_1, p_2) \in\mathbb{R}^2\times \mathbb{R}^2$ are two input pictures from the data set with camera matrices $A_1,A_2$, we want to solve the following minimization problem:

$$\underset{(x,\lambda) \in \mathbb{R}^3\times (\mathbb{R}\backslash \\{0\\})}{\operatorname{argmin}}\; \lVert y_1(x) - p_1 \rVert^2 + \lVert y_2(x) - p_2 \rVert^2.$$


## Implementation with Homotopy Continuation

Now let's this optimization problem using homotopy continuation by solving the critical equations. We use the cameras `n₁=1` and `n₂=2`.

```julia
using DynamicPolynomials, LinearAlgebra, HomotopyContinuation

include("cameras.jl")
include("pictures.jl")
n₁, n₂ = 1, 2

@polyvar x[1:3]
@polyvar λ[1:2]
@polyvar p[1:2,1:2]

y = [cams[i]*[x; 1] for i in camera_numbers]
g = [λ[i] .* y[i] - [p[:,i]; 1] for i in 1:2]
G = sum(gᵢ ⋅ gᵢ for gᵢ in g)
# G is the function that we want to optimize
```

For `G=0` we generate the critical equations `F=0`.

```julia
F = differentiate(G, [x;λ])
```

`F` is a system of polynomials in the variables `x` and `λ` and the parameters `p`. We want to solve this system many times for different parameters. For this, we want to use the guide on how to [track many systems in a loop](guides/many-systems).

First, we need an initial solution for a random set of parameters.
```julia
p₀ = randn(ComplexF64, 4)
F₀ = [subs(Fᵢ, vec(p)=>p₀) for Fᵢ in F]
start = solutions(nonsingular(solve(F₀)))
```

`start` contains 8 solutions. Two of them have either `λ[1]=0` or  `λ[2]=0`. We need  to sort them out in the loop below. Note that, by the discussion at the end of this example, the number of critical points `F=0` is indeed 6.

```julia
photos = ps[:, [1, 2, 3, 4]]
tracker = pathtracker(F; parameters=vec(p), generic_parameters=p₀)
reconstructed_points = Vector{Vector{Float64}}()

for pᵢ in photos
	# the data from the dataset is incomplete.
	# the cameras did not take pictures of all world points.
	# if a world point was not capture, the entry in the data set is -1.
	if all(pᵢ .> 0)
		set_parameters!(tracker; target_parameters=pᵢ)
		R = Vector{Vector{Float64}}() # array for the real solutions
		N = Vector{Float64}() # array for the values of the target function G
		for s in start
			result = track(tracker, s)
			if is_success(result) && is_real(result)
				r = real.(solution(result))
				# check if λ[1]=0 or λ[2]=0
				if abs.(s[4]) > 1e-10 && abs.(s[5]) > 1e-10
					push!(R,r)
					push!(N, G([x;λ]=>r, vec(p) => pᵢ))
				end
			end
			# add the real solution that minimizes the target function
			i = findmin(N)
			push!(reconstructed_points, R[i[2]])
		end
end

```

Doing this for several pairs of cameras we get the above picture.



## EDdegree of the Multiview variety

The closure (under [Zariski topology]) of $\\{(y_1(x),y_2(x))\in \mathbb{R}^2\times \mathbb{R}^2 \mid x \in \mathbb{R}^3\\}$ is called *(affine) multiview variety* for two cameras.

Regarding such an affine multiview variety, the number of (complex) critical points of the squared distance function is an invariant, which is called the *euclidean distance degree* (ED degree). [Maxim, Rodriguez and Wang proved][ED degree paper] showed that the EDdegree of the Multiview variety for 2 cameras is 6. We used this information in the code above for verifying that the initial computation for `F₀` was correct.


[dinosaur]: <https://www.robots.ox.ac.uk/~vgg/data/data-mview.html>
[pinhole camera model]: <https://en.wikipedia.org/wiki/Pinhole_camera_model>
[camera matrix]: <https://en.wikipedia.org/wiki/Camera_matrix>
[monodromy]: <https://www.juliahomotopycontinuation.org/guides/monodromy/>
[PathTracker]: <https://www.juliahomotopycontinuation.org/guides/many-systems/>
[Zariski topology]: <https://en.wikipedia.org/wiki/Zariski_topology>
[ED degree paper]: <https://arxiv.org/abs/1812.05648>
