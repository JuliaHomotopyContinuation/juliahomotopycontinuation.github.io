+++
title = "Composite systems"
description = "How to construct and solve composite systems"
weight = 100
draft = false
toc = true
bref = "How to construct and solve composite systems"
group = "feature-guide"
+++

If your system of polynomials is given as a composition of several systems, you can exploit this in HomotopyContinuation.jl.

<h3 class="section-head"><a>Composition of two systems</a></h3>

If $f$ and $g$ are your systems, and you want to solve $f \circ g$, then you can do this by

```julia
solve(f ∘ g)
```

For instance, if

$$ f = \\begin{bmatrix} ab - 2\\\  ac- 1\end{bmatrix}, \\quad g =  \\begin{bmatrix}x + y\\\ y + 3\\\ x + 2\end{bmatrix},$$

then you solve $f\circ g$ by

```julia-repl
julia> @polyvar a b c x y
julia> f = [a * b - 2, a * c- 1]
julia> g = [x + y, y + 3, x + 2]
julia> solve(f ∘ g)
Result with 2 solutions
==================================
• 2 non-singular solutions (2 real)
• 0 singular solutions (0 real)
• 4 paths tracked
• random seed: 446964
```

<h3 class="section-head"><a>Composition of several systems</a></h3>

You can also iterate the above process:
```julia-repl
julia> @polyvar u v
julia> h = [u^2 - 1, u + v - 2]
julia> solve(f ∘ g ∘ h)
Result with 4 solutions
==================================
• 4 non-singular solutions (2 real)
• 0 singular solutions (0 real)
• 12 paths tracked
• random seed: 386832
```

<h3 class="section-head"><a>Systems with parameters</a></h3>

You can also track a [parameter homotopy](/guides/parameter-homotopies) in a composite system. If

$$ f = \\begin{bmatrix} ab - q\\\  ac - p\end{bmatrix}, \\quad g =  \\begin{bmatrix}x + y\\\ y + 3\\\ x + 2\end{bmatrix},$$

and you want to track solutions from $(p,q) = (1, 2)$ to $(p,q) = (2, 3)$, this is how it works:

```julia-repl
julia> res = solve(f ∘ g)
julia> @polyvar p q
julia> f2 = [a * b - q, a * c - p]
julia> res2 = solve(f2 ∘ g, solutions(res), parameters=[p, q], p₁=[1, 2], p₀=[2, 3])
Result with 2 solutions
==================================
• 2 non-singular solutions (2 real)
• 0 singular solutions (0 real)
• 2 paths tracked
• random seed: 48821
```

It does not matter at which level the parameters are.
