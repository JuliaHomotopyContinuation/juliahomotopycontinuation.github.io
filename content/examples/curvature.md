+++
date = "2018-09-04T11:56:55+01:00"
title = "Maximal curvature of a surface"
tags = ["example"]
categories = ["general"]
draft = false
description = "How to compute curvature"
weight = 10
author = "Paul"
+++

<h3 class="section-head">Curvature of curves in the plane</h3>

Consider the problem of computing the point on a (smooth) real variety $V\subset \mathbb{R}^n$, where the curvature is maximal. For curves in the plane $ \mathbb{R}^2$ we can use the [following formula](https://en.wikipedia.org/wiki/Implicit_curve#Slope_and_curvature) for curvature at a point $p\in V = \\{f(x_1,x_2)=0\\}$.

$$\sigma(p) = \frac{v^T H v}{g^\frac{3}{2}}$$

where $v^T \,\nabla_p f(p) = 0$, $H$ is the Hessian of $f$ at $p$ and $g = \nabla_p f(p)^T\nabla_p f(p)$. The conditions for $\sigma(p)$ being maximal on $V$ are thus $v^T \, \nabla_p \sigma(p)=0$ and $f(p)=0$.

Thus, for maximizing $\sigma$ over


$$V =\\{x_1^4 - x_1^2x_2^2 + x_2^4 - 4x_1^2 - 2x_2^2 - x_1 - 4x_2 + 1 = 0\\}$$

we use the following code.
```julia
using HomotopyContinuation, DynamicPolynomials, LinearAlgebra
# using JLD2

@polyvar x[1:2]# initialize variables
f = x[1]^4 - x[1]^2*x[2]^2 + x[2]^4 - 4x[1]^2 - 2x[2]^2 - x[1] - 4x[2] + 1

∇ = differentiate(f, x) # the gradient
H = differentiate(∇, x) # the Hessian

g = ∇ ⋅ ∇
v = [-∇[2]; ∇[1]]
h = v' * H * v
dg = differentiate(g, x)
dh = differentiate(h, x)

F = [(g .* dh - ((3/2) * h).* dg) ⋅ v; f]

S = solve(F)
```

Then, `S` returns

```julia-repl
julia> S
Result with 56 solutions
==================================
• 56 non-singular solutions (12 real)
• 0 singular solutions (0 real)
• 64 paths tracked
• random seed: 314288
```

Here is a picture of all solutions.

<p style="text-align:center;"><img src="/images/curvature.pdf" width="600px"/></p>



<h3 class="section-head">Curvature of general hypersurfaces</h3>

The definition of maximal curvature for points on general [hypersurfaces](https://en.wikipedia.org/wiki/Hypersurface) is the maximal curvature of a [geodesic](https://en.wikipedia.org/wiki/Geodesic) through $p$:

$$\sigma(p) = \mathrm{max} \,\\{\Vert \ddot{\gamma}(0)\Vert \mid \gamma \in V \text{ geodesic with\ } \gamma(0)=p, \Vert \dot{\gamma}(0)\Vert = 1\\}$$

(curves with unit norm derivatives are called [parametrized by arc-length](https://en.wikipedia.org/wiki/Differential_geometry_of_curves)).

Here, the equations are more complicated.
The math for deriving them requires some knowledge on [differential geometry](https://en.wikipedia.org/wiki/Differential_geometry). The theoretical part is at the end of this example. The reader who just wants to see code can execute the following script. It is written for the input data

$$V=\\{x_1^2 + x_1x_2 + x_2^2  + x_1 - 3x_2  -  2x_3 + 2 = 0\\}.$$

```julia
n = 3
@polyvar x[1:n] v[1:n] z[1:3]# initialize variables
f = x[1]^2 + x[1]*x[2] + x[2]^2  + x[1] - 3x[2]  -  2x[3] + 2# define f

∇f = differentiate(f, x) # the gradient
H = hcat([differentiate(∇f[i], x) for i in 1:n]...) # the Hessian

g = ∇f ⋅ ∇f
h = v ⋅ (H * v)
∇g = differentiate(g, x)
∇h = differentiate(h, x)
A = [(g .* ∇h - (3/2 * h) .* ∇g) ∇f H*v zeros(n); g.*(H*v) zeros(n) ∇f v]

# F is the system that is solved
F = [
    A * [1;z]
    v ⋅ v - 1;
    ∇f ⋅ v;
    f
]

S = solve(F)

# extract the real solutions
real_sols =  realsolutions(S)

# find the maximal σ
σ = map(p -> abs(h([x;v] => p[1:2n]) / g([x;v] => p[1:2n])^(3/2)), real_sols)
σ_max, i = findmax(σ)
p = real_sols[i][1:n]

```

The following animation was created with the `@gif` macro from the [Plots.jl](http://docs.juliaplots.org/latest/) package.

<p style="text-align:center;"><img src="/images/curvature2.gif" width="500px"/></p>


<h3 class="section-head">The Algebraic Geometry of Curvature</h3>

Here is why the code above does what it is supposed to do.

It can be shown that for hypersurfaces $V = \\{f=0\\}.$ the maximal geodesic curvature at $p$ is the [spectral norm](http://mathworld.wolfram.com/SpectralNorm.html) of the derivative of the [Gauss map](https://en.wikipedia.org/wiki/Gauss_map) $G: V \to \mathbb{P}^{n-1}\mathbb{R},\, p\mapsto (\mathrm{T}_p V)^\perp$.
The Gauss map sends a point $p$ to the normal space of $V$ at $p$. Since $V$ is of codimension $1$, the normal space is a line and lines are parametrized by the $(n-1)$-dimensional [projective space](https://en.wikipedia.org/wiki/Projective_space) $\mathbb{P}^{n-1}\mathbb{R}$. Summarizing:

$$\sigma(p) = \max_{v\in \mathrm{T}_p V,\, w\in \mathrm{T}_L \mathbb{P}^{n-1}\mathbb{R} \,  \Vert v\Vert = \Vert w \Vert_L =1}  \,\langle w, DG(p)v\rangle_L.$$

where $L=G(p)$ and $\langle \,,\,\rangle_L$ is the metric on $\mathrm{T}_L \mathbb{P}^{n-1}\mathbb{R}$.
What is this metric? First, $V$ being embedded in $\mathbb{R}^n$ inherits the usual euclidean inner product $\langle\;,\,\rangle$. The inner product on the tangent space to $L$ is as follows: if $L$ is a line through $q\in \mathbb{R}^n$, then  $\mathrm{T}_L \mathbb{P}^{n-1}\mathbb{R} \cong q^\perp$ and the inner product on $q^\perp$ is $\langle \;,\,\rangle_L  = \frac{\langle\;,\,\rangle}{\langle q,q \rangle}$. It follows that,

$$\sigma(p) = \max_{v\in \mathrm{T}_p V,\, w\in q^\perp \,   v^Tv = 1, \,w^Tw = q^T q}  \,\frac{w^T \,DG(p) \,v}{q^Tq}$$
where $q$ is a point on $G(p)=(\mathrm{T}_p V)^\perp$.

A point on $(\mathrm{T}_p V)^\perp$ that can be computed easily from the input data is the [gradient](https://en.wikipedia.org/wiki/Gradient)

$$\nabla_p f = \left(\frac{\partial f}{\partial x_1}(p),\ldots, \frac{\partial f}{\partial x_n}(p)\right)^T,$$

so that

$$\sigma(p) = \max_{v,w\in \nabla_p f^\perp,\,  v^Tv = 1,\, w^Tw = \nabla_p f^T\,\nabla_p f}  \,\frac{w^T \,DG(p)\, v}{\nabla_p f^T\,\nabla_p f}.$$

It remains to compute $DG(p)$. For this let $\pi : \mathbb{R}^n \to \mathbb{P}^{n-1}\mathbb{R}$ be the projection that sends $q\in  \mathbb{R}^n$ to the line through $q$. Then, the Gauss map is written as $G(p) = \pi(\nabla_p f).$ Consequently, by the chain rule of differentiation:

$$DG(p) = D\pi(\nabla_p f) \, H$$
where $H = \begin{bmatrix} \frac{\partial \nabla}{\partial x_1} & \ldots & \frac{\partial \nabla}{\partial x_n}\end{bmatrix}$ is the Hessian of $f$.

One can show that $D\pi(\nabla_p f)$ is the orthogonal projection onto $\nabla_p f^\perp$. If $I_n$ denotes the $n\times n$ identity matrix: $D\pi(\nabla_p f) =  I_n - \frac{\nabla_p f \nabla_p f^T}{\nabla_p f^T \nabla_p f}$. From this it is easy to see that $w^T\,D\pi(\nabla_p f) = w^T$ for all $w\in \nabla_p f^\perp$. Therefore, the following is an equation for $\sigma(p)$:

$$\sigma(p) = \max_{v, w\in \nabla_p f^\perp \,  v^Tv = 1,\, w^Tw = \nabla_p f^T\,\nabla_p f}  \,\frac{w^T \,H\, v}{\nabla_p f^T\,\nabla_p f}.$$

Diving $w$ by $\sqrt{g}$ for $g:=\nabla_p f^T\,\nabla_p f$ and using that $H$ is symmetric we have

$$\sigma(p) = \max_{v \in \nabla_p f^\perp \,  v^Tv = 1}  \,\frac{v^T \,H\, v}{g^\frac{3}{2}}.$$

(for curves in the plane this is the formula from above). Finally, the following formula for $\sigma$

$$\sigma = \max_{p\in V, v \in\nabla_p f^\perp \,  v^Tv = 1}  \,\frac{v^T \,H\, v}{g^\frac{3}{2}}$$

(actually, the last $\max$ is a $\sup$).

Writing $h =  v^T H v$, $\nabla h = (\frac{\partial h}{\partial x_i})^{1\leq i\leq n}$ and $\nabla g = (\frac{\partial g}{\partial x_i})^{1\leq i\leq n}$
the corresponding critical equations of this are:

* $A \begin{bmatrix} 1\\\ z \end{bmatrix} = 0$ for $A= \begin{bmatrix}\nabla h \cdot g - \frac{3}{2} \cdot h \cdot \nabla g &  \nabla f & Hv&  0 \\\ Hv &  0 & \nabla f & v \end{bmatrix}$ and $z=(z_1,z_2,z_3)^T$.

* $f=0$.

* $v^Tv = 1$

* $\nabla f^T v = 0$

 These are the equations solved with the code above. It would be interesting to understand the degree of the equations for generic $f$.
