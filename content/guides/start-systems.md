+++
title = "Choosing a start system"
description = "What start system should I choose?"
weight = -700
draft = false
toc = true
bref = "What start system should I choose?"
group = "get-started"
+++

Choosing a start system for homotopy continuation is an art for itself. We give some basic rules for start systems. They can roughly be subdivided into three classes:

<h3 class="section-head" id="result"><a>I know nothing about the structure of my polynomial system</a></h3>

In this case, there are two options: choosing a [totaldegree](/guides/totaldegree) start system, or a [polyhedral](/guides/polyhedral) start system.

The first one is suitable for system, which are dense. The second one is suitable for systems, which are sparse. Here is how it works:

```julia
using HomotopyContinuation
@polyvar x y;
f = [x^2 + 2y, y^2 - 2]
solve(f; start_system = :total_degree) # using totaldegree
solve(f; start_system = :polyhedral) # using polyhedral
```

<h3 class="section-head" id="result"><a>My polynomial system has parameters</a></h3>

In this case, one should first compute an intermediate solution with random *complex* coefficients. Why complex? The reason is that tracking over the complex numbers one can easily avoid the locus where homotopy continuation fails (and this is not possible tracking only over the real numbers!).

Here is an example with parameters `p`:

```julia
using HomotopyContinuation, DynamicPolynomials
@polyvar x y z p[1:3]
F = [
    x + 3 + 2y + 2y^2 - p[1]^2,
    (x - 2 + 5y)*z + 4 - p[2] * z,
    (x + 2 + 4y)*z + 5 - p[3] * z    
]
```

Suppose we want to solve the system for `p₁ = [1,1,2]`. Then, we first solve it for random complex coefficients:

```julia
# Generate generic parameters by sampling complex numbers from the normal distribution
p₀ = randn(ComplexF64, 3)
# Substitute p₀ for p
F_p₀ = subs(F, p => p₀)
# Compute all solutions for F_p₀
result_p₀ = solve(F_p₀)
```

Now, we track `p₀` to `p₁` using a [parameter homotopy](/guides/parameter-homotopies).

```julia
p₁ = [1, 1, 2]
result_p₁ = solve(F, solutions(result_p₀); parameters=p, start_parameters=p₀, target_parameters=p₁)
```
This approach is particularly useful when one has to solve this system for many different sets of parameters, as we explain in [this guide](/guides/many-systems).


<h3 class="section-head" id="result"><a>I have one solution of my polynomial system already</a></h3>

In this case, one should use the [monodromy method](/guides/monodromy).
