+++
date = "2021-26-00:00:00"
title = "Symmetroids"
tags = ["example"]
categories = ["general"]
draft = false
description = "Computing the degree of a cubic symmetroid"
weight = 3
author = "Paul Breiding, Christian Ikenmeyer, Mateusz Michalek, and Reuven Hodges"
group = "algebraic-geometry"
+++


We make a numerical computation to determine the degree of the cubic symmetroid

$$Q_3:= \\{\det(x_0A_0 + x_1A_1 + x_2A_2 + x_3A_3)\mid A_i\in \mathbb{C}^{3\times 3}, A_i^T = A_i, 0\leq i\leq 3\\}.$$

First, we compute the dimension of $Q_3$.
We use affine coordinates by setting $A_0 = \mathbf 1_3$ equal to the $3\times 3$ identity matrix. Then, we have the following situation:

$$
f:V \to W,\\;
 (A_1,A_2,A_3) \mapsto \text{coefficients of }\det(x_0\mathbf 1_3 + x_1A_1 + x_2A_2 + x_3A_3),
$$

where $\dim_{\mathbb C} V = 18$ and $\dim W_{\mathbb C}  = 20$. We set up $f$ in `julia`.

```julia
using HomotopyContinuation, LinearAlgebra
d = 3; n = 4
# D = dim V, N = dim W
M = binomial(d - 1 + 2, 2)
D = (n-1) * M
N = binomial(n - 1 + d, d)

@var x[0:n-1] a[1:D]
# Construct symmetric matrices with variable entries
A = map(0:n-2) do ℓ
  Aᵢ  = []
  for i in 1:d
           k = ℓ * M + sum(d-j for j in 0:i-1)
           push!(Aᵢ, [zeros(i-1); a[k-(d-i):k]])
  end
  Aᵢ = hcat(Aᵢ...)
  (Aᵢ + transpose(Aᵢ)) ./ 2
end

μ = x[1] .* diagm(0=>ones(d)) + sum(x[i+1] .* A[i] for i in 1:n-1)

# f is equal to the coefficients of det(μ) as a polynomial in x
f = System(coefficients(det(μ), x))
```

To determine the dimension of $Q_3$ we compute the rank of the Jacobian matrix of $f$ at a random point.

```julia
J₀ = jacobian(InterpretedSystem(f), randn(ComplexF64,D))
dimQ = rank(J₀)
dim_fibers = D  - dimQ
```

We get
```julia-repl
julia> dimQ, dim_fibers
(15, 3)
```

The degree of $Q_3$ is thus the number of isolated complex solutions of the following system of $18$ polynomial equations in the $18$ variables $a$:

$$
R \cdot f(a) = r \\quad \text{ and } \\quad  a = S b + s,
$$

where
$R \in \mathbb{C}^{15 \times 18}$, $r \in \mathbb{C}^{15}$,
$S \in \mathbb{C}^{18\times 15}$ and $s \in \mathbb{C}^{18}$
are chosen randomly.

```julia
# Compute a linear space a = S b + s
S1 = qr(randn(ComplexF64, D, D)).Q
S = S1[:, 1:dimQ]
s = S1[:, dimQ + 1]

@var b[1:dimQ]
L₁ = System(S * b + s)
```

We want to use [monodromy](https://www.juliahomotopycontinuation.org/guides/monodromy/) to solve the intersection of `f ∘ L₁` with the linear space given by $L_2 = \\{R\, f(a) = r\\}$. For this, we consider the first row of $[R, r]$ as varying. We introduce new variables `k`.

```julia
@var k[1:N+1] f₀[1:length(f)]
R1 = qr(randn(ComplexF64, N, N)).Q
R = [transpose(k[1:N]); R1[1:(dimQ-1), :]]
r = [k[N+1]; randn(dimQ-1)]

L₂ = System(
           R * f₀ - r,
           variables = f₀;
           parameters = k
           );
```

Now, we can compute the zeros of `L₂ ∘ f ∘ L₁` using monodromy. It is enough to compute one zero in each fiber. This is why we compare points with the distance function

$$\mathrm{dist}(b_1,b_2) = \Vert (f\circ L_1)(b_1) - (f\circ L_1)(b_2)\Vert_\infty.$$

```julia
dist(b₁,b₂) = norm((f ∘ L₁)(b₁) - (f ∘ L₁)(b₂), Inf)
```
Finally, we execute the monodromy command.

```julia-repl
julia> points = monodromy_solve(L₂ ∘ f ∘ L₁,
                   distance = dist;
                   compile = false)
===============
• return_code → :interrupted
• 310 solutions
• 1879 tracked loops
• random_seed → 0x47a4214e
```
This shows that the degree of the cubic symmetroid is $310$.

We reuse the code for quartic symmetroids replacing `d = 3` by `d = 4`.  After three months the computation had found $849998$ solutions. At this point the computation was aborted manually, because it hadn't found any more solution in a week. This led us to state Conjecture that the degree $\delta$ of the quartic symmetroid is
$850000\leq \delta \leq 851000$. Determining the exact number is an open problem.


{{<bibtex >}}
