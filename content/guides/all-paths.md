+++
title = "Solutions at infinity"
description = "Let solve return the outcomes of all paths"
weight = 100
draft = false
toc = false
bref = "Let solve return the outcomes of all paths"
group = "feature-guide"
+++


By default, `solve(f)` return only "true" solutions of `f`. But when tracking towards `f` paths might diverge to infinity (solutions at infinity describe solutions of the [homogenization](https://en.wikipedia.org/wiki/Homogeneous_polynomial#Homogenization) of `f` which are no solutions of `f` itself).

To save the results of all paths, one has to use

```julia
solve(f, save_all_paths = true)
```

Here is an example that has solutions at infinity.

```julia-repl
julia> using HomotopyContinuation
julia> @polyvar x y
julia> f = [x^2 - y^2 - 1, x - y]
julia> solve(f, save_all_paths = true)
Result with 0 solutions
==================================
• 0 non-singular solutions (0 real)
• 0 singular solutions (0 real)
• 2 solutions at infinity
• 2 paths tracked
• random seed: 229664
```
