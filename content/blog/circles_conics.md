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

Consider the problem of computing all circles that are tangent to 3 [conics](https://en.wikipedia.org/wiki/Conic_section) $C_1,C_2,C_3 \subset \mathbb{R}^2$. For instance, the following picture shows 14 circles that are tangent to
 $$C_1 = \\{y=-x^2+2x+5\\}, C_2 = \\{y = 2x^2+5x-8\\}, C_3 = \\{y = 8x^2-3x-2\\}.$$

![img](/images/circles.png)


[Emiris and Tzoumas](http://www.win.tue.nl/EWCG2005/Proceedings/38.pdf) write that there are 184 complex circles that are tangent to 3 general conics. This means, that there are 184 complex solutions $(a_1,a_2,r)$ such that there exists some $(x,y)\in\mathbb{C}^2$ with

* $(x-a_1)^2 + (y-a_2)^2 = r$,

* $(x,y)\in C_i, 1\leq i\leq 3$, and

* $(\overline{x}-\overline{a_1}, \overline{y}-\overline{a_2})$ spans the normal space of $C_i$ at $(x,y)$ for $1\leq i\leq 3$.

How many real solutions can this system have? Only real solutions give circles in the real plane.

Here is code to generate the above system for random coefficients of the conics.

```julia
using HomotopyContinuation, DynamicPolynomials, LinearAlgebra
@polyvar a[1:2] r #variables for the circle center and radius
@polyvar x y #variables of the circle
@polyvar B[1:3,1:3] #coefficients of the conics
@polyvar v[1:2, 1:3] #variables of the 3 points at which the circle is tangent

circle = ([x;y]-a) ⋅ ([x;y]-a) - r
conic  = [x; y; 1] ⋅ (B * [x;y;1]);
T = det([differentiate(circle, [x;y]) differentiate(conic, [x;y])])

#Plug in the variables of the 3 points
#and random coefficients for B
F = [[f([x;y] => v[:,i], a=>a, r=>r, vec(B) => randn(9)) for f in [circle;conic;T]] for i in 1:3]

S = solve(vcat(F...))
```

I get the following answer.
```julia-repl
AffineResult with 512 tracked paths
==================================
• 184 non-singular finite solutions (14 real)
• 0 singular finite solutions (0 real)
• 328 solutions at infinity
• 0 failed paths
• random seed: 743957
```

I make a random experiment by sampling 500 instances of the above system and counting the real solutions.

```julia
number_of_real_solutions = Vector{Int}()
rands = [randn(9) for _ in 1:500]
for M in rands
  F = [[f([x;y] => v[:,i], a=>a, r=>r, vec(B) => M) for f in [circle;conic;T]] for i in 1:3]

  S = solve(vcat(F...))
  push!(number_of_real_solutions, nreal(S))
end
```

Here is a histogram of the results.

```julia
using Plots #The Plots package must be installed for this
histogram(number_of_real_solutions, bins = 46)
```

![img](/images/hist.png)
