+++
title = "How to solve a system of polynomial equations"
description = "For this guide, we're going to walk through an illustrative example"
weight = -2000
draft = false
toc = false
bref = "For this guide, we're going to walk through an illustrative example"
group = "get-started"
+++

### Requirements
If you have not yet installed HomotopyContinuation.jl, please consider the [installation guide](/guides/installation/).

### Solve your first system of equations
Consider the following simple system of two polynomials in two variables.


$$
f=\begin{bmatrix}x^2+2y \\\\ y^2-2 \end{bmatrix}
$$


Solving the equation $f=0$ can be accomplished as follows


```julia
using HomotopyContinuation # load the package into the current Julia session
@var x y; # declare the variables x and y
f = System([x^2 + 2y, y^2 - 2]) # construct system f
result = solve(f) # solve f
```

After the computation has finished, you should see the following output.

```julia
Result with 4 solutions
=======================
• 4 paths tracked
• 4 non-singular solutions (2 real)
• random seed: 0x09c7d125
• start_system: :polyhedral
```

We see that $f$ has two real zeros. They are

```julia-repl
julia> realsolutions(result)
2-element Array{Array{Float64,1},1}:
 [1.68179, -1.41421]
 [-1.68179, -1.41421]
```

It is possible to interrupt the computations using `ctrl+c`. All solutions that have been computed before the interruption will be returned.

### What else should I know?

The [next guide](/guides/introduction) explains in greater detail how to use HomotopyContinuation.jl. You should also check the rest of our detailed [Guides](/guides/) for learning more about the full power of homotopy continuation. Furthermore, our [Reference documentation](https://www.juliahomotopycontinuation.org/HomotopyContinuation.jl/stable/solve/) lists all options of `solve(f)`.
