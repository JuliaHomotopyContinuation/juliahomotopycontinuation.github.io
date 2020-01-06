+++
title = "Solving many systems in a loop"
description = "What to do, if you have to solve system in a loop"
weight = 5
draft = false
toc = false
bref =  "What to do, if you have to solve system in a loop"
group = "feature-guide"
+++

Polynomial systems arising in application very often have a coefficients which are determined by some parameters.

We now want to show you how you can setup an efficient way to solve this polynomial system for many parameter values.
Assume we have the following polynomial system:
```julia
using HomotopyContinuation, DynamicPolynomials
@polyvar x y z p[1:3]

F = [
    x + 3 + 2y + 2y^2 - p[1],
    (x - 2 + 5y)*z + 4 - p[2] * z,
    (x + 2 + 4y)*z + 5 - p[3] * z    
]
```


First, we compute the
solutions for generic parameters and then use  a [parameter homotopy](/guides/parameter-homotopies/).

```julia
# Generate generic parameters by sampling complex numbers from the normal distribution
p₀ = randn(ComplexF64, 3)
# Substitute p₀ for p
F_p₀ = subs(F, p => p₀)
# Compute all solutions for F_p₀
result_p₀ = solve(F_p₀)
```

```
Result with 2 solutions
==================================
• 2 non-singular solutions (0 real)
• 0 singular solutions (0 real)
• 8 paths tracked
• random seed: 652079
```

We see that our polynomial system $F$ has at most **2** isolated solutions (instead of the 8 possible ones).
The idea is to use these two generic solutions to find the solutions for the specific parameters we are interested in.
For this we are using a [parameter homotopy](/guides/parameter-homotopies/) from the generic parameters $p_0$ to the specific parameters.

This can be done as follows:
```julia
# generate some random data to simulate the parameters
data = [randn(3) for _ in 1:10_000]

# track p₀ towards the entries of data
data_points = solve(
    F,
    solutions(result_p₀);
    parameters = p,
    start_parameters =  p₀,
    target_parameters = data
)
```

It is also possible to immediately postprocess the output. For instance, suppose that we are only interested in the real solutions. Then:

This can be done as follows:
```julia
data_points = solve(
    F,
    solutions(result_p₀);
    parameters = p,
    start_parameters =  p₀,
    target_parameters = data,
    transform_result = (r,p) -> real_solutions(r),
    flatten = true
)
```
