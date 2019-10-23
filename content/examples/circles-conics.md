+++
date = "2018-07-05T21:56:55+01:00"
title = "The number of circles that are tangent to 3 given conics"
tags = ["example"]
categories = ["general"]
draft = false
description = "Using HomotopyContinuation.jl for a problem in enumerative geometry"
weight = 20
author = "Paul Breiding"
group = "algebraic-geometry"
+++

Consider the problem of computing all circles that are tangent to 3 [conics](https://en.wikipedia.org/wiki/Conic_section) $C_1,C_2,C_3 \subset \mathbb{R}^2$. For instance, the following picture shows 14 circles that are tangent to

 $$C_1 = \\{y=-x^2+2x+5\\},$$

 $$C_2 = \\{y = 2x^2+5x-8\\},$$

 $$C_3 = \\{y = 8x^2-3x-2\\}.$$

<p style="text-align:center;"><img src="/images/circles.png" width="700px"/></p>


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

circle = ([x; y] - a) ⋅ ([x; y] - a) - r
conic  = [x; y; 1] ⋅ (B * [x; y; 1]);
tangential_condition = det([differentiate(circle, [x; y]) differentiate(conic, [x; y])])

conditions = [circle; conic; tangential_condition]

#define coefficients of the three conics
C1 = randn(3,3)
C2 = randn(3,3)
C3 = randn(3,3)

#Plug in the variables of the 3 points
#and coefficients of the 3 conics
F = [
    f([x; y; a; r; vec(B)] => [v[:,i]; a; r; vec(C)])
    for f in conditions
    for (i,C) in enumerate([C1, C2, C3])
    ]

solve(F)
```

I get the following answer.
```julia-repl
Result with 184 solutions
==================================
• 184 non-singular solutions (22 real)
• 0 singular solutions (0 real)
• 512 paths tracked
• random seed: 390710
```

And here is the code for $C_1$, $C_2$ and $C_3$ above.

```julia-repl
julia> C1 = [-1 0 1; 0 0 -0.5; 1 -0.5 5]
julia> C2 = [2 0 2.5; 0 0 -0.5; 2.5 -0.5 -8]
julia> C3 = [8 0 -1.5; 0 0 -0.5; -1.5 -0.5 -2]
julia> F = [
    f([x; y; a; r; vec(B)] => [v[:,i]; a; r; vec(C)])
    for f in conditions
    for (i,C) in enumerate([C1, C2, C3])
    ]
julia> solve(F)
Result with 60 solutions
==================================
• 60 non-singular solutions (14 real)
• 0 singular solutions (0 real)
• 512 paths tracked
• random seed: 483355
```

{{<bibtex >}} 
