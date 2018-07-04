+++
date = "2018-07-03T21:56:55+01:00"
title = "The number of circles that are tangent to 3 given conics"
tags = ["example"]
categories = ["general"]
draft = false
description = "We use Macaulay2 to generate a polynomial system solved by HomotopyContinuation.jl"
weight = 20
author = "Paul"
+++

In the previous blog entry we mentioned the Macaulay2 interface for HomotopyContinuation.jl that is currently under development. In this blog post we want to show how useful this interface can be.

Consider the problem of computing all circles that are tangent to 3 given [conics](https://en.wikipedia.org/wiki/Conic_section) $C_1,C_2,C_3 \subset \mathbb{R}^2$. [Emiris and Tzoumas](http://www.win.tue.nl/EWCG2005/Proceedings/38.pdf) write that there are 184 complex circles that are tangent to 3 general conics. This means, that there are 184 complex solutions $(a_1,a_2,r)$ such that there exists some $(x,y)\in\mathbb{C}^2$ with

* $(x-a_1)^2 + (y-a_2)^2 = r$,

* $(x,y)\in C_i, 1\leq i\leq 3$, and

* $\overline{x}-\overline{a_1} + \overline{y}-\overline{a_2}$ spans the normal space of $C_i$ at $(x,y)$ for $1\leq i\leq 3$.

We wish to explore the solution space. In particular, we wish to know how many real solutions are possible, because only real solutions give circles in the real plane.

We use Macaulay2 to eliminate the existence quantifier in the above equations. The following M2 code creates a file [`circles_conics.jl`](https://gist.github.com/saschatimme/ef2caedf03da9ebfbe908eb0a44aac4b).

```julia
  R = QQ[x, y, a_1, a_2,  r,  b_1..b_6]

  f = (x-a_1)^2 + (y-a_2)^2 - r^2
  g = b_1*x^2 + b_2 *x*y + b_3*y^2 + b_4*x + b_5*y + b_6

  Jac = diff(matrix {{x, y}}, matrix {{f}, {g}})
  K = ideal(f, g, det Jac)
  J = eliminate({x,y}, K)

  writeSys(PolySystem {J_0}, "circles_conics.jl")
```

In a Julia session we include this polynomial by writing

```julia
using HomotopyContinuation
include("circles_conics.jl")
```

Now, the session contains a variable `f` which is an array of length 1. The only entry is a polynomial in the variables $a_1,a_2,r, b_1,b_2,b_3,b_4,b_5,b_6$. It vanishes if and only if the circle $(x-a_1)^2 + (y-a_2)^2 = r^2$ and the conic $b_1x^2 + b_2 xy + b_3y^2 + b_4x + b_5y + b_6 = 0$ are tangent. Let us generate 3 random assignments of the $b_i$.
```julia
circle_vars = [a_1, a_2, r]
conic_vars = [b_1, b_2, b_3, b_4, b_5, b_6]
F = [f[1](circle_vars => circle_vars, conic_vars => rand(6)) for _ in 1:3]
```
Computing the circles that are tangent to the three conics means computing the zeros of $F$. HomotopyContinuation.jl's `solve` command does this

```julia-repl
julia> S = solve(F)
-----------------------------------------------
Paths tracked: 512
# non-singular finite solutions:  364
# singular finite solutions:  2
# solutions at infinity:  146
# failed paths:  0
Random seed used: 24622
-----------------------------------------------
```

Each circle actually gives 2 solutions, one with $r$ and one with $-r$. One solution was labeled singular. The number of complex solutions is $(366+2)/2=184$.

We make a random experiment by sampling 200 instances of the above system and counting the real solutions.

```julia
number_of_real_solutions = zeros(200)
rands = [rand(6,3) for _ in 1:200]

for (i, X) in enumerate(rands)
    F = [f[1](circle_vars => circle_vars, conic_vars => X[:,j]) for j in 1:3]
    S = solve(F)
    all_solutions = results(S, onlynonsingular = false)
    number_of_real_solutions[i] = length(real(all_solutions))/2
end
```

Let us plot a histogram of what we got.

```julia
using Plots #The Plots package must be installed for this
histogram(number_of_real_solutions, label="b_i uniform in [0,1]", bins = 184)
```

![img](/images/hist1.pdf)

The `rand()` command samples uniformly in the interval $[0,1]$. Two alternative sampling methods are using `randn()` (standard normal numbers) and `rand(-20:20)` (integers uniformly between $-20$ and $20$). The respective histograms are shown next.

![img](/images/hist2.pdf)

![img](/images/hist3.pdf)

It seems that the typical configuration of three conics has only few circles tangent to them.
