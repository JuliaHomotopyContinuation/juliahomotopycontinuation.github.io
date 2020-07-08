+++
date = "2019-03-26T21:56:55+01:00"
title = "Method of moments"
tags = ["example"]
categories = ["general"]
draft = false
description = "For mixtures of three Gaussians"
weight = 1
author = "Paul Breiding"
group = "math-data"
+++


Consider three Gaussian random variables $X_1,X_2,X_3$ with means $\mu_1,\mu_2,\mu_3$ and variances $\sigma_1^2,\sigma_2^2,\sigma_3^2$. The density of $X_i$ is

$$\phi_i(x) = \frac{1}{\sqrt{2\pi}} e^{-\frac{(x-\mu_i)^2}{2\sigma_i^2}}.$$

A mixture of the three random variables is the random variable $U$ with density

$$\psi(x) = a_1 \phi_1(x) + a_2 \phi_2(x) + a_3 \phi_3(x), \quad\text{   for } \quad  a_1+a_2+a_3 =1.$$

The [method of moments](https://en.wikipedia.org/wiki/Method_of_moments_(statistics)) recovers $\psi$ from the moments

  $$m_k = \\int x^k \psi(x) \mathrm{d}x.$$

Since we have 8 unknowns, we expect to need at least 8 moments to recover $\psi$. Let us set up a system for this in Julia.

```julia
@var a[1:3] μ[1:3] σ²[1:3] m[0:8]

f0 = a[1]+a[2]+a[3];
f1 = a[1]*μ[1]+a[2]*μ[2]+a[3]*μ[3];
f2 = a[1]*(μ[1]^2+σ²[1])+a[2]*(μ[2]^2+σ²[2])+a[3]*(μ[3]^2+σ²[3]);
f3 = a[1]*(μ[1]^3+3*σ²[1]*μ[1])+a[2]*(μ[2]^3+3*σ²[2]*μ[2])+a[3]*(μ[3]^3+3*σ²[3]*μ[3]);
f4 = a[1]*(μ[1]^4+6*σ²[1]*μ[1]^2+3*σ²[1]^2)+a[2]*(μ[2]^4+6*σ²[2]*μ[2]^2+3*σ²[2]^2)+
      a[3]*(μ[3]^4+6*σ²[3]*μ[3]^2+3*σ²[3]^2);
f5 = a[1]*(μ[1]^5+10*σ²[1]*μ[1]^3+15*μ[1]*σ²[1]^2)+
      a[2]*(μ[2]^5+10*σ²[2]*μ[2]^3+15*μ[2]*σ²[2]^2)+
      a[3]*(μ[3]^5+10*σ²[3]*μ[3]^3+15*μ[3]*σ²[3]^2);
f6 = a[1]*(μ[1]^6+15*σ²[1]*μ[1]^4+45*μ[1]^2*σ²[1]^2+15*σ²[1]^3)+
      a[2]*(μ[2]^6+15*σ²[2]*μ[2]^4+45*μ[2]^2*σ²[2]^2+15*σ²[2]^3)+
      a[3]*(μ[3]^6+15*σ²[3]*μ[3]^4+45*μ[3]^2*σ²[3]^2+15*σ²[3]^3);
f7 = a[1]*(μ[1]^7+21*σ²[1]*μ[1]^5+105*μ[1]^3*σ²[1]^2+105*μ[1]*σ²[1]^3)+
      a[2]*(μ[2]^7+21*σ²[2]*μ[2]^5+105*μ[2]^3*σ²[2]^2+105*μ[2]*σ²[2]^3)+
      a[3]*(μ[3]^7+21*σ²[3]*μ[3]^5+105*μ[3]^3*σ²[3]^2+105*μ[3]*σ²[3]^3);
f8 = a[1]*(μ[1]^8+28*σ²[1]*μ[1]^6+210*μ[1]^4*σ²[1]^2+420*μ[1]^2*σ²[1]^3+105*σ²[1]^4)+
      a[2]*(μ[2]^8+28*σ²[2]*μ[2]^6+210*μ[2]^4*σ²[2]^2+420*μ[2]^2*σ²[2]^3+105*σ²[2]^4)+
      a[3]*(μ[3]^8+28*σ²[3]*μ[3]^6+210*μ[3]^4*σ²[3]^2+420*μ[3]^2*σ²[3]^3+105*σ²[3]^4)

f = System([f0, f1, f2, f3, f4, f5, f6, f7, f8] - m; variables=[a;μ;σ²], parameters = m)
```
```
System of length 9
 9 variables: a₁, a₂, a₃, μ₁, μ₂, μ₃, σ²₁, σ²₂, σ²₃
 9 parameters: m₀, m₁, m₂, m₃, m₄, m₅, m₆, m₇, m₈

 a₁ + a₂ + a₃ - m₀
 ...
```

Let us consider the following moments:

```julia
m₀ =  [1; -1; 3; -5.5; 22.45; -50.75; 243.325; -635.725; 3420.7375]     
```

We could solve for $f(x;m₀) = 0$ directly by using a polyhedral homotopy since the number of paths is

```julia-repl
julia> paths_to_track(f)
4271
```
Yet, [Amendola, Faugere and Sturmfels](https://arxiv.org/pdf/1510.04654.pdf) showed that the number of (complex) solutions of the polynomial system $f(x;m₀)=0$ is only 1350.

Instead of solving $f(x;m₀) = 0$ directly, we use monodromy for solving another instance $f(x;q₀)=0$. Then we move the 1350 computed solutions from  $f(x;q₀)=0$ to  $f(x;m₀)=0$. First, we generate a start solution:

```julia
a₀ = randn(ComplexF64, 3)
a₀ = a₀ / sum(a₀)
μ₀ = rand(ComplexF64, 3)
σ²₀ = rand(ComplexF64, 3)
start_sol = [a₀; μ₀; σ²₀]

q₀ = [m([a; μ; σ²] => start_sol) for m in f]
```

which we can use as input data for the monodromy method for `q₀` being the parameters. Here, it doesn't matter that complex solutions have no interpretation as parameters. They only serve to solve one specific instance of the polynomial system.

```julia
R =  monodromy_solve(f; target_solutions_count = 1350)
```
```
MonodromyResult
===============
• return_code → :success
• 1350 solutions
• 2700 tracked loops
• random_seed → 0x65fad406
```

Now, we can track the solutions from $q₀$ to $m₀$.

```julia
R2 = solve(f, solutions(R); start_parameters=parameters(R), target_parameters = m₀)
```
```
Result with 1350 solutions
==========================
• 1350 paths tracked
• 1350 non-singular solutions (36 real)
• random_seed: 0xafadb50f
```

There are
```julia
nreal(R2)
```
```
36
```

real solutions. Let us keep only those for which the variances are positive:

```julia
true_real_solutions  = filter(r -> all(r[7:9] .> 0), real_solutions(R2))
```

There are 12 of those. Those 12 come in groups of 6, because the group that permutes $\{1,2,3\}$ acts on the solutions. We can filter these as follows

```julia
S₃ = SymmetricGroup(3)
relabeling(v) = map(p -> (v[1:3][p]..., v[4:6][p]..., v[7:9][p]...), S₃)
mults = multiplicities(true_real_solutions, group_action = relabeling)
```
```
[3, 4, 8, 9, 11, 12]
[1, 2, 5, 6, 7, 10]
```
Let us thus look at the first and at the third real solution

```julia-repl
julia> true_real_solutions[1]
[-0.182136, -1.74012, 2.92226, -1.60721, 0.184633, -0.33243, 0.0927855, 1.11301, 1.76594]
julia> true_real_solutions[3]
[1.30343, -0.396056, 0.0926208, -0.346632, 0.755685, -2.68724, 1.98223, 0.553889, 0.392889]
```

Those are the parameters of the two mixtures Gaussian that give our moments `m₀`.

The group action can also be exploited in the monodromy computation:

```julia
R_with_group_action = monodromy_solve(f; group_action = relabeling)
```
```
MonodromyResult
===============
• return_code → :heuristic_stop
• 225 classes of solutions (modulo group action)
• 1575 tracked loops
• random_seed → 0x0184c477
```

The full 1350 solutions can then be returned as

```julia
reduce(vcat, relabeling.(solutions(R_with_group_action)))
```

Then, we can proceed with the parameter homotopy as above.


{{<bibtex >}}
