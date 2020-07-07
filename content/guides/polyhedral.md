+++
title = "Polyhedral homotopy"
description = "A start system from polyhedral geometry"
weight = 3
draft = false
toc = true
bref = "A start system from polyhedral geometry"
group = "feature-guide"
+++

<h3 class="section-head" id="result"><a>Polyhedral start systems</a></h3>

Polyhedral is a particular choice of start system for homotopy continuation.

The advantage of so called polyhedral homotopies over [total degree homotopies](/guides/totaldegree) is that the number of paths to track can be significantly smaller for the polyhedral homotopy.

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

The number of paths for the total degree start system is 5040, while for the polyhedral homotopy it is only 924.

The underlying idea goes back to [Huber and Sturmfels](https://dl.acm.org/citation.cfm?id=213837).
In our implementation we use [Anders Jensen's algorithm](https://arxiv.org/pdf/1601.02818.pdf) for the computation of the mixed cells.

<h3 class="section-head" id="result"><a>Solutions with non-zero entries</a></h3>

If it is known that all of the solutions of the system have non-zero entries (i.e., that they are points in $(\mathbb{C}\backslash\\{0\\})^n$), then one can accelerate the computation as follows:
```julia
solve(f; start_system = :polyhedral, only_torus = true)
```

Here is an example:

```julia
@var x y
f = System([2y + 3y^2 - x*y^3, x + 4*x^2 - 2*x^3*y])
solve(f, start_system=:polyhedral, only_torus=true)
```
```
Result with 3 solutions
=======================
• 3 paths tracked
• 3 non-singular solutions (3 real)
• random seed: 0x07df8713
• start_system: :polyhedral
```

whereas

```julia
solve(f, start_system=:polyhedral, only_torus=false)
```
```
Result with 6 solutions
=======================
• 8 paths tracked
• 6 non-singular solutions (6 real)
• random seed: 0x60ae238f
• start_system: :polyhedral
```