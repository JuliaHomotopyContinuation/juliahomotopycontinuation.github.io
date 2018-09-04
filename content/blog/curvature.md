+++
date = "2018-09-04T11:56:55+01:00"
title = "The point of maximal curvature on a surface"
tags = ["example"]
categories = ["general"]
draft = false
description = "How to compute curvature with homotopy continuation"
weight = 10
author = "Paul"
+++

(Update Sept. 4 2018: there have been some typos in the first version of this post. They have been fixed.)

In a recent discussion with [Maddie Weinstein](https://math.berkeley.edu/~maddie/) and [Khazhgali Kozhasov](http://personal-homepages.mis.mpg.de/kozhasov/) we considered the problem of computing the maximal curvature of an algebraic manifold  $V\subset \mathbb{R}^n$ (a smooth [manifold](https://en.wikipedia.org/wiki/Manifold) that is also a real [algebraic variety](https://en.wikipedia.org/wiki/Algebraic_variety) ).

Our definition of maximal curvature is $\sigma: = \mathrm{sup}_{p\in V} \sigma(p)$, where $\sigma(p)$ is the maximal curvature of a [geodesic](https://en.wikipedia.org/wiki/Geodesic) through $p$:

$$\sigma(p): = \mathrm{max} \,\\{\Vert \ddot{\gamma}(0)\Vert \mid \gamma:(-1,1) \to V \text{ geodesic with } \gamma(0)=p, \Vert \dot{\gamma}(0)\Vert = 1\\}$$

(curves with unit norm derivatives are called [parametrized by arc-length](https://en.wikipedia.org/wiki/Differential_geometry_of_curves)).

In this blog post I want to explain how to compute $\sigma$ for [hypersurfaces](https://en.wikipedia.org/wiki/Hypersurface) in $\mathbb{R}^n$ using HomotopyContinuation.jl. The approach I present can be generalized to varieties of higher codimension, but this will be elaborated at another point.

The math behind the problem is advanced and requires some knowledge on [differential geometry](https://en.wikipedia.org/wiki/Differential_geometry). This is why I decided to put the theoretical part at the end of this blog post. The reader who just wants to see code can execute the following script. It is written for the input data $n=2$ and $V = \\{x_1^2 + 4x_1 + x_2 - 1 = 0\\}$.

```julia
n = 2
using HomotopyContinuation
@polyvar σ x[1:n] v[1:n] w[1:n] μ ω[1:2] # initialize variables
f = x[1]^2 + 4x[1] + x[2] - 1 # define f

∇ = differentiate(f, x) # the gradient
H = hcat([differentiate(∇[i], x) for i in 1:n]...) # the Hessian

g = ∇ ⋅ ∇
h = w ⋅ (H * v)
dg = differentiate(g, x)
dh = differentiate(h, x)

r =  μ .* ∇ + ω[1] .* H * v + ω[2] .* H' * w

# F is the system that is solved
F = [
    g .* dh - h .* dg - g .* (σ/2) .* dg - g^2 .* r;
    H' * w - (σ * g) .* v - (ω[1] * g) .* ∇;
    H * v - σ .* w - (ω[2] * g) .* ∇;
    f;
    ∇ ⋅ v;
    ∇ ⋅ w;
    randn(1,n) * v - 1;
]

S = solve(F)

# Filter the solutions for which x and σ are real

# extracts the finite solutions
finite_sols = results(solution, S, onlyfinite = true)
# extracts real x and σ from the finite solutions
sols = filter(s -> norm(imag.(s[1:(n+1)])) .< 1e-8, finite_sols)
# finds the largest σ
m = indmax([abs(s[1]) for s in sols])
σ_max, p = abs(sols[m][1]), sols[m][2:(n+1)]
```

If $V=\\{f = 0\\}$ has a point of maximal curvature, that point will be saved to the variable `p` and the maximal curvature at this point is `σ_max`. The picture is as follows.

<img src="/images/curvature1.png" width="500px"/>

It is not suprising that the maximal curvature is attained at the vertex.

Already in this small example the totaldegree of `F` is 46080.  For sparse systems with large totaldegree like `F` it makes sense to exploit Julia's JIT compiler for evaluating polynomials. The [StaticPolynomials](https://github.com/JuliaAlgebra/StaticPolynomials.jl) package provides this option and it used in HomotopyContinuation.jl by calling `solve(F, system = SPSystem)`.

The next example is the following hypersurface in $\mathbb{R}^3$:

$$V=\\{-x_1^2 - x_1x_2 + x_2^2 - 3x_1 - 3x_2  - 25 x_3 - 1 = 0\\}$$

Here, the totaldegree of `F` is 4423680. For such parametric surfaces I can precondition the system by some straight-forward elimination, thus cutting the totaldegree down to 2211840. I get the following picture.

<img src="/images/curvature2.gif" width="500px"/>

I created this gif with the `@gif` macro from the [Plots.jl](http://docs.juliaplots.org/latest/) package.

For higher dimensional surfaces or surfaces of degree more than 2, the totaldegree of `F` becomes prohibitively large for computations. Another approach than totaldegree homotopy is required.

<h3 class="section-head">Relation to topological data analysis</h3>

Computing the maximal curvature $\sigma$ is relevant for
[topological data analysis](https://en.wikipedia.org/wiki/Topological_data_analysis) (TDA) as it is part of computing the *reach* $\tau_V$ of a manifold $V$. I don't want to recall the technical definition of the reach, but rather quote [Aamari et al.](https://arxiv.org/pdf/1705.04565.pdf) who write *"If a set has its reach greater than $\tau_V > 0$, then one can roll freely a ball of radius $\tau_V > 0$ around it".* The connection to TDA comes from a paper by [Niyogi, Smale and Weinberger](http://people.cs.uchicago.edu/~niyogi/papersps/NiySmaWeiHom.pdf) who explain how to compute the homology of a manifold $V$ from a finite point sample $X\subset V$. In their computation they assume that the reach $\tau_V$ is known. This is why being able to compute the reach is important for TDA.

[Aamari et al.](https://arxiv.org/pdf/1705.04565.pdf) show that $\tau_V$ is the minimum $ \tau_V = \min\, \\{\sigma^{-1}, \rho\\},$
where $\sigma$ is the maximal curvature as above, and $\rho$ is $\frac{1}{2}$ the width of the narrowest *bottleneck* of $V$.
[David Eklund](https://arxiv.org/pdf/1804.01015.pdf) has shown how to compute $\rho$ using homotopy continuation. Computing the maximal curvature $\sigma$ is the final step towards computing the reach.


<h3 class="section-head">The Algebraic Geometry of Curvature</h3>

I will now explain the math behind the problem, and why the code above does what it is supposed to do. The variety $V$ is assumed to be a smooth hypersurface in $\mathbb{R}^n$. That is, there is a polynomial $f(x_1,\ldots,x_n)$ with $V = \\{p\in\mathbb{R}^n\mid f(p)=0\\}.$

It can be shown that the maximal curvature at $p$ is the [spectral norm](http://mathworld.wolfram.com/SpectralNorm.html) of the derivative of the [Gauss map](https://en.wikipedia.org/wiki/Gauss_map) $G: V \to \mathbb{P}^{n-1}\mathbb{R},\, p\mapsto (\mathrm{T}_p V)^\perp$.
The Gauss map sends a point $p$ to the normal space of $V$ at $p$. Since $V$ is of codimension $1$, the normal space is a line and lines are parametrized by the $(n-1)$-dimensional [projective space](https://en.wikipedia.org/wiki/Projective_space) $\mathbb{P}^{n-1}\mathbb{R}$. Summarizing:

$$\sigma(p) = \max_{v\in \mathrm{T}_p V,\, w\in \mathrm{T}_L \mathbb{P}^{n-1}\mathbb{R} \,  \Vert v\Vert = \Vert w \Vert_L =1}  \,\langle w, DG(p)v\rangle_L.$$

where $L=G(p)$ and $\langle \,,\,\rangle_L$ is the metric on $\mathrm{T}_L \mathbb{P}^{n-1}\mathbb{R}$.
What is this metric? First, $V$ being embedded in $\mathbb{R}^n$ inherits the usual euclidean inner product $\langle\;,\,\rangle$. The inner product on the tangent space to $L$ is as follows: if $L$ is a line through $q\in \mathbb{R}^n$, then  $\mathrm{T}_L \mathbb{P}^{n-1}\mathbb{R} \cong q^\perp$ and the inner product on $q^\perp$ is $\langle \;,\,\rangle_L  = \frac{\langle\;,\,\rangle}{\langle q,q \rangle}$ (see, e.g., section 14 in Bürgisser, Cucker: *Condition: the geometry of numerical algorithms*, Springer 2013). It follows that,

$$\sigma(p) = \max_{v\in \mathrm{T}_p V,\, w\in q^\perp \,   v^Tv = 1, \,w^Tw = q^T q}  \,\frac{w^T \,DG(p) \,v}{q^Tq}$$
where $q$ is a point on $G(p)=(\mathrm{T}_p V)^\perp$.

A point on $(\mathrm{T}_p V)^\perp$ that can be computed easily from the input data is the [gradient](https://en.wikipedia.org/wiki/Gradient)

$$\nabla_p = \left(\frac{\partial f}{\partial x_1}(p),\ldots, \frac{\partial f}{\partial x_n}(p)\right)^T,$$

so that

$$\sigma(p) = \max_{v,w\in \nabla_p^\perp,\,  v^Tv = 1,\, w^Tw = \nabla_p^T\,\nabla_p}  \,\frac{w^T \,DG(p)\, v}{\nabla_p^T\,\nabla_p}.$$

In remains to compute $DG(p)$. For this let $\pi : \mathbb{R}^n \to \mathbb{P}^{n-1}\mathbb{R}$ be the projection that sends $q\in  \mathbb{R}^n$ to the line through $q$. Then, the Gauss map is written as $G(p) = \pi(\nabla_p).$ Consequently, by the chain rule of differentiation:

$$DG(p) = D\pi(\nabla_p) \, H$$
where $H = \begin{bmatrix} \frac{\partial \nabla}{\partial x_1} & \ldots & \frac{\partial \nabla}{\partial x_n}\end{bmatrix}$ is the Hessian of $f$.

One can show that $D\pi(\nabla_p)$ is the orthogonal projection onto $\nabla_p^\perp$. If $I_n$ denotes the $n\times n$ identity matrix: $D\pi(\nabla_p) =  I_n - \frac{\nabla_p \nabla_p^T}{\nabla_p^T \nabla_p}$. From this it is easy to see that $w^T\,D\pi(\nabla_p) = w^T$ for all $w\in \nabla_p^\perp$. Therefore, the following is an equation for $\sigma(p)$:

$$\sigma(p) = \max_{v, w\in \nabla_p^\perp \,  v^Tv = 1,\, w^Tw = \nabla_p^T\,\nabla_p}  \,\frac{w^T \,H\, v}{\nabla_p^T\,\nabla_p}.$$

I finally arrive at the following formula for $\sigma$.

$$\sigma = \max_{p \in V,\,v, w\in \nabla_p^\perp \,  v^Tv = 1,\, w^Tw = \nabla_p^T\,\nabla_p}  \,\frac{w^T \,H\, v}{\nabla_p^T\,\nabla_p}$$

(actually, the last $\max$ is a $\sup$, but I want to derive the critical equations of the $\max$). Writing $g = \nabla_p^T\nabla_p$, the Lagrange function for this maximization problem is

$$L=\frac{w^T H v}{g} - \frac{\sigma}{2}(v^Tv-1) - \frac{\lambda}{2}(w^Tw - g) - \mu \cdot f \omega_1\cdot\nabla_p^Tv - \omega_2\cdot\nabla_p^Tw ,$$

where $\sigma,\lambda,\mu,\omega_1,\omega_2$ are Lagrange multipliers.

The corresponding critical equations are:

* $ (\frac{\partial w^T H v}{\partial x_i})^{1\leq i \leq n} \cdot g -w^T H v \cdot(\frac{\partial g}{\partial x_i})^{1\leq i\leq n} - \frac{\sigma\cdot g}{2} \cdot (\frac{\partial g}{\partial x_i})^{1\leq i\leq n}-g^2 \cdot r=0$, where $r=\mu\cdot \nabla_p+\omega_1 \cdot Hv + \omega_2 \cdot H^Tw$.

* $H^T w - \sigma \cdot  g  \cdot v - \omega_1  \cdot g  \cdot \nabla_p=0$,

* $H v - \sigma \cdot  w - \omega_2 \cdot  g  \cdot \nabla_p=0$,

* $f=0$,

* $\nabla_p^T v=0$,

* $\nabla_p^T w=0$,

* $v^T v  = 1$.

(one can replace $v^T v  = 1$ by a degree 1 normalization like $a_1v_1 + \cdots + a_nv_n = 1$ to decrease the totaldegree of the system). These are the equations solved with the code above. It would be interesting to understand the degree of the equations for generic $f$.
