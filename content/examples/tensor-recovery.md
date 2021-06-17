+++
date = "2021-05-31T21:56:55+01:00"
title = "Low rank tensor recovery"
tags = ["example"]
categories = ["general"]
draft = false
description = "Reconstructing a tensor from linear measurements"
weight = -2
author = "Paul Breiding, Fulvio Gesmundo, Mateusz Michalek, and Nick Vannieuwenhoven"
group = "math-data"
+++

Consider the problem of reconstructing a tensor $T\in\mathbb R^{n_1\times \cdots \times n_d}$ from linear measurements $\mu_1(T), \ldots, \mu_s(T)$, where each $\mu_i: \mathbb R^{n_1\times \cdots \times n_d}\to \mathbb R$ is a linear function.

This problem is called *tensor recovery*. If the $\mu_i$ are coordinate projections this is also known as *tensor completion*.

For a fixed measurement $y\in\mathbb R^s$, there are infinitely many tensors $T\in\mathbb R^{n_1\times \cdots \times n_d}$ with

$$\mu(T) = (\mu_1(T), \ldots, \mu_s(T)) = y.$$

Therefore, in order to have the tensor recovery well-posed we need some additional assumption. One common assumption is that the tensor $T$ has low rank. If $s$ is larger than the dimension of rank-$r$ tensors in $\mathbb R^{n_1\times \cdots \times n_d}$, then for a general measurement $\mu$ almost all tensors $T$ can be recovered *uniquely*: $\mu^{-1}(\mu(T)) = \\{T\\}$. We will confirm this experimentally.

In this example we will recover a $3\times 3\times 3$ tensor of rank $2$ from $s=15$ measurements. The dimension $d$ of rank-$2$ tensors in $\mathbb R^{3\times 3\times 3}$ is

```julia
d = 14
```

so that

```julia
s = 15
```

measurements suffice for unique recovery for almost all $T$.

We parametrize our tensors as follows:
$$T = a_1 \otimes b_1 \otimes c_1 + a_2 \otimes b_2 \otimes c_2,$$
where $a_i,b_i,c_i\in \mathbb R^3$ for $i=1,2$.

To get a one-to-one parametrization we set the last entries of $a_1,a_2,b_1,b_2$ equal to $1$ (this parametrizes a Euclidean dense subset of all rank-$2$ tensors).

Let us implement this in Julia.
```julia
using HomotopyContinuation, LinearAlgebra

## T = 3x3x3 tensor of rank 2
@var a[1:2, 1:2] b[1:2, 1:2] c[1:2, 1:3]
T = sum( kron([a[i,:];1], [b[i,:];1], c[i,:]) for i in 1:2)
```
Let us sample a random rank-$2$ tensor $T₀$.
```julia
a₀ = randn(2,2); b₀ = randn(2,2); c₀ = randn(2,3)
T₀ = evaluate(T, vec([a b c]) => vec([a₀ b₀ c₀]))
```
<br>

## Random measurements
We first consider the case when $\mu$ is a *randomly chosen* projection. We sample $\mu$ by sampling a $s\times 3^3$ Gaussian matrix $M$. Note that, if $y=MT$, then $Q^Ty = RT$ where $QR = M$ is the $QR$-decomposition of $M$. Therefore, it suffices to take the $R$-factor in the definition of the random map. The sparseness of $R$ is helpful when using the [polyhedral homotopy](https://www.juliahomotopycontinuation.org/guides/polyhedral/) later.
```julia
## random projection with s = 15
M₁ = qr(randn(s,3^3)).R
```

We define the measurement map and evaluate it at $T_0$.
```julia
μ₁ = M₁ * T
y₁ = M₁ * T₀
```

Now, we can set up a system of polynomials equations for recovery:
```julia
F = System(μ₁ - y₁, variables = vec([a b c]))
```
which we solve directly:
```julia-repl
julia> S_F = solve(F)
Result with 2 solutions
=======================
• 8009 paths tracked
• 2 non-singular solutions (2 real)
• 1564 excess solutions
• random_seed: 0x7fd9606f
• start_system: :polyhedral
```

We see that we there are two real solutions. They correspond to the $\mathbb Z/2\mathbb Z$ action on the solutions which interchanges the summands in the definition of $T$.

We can check that both solutions give the same tensor:
```julia
recovered_tensors = [evaluate(T, vec([a b c]) => sol) for sol in real_solutions(S_F)]
recovered_tensors_unique = unique_points(recovered_tensors)
```

The number of recovered tensors is
```julia-repl
julia> length(recovered_tensors_unique)
1
```
which shows that we have uniquely recovered $T_0$:
```julia-repl
julia> norm(T₀ - recovered_tensors_unique[1])
3.6619745506726126e-15
```
<br>

## Coordinate projections

Next, we consider the case when $\mu$ is a coordinate projection.

Let us randomly choose $s=15$ entries of $T$.
```julia
using StatsBase
Id = diagm(0 => ones(3^3))
M₂ = Id[sample(1:3^3, s, replace = false), :]
μ₂ = M₂ * T
```

Let us first check, if we can expect to recover points from $\mu$. For this, we evaluate the Jacobian $J$ of $T$ at $(a_0,b_0,c_0)$ and multiply it by $M$. If this has rank equal to $d=14$ we can expect recoverability.

```julia-repl
julia> J = differentiate(T, vec([a b c]))
julia> J₀ = evaluate(J, vec([a b c]) => vec([a₀ b₀ c₀]))
julia> rank(M₂ * J₀)
14
```

We can then proceed as before and recover $T_0$ from the measurement $y = \mu(T_0)$.
```julia
y₂ = M₂ * T₀
G = System(μ₂ - y₂, variables = vec([a b c]))
```

Solving $G$ gives the following result:
```julia-repl
julia> S_G = solve(G)
Result with 2 solutions
=======================
• 102 paths tracked
• 2 non-singular solutions (2 real)
• 8 excess solutions
• random_seed: 0xa249d8ef
• start_system: :polyhedral
```

As before we get 2 real solutions which we can use to get $T_0$:
```julia
recovered_tensors = [evaluate(T, vec([a b c]) => sol) for sol in real_solutions(S_G)]
recovered_tensors_unique = unique_points(recovered_tensors)
```

The number of recovered tensors is
```julia-repl
julia> length(recovered_tensors_unique)
1
```
and the distance of the recovered tensor to $T_0$ is:
```julia-repl
julia> norm(T₀ - recovered_tensors_unique[1])
5.380932148235815e-15
```

As above we conclude that we have uniquely recovered $T_0$.


## Condition numbers

The condition number of the recovering map at the data point $y\in\mathbb R^s$ is

$$\kappa(y) = \frac{1}{\sigma_{\min}(MQ)},$$

where $M$ is the matrix defining $\mu$ and $Q$ is a matrix whose columns form an orthonormal basis for the tangent space of rank-2 tensors at $T$.
```julia
Q = (qr(J₀).Q)[:, 1:d]
```

 We compute the condition number for both measurement maps:

For the randomly chosen projection we have

```julia-repl
julia> κ₁ = 1/svdvals(M₁ * Q)[end]
2.3828877488792153
```

For the coordinate projection we have

```julia-repl
julia> κ₂ = 1/svdvals(M₂ * Q)[end]
188.6820598623247
```

{{<bibtex >}}
