+++
date = "2018-07-03T21:56:55+01:00"
title = "Macaulay2 interface for HomotopyContinuation.jl"
tags = ["news"]
categories = ["general"]
draft = false
description = "An interface to call HomotopyContinuation.jl from Macaulay2 is in development "
weight = 15
author = "Paul"
+++

[Tim Duff](http://people.math.gatech.edu/~tduff3/) pushed a very first version of a [Macaulay2](http://www2.macaulay2.com/Macaulay2/) interface to his [Github repo](https://github.com/timduff35/M2). It is available in the "Julia" branch. The current version lets you export polynomials into .jl files or call HomotopyContinuation.jl directly from Macaulay2.

For instance, the following M2 code generates the file `mypolynomial.jl` (we assume that the functions from the Julia branch have been loaded into the current session).
```
R = QQ[x, y]
f = {x^2 + y^2, x-y}
writeSys(PolySystem f, "mypolynomial.jl")
```
The Julia command
```julia
include("mypolynomial.jl")
```
initializes a variable `f` that is a vector whose entries are the polynomials $x^2+y^2$ and $x-y$.
