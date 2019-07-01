+++
title = "Overdetermined systems"
description = "How to track solutions of systems with more equations than variables."
weight = 5
draft = false
toc = true
bref = "We're tracking a solution of an overdetermined system"
group = "feature-guide"
+++




<h3 class="section-head" id="overdetermined*systems"><a href="#overdetermined*systems">Overdetermined systems</a></h3>


A system of polynomial equations $f=(f_1(x_1,\ldots, x_m),\ldots,  f_n(x_1,\ldots,x_m))$ is called *overdetermined*, if it has more equations than variables; i.e., when $n>m$. HomotopyContinuation.jl can solve overdetermined systems. Here is a simple example.

$$f(x,y,z) = \begin{bmatrix} xz-y^2 \\\ y-z^2 \\\ x-yz \\\ x + y + z + 1\end{bmatrix}.$$

This system has 4 equation in 3 variables. One might expect that it has no solution, but actually it has solutions, as is explained [here](https://en.wikipedia.org/wiki/Rational_normal_curve).

The Julia code is as follows

```julia-repl
julia> using HomotopyContinuation
julia> @polyvar x y z
julia> solve([x*z - y^2, y - z^2, x - y*z, x + y + z + 1])
Result with 3 solutions
==================================
• 3 non-singular solutions (1 real)
• 0 singular solutions (0 real)
• 8 paths tracked
• random seed: 157717
```
