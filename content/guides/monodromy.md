+++
title = "Monodromy"
description = "How to solve polynomial system by using the monodromy method."
weight = 2
draft = false
toc = true
bref = "We're solving a system by monodromy"
group = "feature-guide"
+++




<h3 class="section-head" id="monodromy"><a href="#monodromy">The monodromy method</a></h3>


An alternative to using the [solve function](/guides/examples.md) is solving a polynomial system $F=(f_1,\ldots,f_n)$ by monodromy. This approach is more efficient, but requires the user to provide at least one solution of $F=0$. Here is the basic idea:


Suppose $x$ is a solution $F(x)=0$ and that $F=F_{u_0}$ is a point in a family of polynomial systems $\mathcal{F}=\\{F_u : u\in \mathbb{C}^k\\}$ which is defined with $k\geq 1$ parameters. The monodromy method consists in moving around $u$ in a loop starting and ending at $u_0$ while tracking $x$ along that loop. After one iteration usually one has found a new solution $y\in \mathbb{C}^n$. This process then is repeated until some stopping criterion is fulfilled.


The general syntax for this is `monodromy_solve(F, x₀, u₀)` where we call $(x_0, u_0)$ a *start pair*.

Here is a simple example. Take

$$F_u(x,y) = \begin{bmatrix} x^4 + y - 2u_1\\\ x^4 + x^2 - 2u_2y^2 \end{bmatrix}.$$

For $u=1$ we have the solution $(x,y) = (1,1)$. For finding all solutions of $F_2$ we use

```julia
using HomotopyContinuation
@var x y u[1:2]
F = System([x^4 + y - 2u[1], x^4 + x^2 - 2*u[2]*y^2]; parameters = u)
monodromy_solve(F, [1, 1], [1, 1])
```
```
MonodromyResult
===============
• return_code → :heuristic_stop
• 8 solutions
• 88 tracked loops
• random_seed → 0x170fb647
```

Instead of providing explicitly a start pair, you can also let the program perform a random search for a start pair using the [`find_start_pair`](https://www.juliahomotopycontinuation.org/HomotopyContinuation.jl/stable/monodromy/#HomotopyContinuation.find_start_pair) routine.
This is automatically done, if you don't provide a start pair:

```julia
res = monodromy_solve(F, [1, 1], [1, 1])
```
```
MonodromyResult
===============
• return_code → :heuristic_stop
• 8 solutions
• 56 tracked loops
• random_seed → 0x437da29f
```

You can then obtain the generated parameters $u_0$
```julia
parameters(res)
```
```
2-element Array{Complex{Float64},1}:
 0.0038611666763959164 + 0.13680689997048212im
  -0.14196466931492574 + 0.6958312604959469im
```

<h3 class="section-head" id="monodromy"><a href="#monodromy">Group Actions</a></h3>

If the set of solutions of `F` is invariant under some group actions you can exploit this in your computation.

```julia
monodromy_solve(F, x, u₀, group_actions = G)
```

computes only with equivalence classes modulo `G`.


```julia
monodromy_solve(F, x, u₀, group_action = G, equivalence_classes = false)
```

computes only with all solutions but exploits `G` to find solutions more quickly.

In the above example, the group that interchanges `x` and `y` acts on the solution set of `F`. We can use the group that multiplies `x` by $\\pm 1$.

```julia
monodromy_solve(F, [1, 1], [1, 1], group_action = a -> [[-a[1], a[2]]])
```
```
MonodromyResult
===============
• return_code → :heuristic_stop
• 4 classes of solutions (modulo group action)
• 40 tracked loops
• random_seed → 0x156b9866
```

Now, we found only 4 solutions: one from each orbit. If we suppress computing with equivalence classes, then

```julia
monodromy_solve(F, [1, 1], [1, 1], group_action = a -> [[-a[1], a[2]]], equivalence_classes = false)
```
```
MonodromyResult
===============
• return_code → :heuristic_stop
• 8 solutions
• 80 tracked loops
• random_seed → 0x0ef98350
```
