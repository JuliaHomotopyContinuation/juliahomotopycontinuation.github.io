+++
draft= false
title = "FAQ"
description = "Asked and answered"
+++

## Why do I need homotopy continuation when I have Newton's method?

[Newton's methods](https://en.wikipedia.org/wiki/Newton%27s_method) (a.k.a. Newton-Raphson method) is a simple and quick to solve a polynomial system.
However, in general Newton's method only converges when a good initial point is used, and even then this only yields
a *single* solution. But if you are interested in *all* possible solutions you are usually out of luck.

## How should I cite HomotopyContinuation.jl when I use it?
First of all, HomotopyContinuation.jl is absolutely free for personal or commercial use. It is licensed under the [MIT](https://opensource.org/licenses/MIT) license. If you use it in your work we would be grateful, if you could cite our [extended abstract](https://link.springer.com/chapter/10.1007/978-3-319-96418-8_54).
A preprint of it is freely available at [arXiv:1711.10911](https://arxiv.org/abs/1711.10911).

## Are there other homotopy continuation solvers available?

Yes! HomotopyContinuation.jl is only the newest of a couple of implementations established through academic research. Others that must be mentioned are [Bertini](https://bertini.nd.edu), [PHCpack](http://homepages.math.uic.edu/~jan/PHCpack/phcpack.html) and [HOM4PS](http://www.hom4ps3.org/store/c1/Featured_Products.html). We wish to stress that by using those programs we learned a lot about homotopy continuation and [numerical algebraic geometry](https://en.wikipedia.org/wiki/Numerical_algebraic_geometry) in general. Without those programs the development of HomotopyContinuation.jl wouldn't have been possible.
There are very simple and unofficial Julia wrappers [for Bertini](https://github.com/PBrdng/Bertini.jl) and [for PHCpack](https://github.com/saschatimme/PHCpack.jl) available.
