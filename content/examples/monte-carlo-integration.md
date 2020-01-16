+++
date = "2019-07-02T21:56:55+01:00"
title = "Monte Carlo integration"
tags = ["example"]
categories = ["general"]
draft = false
description = "Integrating functions on a variety"
weight = 2
author = "Paul Breiding"
group = "math-data"
+++


Consider the problem of numerically approximating an integral of the form

$$\int\_{V} f(x)  \mathrm{d}x,$$

where $V\subset \mathbb{R}^N$ is an open submanifold of an algebraic variety and $f:V\to \mathbb{R}$ is a measurable function.

For instance, for $f(x)=1$, this integral gives the volume of $V$. In this example, we want to use homotopy continuation to approximate this integral. We will use the Monte Carlo integration proposed [in this article](https://arxiv.org/abs/1810.06271).

#### Integrating functions with homotopy continuation

Let $n=\mathrm{dim}\, V$, and let $A\in \mathbb{R}^{n\times N}$ and $b\in \mathbb{R}^n$ be a matrix-vector pair with independent standard Gaussian entries. Then, almost surely, $\\{x\in \mathbb{R}^N : Ax=b\\}$ is a linear space of dimension $N-n$, which intersects $V$ in finitely many points.

Consider the random variable

$$\overline{f}(A,b):= \sum\_{x\in V: Ax=b} \frac{f(x)}{\alpha(x)},$$

where

$$\alpha(x) = \frac{\Gamma(\frac{n+1}{2})}{\sqrt{\pi}^{n+1}} \frac{\sqrt{1+\langle x, \pi_x x\rangle}}{1+\Vert x\Vert^2}$$

and where $n=\mathrm{dim}(V)$, and where $\pi_x$ is the orthogonal projection onto the normal space of $V$ at $x$. The main theorem of [the article](https://arxiv.org/abs/1810.06271) yields

$$\mathbb{E} \, \overline{f}(A,b) = \int_V f(x)  \mathrm{d} x.$$

The empirical mean $\mathrm{E}(f,k) = \frac{1}{k}(\overline{f}(A_1,b_1) + \cdots \overline{f}(A_k,b_k))$ for $k$ sample pairs $(A_1,b_1),\ldots, (A_k,b_k)$ converges to the integral of $f$ over $V$ as $k\to \infty$.

#### Example: volume of a planar curve

Let us now use the empirical mean of $\overline{f}(A,b)$ for $f(x)=1$ to approximate the volume of the curve $C = \\{x^4+y^4-3x^2-xy^2-x+1 = 0\\}$. A plot of the curve is shown next.

<p style="text-align:center;"><img src="/images/curve0.png" width="400px"/></p>


Let us define the equation for $C$ in `Julia`.

```julia
using HomotopyContinuation, LinearAlgebra, Statistics
@polyvar x[1:2]
F = x[1]^4+x[2]^4-3x[1]^2-x[1]*x[2]^2-x[2]+1
```

We also define $\overline{f}$.

```julia
f(x) = 1.0 # so that ∫ f(x) dx gives the volume

using SpecialFunctions
N, n = 2, 1
Γ = SpecialFunctions.gamma((n+1)/2) / sqrt(pi)^(n+1)
J = differentiate(F, x)

#define f̄
function f̄(R)
    if nreal(R) == 0
        return 0.0
    else
        return sum(z -> f(z) / α(z, J), real_solutions(R))
    end
end
function α(z, J)
    N = normalize!([j(x=>z) for j in J])
    Γ * sqrt(1 + (z ⋅ N)^2) / (1 + z⋅z)
end
```

For computing $f(A,b)$ we have to intersect $V$ with linear spaces. Following [this guide](/guides/many-systems) we first create a suitable start system by intersecting $V$ with a random complex linear space of dimension $N-n$.

```julia
@polyvar A[1:n, 1:N] b[1:n]
G = [F; A * x - b]

A₀, b₀ = randn(ComplexF64, n, N), randn(ComplexF64, n)
G₀ = [subs(g, vec(A)=>vec(A₀), b=>b₀) for g in G]
start = solve(G₀)
start_sols = solutions(start)
```


Now, we track `start_sols` towards $10^7$ random Gaussian linear spaces.

```julia
k = 10^5
#track towards k random linear spaces
empirical_distribution = solve(
    G,
    start_sols;
    parameters = [vec(A); b],
    start_parameters =  [vec(A₀); b₀],
    target_parameters = [randn(n*N + n) for _ in 1:k],
    transform_result = (R,p) -> f̄(R)
)
```

We get the following estimate for the volume:

```julia-repl
julia> mean(empirical_distribution)
11.203665864791367
```

#### Rate of convergence

Let $\sigma^2$ be the variance of $\overline{f}(A,b)$. By Chebychevs inequality we have the following rate of convergence for the $k$-th empirical mean $\mathrm{E}(f,k) = \frac{1}{k}(\overline{f}(A_1,b_1) + \cdots \overline{f}(A_k,b_k))$:

$$\mathrm{Prob}\\{\vert \mathrm{E}(f,k) -  \int_V f(x)  \mathrm{d} x \vert \geq \varepsilon \\} \leq \frac{\sigma^2}{\varepsilon^2k}.$$

The empirical variance of our sample is

```julia-repl
julia> s² = std(empirical_distribution)
8.198196919934363
```

For $\varepsilon = 0.1$ the probability of $\vert \mathrm{E}(1,k) - \mathrm{vol}(V)\vert\geq \varepsilon$ is

```julia-repl
julia> ε = 0.1
julia> s² / (ε^2 * k)
0.008198196919934361
```

Therefore, we can safely conclude that $\mathrm{vol}( C ) \approx 11.2$.

{{<bibtex >}}
