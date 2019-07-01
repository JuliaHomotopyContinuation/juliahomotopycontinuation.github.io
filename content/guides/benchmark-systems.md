+++
title = "Benchmarks"
description = "Polynomial systems for testing"
weight = -1
draft = false
toc = false
bref = "Polynomial systems for testing"
group = "advanced"
+++

The auxiliary package [PolynomialTestSystems](https://github.com/JuliaHomotopyContinuation/PolynomialTestSystems.jl) is a collection of systems of polynomials for benchmarking, testing etc.

Here is an example (the system created is called cyclic-7):
```julia
using PolynomialTestSystems
f = equations(cyclic(7))  
```

A complete list is available [here](https://www.juliahomotopycontinuation.org/PolynomialTestSystems.jl/stable/#Systems-1).

Some of the polynomial systems are obtained from the database of polynomial systems created by Jan Verschelde and available under http://homepages.math.uic.edu/~jan/.
