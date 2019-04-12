+++
title = "Composite systems"
description = "How to construct and solve composite systems"
weight = 6
draft = false
toc = false
bref = "How to construct and solve composite systems"
group = "advanced"
+++

If your system of polynomials is given as a composition of several systems, you can exploit this in HomotopyContinuation.jl. If $f$ and $g$ are your systems, and you want to solve $f \circ g$, then you can do this by

```julia
solve(f ∘ g)
```

For instance, if

$$ f = \\begin{bmatrix} ab - 2\\\  ac- 1\end{bmatrix}, \\quad g =  \\begin{bmatrix}x + y\\\ y + 3\\\ x + 2\end{bmatrix},$$

then you solve $f\circ g$ by

```julia-repl
julia> @polyvar p q a b c x y
julia> f = [a * b - 2, a*c- 1]
julia> g = [x + y, y + 3, x + 2]
julia> solve(f ∘ g)
Result with 2 solutions
==================================
• 2 non-singular finite solutions (2 real)
• 0 singular finite solutions (0 real)
• 4 paths tracked
• random seed: 446964
```

You can also iterate this process:
```julia-repl
julia> @polyvar u v
julia> h = [u^2 - 1, u + v - 2]
julia> solve(f ∘ g ∘ h)
Result with 4 solutions
==================================
• 4 non-singular finite solutions (2 real)
• 0 singular finite solutions (0 real)
• 12 paths tracked
• random seed: 386832
```
