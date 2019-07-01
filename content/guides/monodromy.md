+++
title = "Monodromy"
description = "How to solve polynomial system by using the monodromy method."
weight = 40
draft = false
toc = true
bref = "We're solving a system by monodromy"
group = "feature-guide"
+++




<h3 class="section-head" id="monodromy"><a href="#monodromy">The monodromy method</a></h3>


An alternative to using the [solve function](/guides/examples.md) is solving a polynomial system $F=(f_1,\ldots,f_n)$ by monodromy. This approach is more efficient, but requires the user to provide at least one solution of $F=0$. Here is the basic idea:


Suppose $x$ is a solution $F(x)=0$ and that $F=F_{u_0}$ is a point in a family of polynomial systems $\mathcal{F}=\\{F_u : u\in \mathbb{C}^k\\}$ which is defined with $k\geq 1$ parameters. The monodromy method consists in moving around $u$ in a loop starting and ending at $u_0$ while tracking $x$ along that loop. After one iteration usually one has found a new solution $y\in \mathbb{C}^n$. This process then is repeated until some stopping criterion is fulfilled.


The general syntax for this is:


```julia
monodromy_solve(F, [x], u₀, parameters = u)
```

Here is a simple example: take

$$F_u(x,y) = \begin{bmatrix} x^4 + y - 2u_1\\\ x^4 + x^2 - 2u_2y^2 \end{bmatrix}.$$

For $u=1$ we have the solution $(x,y) = (1,1)$. For finding all solutions of $F_2$ we use

```julia-repl
julia> using HomotopyContinuation
julia> @polyvar x y u[1:2]
julia> F = [x^4 + y - 2u[1], x^4 + x^2 - 2*u[2]*y^2]
julia> monodromy_solve(F, [[1; 1]], [1, 1], parameters = u)
MonodromyResult
==================================
• 8 solutions (4 real)
• return code → heuristic_stop
• 644 tracked paths
```

<h3 class="section-head" id="monodromy"><a href="#monodromy">Group Actions</a></h3>

If the set of solutions of `F` is invariant under some group actions you can exploit this in your computation.

```julia
monodromy_solve(F, [x], u₀, parameters = u, group_actions = G)
```

computes only with equivalence classes modulo `G`.


```julia
monodromy_solve(F, [x], u₀, parameters = u, group_actions = G, equivalence_classes = false)
```

computes only with all solutions but exploits `G` to find solutions more quickly.

In the above example, the group that interchanges `x` and `y` acts on the solution set of `F`. We can use the group that multiplies `x` by $\\pm 1$.

```julia-repl
julia> G = GroupActions( a -> ([-a[1], a[2]], ))
julia> monodromy_solve(F, [[1; 1]], [1, 1], parameters = u, group_actions = G)
MonodromyResult
==================================
• 4 classes of solutions (modulo group action) (2 real)
• return code → heuristic_stop
• 322 tracked paths
```

Now, we found only 4 solutions: one from each orbit. If we suppress computing with equivalence classes, then

```julia-repl
julia> monodromy_solve(F, [[1; 1]], [1, 1], parameters = u, group_actions = G, equivalence_classes = false)
MonodromyResult
==================================
• 8 solutions (4 real)
• return code → heuristic_stop
• 644 tracked paths
```
