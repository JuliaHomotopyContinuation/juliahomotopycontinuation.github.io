+++
date = "2019-09-03T21:56:55+01:00"
title = "Computer vision"
tags = ["example"]
categories = ["general"]
draft = false
description = "Triangulation of a dinosaur"
weight = 1
author = "Paul Breiding, Christoph Schmidt"
group = "applications"
+++

<span style="color: gray">This post was worked out in a [student seminar](https://www.math.tu-berlin.de/fachgebiete_ag_diskalg/fachgebiet_algorithmische_algebra/v_menue/veranstaltungen/2019ss/software_seminar_numerical_nonlinear_algebra/) that we held at TU Berlin in summer 2019. </span>


We want to reconstruct a three-dimensional object from two-dimensional images. Think of an object, maybe a [dinosaur], that is captured by $n$ cameras from different angles. Suppose we have the following information available:

- the configuration of the cameras (in the form of [camera][pinhole camera model] [matrices][camera matrix]);
- sets of 2D points in the $n$ two-dimensional images, where each set corresponds to one 3D point.

(Actually, the second bullet is the more challenging part in reconstructing three-dimensional objects. We assume that this task has already been done.)

The goal is to compute the following 3D picture

<p style="text-align:center;"><img src="/images/dino.png" width="700px"/></p>

In theory, it suffices to have two matching 2D points and the configuration of the cameras to *exactly* reconstruct the corresponding 3D point. In practice, there is lens distortion, pixelation, the algorithm matching the 2D points is not working fully precise and so on. This is why we are looking for 3D points that minimize the euclidean distance regarding their 2D image points. We want to solve an optimization problem.

This post is restricted to the case $n=2$, i.e. we want to reconstruct 3D points from images captured by two cameras at a time. We take the [dinosaur] data set from the Visual Geometry Group
Department of Engineering Science at the University of Oxford. This contains a list of [36 cameras](https://gist.github.com/PBrdng/46436855f3755c5a959a7c5d6ba7e32b#file-cameras-jl) as $3\times 4$ matrices and a corresponding list of [pictures taken from 4983 world points](https://gist.github.com/PBrdng/46436855f3755c5a959a7c5d6ba7e32b#file-pictures-jl). (For using the code below one must download the files from these links.)

Let $x\in\mathbb{R}^3$ be a 3D point. Then, taking a picture $u=(u_1,u_2)\in\mathbb{R}^2$ of $x$ is modeled as

$$ \begin{pmatrix} u_1 \\\ u_2 \\\ 1 \end{pmatrix} = t \, A \, \begin{pmatrix}x_1 \\\ x_2 \\\ x_3  \\\ 1\end{pmatrix},$$

where $A\in \mathbb{R}^{3\times 4}$ is the camera matrix and $t \in \mathbb{R}, t \neq 0$, is a scalar. This is called the pinhole camera model. Let us write $y(x)$ for the first two entries of  $A \begin{pmatrix} x\\\ 1\end{pmatrix}$, and $z(x)$ for the third entry. Then, $u=t y(x)$ and $1 = t z(x)$.

If $p = (p_1, p_2) \in\mathbb{R}^2\times \mathbb{R}^2$ are two input pictures from the data set, we want to solve the following minimization problem:

$$
\underset{(x,t) \in \mathbb{R}^3\times (\mathbb{R}\backslash \\{0\\})^2}{\operatorname{argmin}}\; \lVert t_1 \, y_1(x) - p_1 \rVert^2 + \lVert  t_2 \,  y_2(x) - p_2 \rVert^2
$$

$$
\text{s.t. }\; t_1 \, z_1(x) = 1 \;\text{ and } \;t_2 \, z_2(x)=1.\quad $$

## Implementation with Homotopy Continuation

Now let's solve this optimization problem using homotopy continuation by solving the critical equations. We use the cameras `n₁=1` and `n₂=2`. The camera data

```julia
using DynamicPolynomials, LinearAlgebra, HomotopyContinuation

include("cameras.jl")
include("pictures.jl")
n₁, n₂ = 1, 2

@polyvar x[1:3]
@polyvar t[1:2]
@polyvar p[1:2,1:2]

y = [cams[i][1:2,:]*[x; 1] for i in camera_numbers]
z = [cams[i][3,:] ⋅ [x; 1] for i in camera_numbers] .* 648
```

The last multiplication by 648 is because the data is given in pixel units (between 0 and 648). For numerical stability it is better to work with coordinates between 0 and 1. Now, we define the target function.

```julia
g = [t[i] .* y[i] - p[:,i] for i in 1:2]
G = sum(gᵢ ⋅ gᵢ for gᵢ in g)
# G is the function that we want to optimize
```

For `G` we generate the critical equations `F=0` using Lagrange multipliers.

```julia
@polyvar λ[1:2] # the Lagrance multipliers
F = differentiate(G - sum(λ[i] * (t[i] * z[i] - 1) for i in 1:2), [x;t;λ])
```

`F` is a system of polynomials in the variables `x`, `t` and `λ` and the parameters `p`. We want to solve this system many times for different parameters. For this, we use the guide on how to [track many systems in a loop](guides/many-systems).

First, we need an initial solution for a random set of parameters.
```julia
p₀ = randn(ComplexF64, 4)
F₀ = [subs(Fᵢ, vec(p)=>p₀) for Fᵢ in F]
start = solutions(solve(F₀))
```

`start` contains 6 solutions. By the discussion at the end of this example, the number of critical points `F=0` is indeed 6. Now, we track these 6 solutions towards the photo parameters we are interested in.

```julia
photos = ps[:, [1, 2, 3, 4]]
tracker = pathtracker(F; parameters=vec(p), generic_parameters=p₀)
reconstructed_points = Vector{Vector{Float64}}()

for pᵢ in photos
	# the data from the dataset is incomplete.
	# the cameras did not take pictures of all world points.
	# if a world point was not captured, the entry in the data set is -1.
	if all(pᵢ .> 0)
		# we divide by 648 for working with coordinates between 0 and 1
		# (as explained above)
		set_parameters!(tracker; target_parameters=pᵢ./648)
		R = Vector{Vector{Float64}}() # array for the real solutions
		N = Vector{Float64}() # array for the values of the target function G
		for s in start
			result = track(tracker, s)
			if is_success(result) && is_real(result)
				r = real.(solution(result))
				push!(R,r[1:3])
				push!(N, G([x;t]=>r[1:5], vec(p) => pᵢ))
			end
			# add the real solution that minimizes the target function
			i = findmin(N)
			push!(reconstructed_points, R[i[2]])
		end
end

```

Doing this for several pairs of cameras we get the above picture.



## EDdegree of the Multiview variety

The closure (under [Zariski topology]) of

$$\\{(t_1y_1(x), t_2y_2(x))\in \mathbb{R}^2\times \mathbb{R}^2  \, \mid \, t_1z_1(x) = t_2z_2(x) = 1,  (x,t)\in \mathbb{R}^3 \times (\mathbb{R}\backslash \\{0\\})^2\\}$$

is called *(affine) multiview variety* for two cameras.

Regarding such an affine multiview variety, the number of (complex) critical points of the squared distance function `G` is an invariant, which is called the *euclidean distance degree* (ED degree). [Maxim, Rodriguez and Wang proved][ED degree paper] showed that the EDdegree of the Multiview variety for 2 cameras is 6. We used this information in the code above for verifying that the initial computation for `F₀` was correct.


{{<bibtex >}}



[dinosaur]: <https://www.robots.ox.ac.uk/~vgg/data/data-mview.html>
[pinhole camera model]: <https://en.wikipedia.org/wiki/Pinhole_camera_model>
[camera matrix]: <https://en.wikipedia.org/wiki/Camera_matrix>
[monodromy]: <https://www.juliahomotopycontinuation.org/guides/monodromy/>
[PathTracker]: <https://www.juliahomotopycontinuation.org/guides/many-systems/>
[Zariski topology]: <https://en.wikipedia.org/wiki/Zariski_topology>
[ED degree paper]: <https://arxiv.org/abs/1812.05648>
