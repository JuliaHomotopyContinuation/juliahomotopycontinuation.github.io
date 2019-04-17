+++
title = "How to solve a system of polynomial equations"
description = "For this guide, we're going to walk through an illustrative example"
weight = -900
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
@polyvar x y; # declare the variables x and y
f = [x^2 + 2y, y^2 - 2]
result = solve(f) # solve f
```

After the computation has finished, you should see the following output.

```julia
Result with 4 solutions
==================================
• 4 non-singular solutions (2 real)
• 0 singular solutions (0 real)
• 4 paths tracked
• random seed: 902575
```

We see that $f$ has two real zeros. They are

```julia-repl
julia> realsolutions(result)
2-element Array{Array{Float64,1},1}:
 [1.68179, -1.41421]
 [-1.68179, -1.41421]
```

### Understanding the output of your computation

A detailed explanation of the output of `solve(f)` is described [in the next guide](/guides/reading-output/).

### Solving many systems of equations

`solve(f)` works nicely for single systems. If you have to solve many systems in a loop, you should read [this guide](/guides/many-systems/).

### What else should I know?

HomotopyContinuation.jl provides many more features. Check our detailed [Guides](/guides/) for learning more about the full power of homotopy continuation.

You should also consult our [API Docs](https://www.juliahomotopycontinuation.org/HomotopyContinuation.jl/stable/solving/#The-*solve*-function-1), where all options of `solve(f)` are listed.
