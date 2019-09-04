+++
date = "2019-03-26T21:56:55+01:00"
title = "Minimizing a function over the sphere"
tags = ["example"]
categories = ["general"]
draft = false
description = "Using HomotopyContinuation.jl for a problem in optimization"
weight = 1
author = "Sascha Timme"
+++


We want to solve following optimization problem


$$
\text{minimize} \; 3x^3y+y^2z^2-2xy-4xz^3 \quad \text{s.t.} \quad x^2+y^2+z^2=1
$$


The strategy to find the *global* optimum is to use the [method of Lagrange multipliers](https://en.wikipedia.org/wiki/Lagrange_multiplier) to find *all* critical points of the objective function such that the equality constraint is satisfied. We start with defining our Lagrangian.


```julia
using HomotopyContinuation, DynamicPolynomials
@polyvar x y z
J = 3x^3*y+y^2*z^2-2x*y-x*4z^3
g = x^2+y^2+z^2-1
# Introduce auxillary variable for Lagrangian
@polyvar λ
# define Lagrangian
L = J - λ * g
```

```
3x³y - 4xz³ + y²z² - x²λ - y²λ - z²λ - 2xy + λ
```


In order to compute all critical points we have to solve the square system of equations


$$
\nabla_{(x,y.z,\lambda)}L = 0
$$


For this we first compute the gradient of $L$ and then use the `solve` routine to find all critical points.


```julia
# compute the gradient
∇L = differentiate(L, [x, y, z, λ])
# Now we solve the polynomial system
result = solve(∇L)
```

```
Result with 26 solutions
==================================
• 26 non-singular solutions (22 real)
• 0 singular solutions (0 real)
• 54 paths tracked
• random seed: 556761
```


We see that from the theoretical 54 possible (complex) critical points there are only 26. Also we check the number of *real* critical points by


```julia
nreal(result)
```

```
22
```


and see that there are 22.


In order to find the global minimum we now have to evaluate all *real* solutions and find the value where the minimum is attained.


```julia
reals = real_solutions(result);
# Now we simply evaluate the objective J and find the minimum
minval, minindex = findmin(map(s -> J(s[1:3]), reals))
```

```
(-1.32842129069426, 21)
```


```julia
minarg = reals[minindex][1:3]
```

```
3-element Array{Float64,1}:
 -0.4968755205596932
 -0.09460829635048905
 -0.8626494000056988
```


We found that the minimum of $J$ over the unit sphere is attained at $(0.496876, 0.0946083, 0.862649)$ with objective value $-1.32842$.


{{<bibtex >}} 
