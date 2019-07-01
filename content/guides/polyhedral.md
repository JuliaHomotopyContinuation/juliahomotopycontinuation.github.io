+++
title = "Polyhedral homotopy"
description = "A start system from polyhedral geometry"
weight = -10
draft = false
toc = true
bref = "A start system from polyhedral geometry"
group = "advanced"
+++

<h3 class="section-head" id="result"><a>Polyhedral start systems</a></h3>

Polyhedral is a particular choice of start system for homotopy continuation.

The advantage of so called polyhedral homotopies over [totaldegree homotopies](/guides/totaldegree) is that the number of paths to track can be significantly smaller for the polyhedral homotopy.

Here is how it works:

```julia-repl
julia> using HomotopyContinuation, PolynomialTestSystems
julia> f = equations(cyclic(7))  
julia> solve(f; start_system = :polyhedral)
Result with 924 solutions
==================================
• 924 non-singular solutions (56 real)
• 0 singular solutions (0 real)
• 924 paths tracked
• random seed: 606778
```

For comparison:

```julia-repl
julia> solve(f; start_system = :total_degree)
Result with 924 solutions
==================================
• 924 non-singular solutions (56 real)
• 0 singular solutions (0 real)
• 5040 paths tracked
• random seed: 286291
```

The number of paths for the totaldegree start system is 5040, while for the polyhedral homotopy it is only 924.

The underlying idea goes back to [Huber and Sturmfels](https://dl.acm.org/citation.cfm?id=213837).
In our implementation we use [Anders Jensen's algorithm](https://arxiv.org/pdf/1601.02818.pdf).

<h3 class="section-head" id="result"><a>Solutions with non-zero entries</a></h3>

If it is known that all of the zeros of the system have non-zero entries (i.e., that they are points in $(\mathbb{C}\backslash\\{0\\})^n$), then one can accelerate the computation as follows:
```julia
solve(f; start_system = :polyhedral, only_torus = true)
```

Here is an example:

```julia-repl
julia> @polyvar x y
julia> f = [2y + 3y^2 - x*y^3, x + 4*x^2 - 2*x^3*y]
julia> solve(f, start_system=:polyhedral, only_torus=true)
Result with 3 solutions
==================================
• 3 non-singular solutions (3 real)
• 0 singular solutions (0 real)
• 3 paths tracked
• random seed: 154150
```

whereas

```julia-repl
julia> solve(f, start_system=:polyhedral, only_torus=false)
Result with 6 solutions
==================================
• 6 non-singular solutions (6 real)
• 0 singular solutions (0 real)
• 8 paths tracked
• random seed: 45414
```
