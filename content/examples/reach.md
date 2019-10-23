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

<p style="text-align:center;"><img src="/images/curve_reach.png" width="500px"/></p>


```julia
using HomotopyContinuation, DynamicPolynomials, LinearAlgebra

@polyvar x y
f = (x^3 - x*y^2 + y + 1)^2 * (x^2+y^2 - 1)+y^2-5
```

As pointed out by [Aamari et. al.](https://arxiv.org/pdf/1705.04565.pdf) the reach is the minimum of two factors: the curvature of the manifold and the width of the narrowest bottleneck of $M$, which quantifies how close M is from being self-intersecting. In symbols:

$$\tau = \min\\left\\{\rho, \, \frac{1}{\sigma}\\right\\},$$

where $\sigma$ is a the maximal curvature of a geodesic running through $C$ and $\rho$ is the width of the narrowest bottleneck. Below we compute both $\rho$ and $\sigma$. Our computation finds $\rho = $ and $\sigma =2097.165767782749$. Therefore, the reach of $C$ is

$$\tau = $$.

## Bottlenecks

Bottlenecks of $C$ are pairs of points $p,q\in C$ such that $p-q$ is perpendicular to the tangent space $\mathrm{T}_p C$ and perpendicular to the tangent space $\mathrm{T}_q C$.

[Eklund](https://arxiv.org/pdf/1804.01015.pdf) and [di Rocco et. al.](https://arxiv.org/pdf/1904.04502.pdf) discuss the algebraic equations of bottlenecks. The equations are

$$f(p) = 0, \; f(q) = 0\; \det\begin{bmatrix} \nabla_p f & p-q\end{bmatrix} = 0,\; \det\begin{bmatrix} \nabla_q f & p-q\end{bmatrix}=0,$$

where $\nabla_p f$ denotes the [gradient](https://en.wikipedia.org/wiki/Gradient) of $f$ at $p$. The width of a bottleneck is $\rho(p,q) = \Vert p-q\Vert$. The width of the narrowest bottleneck is the minimum over all $\rho(p,q)$ such that $(p,q)$ satisfies the above equations.

Let us define and solve the equations in `Julia`:

```julia
@polyvar p[1:2] q[1:2] # define variables for the points p and q
f_p = subs(f, [x;y] => p)
f_q = subs(f, [x;y] => q)
∇_p = differentiate(f_p, p)
∇_q = differentiate(f_q, q)
F = [f_p; f_q; det([∇_p p-q]); det([∇_q p-q])]

S₁ = solve(F, start_system = :polyhedral)
R₁ = real_solutions(nonsingular(S₁))
```

From the solutions we compute the width of the narrowest bottleneck.

```julia
julia> ρ = map(s -> norm(s[1:2] - s[3:4]), R₁)
julia> ρ_max, i = findmin(ρ)
(0.13835123592621762, 60)
```

The narrowest bottleneck of $C$ is of width $\approx 0.14$.

Here is a plot of all bottlenecks


## Maximal curvature

We can use the [following formula](https://en.wikipedia.org/wiki/Implicit_curve#Slope_and_curvature) for the curvature $\sigma(p)$ at $p\in C = \\{f(x,y)=0\\}$.

$$\sigma(p) = \frac{h(p)}{g(p)^\frac{3}{2}}$$

with

$$g(p)= \nabla_p f^T\nabla_p f\quad \text{and}\quad h(p) = v(p)^T H(p) v(p),$$

where $H(p)$ is the Hessian of $f$ at $p$ and $v(p) = \begin{bmatrix} 0 & -1 \\\ 1 & 0 \end{bmatrix}\nabla_p f$.

The critical equations for $\sigma(p)$ are $v(p)^T \, \nabla_p \sigma=0$ and $f(p)=0$. Thus, for computing the critical points of $\sigma$ over $C$ we use the following code.

```julia
∇ = differentiate(f, [x;y]) # the gradient
H = differentiate(∇, [x;y]) # the Hessian

g = ∇ ⋅ ∇
v = [-∇[2]; ∇[1]]
h = v' * H * v
dg = differentiate(g, [x;y])
dh = differentiate(h, [x;y])

∇σ = g .* dh - ((3/2) * h).* dg

F = [v ⋅ ∇σ; f]

S₂ = solve(F, start_system = :polyhedral)
R₂ = real_solutions(S₂)
```

From the solutions we compute the corresponding curvatures and extract the maximum.

```julia
julia> curv = s -> h([x;y] => s) / (g([x;y] => s))^(3/2)
julia> σ = map(s -> abs(curv(s)), R₂)
julia> σ_max, j = findmax(σ)
(2097.165767782749, 18)
```

Therefore, the maximal curvature of a geodesic in $C$ is $\approx 2097.17$. We use this above to find the reach of $C$.

Here is a plot of all critical points with the point of maximal curvature in violet.

```julia
using Plots, ImplicitPlots
implicit_plot(f)
scatter!(hcat(R₂...)[1,:], hcat(R₂...)[2,:])
scatter!([R₂[j][1]], [R₂[j][2]])
```

<p style="text-align:center;"><img src="/images/curve_reach_curvature.png" width="500px"/></p>


{{<bibtex >}}
