+++
date = "2018-07-05T21:56:55+01:00"
title = "The number of circles that are tangent to 3 given conics"
tags = ["example"]
categories = ["general"]
draft = false
description = "Using HomotopyContinuation.jl for a problem in enumerative geometry"
weight = 20
author = "Paul"
+++

Consider the problem of computing all circles that are tangent to 3 given [conics](https://en.wikipedia.org/wiki/Conic_section) $C_1,C_2,C_3 \subset \mathbb{R}^2$. For instance, the following picture shows 14 circles that are tangent to
 $$C_1 = \\{y=-x^2+2x+5\\}, C_2 = \\{y = 2x^2+5x-8\\}, C_3 = \\{y = 8x^2-3x-2\\}.$$

![img](/images/circles.png)


[Emiris and Tzoumas](http://www.win.tue.nl/EWCG2005/Proceedings/38.pdf) write that there are 184 complex circles that are tangent to 3 general conics. This means, that there are 184 complex solutions $(a_1,a_2,r)$ such that there exists some $(x,y)\in\mathbb{C}^2$ with

* $(x-a_1)^2 + (y-a_2)^2 = r$,

* $(x,y)\in C_i, 1\leq i\leq 3$, and

* $(\overline{x}-\overline{a_1}, \overline{y}-\overline{a_2})$ spans the normal space of $C_i$ at $(x,y)$ for $1\leq i\leq 3$.

I wish to explore the solution space. In particular, I wish to know how many real solutions are possible, because only real solutions give circles in the real plane.

Here is code to generate the above system for random coefficients of the conics.

```julia
using HomotopyContinuation, DynamicPolynomials
@polyvar x y a[1:2] r v[1:2, 1:3]

C = [ [x; y; 1] ⋅ (randn(3,3) * [x;y;1]) for _ in 1:3]
tangential_conditions = [det([[x;y]-a differentiate(C[i], [x;y])])  for i in 1:3]

F = map(i->
  [
  (v[1,i]-a[1])^2 + (v[2,i]-a[2])^2 - r;
  C[i]([x;y] => v[:,i]);
  tangential_conditions[i]([x;y] => v[:,i], a=>a)
  ], 1:3)

S = solve(vcat(F...))
```

I get the following answer.
```julia-repl
AffineResult with 512 tracked paths
==================================
• 184 non-singular finite solutions (0 real)
• 0 singular finite solutions (0 real)
• 328 solutions at infinity
• 0 failed paths
• random seed: 32280
```

I make a random experiment by sampling 500 instances of the above system and counting the real solutions.

```julia
number_of_real_solutions = Vector{Int}()
rands = [randn(3,3) for _ in 1:500]

for M in rands
  C = [ [x; y; 1] ⋅ (M * [x;y;1]) for _ in 1:3]
  tangential_conditions = [det([[x;y]-a differentiate(C[i], [x;y])])  for i in 1:3]

  F = map(i->
    [
    (v[1,i]-a[1])^2 + (v[2,i]-a[2])^2 - r;
    C[i]([x;y] => v[:,i]);
    tangential_conditions[i]([x;y] => v[:,i], a=>a)
    ], 1:3)

  S = solve(vcat(F...))
  push!(number_of_real_solutions, nreal(S))
end
```

Here is a histogram of the results.

```julia
using Plots #The Plots package must be installed for this
histogram(number_of_real_solutions, bins = 92)
```

![img](/images/hist.png)
