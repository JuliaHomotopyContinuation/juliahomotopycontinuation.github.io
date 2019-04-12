+++
date = "2019-03-26T21:56:55+01:00"
title = "The 6R-serial link robot"
tags = ["example"]
categories = ["general"]
draft = false
description = "Using HomotopyContinuation.jl for a problem in kinematics"
weight = 1
author = "Sascha"
+++

The following example is from Section 7.3 in [A. Sommese, C. Wampler: The Numerical Solution of Systems of Polynomial Arising in Engineering and Science](https://www.worldscientific.com/worldscibooks/10.1142/5763)


Consider a robot that consists of 7 links connected by 6 joints. The first link is fixed on the ground and the last link has a "hand". The problem of determining the position of the hand when knowing the arrangement of the joints is called  *forward problem*. The problem of determining any arrangement of joints that realized a fixed position of the hand is called *backward problem*. Let us denote by $z_1,\ldots,z_6$ the unit vectors that point in the direction of the joint axes.  They satisfy the following polynomial equations


  * $z_i \cdot z_i = 1,\; i=1,\ldots,6.$
  * $z_1 \cdot z_2 = \cos \alpha_1,\ldots, z_5 \cdot z_6 = \cos \alpha_5$.
  * $a_1\, (z_1 \times z_2) + \cdots + a_5\, (z_5 \times z_6) + a_6 \,z_2 + \cdots + a_9  \,z_5= p.$


for $\alpha=(\alpha_1\ldots, \alpha_5)$ and $a=(a_1,\ldots,a_9)$ and $p=(p_1,p_2,p_3)$ (see the above reference for a detailed explanation on how these numbers are to be interpreted). Here $\times$ is the cross product in $\mathbb{R}^3$.


In this notation the forward problem consists of computing $(\alpha,a)$ given the $z_i$ and $p$ and the backward problem consists of computing  $z_2,\ldots,z_5$ that realize some fixed $(\alpha,a,p,z_1,z_6)$ (knowing $z_1,z_6$ means that the position where the robot is attached to the ground  and the position where its hand should be are fixed).


Assume that $z_1 = z_6 = (1,0,0)$ and $p=(1,1,0)$ and some random $a$ and $\alpha$. We compute all backward solutions. We start with setting up the system.


```julia
using HomotopyContinuation, LinearAlgebra, DynamicPolynomials
# initialize the variables
@polyvar z[1:6,1:3]
p = [1, 1, 0]
α = randn(5)
a = randn(9)
# define the system of polynomials
f = [z[i,:] ⋅ z[i,:] for i=2:5]
g = [z[i,:] ⋅ z[i+1,:] for i=1:5]
h = sum(a[i] .* (z[i,:] × z[i+1,:]) for i=1:3) +
    sum(a[i+4] .* z[i,:] for i=2:5)
F′ = [f .- 1; g .- cos.(α); h .- p]
# assign values to z₁ and z₆
F = [subs(f, z[1,:] => [1, 0, 0], z[6,:] => [1,0,0]) for f in F′]
# Now we can just pass `F` to `solve` in order to compute all solutions
solve(F)
```

```
AffineResult with 1024 tracked paths
==================================
• 16 non-singular finite solutions (0 real)
• 0 singular finite solutions (0 real)
• 1008 solutions at infinity
• 0 failed paths
• random seed: 345137
```


We find 16 solutions, which is the correct number of solutions for these type of systems.
