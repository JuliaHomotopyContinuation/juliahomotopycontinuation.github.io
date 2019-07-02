+++
title = "Tracking in affine space or in projective space"
description = "Define the space for the paths that are tracked"
weight = 100
draft = false
toc = false
bref = "Define the space for the paths that are tracked"
group = "feature-guide"
+++

By default, HomotopyContinuation.jl tracks paths in the complex vector space $\mathbb{C}^n$.

It is also possible to track paths in [projective space](https://en.wikipedia.org/wiki/Projective_space). This has the advantage that all paths have finite length, because projective space is compact.

One can tell HomotopyContinuation.jl to track over projective space by using the flag `projective_tracking = true`:

```julia
using HomotopyContinuation
@polyvar x y
f = [x^2 + y - 1, y - 4]
solve(f, projective_tracking = true)
```

This is the same as
```julia
using HomotopyContinuation
@polyvar x y
f = [x^2 + y - 1, y - 4]
solve(f, affine_tracking = false)
```

The flag `affine_tracking` is dominant; i.e., `solve(f, affine_tracking = true, projective_tracking = true)` tracks in affine space.
