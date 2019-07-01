+++
title = "Groups of variables"
description = "Declaring additional structure for homotopy continuation"
weight = 5
draft = false
toc = false
bref = "Declaring additional structure for homotopy continuation"
group = "feature-guide"
+++


Declaring variable groups can reduce the number of paths that one has to track.

```julia-repl
julia> using HomotopyContinuation
julia> @polyvar x y
julia> g = [x*y - 6, x^2 - 5]
julia> solve(g, variable_groups=[[x], [y]])
Result with 2 solutions
==================================
• 2 non-singular solutions (2 real)
• 0 singular solutions (0 real)
• 2 paths tracked
• random seed: 73638
```

whereas

```julia-repl
julia> solve(g)
Result with 2 solutions
==================================
• 2 non-singular solutions (2 real)
• 0 singular solutions (0 real)
• 4 paths tracked
• random seed: 892652
```

The number of paths tracked is halved using the variable structure.
