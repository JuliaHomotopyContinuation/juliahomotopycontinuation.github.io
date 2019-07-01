+++
title = "Solutions in projective space"
description = "Solving systems defined over projective space"
weight = 100
draft = false
toc = false
bref = "We show how to solve system defined in projective space."
group = "feature-guide"
+++






Sometimes, it is required to compute solutions in [projective space](https://en.wikipedia.org/wiki/Projective_space) $\mathbb{RP}^n$ or $\mathbb{CP}^n$ . This space is defined as the space of all lines in $\mathbb{R}^{n+1}$, respectively $\mathbb{C}^{n+1}$, passing through the origin. HomotopyContinuation.jl automatically recognizes systems of defined over projective space and adjusts the output.


Here is a simple example involving two random quadrics in $\mathbb{CP}^2$

```julia
using HomotopyContinuation, LinearAlgebra
@polyvar x y z
v = [x, y, z]
F = [
  v ⋅ (randn(ComplexF64, 3, 3) * v);
  v ⋅ (randn(ComplexF64, 3, 3) * v);
]
```

For solving $F=0$ one can just use the `solve` command

```julia-repl
julia> R = solve(F)
Result with 4 solutions
==================================
• 4 non-singular solutions (0 real)
• 0 singular solutions (0 real)
• 4 paths tracked
• random seed: 310676
```

We can check that the solutions are projective:

```julia-repl
julia> all(isprojective(r), R)
true
```
