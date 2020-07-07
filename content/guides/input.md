+++
title = "Problem formulation"
description = "Learn how to formulate your problem"
weight = -4000
draft = false
toc = true
bref = "Learn how to formulate your problem"
group = "get-started"
+++

In this guide we want to take a deep dive into the modeling language (`ModelKit`) provided
by HomotopyContinuation.jl and also provide some tips along the way on how to best
formulate your specific problem.
This guide is complementary to the [package function documentation](https://www.juliahomotopycontinuation.org/HomotopyContinuation.jl/stable/model_kit/)
where all available functions are described.

## Variables

We start with the basic building block of every problem: variables.
You can construct a variable using the `Variable` constructor.
Let's start by creating variables ``x`` and ``y``.

```julia-repl
julia> using HomotopyContinuation
julia> x, y = Variable(:x), Variable(:y)
(x, y)
```

Since this is somewhat repetitive we provide the macro `@var` to automatically do this for us

```julia-repl
julia> @var x y
(x, y)
```

Often it is convenient to work with a vector or matrix of variables (or even at tensor).
For this the `@var` macro interprets Julia's indexing syntax as a hint to create an array of variables

```julia-repl
## Create variables a₁,a₂,a₃ and b₁₋₁, b₁₋₂, b₂₋₁ and b₂₋₂
julia> @var a[1:3] b[1:2, 1:2];
## a is vector
julia> a
3-element Array{Variable,1}:
 a₁
 a₂
 a₃

## b is a matrix
julia> b
2×2 Array{Variable,2}:
 b₁₋₁  b₁₋₂
 b₂₋₁  b₂₋₂

## We can index them as expected
julia> b[2,2]
b₂₋₂
```

Variables are identified by their name, so two variables are identical if they have the same name

```julia-repl
julia> x == y
false

julia> x == Variable(:x)
true
```

The default variable ordering is lexicographic, independently from when variables got created.

```julia-repl
julia> @var y x
(y, x)

julia> x < y
true
```

## Expressions

After constructing variables we can construct some expressions using the basic
arithmetic functions `*`, `-`, `+`, `/`.

```julia-repl
julia> f = (x + 2y)^3
(x + 2y)^3
```

As you notice the expression exactly stays as we formulated it.
In case you really want to see the expanded expression you can use `expand`

```julia-repl
julia> expand(f)
12*x*y^2 + 6*x^2*y + x^3 + 8*y^3
```

You can do also basic manipulations. Let's compute the gradient of  `f`

```julia-repl
julia> differentiate(f, [x, y])
2-element Array{Expression,1}:
 3*(x + 2*y)^2
 6*(x + 2*y)^2

```

## Systems

A [`System`](https://www.juliahomotopycontinuation.org/HomotopyContinuation.jl/stable/model_kit/#HomotopyContinuation.ModelKit.System)
is the basic input to the [`solve`](https://www.juliahomotopycontinuation.org/HomotopyContinuation.jl/stable/solve/#HomotopyContinuation.solve) and [`monodromy_solve`](https://www.juliahomotopycontinuation.org/HomotopyContinuation.jl/stable/monodromy/#HomotopyContinuation.monodromy_solve)
functions of HomotopyContinuation.jl, as well as to many other functions.
The role of a `System` is to specify the variable ordering and to (possibly) declare some of the variables as parameters.

Let's consider [an example from our introduction guide](https://www.juliahomotopycontinuation.org/guides/introduction/#solving-the-critical-equations).
```julia
# define f
@var x y
f = (x^4 + y^4 - 1) * (x^2 + y^2 - 2) + x^5 * y
# define new variables u₁, u₂ and λ
@var u[1:2] λ
# Compute the gradient of f
∇f = differentiate(f, [x,y])
C = System([[x,y] - u - ∇f .* λ; f]; variables = [x,y,λ], parameters = u)
```
```
System of length 3
 3 variables: x, y, λ
 2 parameters: u₁, u₂

 -u₁ + x - λ*(5*x^4*y + 4*(-2 + x^2 + y^2)*x^3 + 2*(-1 + x^4 + y^4)*x)
 -u₂ + y - λ*(4*(-2 + x^2 + y^2)*y^3 + 2*(-1 + x^4 + y^4)*y + x^5)
 x^5*y + (-2 + x^2 + y^2)*(-1 + x^4 + y^4)
```
Here you can see that `C` is a system consisting of 3 polynomials in 3 variables with 2 parameters `u`.
