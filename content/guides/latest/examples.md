+++
title = "Solving square systems of polynomial equations"
description = "We go through a couple of examples"
weight = -900
draft = false
toc = true
bref = "For this guide, we're going to walk through a couple of illustrative examples to show you how to use the basic features of HomotopyContinuation.jl"
+++

<h3 class="section-head" id="intro1"><a href="#intro1">Solving square systems of polynomial equations</a></h3>

The basic idea of homotopy continuation algorithms is explained quickly. Suppose that you have a square system of polynomials $$f(x)=(f_1(x_1,\ldots,x_n),\ldots,f_n(x_1,\ldots,x_n)).$$ Here, "square" means that the system should have as many equations as variables. The goal is to find solutions $x\in \mathbb{R}^n$ with $f(x)=0$. For this we need another system of equations, say $g(x)=(g_1(x_1,\ldots,x_n),\ldots,g_n(x_1,\ldots,x_n))$, and a solution $x_0$ with $g(x_0)=0$. The basic algorithm consists in connecting the polynomials $f$ and $g$ by a path and tracking the solution $x_0$ from $g$ to $f$ using [Newton's method](https://en.wikipedia.org/wiki/Newton%27s_method) (Remark: the space of polynomial systems form a vector space, in which the notion of path is well-defined).

For instance, the homotopy could be the *straight-line homotopy* $tg + (1-t)f$. The default choice from HomotopyContinuation.jl is the straight-line homotopy. But others like parameter homotopies are possible. You can even make up your own custom homotopy.

The advantage of square systems is that we can *automatically generate* a start system $g$. If you use the basic `solve` command the following starting system is constructed:
  $$g(x_1,\ldots,x_n) = \begin{pmatrix} x_1^{d_1} - a_1 \\\ \\vdots \\\  x_n^{d_n} - a_n\end{pmatrix},$$
where the $a_i$ are random numbers and $d_i$ is the degree of $f_i$. There are $d_1\cdots d_n$ many solutions to this system, which are easy to write down. A [theorem by Bezout](https://en.wikipedia.org/wiki/Bézout%27s_theorem#Intersection_multiplicity) says that a system whose $i$-th entry is a polynomial of degree $d_i$ has at most $d_1\cdots d_n$ solutions (if not infinitely many). Hence, tracking all $d_1\cdots d_n$ solutions of $g$ to $f$ we are can find all of $f\text{s}$ solutions. Such a homotopy is called a *total degree homotopy*.

In the rest of this guide we will some examples how to use the `solve` command in different contexts.


<h3 class="section-head" id="h-lagrangian"><a href="#h-lagrangian">Example: minimizing over the sphere</a></h3>

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

In order to compute all critical points we have to solve the square system of equations
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
