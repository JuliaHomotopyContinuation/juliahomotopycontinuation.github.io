+++
title = "Solving many systems in a loop"
description = "What to do, if you have to solve system in a loop"
weight = 4
draft = true
toc = false
bref =  "What to do, if you have to solve system in a loop"
group = "advanced"
+++

Polynomial systems arising in application very often have a coefficients which are determined by some parameters.

We now want to show you how you can setup an efficient way to solve this polynomial system for many 


```julia
using HomotopyContinuation, DynamicPolynomials
@polyvar x y z p[1:3]

F = [
    x + 3 + 2y + 2y^2 - p[1],
    (x - 2 + 5y)*z + 4 - p[2] * z,
    (x + 2 + 4y)*z + 5 - p[3] * z    
]

```


Since we need to solve the same system many times it makes sense to first compute a 
solution set for generic parameters and to use then a parameter homotopy.

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

We see that our polynomial system $F$ only has at most **2** singular solutions.

The idea is to use these two generic solutions to find the solutions for the specific parameters we are interested in.
For this we are using a [parameter homotopy](/guides/parameter-homotopies/) from the generic parameters $p_0$ to the specific parameters.

In order to avoid to setup the necessary data structures over and over again we construct a [`PathTracker`](https://www.juliahomotopycontinuation.org/HomotopyContinuation.jl/stable/path_tracker/#HomotopyContinuation.PathTracker) once
and reuse it to track all paths.
```julia
# Let's store the generic solutions
S_p₀ = solutions(result_p₀)
# Construct the PathTracker
tracker = pathtracker(F; parameters=p, generic_parameters=p₀)
```

Since we do not have any real world data for our toy example, let's generate some random data.

```julia
# generate some random data to simulate the parameters
data = [randn(3) for _ in 1:10_000]
```

Now we have everything to solve the equations for all parameters.
```julia
# Map over each parameter of our data
# and compute the corresponding solutions
data_solutions = map(data) do p
    # We want to store all solutions. Create an empty array.
    S_p = similar(S_p₀, 0)
    for s in S_p₀
        result = track(tracker, s; target_parameters=p)
        # check that the tracking was successfull
        if issuccess(result)
            push!(S_p, solution(result))
        end
    end
end
```

