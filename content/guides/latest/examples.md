+++
title = "Examples"
description = "We go through a couple of examples."
weight = -900
draft = false
toc = true
bref = "For this guide, we're going to walk through a couple of illustrative examples to show you how to use HomotopyContinuation.jl"
+++

<h3 class="section-head" id="h-lagrangian"><a href="#h-lagrangian">Minimize over the sphere</a></h3>

We want to solve following optimization problem
$$\text{minimize} \; 3x^3y+y^2z^2-2xy-4xz^3 \quad \text{s.t.} \quad x^2+y^2+z^2=1$$

The strategy to find the *global* optimum is to use the [method of Lagrange multipliers](https://en.wikipedia.org/wiki/Lagrange_multiplier)
to find *all* critical points of the objective function such that the equality constraint is satisfied.
We start with defining our Lagrangian.
```julia-repl
julia> @polyvar x y z;
julia> J = 3x^3*y+y^2*z^2-2x*y-x*4z^3;
julia> g = x^2+y^2+z^2-1;
# Introduce auxillary variable for Lagrangian
julia> @polyvar λ;
# define Lagrangian
julia> L = J - λ * g;
```

In order to compute all critical points we have to solve the equation
$$\nabla_{(x,y.z,\lambda)}L = 0$$
For this we first compute the gradient of $L$ and then use the `solve` routine to find all critical points.
```julia-repl
# compute the gradient
julia> ∇L = map(var -> differentiate(L, var), [x, y, z, λ]);
# Now we solve the polynomial system
julia> result = solve(∇L)
-----------------------------------------------
Paths tracked: 54
# non-singular finite solutions:  26
# singular finite solutions:  0
# solutions at infinity:  28
# failed paths:  0
Random seed used: 83132
-----------------------------------------------
```
We see that from the theoretical 54 possible (complex) critical points there are only 26.
Also we check the number of *real* critical points by
```julia-repl
julia> nreal(result)
22
```
and see that there are 22.

In order to find the global minimum we now have to evaluate all *real* solutions and find the value where the minimum is attained.
```julia-repl
julia> reals = realsolutions(result);
# Now we simply evaluate the objective J and find the minimum
julia> minval, minindex = findmin(map(s -> J(s[1:3]), reals))
(-1.3284212906942612, 18)
julia> argmin = reals[minindex][1:3]
3-element Array{Float64,1}:
 0.496876
 0.0946083
 0.862649
```
We found that the minimum of $J$ over the unit sphere is attained at $(0.496876, 0.0946083, 0.862649)$ with objective value $-1.32842$.

The source code of this example is available [here](https://github.com/JuliaHomotopyContinuation/HomotopyContinuation.jl/blob/master/examples/minimization.jl).

<h3 class="section-head" id="h-degree"><a href="#h-degree">Computing the degree of a variety</a></h3>

Consider the projective variety in the 2-dimensional complex projective space $\mathbb{CP}^2$.
$$V = \\{ x^2 + y^2 - z^2 = 0 \\}$$

The degree of $V$ is the number of intersection points of $V$ with a generic line.
Let us see what it is. First we initialize the defining equation of $V$.
```julia
using HomotopyContinuation
@polyvar x y z
V = x^2 + y^2 - z^2
```
Let us sample the equation of a random line $L$.
```julia
L = randn(1,3) * [x, y, z]
```
Now we compute the number of solutions to $[V, L]=0$.
```julia-repl
julia> solve([V; L])
-----------------------------------------------
Paths tracked: 2
# non-singular solutions:  2
# singular solutions:  0
# failed paths:  0
Random seed used: 986746
-----------------------------------------------
```
We find two distinct solutions and conclude that the degree of $V$ is 2.
