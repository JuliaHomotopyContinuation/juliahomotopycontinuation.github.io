+++
title = "Solutions in projective space"
description = "Solving systems defined over projective space"
weight = -850
draft = false
toc = true
bref = "We show how to solve system defined in projective space."
+++

<h3 class="section-head" id="intro1"><a href="#intro1">Solving systems defined in projective space</a></h3>

In the guides so far we were computing solutions in $\mathbb{R}^n$ or $\mathbb{C}^n$. In some applications, however, it is required to compute solutions in [projective space](https://en.wikipedia.org/wiki/Projective_space) $\mathbb{R}P^n$ or $\mathbb{C}P^n$ . This space is defined as the space of all lines in $\mathbb{R}^{n+1}$, respectively $\mathbb{C}^{n+1}$, passing through the origin. HomotopyContinuation.jl automatically recognizes systems defined over projective space and adjusts the output. Next, we show an example.

<h3 class="section-head" id="h-degree"><a href="#h-degree">Example: computing the degree of a projective variety</a></h3>

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

In particular, the output does not show solutions at infinity, simply because this concept is not defined in projective space.
