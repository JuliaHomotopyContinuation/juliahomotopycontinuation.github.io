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
First of all, HomotopyContinuation.jl is absolutely free for personal or commercial use. It is licensed under [MIT](https://opensource.org/licenses/MIT). If you use it in your work we would be grateful, if you could cite our short abstract available at https://arxiv.org/abs/1711.10911.

## Are there other homotopy continuation solvers available?

Yes! HomotopyContinuation.jl is only the newest of a couple of implementations established through academic research. Others that must be mentioned are [Bertini](https://bertini.nd.edu), [PHCPack](http://homepages.math.uic.edu/~jan/PHCpack/phcpack.html) and [HOM4PS](http://www.hom4ps3.org/store/c1/Featured_Products.html). A [Julia wrapper for Bertini](https://github.com/PBrdng/Bertini.jl) and a [Julia wrapper for PHCPack](https://github.com/saschatimme/PHCPack.jl) are available. We wish to stress that by using those programs we learned a lot about homotopy continuation and [numerical algebraic geometry](https://en.wikipedia.org/wiki/Numerical_algebraic_geometry) in general. Without those programs the development of HomotopyContinuation.jl wouldn't have been possible.
