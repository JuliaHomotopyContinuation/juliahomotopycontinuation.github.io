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

In theory, it suffices to have two matching 2D points and the configuration of the cameras to *exactly* reconstruct the corresponding 3D point. In practice, there is lens distortion, pixelation, the algorithm matching the 2D points is not working fully precise and so on. This is why we are looking for 3D points that minimize the euclidean distance regarding their 2D image points. We want to solve an optimization problem.

This post is restricted to the case $n=2$, i.e. we want to reconstruct 3D points from images captured by two cameras at a time. We take the [dinosaur] data set from the Visual Geometry Group
Department of Engineering Science at the University of Oxford. This contains a list of [36 cameras](jl-files/cameras.jl) as $3\times 4$ matrices and a corresponding list of [pictures taken from 4983 world points](jl-files/pictures.jl).

Let $x\in\mathbb{R}^3$ be a 3D point and let $M$ be a camera matrix. Then, taking a picture $y$ of $x$ is modeled as

$$y(x) = \frac{Ax+b}{c^Tx+d}, \;\text{ where }\; M=\begin{bmatrix} A & b \\\ c^T & d\end{bmatrix},$$
and where $A\in \mathbb{R}^{2\times 3}$, $b\in\mathbb{R}^2$, $c\in\mathbb{R}^3$ and $d\in\mathbb{R}$.

If $p = (p_1, p_2)$ are two input pictures from the data set with camera matrices, we want to solve the following minimization problem:

$$\underset{x \in \mathbb{R}^3}{\operatorname{argmin}} \frac{1}{2}\lVert y_2(x) - p_1 \rVert^2 + \lVert y_1(x) - p_2 \rVert^2.$$


## Implementation with Homotopy Continuation

Now let's this optimization problem using homotopy continuation by solving the critical equations. We use the cameras `n₁=1` and `n₂=2`.

```julia
using DynamicPolynomials, LinearAlgebra, HomotopyContinuation

include("cameras.jl")
include("pictures.jl")
n₁, n₂ = 1, 2

@polyvar x[1:3] p₁[1:2] p₂[1:2]
y₁, y₂ = cams[n₁]*[x; 1], cams[n₂]*[x; 1]
```

The next code writes the derivative of the target function in terms of $y_i(x) = \frac{f_i(x)}{g_i(x)}$.

```julia
f₁ = y₁[1:2]
g₁ = y₁[3]
∂f₁ = differentiate(f₁, x)
∂g₁ = differentiate(g₁, x)

f₂ = y₂[1:2]
g₂ = y₂[3]
∂f₂ = differentiate(f₂, x)
∂g₂ = differentiate(g₂, x)

F₁ = [(f₁ - g₁ .* p₁) ⋅ (g₁ .* ∂f₁[i] - ∂g₁[i] .* f₁) for i in 1:3]
F₂ = [(f₂ - g₂ .* p₂) ⋅ (g₂ .* ∂f₂[i] - ∂g₂[i] .* f₂) for i in 1:3]

F =  g₂^3 .* F₁ + g₁^3 .* F₂ # F = 0 is the critical equation.
```

The idea for solving `F=0` is, given two camera matrices, to construct `p₁,p₂` for a random 3D point `x`. For fixed a `x` the equation `F=0` is linear in `p₁,p₂`. Then, we want to use this information for [monodromy].

```julia
x₀ = randn(ComplexF64, 3)
F₀ = [subs(Fᵢ, x=>x₀) for Fᵢ in F]
A = [coefficient(F₀[i][j]) for (i,j) in Iterators.product(1:3,1:4)]
b = [coefficient(F₀[i][5]) for i in 1:3]
p₀ = A\(-b)
start = monodromy_solve(F, x₀, p₀, parameters=[p₁;p₂], target_solutions_count=6)
```

The reason for the flat `target_solutions_count=6` is explained below.

This start system can now be used to track to critical points of

$$\lVert y_1(x) - q_1 \rVert^2+\lVert y_2(x) - q_2 \rVert^2,$$

where by $q_1,q_2$ we denote any pair of pictures of the 4983 world point that are taken with cameras 1 and 2. The solutions can then be inserted to the target function in order to find the smallest one.

We use the guide on how to [track many systems in a loop](guides/many-systems) for accelerating the computation.

```julia
photos = ps[:, [1, 2, 3, 4]]		
tracker = pathtracker(F; parameters=[p₁;p₂], generic_parameters=p₀)
reconstructed_points = Vector{Vector{Float64}}()
for p in photos
	# the data from the dataset is incomplete.
	# the cameras did not take pictures of all world points.
	# if a world point was not capture, the entry in the data set is -1.
	if all(map(pᵢ -> pᵢ != -1.0, p))
		set_parameters!(tracker; target_parameters=p)

		R = Vector{Vector{Float64}}() # array for the real solutions
		N = Vector{Float64}() # array for the values of the target function

		for s in start
			result = track(tracker, s)
			if is_success(result) && is_real(result)
				r = real.(solution(result))
				y = [y(x => r) for y in [y₁;y₂]]

				push!(R, r)
				push!(N, norm([y[1:2] ./ y[3]; y[4:5] ./ y[6]]  - p))
      end
		end

		# add the real solution that minimizes the target function
		i = findmin(N)
		push!(reconstructed_points, R[i[2]])
	end
end
```

Doing this for several pairs of cameras we get the following picture.


## EDdegree of the Multiview variety

The closure (under [Zariski topology]) of $\\{(y_1(x),y_2(x))\in \mathbb{R}^2\times \mathbb{R}^2 \mid x \in \mathbb{R}^3\\}$ is called *(affine) multiview variety* for two cameras.

Regarding such an affine multiview variety, the number of (complex) critical points of the squared distance function is an invariant, which is called the *euclidean distance degree* (ED degree). [Maxim, Rodriguez and Wang proved][ED degree paper] showed that the EDdegree of the Multiview variety for 2 cameras is 6. We used this information in the code above when we called `monodromy_solve` with `target_solutions_count=6`.


[dinosaur]: <https://www.robots.ox.ac.uk/~vgg/data/data-mview.html>
[pinhole camera model]: <https://en.wikipedia.org/wiki/Pinhole_camera_model>
[camera matrix]: <https://en.wikipedia.org/wiki/Camera_matrix>
[monodromy]: <https://www.juliahomotopycontinuation.org/guides/monodromy/>
[PathTracker]: <https://www.juliahomotopycontinuation.org/guides/many-systems/>
[Zariski topology]: <https://en.wikipedia.org/wiki/Zariski_topology>
[ED degree paper]: <https://arxiv.org/abs/1812.05648>
