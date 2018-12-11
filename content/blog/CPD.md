+++
date = "2018-12-10T21:56:55+01:00"
title = "Tensor decomposition and homotopy continuation"
tags = ["example"]
categories = ["general"]
draft = false
description = "Using homotopy continuation for computing the CPD of a tensor"
weight = 3
author = "Paul"
+++

In this blog I want to repeat the computations from the article "[Homotopy Techniques for Tensor Decomposition and Perfect Identifiability](https://arxiv.org/pdf/1501.00090.pdf)" by Hauenstein, Oeding, Ottaviani and Sommese. In that article they compute the number of [canonical polyadic decompositions](https://en.wikipedia.org/wiki/Tensor_rank_decomposition) (CPD) of a random $2\times 2\times 2\times 3$-[tensor](https://en.wikipedia.org/wiki/Tensor) by using the [monodromy method](/guides/monodromy.md). It is known that with probability one a random complex $2\times 2\times 2\times 3$-tensor  has rank equal to 4:

$$ T = \sum_{i=1}^4 a_i \otimes b_i \otimes c_i \otimes d_i,$$

where

$$a_i = \begin{bmatrix} a_i^{(1)} \\\ a_i^{(2)} \end{bmatrix}\in \mathbb{C}^2, \; b_i  = \begin{bmatrix} 1 \\\ b_i^{(1)} \end{bmatrix} \in \mathbb{C}^2,\; c_i  = \begin{bmatrix} 1 \\\ c_i^{(1)} \end{bmatrix}\in \mathbb{C}^2, \;d_i = \begin{bmatrix} 1 \\\ d_i^{(1)} \\\   d_i^{(2)}\end{bmatrix} \in \mathbb{C}^3$$

(the $1$s compensate the multilinear property of the [Kronecker product](https://en.wikipedia.org/wiki/Kronecker_product) $\otimes$ to get a unique representation of the rank one tensors $a_i\otimes b_i\otimes c_i \otimes d_i$ via the factors $a_i,b_i,c_i,d_i$).  Let us decompose a random $T$ in Julia. First, we define the rank.
```julia
r = 4
```

Now, I initialize the variables for the factors $a_i,b_i,c_i,d_i, 1\leq i\leq 4$. The variables for the $a_i$ are being accumulated in one matrix $a$. Similar for the other factors:
```julia
using HomotopyContinuation
N = 2 * 2 * 2 * 3

#define variables for the tensor T
@polyvar T[1:N]
#define variables for the factors
@polyvar a[1:2, 1:r] b[1:1, 1:r] c[1:1, 1:r] d[1:2, 1:r]

A = a; B = [ones(1,r); b]; C = [ones(1,r); c]; D = [ones(1,r); d];
```

Then, I define the right-hand side $\sum_{i=1}^4 a_i \otimes b_i \otimes c_i \otimes d_i$:
```julia
S = sum(kron(A[:,i], B[:,i], C[:,i], D[:,i]) for i in 1:r)
```

To get an initial solution for the monodromy method, I simply assign random values to the factors $a,b,c,d$ and compute the corresponding value of `S`, which is called `T₀`.

```julia
a₀ = randn(ComplexF64, 2,r);
b₀ = randn(ComplexF64, 1,r);
c₀ = randn(ComplexF64, 1,r);
d₀ = randn(ComplexF64, 2,r);

initial_decomposition = [vec(a₀); vec(b₀); vec(c₀); vec(d₀)];
T₀ = [s([vec(a); vec(b); vec(c); vec(d)] => initial_decomposition) for s in S]
```

Finally, I use `initial_decomposition` for monodromy loops with starting parameter `T₀`.

```julia
F = T - S
Result = monodromy_solve(F, [initial_decomposition], T₀, parameters = T)
```

Here is the result:

```julia-repl
MonodromyResult
==================================
• 24 solutions (0 real)
• return code → heuristic_stop
• 924 tracked paths
```

There are 24 solutions. However, since 1 solution gives $4!=24$ solutions, corresponding to all orderings of the summands, I actually found one solution. This confirms the computations from the paper: a random complex $2\times 2\times 2\times 3$-tensor has a unique CPD.
