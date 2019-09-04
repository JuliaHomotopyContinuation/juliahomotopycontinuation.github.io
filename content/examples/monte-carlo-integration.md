+++
date = "2019-07-02T21:56:55+01:00"
title = "Monte Carlo Integration"
tags = ["example"]
categories = ["general"]
draft = false
description = "Integrating measurable functions on a variety"
weight = 2
author = "Paul Breiding"
+++


Consider the problem of numerically approximating an integral of the form

$$\int \,f(x) \, \mathrm{d}V,$$

where $V\subset \mathbb{R}^N$ is an [algebraic manifold](https://en.wikipedia.org/wiki/Algebraic_manifold), $\mathrm{d}V$ is the volume form on $V$ and $f:V\to \mathbb{R}$ is a measurable function.

For instance, for $f(x)=1$, this integral gives the volume of $V$. In this example, we want to use homotopy continuation to approximate this integral. We will use the Monte Carlo integration scheme proposed [in this article](https://arxiv.org/abs/1810.06271).

Let $n=\mathrm{dim}\, V$, and let $A\in \mathbb{R}^{n\times N}$ and $b\in \mathbb{R}^n$ be a matrix-vector pair with independent standard Gaussian entries. Then, almost surely, $\\{x\in \mathbb{R}^N : Ax=b\\}$ is a linear space of dimension $N-n$, which intersects $V$ in finitely many points.

Consider the function, which is defined by the sum over all $x\in V$ such that $Ax=b$:

$$\Sigma(f)(A,b):= \sum \,f(x)\,\frac{1+\Vert x\Vert^2}{\sqrt{1+\langle x, \pi_x x\rangle}},$$

where $\pi_x$ is the orthogonal projection onto the normal space of $V$ at $x$.

The equality that we want to exploit is in the main theorem of [the article](https://arxiv.org/abs/1810.06271), and it is as follows:

$$\frac{\sqrt{\pi}^{n+1}}{\Gamma(\frac{n+1}{2})}\;\mathbb{E} \, \Sigma(f)(A,b) = \int \,f(x) \, \mathrm{d} V.$$

By the law of large numbers, if we sample many pairs $(A,b)$ and take the empirical mean of $\Sigma(f)(A,b)$, then this number will converge to the integral of $f$ over $V$.

Let us now use this idea to approximate the volume of the unit circle.

```julia
using HomotopyContinuation, LinearAlgebra, Statistics
@polyvar x[1:2]
V = x[1]^2 + x[2]^2 - 1
∇V = differentiate(V, x)

function α(z, J)
    N = normalize!([j(x=>z) for j in J])
    (1 + z⋅z) / sqrt(1 + (z ⋅ N)^2)
end
```

We create a suitable start system by intersecting $V$ with a random complex linear space of dimension $N-n$.

```julia
N = 2
n = 1
@polyvar A[1:n, 1:N] b[1:n]
G = [V; A * x - b]

A₀ = randn(ComplexF64, n, N)
b₀ = randn(ComplexF64, n)

start = solve([subs(g, vec(A)=>vec(A₀), b=>b₀) for g in G])
start_sols = solutions(start)
```

Now, we track `start_sols` to $10^5$ random Gaussian linear spaces, following [this guide](/guides/many-systems).

```julia
tracker = pathtracker(G; parameters=[vec(A); b], generic_parameters=[vec(A₀); b₀])
f(x) = 1.0 # so that ∫ f(x) dx gives the volume

points = Vector{Vector{Float64}}()

empirical_distribution =  map(1:10^5) do _
    # We want to store all solutions. Create an empty array.
    S = Vector{Vector{Float64}}()
    for s in start_sols
        A = randn(n, N)
        b = randn(n)
        result = track(tracker, s; target_parameters=[vec(A); b], details=:minimal)
        # check that the tracking was successfull and that we have a real solution
        if is_success(result) && is_real(result)
            s = real(solution(result))
            push!(S, s)
        end
    end

    if isempty(S)
        return 0.0
    else
        return sum(z -> f(z) * α(z, ∇V), S)
    end
end
```

Let us check the volume:

```julia-repl
julia> μ = mean(empirical_distribution)
julia> volume = π * μ
6.284680060171913
```

The actual volume is $2\pi \approx 6.2832$. Thus, we have the volume with 3 correct digits. Considering that we have used a sample of size $10^5$, the speed of convergence of the law of large numbers seems to be rather slow. Nevertheless, the methods is fast enough to give a good and quick guess on the true volume.


{{<bibtex >}} 
