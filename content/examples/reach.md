+++
date = "2019-21-10T21:56:55+01:00"
title = "The reach of a variety"
tags = ["example"]
categories = ["general"]
draft = false
description = "Computing the reach"
weight = 0
author = "Paul Breiding"
+++

The reach  $\tau$ of an embedded manifold $M\subset \mathbb{R}^n$ is an important complexity measure for methods in computational topology, statistics and machine learning. Namely, estimating $M$, or functionals of $M$, requires regularity conditions and a common regularity assumption is that the reach $\tau >0$. The definition of $\tau$ is as follows:

$$\tau = \sup \\{t\mid \text{all $x\in\mathbb{R}^n$ with $\mathrm{dist}(x,M)<t$ have a unique nearest point on $M$}\\};$$

the distance measure $\mathrm{dist}$ is the euclidean distance.

In this example we want to compute the reach of an \emph{algebraic manifold}; that is, an embedded manifold which is also an [algebraic variety](https://en.wikipedia.org/wiki/Algebraic_variety). The variety we consider is the plane curve $C$ defined by the equation

$${\small
(x^3 - xy^2 + y + 1)^2(x^2+y^2 - 1)+y^2-5 = 0
}
$$

<p style="text-align:center;"><img src="/images/curve_reach.png" width="400px"/></p>

As pointed out by [Aamari et. al.](https://arxiv.org/pdf/1705.04565.pdf) the reach is the minimum of two factors: the curvature of the manifold and the width of the narrowest bottleneck of $M$, which quantifies how close M is from being self-intersecting. In symbols:

$$\tau = \min\\left\\{\rho, \, \frac{1}{\sigma}\\right\\},$$

where $\sigma$ is a the maximal curvature of a geodesic running through $C$ and $\rho$ is the width of the narrowest bottleneck. We compute both separately.

## Bottlenecks

## Maximal curvature

In the [example on curvature](examples/curvature.md) it was already explained how to compute $\sigma$. We copy the code from this example:

```julia
using HomotopyContinuation, DynamicPolynomials, LinearAlgebra

@polyvar x y
f = (x^3 - x*y^2 + y + 1)^2 * (x^2+y^2 - 1)+y^2-5

∇ = differentiate(f, [x;y]) # the gradient
H = differentiate(∇, [x;y]) # the Hessian

g = ∇ ⋅ ∇
v = [-∇[2]; ∇[1]]
h = v' * H * v
dg = differentiate(g, [x;y])
dh = differentiate(h, [x;y])

F = [(g .* dh - ((3/2) * h).* dg) ⋅ v; f]

S = solve(F, start_system = :polyhedral)
R = real_solutions(S)
```

From the solutions we compute the corresponding curvatures and extract the maximum.

```julia
julia> curv = s -> h([x;y] => s) / (g([x;y] => s))^(3/2)
julia> σ = map(s -> abs(curv(s)), R)
julia> σ_max = maximum(σ)
2097.165767782749
```

{{<bibtex >}}
