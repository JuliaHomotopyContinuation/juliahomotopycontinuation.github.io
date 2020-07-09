+++
title = "Overdetermined systems"
description = "How to solve systems with more equations than variables."
weight = 7
draft = false
toc = true
bref = "We are computing solutions of an overdetermined system"
group = "feature-guide"
+++




<h3 class="section-head" id="overdetermined*systems"><a href="#overdetermined*systems">Overdetermined systems</a></h3>


A system of polynomial equations $f=(f_1(x_1,\ldots, x_m),\ldots,  f_n(x_1,\ldots,x_m))$ is called *overdetermined*, if it has more equations than variables; i.e., when $n>m$. HomotopyContinuation.jl can solve overdetermined systems. Here is a simple example.

$$f(x,y,z) = \begin{bmatrix} xz-y^2 \\\ y-z^2 \\\ x-yz \\\ x + y + z + 1\end{bmatrix}.$$

This system has 4 equation in 3 variables. One might expect that it has no solution, but actually it has solutions, as is explained [here](https://en.wikipedia.org/wiki/Rational_normal_curve).

The Julia code is as follows

```julia
using HomotopyContinuation
@var x y z
solve([x*z - y^2, y - z^2, x - y*z, x + y + z + 1])
```
```
Result with 3 solutions
=======================
• 5 paths tracked
• 3 non-singular solutions (1 real)
• 2 excess solutions
• random_seed: 0xf2aeb943
• start_system: :polyhedral
```

Here, the term `excess solutions` refers to artificially added solutions in order to make the overdetermined system a square system.