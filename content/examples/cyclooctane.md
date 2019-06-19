+++
date = "2019-06-16T21:56:55+01:00"
title = "Cyclooctane"
tags = ["example"]
categories = ["general"]
draft = false
description = "The confirmation space of cyclooctane"
weight = 1
author = "Paul"
+++


[Cyclooctane](https://en.wikipedia.org/wiki/Cyclooctane) (CH₂)₈ is a molecule that consists of eight carbon atoms aligned in a ring, and eight hydrogen atoms, each of which is attached to one of the carbon atoms. The distance $c>0$ between neighboring carbon atoms is fixed.

In this example, we want to study the confirmation space of cyclooctane with Homotopy Continuation.
The equations for the positions $z_i\in\mathbb{R}^3$ of the carbon atoms satisfy the algebraic equations

$$\Vert z_1-z_2\Vert^2 = \cdots =  \Vert z_7-z_8\Vert^2=\Vert z_8-z_1\Vert^2 = c^2.$$

The energy of a configuration $z=(z_1,\ldots,z_8)$ is minimized when the angles between successive bonds are all equal to $\text{arccos}(-\frac{1}{3}) \approx 109.5^\circ$. If we assume this geometrical constraint, by the law of cosines, the $z_i$ also satisfy the following equations:

$$\Vert z_1-z_3\Vert^2 = \cdots =  \Vert z_6-z_8\Vert^2=\Vert z_7-z_1\Vert^2 =\Vert z_8-z_2\Vert^2= \frac{8c^2}{3}.$$

It is known that the solution set of these equations, up to simultaneous translation and rotation of the $z_i$, is homeomorphic to a [union of the Klein bottle and a sphere](https://www.ncbi.nlm.nih.gov/pubmed/20572697), which intersect in two rings.

In this example, we demonstrate how to obtain points from the cyclooctane variety, which then can be further processed using, for instance, [persistent homology](https://en.wikipedia.org/wiki/Persistent_homology) and [Ripser](https://github.com/Ripser/ripser).

Let's define the equations in Julia for $c^2 = 5$. For this, we use the following normalization: since the equation of cyclooctane are invariant under simultaneous translation and rotation of the $z_i$, we define $z_1$ to be the origin, $z_8=(c,0,0)$ and $z_7$ to be rotated, such that its last entry is equal to zero. Thus we get a system of equations in $17$ variables.

```julia
using HomotopyContinuation

c² = 5
@polyvar z[1:3, 1:6]
z_vec = vec(z)[1:17] # the 17 variables in a vector
Z = [zeros(3) z[:,1:5] [z[1,6]; z[2,6]; 0] [√c²; 0; 0]] # the eight points in a matrix

# define the functions for cyclooctane:
F1 = [(Z[:, i] - Z[:, i+1]) ⋅ (Z[:, i] - Z[:, i+1]) - c² for i in 1:7]
F2 = [(Z[:, i] - Z[:, i+2]) ⋅ (Z[:, i] - Z[:, i+2]) - 8c²/3 for i in 1:6]
F3 = (Z[:, 7] - Z[:, 1]) ⋅ (Z[:, 7] - Z[:, 1]) - 8c²/3
F4 = (Z[:, 8] - Z[:, 2]) ⋅ (Z[:, 8] - Z[:, 2]) - 8c²/3
f = [F1; F2; F3; F4]
```

The plan is now to intersect `f=0` with a linear space of codimension $2$ many times to get points. The guide [Solving many systems in a loop](https://www.juliahomotopycontinuation.org/guides/many-systems/) explains how to do this. We follow this guide and first generate a complex start system.

```julia
n = 2 # dimension of the cyclooctane variety
N = 17 # ambient dimension
@polyvar Aᵥ[1:n, 1:N] bᵥ[1:n] # variables for the linear equations
p = [vec(Aᵥ); bᵥ] # parameters
F = [f; Aᵥ * z_vec - bᵥ] # the polynomial system we have to solve

# now we solve one particular instance for A,b complex. we use this as start system
A₀ = randn(ComplexF64, n, N)
b₀ = randn(ComplexF64, n)
p₀ = [vec(A₀); b₀]

F₀ = [subs(Fᵢ, params => [vec(A₀); b₀]) for Fᵢ in F]
complex_result = solve(F₀, affine_tracking = true)
S_p₀ = solutions(complex_result)
```

Now, we track the solutions from `S_p₀` towards systems we are interested in (here is a quick comment for algebraic geometers: the size of `S_p₀` is 1408; in other words, the cyclooctane variety has degree 1408).

```julia
tracker = pathtracker(F; parameters=p, generic_parameters=p₀)

# we compute 100 random intersections
data = [randn(n*N+n) for _ in 1:100]
Ω = map(data) do pp
    # We want to store all solutions. Create an empty array.
    S_p = similar(S_p₀, 0)
    for s in S_p₀
        result = track(tracker, s; target_parameters=pp, details=:minimal)
        # check that the tracking was successfull and that we have a real solution
        if issuccess(result) && isreal(result)
            # only store the solutions
            push!(S_p, solution(result))
        end
    end
    # return an array of type Array{Float64}
    # (and not Array{ComplexF64})
    real.(S_p)
end
Ω = vcat(Ω...)
```

Now, `Ω` contains points from the cyclooctane variety.
Here is a gif that shows 876 points from the cyclooctane variety, projected onto the three dimensional linear space spanned by the colums in the matrix below.

<p style="text-align:center;"><img src="/images/cyclooctane.gif" width="800px"/></p>

Here is the matrix.

$${\small \begin{bmatrix}
-0.870834 &   0.016606 &   0.105596  \\\0.0291089&  -0.960009  &  0.131155  \\\ -0.0862039 & -0.108634  & -0.960795  \\\ 0.290577   &-0.0451294 &  0.00544617\\\ 0.196227  & -0.0306267  &-0.0143163 \\\ 0.0234775 & -0.0212117 &  0.106754\\\ -0.0599742&    0.0175282 &  0.0752043\\\ 0.0401599  & -0.0441447 &  0.0387969\\\ -0.0674219  & -0.0201766 &  0.0255016\\\ 0.00794201 & -0.0169972 & -0.0560899\\\ 0.137655   &  0.0216517 & -0.014594 \\\ 0.0680622  &  0.0181186 &  0.0429857\\\ 0.112206  &  0.138351  &   0.133597  \\\ 0.0418083 & -0.0355782 &  -0.00320533\\\ 0.0657858 & -0.0761925  & -0.0730775 \\\  -0.227023  & -0.181425  &   0.0153024 \\\ -0.0792036  & 0.00207062 & -0.0209654
\end{bmatrix}}$$

It is also possible to control the distribution of the points obtained by intersecting with linear spaces; see [here](https://arxiv.org/abs/1810.06271).