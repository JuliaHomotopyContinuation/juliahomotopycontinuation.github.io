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

$$\overline{f}(A,b):= \frac{\sqrt{\pi}^{n+1}}{\Gamma(\frac{n+1}{2})}\,\sum\_{x\in V: Ax=b} \,f(x)\,\frac{1+\Vert x\Vert^2}{\sqrt{1+\langle x, \pi_x x\rangle}},$$

where $n=\mathrm{dim}(V)$, and where $\pi_x$ is the orthogonal projection onto the normal space of $V$ at $x$. The main theorem of [the article](https://arxiv.org/abs/1810.06271) yields

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

For computing $E(f,k)$ we have to intersect $V$ with many linear spaces. Following [this guide](/guides/many-systems) we first create a suitable start system by intersecting $V$ with a random complex linear space of dimension $N-n$.

```julia
N = 2 # dimension of the ambient space
n = 1 # dimension of C
@polyvar A[1:n, 1:N] b[1:n]
G = [F; A * x - b]

A₀ = randn(ComplexF64, n, N)
b₀ = randn(ComplexF64, n)
G₀ = [subs(g, vec(A)=>vec(A₀), b=>b₀) for g in G]
start = solve(G₀)
start_sols = solutions(start)
```

Now, we track `start_sols` towards $10^7$ random Gaussian linear spaces.

```julia
f(x) = 1.0 # so that ∫ f(x) dx gives the volume

#define the random variable f̄
const J = differentiate(F, x)
function f̄(R)
    if nreal(R) == 0
        return 0.0
    else
        return π * sum(z -> f(z) * β(z, J), real_solutions(R))
    end
end
function β(z, J)
    N = normalize!([j(x=>z) for j in J])
    (1 + z⋅z) / sqrt(1 + (z ⋅ N)^2)
end

#track towards random linear spaces
empirical_distribution = solve(
    G,
    start_sols;
    parameters = [vec(A); b],
    start_parameters =  [vec(A₀); b₀],
    target_parameters = [randn(n*N + n) for _ in 1:10^7],
    transform_result = (R,p) -> f̄(R)
)
```

We get the following estimate for the volume:

```julia-repl
julia> mean(empirical_distribution)
11.222552946349621
```

#### Rate of convergence

Let $\sigma^2$ be the variance of $\overline{f}(A,b)$. By Chebychevs inequality we have the following rate of convergence for the $k$-th empirical mean $\mathrm{E}(f,k) = \frac{1}{k}(\overline{f}(A_1,b_1) + \cdots \overline{f}(A_k,b_k))$:

$$\mathrm{Prob}\\{\vert \mathrm{E}(k) -  \int_V f(x)  \mathrm{d} x \vert \geq \varepsilon \\} \leq \frac{\sigma^2}{\varepsilon^2k},$$

One can show that
$\sigma^2 \leq d^2(1+C)^2 \frac{\pi^{n+1}}{\Gamma\left(\frac{n+1}{2}\right)^2}\, \max_{x\in V} f(x)^2,$
where $d = \mathrm{deg}(V)$ and $C\geq \max\_{x\in V}\Vert x\Vert^2$.

In the example curve from above we take $C=8$, $d=4$, $n=1$ and $\max_{x\in V} f(x)^2=1$:

```julia
using SpecialFunctions
C, d, n = 8, 4, 1
σ² = d^2 * (1+C)^2 * pi^(n+1) / gamma((n+1)/2)
```

For $\varepsilon = 0.1$ the probability of $\vert \mathrm{E}(1,k) - \mathrm{vol}(V)\vert\geq \varepsilon$ is

```julia-repl
julia> k, ε = 10^7, 0.1
julia> σ² / (ε^2 * k)
0.12791007303811808
```

Therefore, we can safely conclude that $\mathrm{vol}( C ) \approx 11.2$.

{{<bibtex >}}
