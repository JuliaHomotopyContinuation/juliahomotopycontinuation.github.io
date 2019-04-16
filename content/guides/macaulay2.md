+++
date = "2019-04-15T18:56:55+01:00"
title = "Using HomotopyContinuation.jl from Macaulay2"
draft = false
description = "How do I solve my ideal from Macaulay2 with HomotopyContinuation.jl?"
weight = 15
group = "get-started"
+++

[Macaulay2](http://www2.macaulay2.com/Macaulay2/) is a great software for symbolic computations and it even has the [NumericalAlgebraicGeometry](https://faculty.math.illinois.edu/Macaulay2/doc/Macaulay2-1.12/share/doc/Macaulay2/NumericalAlgebraicGeometry/html/) package to solve systems
of polynomial equations by homotopy continuation.

<!-- [Tim Duff](http://people.math.gatech.edu/~tduff3/) pushed a very first version of a [Macaulay2](http://www2.macaulay2.com/Macaulay2/) interface to his [Github repo](https://github.com/timduff35/M2). It is available in the "Julia" branch. The current version lets you export polynomials into .jl files or call HomotopyContinuation.jl directly from Macaulay2.

For instance, the following M2 code generates the file `mypolynomial.jl` (I assume that the functions from the Julia branch have been loaded into the current session).
```
R = QQ[x, y]
f = {x^2 + y^2, x-y}
writeSys(PolySystem f, "mypolynomial.jl")
```
The Julia command
```julia
include("mypolynomial.jl")
```
initializes a variable `f` that is a vector whose entries are the polynomials $x^2+y^2$ and $x-y$. -->
