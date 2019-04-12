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


Consider the situation in which one has to solve a specific instance of a *parametrized family of polynomial systems*


$$

$$





The basic `solve` of HomotopyContinuation.jl constructs a straight-line homotopy between the start system $g$ and the target system $f$; i.e. $H(x,t)  = tg + (1-t)f$. When $P$ is not convex, $H(x,t)$ might leave the family $P$. Using *parameter homotopies* avoids this.

The syntax in HomotopyContinuation.jl is as follows.

```julia
solve(F, startsolutions, parameters, startparameters=s, targetparameters=t)
```

where `s` and `t` are vectors of parameter values for ``F``.
`parameters` is a vector of variables that specify the parameters of `F`.
Necessarily, `length(parameters)`,  `length(p₁)`and `length(p₀)` must all be equal.

Here is an example: let

$$F(x,y,a,b) = \\begin{bmatrix} x^2-a \\\ xy-a+b \\end{bmatrix}.$$

For tracking the solution $(x,y) = (1,1)$ from $(a,b) = (1,0)$ to $(a,b) = (2,5)$ we do the following.

```julia-repl
julia> @polyvar x y a b
julia> F = [x^2 - a, x * y - a + b]
julia> startsolution = [[1, 1]]
julia> solve(F, startsolution, parameters=[a, b], startparameters=[1, 0], targetparameters=[2, 5])
Result with 1 solutions
==================================
• 1 non-singular finite solution (1 real)
• 0 singular finite solutions (0 real)
• 1 paths tracked
• random seed: 772337
```


<h3 class="section-head" id="ellipses"><a href="#ellipses">Example: When are two ellipses tangent?</a></h3>

Here is an example how to use parameter homotopies.

Let two ellipses be centered at points $p_1,p_2$:
$$
E_i( r ) = \\{x\in \mathbb{R}^2 \mid (x-p_i)^T Q_i^TQ_i(x-p_i) = r^2\\},\; i=1,2,
$$
where $Q_1, Q_2$ are symmetric matrices.


We wish to find the smallest radius $r$ for which $E_1( r )\cap E_2( r )$ is not empty. Let $r^\star$ be the solution for this optimization problem. In Julia we translate this into a polynomial system:


```julia
using HomotopyContinuation, LinearAlgebra
# generate the variables
@polyvar Q₁[1:2, 1:2] Q₂[1:2, 1:2] p₁[1:2] p₂[1:2]
@polyvar x[1:2] r
z₁ = x - p₁
z₂ = x - p₂
# initialize the equations for E₁ and E₂
f₁ = (Q₁ * z₁) ⋅ (Q₁ * z₁) - r^2
f₂ = (Q₂ * z₂) ⋅ (Q₂ * z₂) - r^2
# initialize the equation for E₁ and E₂ being tangent
@polyvar λ
g = (Q₁' * Q₁) * z₁ - λ .* (Q₂' * Q₂) * z₂
# gather everything in one system
F = [f₁; f₂; g];
```


An initial solution is given by two circles, each of radius 1,  centered at $(1,0)$ and $(-1,0)$, respectively. Let us track this solution to the system given by $p_1 = [7,5], p_2 = [1,2], Q_1 = \begin{pmatrix} 1 & 2 \\\ 2 & 4 \end{pmatrix}, Q_2 = \begin{pmatrix} 0 & 3 \\\ 3 & 1 \end{pmatrix}$.


That is, the *parameters* are $p_1, p_2, Q_1, Q_2$ and the *variables* are $x,r,λ$. Now we track the starting solution towards the target system


```julia-repl
julia> params = [vec(Q₁); vec(Q₂); p₁; p₂]
julia> q = [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, -1, 0]
julia> p = [vec([1 2; 2 5]); vec([0 3; 3 1]); [7, 5]; [1, 2]]
julia> solve(F, [[0, 0, 1, -1]], parameters=params, startparameters=q, targetparameters=p)
Result with 1 solutions
==================================
• 1 non-singular finite solution (1 real)
• 0 singular finite solutions (0 real)
• 1 paths tracked
• random seed: 296689
```


The computation reveals that $r^\star \approx 10.89$. Here is a picture.


![img](/images/ellipse.png)
