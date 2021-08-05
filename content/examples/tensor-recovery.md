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

Therefore, in order to have the tensor recovery well-posed we need some additional assumption. One common assumption is that the tensor $T$ has low rank. If $s$ is equal to the dimension of rank-$r$ tensors in $\mathbb R^{n_1\times \cdots \times n_d}$, then for a general measurement $\mu$ almost all tensors $T$ can be recovered: $\mu^{-1}(\mu(T))$ is finite. We will confirm this experimentally.

In this example we will recover a $4\times 3\times 2$ tensor of rank $2$ from the following incomplete tensor displayed by two $4\times 3$ slices:

$$ T = \\begin{bmatrix} -32   & ?     & -24\\\ 72    & ?     & ?  \\\ -104  & 40    & ? \\\ ?     & 16    & 0\\end{bmatrix}\quad \\begin{bmatrix}?   & 10    & ? \\\ -57   & 27    & ?\\\ -11   & 1     & ?\\\ -1    & ?     & -7\\end{bmatrix}.$$


The symbol ? means that this coordinate is not observed. In `julia` we use the symbol `:?` for denoting unobserved entries.

```julia-repl
julia> T = reshape([
        -32 :? -24 :? 10 :?;
        72 :? :? -57 27 :?;
        -104 40 :? -11 1 :?;
        :? 16 0 -1 :? -7], 4,3,2)
4×3×2 Array{Any, 3}:
[:, :, 1] =
  -32      :?  -24
   72      :?     :?
 -104    40       :?
     :?  16      0

[:, :, 2] =
    :?  10      :?
 -57    27      :?
 -11     1      :?
  -1      :?  -7
```

The number of observed entries is 14. This equals he dimension $d$ of rank-$2$ tensors in $\mathbb R^{4\times 3\times 2}$, so recovery is possible, in principle. Let us define the input data for the recovery problem and denote it by $y$:

```julia
observed_entries = findall(vec(T) .!= :?)
y = vec(T)[observed_entries]
y = convert(Vector{Float64}, y)
```

Now, $y$ is a vector that contains the observed coordinates of $T$.

We define the coordinate projection $\mu$ that projects onto the observed coordinates of $T$:

```julia
using LinearAlgebra
n = [4; 3; 2]
Id = diagm(0 => ones(prod(n)))
μ = Id[observed_entries, :]
```

## Setting up a polynomial system

To recover $T$ from $\mu(T)$ we define a polynomial system. First, we parametrize rank-2 tensors as follows:
$$\mathbb T = a_1 \otimes b_1 \otimes c_1 + a_2 \otimes b_2 \otimes c_2,$$
where $a_i,b_i,c_i\in \mathbb R^3$ for $i=1,2$.

Here, $\mathbb T$ should be understood as a function in $a_1,a_2,b_1,b_2,c_1,c_2$.

To get a one-to-one parametrization we set the last entries of $a_1,a_2,b_1,b_2$ equal to $1$ (this parametrizes a Euclidean dense subset of all rank-$2$ tensors).

Let us implement this in Julia.
```julia
using HomotopyContinuation

## 𝕋 = 4x3x2 tensor of rank r=2
r = 2
@var a[1:r, 1:(n[1]-1)] b[1:r, 1:(n[2]-1)] c[1:r, 1:n[3]]
𝕋 = sum( kron(c[i,:], [b[i,:];1], [a[i,:];1]) for i in 1:r)
```

Now, we can set up a system of polynomials equations for recovery:
```julia
F = System(μ * 𝕋 - y, variables = vec([a b c]))
```
which we solve directly:
```julia-repl
julia> S_F = solve(F)
Result with 6 solutions
=======================
• 23 paths tracked
• 6 non-singular solutions (4 real)
• random_seed: 0x40c65a1d
• start_system: :polyhedral
```

We see that we there are 4 real solutions. They come in pairs of two corresponding to the $\mathbb Z/2\mathbb Z$ action which interchanges the summands in the definition of $T$.

We can check that we get 2 distinct solutions:
```julia
recovered_tensors = [evaluate(𝕋, vec([a b c]) => sol) for sol in real_solutions(S_F)]
recovered_tensors = unique_points(recovered_tensors)
```

The number of recovered tensors is
```julia-repl
julia> length(recovered_tensors)
2
```

Let us take a look at the recovered tensors:
```julia-repl
julia> T₁ = reshape(recovered_tensors[1], 4, 3, 2)
4×3×2 Array{Float64, 3}:
[:, :, 1] =
  -32.0       411.518   -24.0
   72.0      1112.91   1075.77
 -104.0        40.0    -728.216
   -1.11448    16.0       0.0

[:, :, 2] =
 -26.0  10.0       -182.054
 -57.0  27.0       -396.574
 -11.0   1.0        -78.642
  -1.0   0.388769    -7.0
```

The other solutions is

```julia-repl
julia> T₂ = reshape(recovered_tensors[2], 4, 3, 2)
4×3×2 Array{Float64, 3}:
[:, :, 1] =
-32.0    8.0  -24.0
 72.0  -40.0  -56.0
-104.0   40.0   -8.0
-40.0   16.0    0.0

[:, :, 2] =
-26.0  10.0   -2.0
-57.0  27.0   21.0
-11.0   1.0  -17.0
-1.0  -1.0   -7.0
```

It is interesting to observe that both tensors coincide, up to $14$ significant digits, in the unobserved coordinate $(1,1,2)$ with value $-26$. This implies that augmenting $\mu$ with a projection to this coordinate (so it projects to $s = d+1$ coordinates) will not eliminate either completed tensor, even though this number of measurements generically suffices for generic identifiability!

## Condition numbers

Let us compute the condition numbers of the recovered tensors. It is defined as

$$\kappa(T) = \frac{1}{\sigma_{\min}(MQ)},$$

where $M$ is the matrix defining $\mu$ and $Q$ is a matrix whose columns form an orthonormal basis for the tangent space of rank-2 tensors at $T$.

We compute $Q$ by using a QR-decomposition of the Jacobian matrix of `𝕋` at the computed solutions.
```julia
d = 14
J = differentiate(𝕋, vec([a b c]))
Js = [evaluate(J, vec([a b c]) => sol) for sol in real_solutions(S_F)]
Qs = [(qr(J).Q)[:, 1:d] for J in Js]
```

We compute the condition numbers for our computed solutions:


```julia-repl
julia> [1/svdvals(μ * Q)[end] for Q in Qs]
4-element Vector{Float64}:
 1907.954236908041
   11.641768946763904
 1907.9542369079288
   11.641768946763932
```

The fact that each number appears twice is again due to the $\mathbb Z/2\mathbb Z$ action on the solutions.

Hence, `T₁` has a condition number of about 1907 and `T₂` a condition number of about 11.
{{<bibtex >}}
