+++
title = "Systems with parameters"
description = "How to track parametrized systems of equations"
weight = 1
draft = false
toc = true
bref = "How to track parametrized systems of equations"
group = "advanced"
+++




<h3 class="section-head" id="parameter*homotopies"><a href="#parameter*homotopies">Parameter Homotopies</a></h3>


Consider the situation in which one has to solve a specific instance of a parametrized family of polynomial systems


$$
P = \\{F(x,p) = (f_1(x,p), \ldots, f_n(x,p)) \mid p \in \mathbb{C}^m\\}.
$$


To not destroy the solution structure it is desirable to not leave $P$ during the homotopy.
This can be accomplished by using the homotopy
$$H(x,t) := F(x, (1-t)p + tq)$$
where $p$ and $q$ are parameters in $\mathbb{C}^m$.
Note that you have to provide the start solutions for this kind of homotopy.

The syntax in HomotopyContinuation.jl to construct such a homotopy is as follows.

```julia
solve(F, startsolutions; parameters=params, startparameters=q, targetparameters=p)
```

where `p` and `q` are vectors of parameter values for ``F``.
`params` is a vector of variables that specify the parameters of `F`.
Necessarily, `length(params)`,  `length(p)`and `length(q)` must all be equal.


<h3 class="section-head" id="simple-example"><a href="#simple-example">A simple example</a></h3>

$$F(x,y,a,b) = \\begin{bmatrix} x^2-a \\\ xy-a+b \\end{bmatrix}.$$

For tracking the solution $(x,y) = (1,1)$ from $(a,b) = (1,0)$ to $(a,b) = (2,5)$ we do the following.

```julia-repl
julia> @polyvar x y a b
julia> F = [x^2 - a, x * y - a + b]
julia> startsolution = [[1, 1]]
julia> solve(F, startsolution; parameters=[a, b], startparameters=[1, 0], targetparameters=[2, 5])
Result with 1 solutions
==================================
• 1 non-singular solution (1 real)
• 0 singular solutions (0 real)
• 1 paths tracked
• random seed: 772337
```
