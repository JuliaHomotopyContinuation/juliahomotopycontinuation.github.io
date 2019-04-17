+++
title = "Tracking in affine space"
description = "Let the tracker make its computation in affine space"
weight = 99
draft = false
toc = false
bref = "Let the tracker make its computation in affine space"
group = "advanced"
+++

By default, HomotopyContinuation.jl tracks paths in [projective space](https://en.wikipedia.org/wiki/Projective_space). 
One can tell HomotopyContinuation.jl to track over affine space by using the flag `affine_tracking = true`:

```julia
using HomotopyContinuation
@polyvar x y
f = [x^2 + y - 1, y - 4]
solve(f, affine_tracking = true)
```
