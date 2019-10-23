+++
date = "2019-21-10T21:56:55+01:00"
title = "The reach of a variety"
tags = ["example"]
categories = ["general"]
draft = false
description = "Computing the reach"
weight = 0
author = "Paul Breiding and Sascha Timme"
+++

The reach  $\tau$ of an embedded manifold $M\subset \mathbb{R}^n$ is an important complexity measure for methods in computational topology, statistics and machine learning. Namely, estimating $M$, or functionals of $M$, requires regularity conditions and a common regularity assumption is that the reach $\tau >0$. The definition of $\tau$ is as follows:

$$\tau = \sup \\{t\mid \text{all $x\in\mathbb{R}^n$ with $\mathrm{dist}(x,M)<t$ have a unique nearest point on $M$}\\};$$

the distance measure $\mathrm{dist}$ is the euclidean distance.

In this example we want to compute the reach of an \emph{algebraic manifold}; that is, an embedded manifold which is also an [algebraic variety](https://en.wikipedia.org/wiki/Algebraic_variety). The variety we consider is the plane curve $C$ defined by the equation

$$
(x^3 - xy^2 + y + 1)^2(x^2+y^2 - 1)+y^2-5 = 0
$$

<p style="text-align:center;"><img src="/images/curve_reach.png" width="500px"/></p>


As pointed out by [Aamari et. al.](https://arxiv.org/pdf/1705.04565.pdf) the reach is the minimum of two factors: the curvature of the manifold and the width of the narrowest bottleneck of $M$, which quantifies how close M is from being self-intersecting. In symbols:

$$\tau = \min\\left\\{\rho, \, \frac{1}{\sigma}\\right\\},$$

where $\sigma$ is a the maximal curvature of a geodesic running through $C$ and $\rho$ is the width of the narrowest bottleneck. We compute both $\rho$ and $\sigma$. For this, we first define the equation of $C$ in `Julia`.

```julia
using HomotopyContinuation, LinearAlgebra
@polyvar x y
f = (x^3 - x*y^2 + y + 1)^2 * (x^2 + y^2 - 1) + y^2 - 5
```

Our computation below finds

$$\rho = 0.13835123592621174 \;\text{ and }\ \sigma =2097.165767782749$$

and we have

$$\min\\left\\{0.13835123592621174, \, \frac{1}{2097.165767782749}\\right\\} = 0.00047683402779230983$$

Therefore, the reach of the curve $C$ is $\tau = 0.00047683402779230983$.

## Bottlenecks

Bottlenecks of $C$ are pairs of points $(p,q)\in C\times C$ such that $p-q$ is perpendicular to the tangent space $\mathrm{T}_p C$ and perpendicular to the tangent space $\mathrm{T}_q C$.

[Eklund](https://arxiv.org/pdf/1804.01015.pdf) and [di Rocco et. al.](https://arxiv.org/pdf/1904.04502.pdf) discuss the algebraic equations of bottlenecks. The equations are

$$f(p) = 0, \; \det\begin{bmatrix} \nabla_p f & p-q\end{bmatrix} = 0, \; f(q) = 0 ,\; \det\begin{bmatrix} \nabla_q f & p-q\end{bmatrix}=0,$$

where $\nabla_p f$ denotes the [gradient](https://en.wikipedia.org/wiki/Gradient) of $f$ at $p$. The first equation defines $p\in C$ and the second equation defines $p-q \perp \mathrm{T}_p C$. The third equation defines $q\in C$ and the fourth equation defines $p-q \perp \mathrm{T}_q C$.

The width of a bottleneck is $\rho(p,q) = \Vert p-q\Vert$. The width of the narrowest bottleneck is the minimum over all $\rho(p,q)$ such that $(p,q)$ satisfies the above equations.

Let us define and solve the equations in `Julia`:

```julia
@polyvar p[1:2] q[1:2] # define variables for the points p and q
f_p = subs(f, [x;y] => p)
f_q = subs(f, [x;y] => q)
∇_p = differentiate(f_p, p)
∇_q = differentiate(f_q, q)
F₁ = [f_p; det([∇_p p-q]); f_q; det([∇_q p-q])]

S₁ = solve(F₁, start_system = :polyhedral)
R₁ = real_solutions(nonsingular(S₁))
```

From the solutions we compute the width of the narrowest bottleneck.

```julia-repl
julia> ρ = map(s -> norm(s[1:2] - s[3:4]), R₁)
julia> ρ_min, i = findmin(ρ)
julia> @show ρ_min;
ρ_min = 0.13835123592621174
```

The narrowest bottleneck of $C$ is of width $\approx 0.14$.

Here is a plot of all bottlenecks in green. The narrowest bottleneck is displayed in red.

```julia
using Plots, ImplicitPlots
implicit_plot(f)
for r in R₁
  plot!([r[1], r[3]], [r[2], r[4]], color = :green,  linealpha = 0.2)
end
plot!([R₁[i][1], R₁[i][3]], [R₁[i][2], R₁[i][4]], color = :red, linewidth = 4)
```

<p style="text-align:center;"><img src="/images/curve_reach_bottlenecks.png" width="500px"/></p>

## Maximal curvature

The [following formula](https://en.wikipedia.org/wiki/Implicit_curve#Slope_and_curvature) gives the curvature $\sigma(p)$ at $p\in C = \\{f(x,y)=0\\}$.

$$\sigma(p) = \frac{h(p)}{g(p)^\frac{3}{2}}$$

where

$$g(p)= \nabla_p f^T\nabla_p f\quad \text{and}\quad h(p) = v(p)^T H(p) v(p),$$

and where $H(p)$ is the Hessian of $f$ at $p$ and $v(p) = \begin{bmatrix} 0 & -1 \\\ 1 & 0 \end{bmatrix}\nabla_p f$.

For computing the maximum of $\sigma(p)$ over $C$ we solve the critical equations of $\sigma(p)$.  
The critical equations are

$$v(p)^T \, \nabla_p \sigma=0\quad \text{and}\quad f(p)=0.$$

We use the following code.

```julia
∇ = differentiate(f, [x;y]) # the gradient
H = differentiate(∇, [x;y]) # the Hessian

g = ∇ ⋅ ∇
v = [-∇[2]; ∇[1]]
h = v' * H * v
dg = differentiate(g, [x;y])
dh = differentiate(h, [x;y])

∇σ = g .* dh - ((3/2) * h).* dg

F₂ = [v ⋅ ∇σ; f]

S₂ = solve(F₂, start_system = :polyhedral)
R₂ = real_solutions(nonsingular(S₂))
```

From the solutions we compute the corresponding curvatures and extract the maximum.

```julia-repl
julia> curv = s -> h([x;y] => s) / (g([x;y] => s))^(3/2)
julia> σ = map(s -> abs(curv(s)), R₂)
julia> σ_max, j = findmax(σ)
julia> @show σ_max;
σ_max = 2097.165767782749
```

Therefore, the maximal curvature of a geodesic in $C$ is $\approx 2097.17$.

Here is a plot of all critical points in green with the point of maximal curvature in red.

```julia
using Plots, ImplicitPlots
implicit_plot(f)
scatter!(hcat(R₂...)[1,:], hcat(R₂...)[2,:], color = :green)
scatter!([R₂[j][1]], [R₂[j][2]], color = :red)
```

<p style="text-align:center;"><img src="/images/curve_reach_curvature.png" width="500px"/></p>


{{<bibtex >}}
