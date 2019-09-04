+++
date = "2019-07-02T21:56:55+01:00"
title = "Sampling"
tags = ["example"]
categories = ["general"]
draft = false
description = "Sampling from a variety"
weight = 1
author = "Paul Breiding"
+++

The article [Random points on an algebraic manifold](https://arxiv.org/abs/1810.06271) proposes an algorithm for sampling from probability densities on a variety based on linear slicing. In this example, we want to apply this algorithm to sample from the plane curve

$$V = \\{ x=(x_1,x_2) \in \mathbb{R}^2 : x_1^4+x_2^4-3x_1^2-x_1x_2^2-x_2+1=0\\}.$$

intersected with the box $B = [-2,2]\times [-2,2]$.

Suppose that $f:V\to \mathbb{R}_+$ is a measurable function. We want to sample from the density $f(x)/(\int f(x)\, \mathrm{d}V)$. We will consider the example $f(x)=1$, which gives the uniform distribution on $V\cap B$. For the algorithm we need upper bounds

$$K\geq \sup \\{ f(x) : x\in V\cap B\\} \quad \text{and}\quad C\geq \sup \\{\Vert x\Vert^2 : x\in V\cap B\\}.$$
We take $K = 1$ and $C = 8$.

The algorithm goes as follows. Intersect $V\cap B$ with a random line $L=\{a_1x+a_2y=b\}$, where $a_1,a_2$ and $b$ are independent standard Gaussian random variables.
Then, compute the following sum over the points $x\in V\cap B\cap L$:

$$g(a_1,a_2,b) := \sum \, f(x) \cdot \alpha(x), \text{ where } \alpha(x)= \frac{1+\Vert x\Vert^2}{\sqrt{1+ \langle x,\pi_x x\rangle}},$$

and $\pi_x$ is the orthogonal projection onto the normal space of $V$ at $x$ (*careful*: the $\alpha$ here is $1/(\pi\alpha)$ in the paper). Because $V$ has degree $4$, there are at most 4 points in the section, and so

$$p:= \frac{g(a_1,a_2,b)}{4K(1+C)} \leq 1.$$

Then, we throw a biased coin $Z$ with $\mathrm{Prob}\\{Z=1\\} = p$.

If $Z=1$, we choose the point in $x\in V\cap B\cap L$ with probability $f(x) \alpha(x)/g(a_1,a_2,b)$. If $Z=0$, we don't take any point. The theorem in the paper says that this procedure produces points from the density $f(x)/(\int_V f(x)\mathrm{d}x)$.

Let us sample in Julia. First, we set up the equations

```julia
using HomotopyContinuation, LinearAlgebra, Distributions
@polyvar x[1:2]
V = x[1]^4+x[2]^4-3x[1]^2-x[1]*x[2]^2-x[2]+1
∇V = differentiate(V, x)
K = 1
C = 8
W = 4K*(1+C)

function α(z, J)
    N = normalize!([j(x=>z) for j in J])
    (1 + z⋅z) / sqrt(1 + (z ⋅ N)^2)
end
```

We create a suitable start system by intersecting $V$ with a random complex linear space.

```julia
@polyvar a[1:2] b
G = [V; a⋅x - b]
a₀ = randn(ComplexF64, 2)
b₀ = randn(ComplexF64)

start = solve([subs(g, a=>a₀, b=>b₀) for g in G])
start_sols = solutions(start)
```

Now, we track `start_sols` to various random real intersections, following [this guide](/guides/many-systems). In the code below we make 1000 trials to get points.

```julia
tracker = pathtracker(G; parameters=[a; b], generic_parameters=[a₀; b₀])
f(x) = 1.0

points = Vector{Vector{Float64}}()

for i in 1:1000
    # We want to store all solutions. Create an empty array.
    S = Vector{Vector{Float64}}()
    for s in start_sols
        result = track(tracker, s; target_parameters=randn(3), details=:minimal)
        # check that the tracking was successfull and that we have a real solution
        if is_success(result) && is_real(result)
            s = real(solution(result))
            if abs(s[1]) < 2 && abs(s[2]) < 2
                # only store the solutions
                push!(S, s)
            end
        end
    end

    if !isempty(S)
        β = map(z -> f(z)*α(z, ∇V), S)
        Σβ = sum(β)
        p = Σβ / W

        # rejection step
        if rand(Bernoulli(p)) == 1
            q = β ./ Σβ
            i = rand(Categorical(q))
            push!(points, S[i])
        end
    end
end
```

The points we get from executing this code are shown next.

<p style="text-align:center;"><img src="/images/unif.png" width="700px"/></p>

The code can easily be adapted to sample from other densities. For instance, changing to `f(x) = exp(2x[2])`, `K=exp(4)` and `W=4K*(1+C)` samples from a distribution that gives more weight to points in the upper half plane. Here is a picture.

<p style="text-align:center;"><img src="/images/exp.png" width="700px"/></p>


{{<bibtex >}} 
