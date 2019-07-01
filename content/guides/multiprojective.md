+++
title = "Solutions in a product of projective spaces"
description = "Solving systems over a product of projective spaces"
weight = 101
draft = false
toc = false
bref = "Solving systems over a product of projective spaces"
group = "feature-guide"
+++

When your system has a multiprojective structure, you can declare variables groups for accelerating the computations.

Here is a simple example for the following system defined over $\mathbb{CP}^1\times  \mathbb{CP}^1$:

$$f(u,y,u,v) = \begin{bmatrix} xy - 6uv\\\ x^2 - u^2 \end{bmatrix}.$$

The Julia code for the variable groups $\{x,y\}$ and $\{u,v\}$ is as follows.

```julia-repl
julia> using HomotopyContinuation
julia> @polyvar x y u v
julia> f = [x*y - 6u*v, x^2 - u^2]
julia> S = solve(f, variable_groups=[(x,u), (y,v)])
Result with 2 solutions
==================================
• 2 non-singular solutions (0 real)
• 0 singular solutions (0 real)
• 2 paths tracked
• random seed: 127575
```

With out the declaration of groups we would have

```julia-repl
julia> S = solve(f)
Result with 2 solutions
==================================
• 2 non-singular solutions (2 real)
• 0 singular solutions (0 real)
• 4 paths tracked
• random seed: 202895
```

The number of solutions found is the same, but the number of paths tracked is different. This is because

```julia-repl
julia> bezout_number(f, variable_groups=[[x], [y]])
2
julia> bezout_number(f)
4
```


It is also possible to declare variable groups for affine systems:

```julia-repl
julia> @polyvar x y z
julia> g = [x*y - 6, x^2 - 5]
julia> R = solve(g, variable_groups=[(x,), (y,)])
Result with 2 solutions
==================================
• 2 non-singular solutions (2 real)
• 0 singular solutions (0 real)
• 2 paths tracked
• random seed: 192959
julia> all(isaffine, R)
true
```
