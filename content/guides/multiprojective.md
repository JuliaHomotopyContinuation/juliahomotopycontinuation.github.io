+++
title = "Solutions in a product of projective spaces"
description = "Solving systems over a product of projective spaces"
weight = 100
draft = false
toc = false
bref = "Solving systems over a product of projective spaces"
group = "feature-guide"
+++

When your system has a multi-projective structure, you can declare variables groups for accelerating the computations.

Here is a simple example for the following system defined over $\mathbb{CP}^1\times  \mathbb{CP}^1$:

$$f(u,y,u,v) = \begin{bmatrix} xy - 6uv\\\ x^2 - u^2 \end{bmatrix}.$$

The Julia code for the variable groups $\{x,y\}$ and $\{u,v\}$ is as follows.

```julia-repl
using HomotopyContinuation
@var x y u v
f = System([x*y - 6u*v, x^2 - u^2], variable_groups=[[x,u], [y,v]])
```
```
System of length 2
4 variables (2 groups): [x, u], [y, v]

 -6*u*v + x*y
 -u^2 + x^2
```
```julia
S = solve(f, start_system = :total_degree)
```
```
Result with 2 solutions
=======================
• 2 paths tracked
• 2 non-singular solutions (0 real)
• random_seed: 0xdf2fbbdb
• start_system: :total_degree
```
