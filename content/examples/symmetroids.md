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
We use affine coordinates by setting the first matrix to be $A_0 = \mathrm{diag}(a_{1},a_{2},a_3)$, where $a_1,a_2,a_3$ are variables. Then, we have the following situation:

$$
f:V \to W,\\;
 (a_1,a_2,a_3,A_1,A_2,A_3) \mapsto \text{coefficients of }\det\\Big(\sum_{i=0}^4x_iA_i\\Big),
$$

where $D = \dim_{\mathbb C} V = 21$, $N = \dim W_{\mathbb C}  = 20$, and coefficients means the coefficients as a polynomial in $x$.

We set up $f$ in `julia`.

```julia
using HomotopyContinuation, LinearAlgebra
d = 3; n = 4
# D = dim V, N = dim W
M = binomial(d - 1 + 2, 2)
D = (n-1) * M + 3
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

A₀ = [a[D-2] 0 0; 0 a[D-1] 0; 0 0 a[D]]
μ = x[1] .* A₀ + sum(x[i+1] .* A[i] for i in 1:n-1)

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
(16, 5)
```

The degree of $Q_3$ multiplied by the degree of a general fiber $f^{-1}(h), h\in Q_3,$ is thus the number of isolated complex solutions of the following system of $16$ polynomial equations in the $16$ variables $b=(b_1,\ldots,b_{16})$:

$$
R \cdot f(a) = r \\quad \text{ and } \\quad  a = S\cdot b + s,
$$

where
$R \in \mathbb{C}^{16 \times 20}$, $r \in \mathbb{C}^{16}$,
$S \in \mathbb{C}^{21\times 16}$ and $s \in \mathbb{C}^{21}$
are chosen randomly.

```julia
# Compute a linear space a = S b + s
S1 = qr(randn(ComplexF64, D, D)).Q
S = S1[:, 1:dimQ]
s = S1[:, dimQ + 1]

@var b[1:dimQ]
L₁ = System(S * b + s)
```

We want to use [monodromy](https://www.juliahomotopycontinuation.org/guides/monodromy/) to solve the intersection of `f ∘ L₁` with the linear space given by $L_2 = \\{R\\cdot f(a) = r\\}$. For this, we consider the first row of $[R, r]$ as varying. We introduce new variables `k`.

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
dist(b₁,b₂) = norm(f(L₁(b₁)) - f(L₁(b₂)), Inf)
```
Finally, we execute the monodromy function.

```julia-repl
julia> points = monodromy_solve(L₂ ∘ f ∘ L₁,
                   distance = dist;
                   compile = false)
MonodromyResult
===============
• return_code → :heuristic_stop
• 305 solutions
• 2435 tracked loops
• random_seed → 0xfa48c9b2
```
This shows that the degree of the cubic symmetroid is $305$.

(This was proven by Vainsencher in [this article](https://www.tandfonline.com/doi/abs/10.1081/AGB-120022456).)

We certify that the 305 solutions are true solutions.

```julia-repl
julia> c = certify(L₂ ∘ f ∘ L₁,
    solutions(points);
    target_parameters = points.parameters)
CertificationResult
===================
• 305 solution candidates given
• 305 certified solution intervals (0 real, 305 complex)
• 305 distinct certified solution intervals (0 real, 305 complex)
```

We reuse the code for quartic symmetroids replacing `d = 3` by `d = 4`.  After three months the computation had found $849998$ solutions. At this point the computation was aborted manually, because it hadn't found any more solution in a week. This led us to state Conjecture that the degree $\delta$ of the quartic symmetroid is
$850000\leq \delta \leq 851000$. Determining the exact number is an open problem.


{{<bibtex >}}
