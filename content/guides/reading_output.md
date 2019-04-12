+++
title = "Reading the output of your computation"
description = "I solved a system of equations. What does the output tell me?"
weight = -800
draft = false
toc = true
bref = "I solved a system of equations. What does the output tell me?"
group = "get-started"
+++

<h3 class="section-head"><a>The Result of a computation</a></h3>

The line of commands

```julia
using HomotopyContinuation
@polyvar x y;
f = [x^2+2y, y^2-2])
result = solve(f)
```

gives the output.

```julia
Result with 4 solutions
==================================
• 4 non-singular finite solutions (2 real)
• 0 singular finite solutions (0 real)
• 4 paths tracked
• random seed: 902575
```

Let us look at this output in more detail: 4 non-singular solutions have been found, and 2 of them are real solutions. 

The line "4 paths tracked" means that the algorithm tracked 4 paths with homotopy continuation. In the guide on [How does it work?](how_does_it_work) we explain in detail the meaning of this. If you are only interested in the solutions, however, you can skip this part.

<h3 class="section-head"><a>The entries of Result: PathResult</a></h3>

`result` is an array of the datastructure `PathResult`. For instance, the first entry of `result` is

```julia-repl
julia> result[1]
PathResult
=================
 • return_code: success
 • solution: Complex{Float64}[5.11415e-16+1.68179im, 1.41421-4.09132e-16im]
 • accuracy: 3.434e-11
 • residual: 2.894e-15
 • condition_jacobian: 4.655e+00
 • path_number: 1
```

The meaning of those entries is as follows:

* `return_code: success` means that the computation was successful.
* `solution` is the solution that was computed.
* `accuracy` is an approximation of $\\Vert x-x^* \\Vert$ where $x$ is the computed solution and $x^* $ is the true solution.
* `residual` is the value of the euclidean norm of $f(x)$, where $x$ is the computed solution.
* `condition_jacobian` is the condition number of the Jacobian of $f$ at the solution. A small value of this indicates that the numerical values are trustworthy.
* `path_number` a path number greater than one indicates a singularity.  
