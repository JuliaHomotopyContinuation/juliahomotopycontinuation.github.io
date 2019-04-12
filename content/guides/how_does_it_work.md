+++
title = "What is Homotopy Continuation?"
description = "We briefly explain the algorithmic paradigm behind HomotopyContinuation.jl"
weight = -750
draft = false
toc = false
bref = "We briefly explain the algorithmic paradigm behind HomotopyContinuation.jl"
+++



The basic idea of homotopy continuation algorithms is explained quickly. Suppose that you have a system of polynomials with as many variables as polynomials


$$
f(x)=(f_1(x_1,\ldots,x_n),\ldots,f_m(x_1,\ldots,x_n)).
$$

(for more polynomials than variables, see the guide on [overdetermined tracking](overdetermined-tracking)).


The goal is to find a solution $f(x)=0$. For this we need another system $$g(x)=(g_1(x_1,\ldots,x_n),\ldots,g_n(x_1,\ldots,x_n))$$
and a solution $x_0$ with $g(x_0)=0$. The basic algorithm consists in connecting the polynomials $f$ and $g$ by a path and tracking the solution $x_0$ from $g$ to $f$ using [Newton's method](https://en.wikipedia.org/wiki/Newton%27s_method) (the space of polynomial systems form a vector space, in which the notion of path is well-defined).


For instance, the homotopy could be the *straight-line homotopy* $tg + (1-t)f$. The default choice of HomotopyContinuation.jl is a slightly modified straight-line homotopy. If your system has parameters, you can also make a [parameter homotopy](parameter-homotopies). You can even make up your own [custom homotopy](custom-homotopy).


The advantage of square systems is that we can *automatically generate* a start system $g$. If you use the basic `solve` command the following starting system is constructed:


$$
g(x_1,\ldots,x_n) = \begin{pmatrix} x_1^{d_1} - a_1 \\\ \\vdots \\\  x_n^{d_n} - a_n\end{pmatrix},
$$


where the $a_i$ are random numbers and $d_i$ is the degree of $f_i$. There are $d_1\cdots d_n$ many solutions to this system, which are easy to write down. A [theorem by Bézout](https://en.wikipedia.org/wiki/Bézout%27s_theorem#Intersection_multiplicity) says that a system whose $i$-th entry is a polynomial of degree $d_i$ has at most $d_1\cdots d_n$ solutions (if not infinitely many). Hence, tracking all $d_1\cdots d_n$ solutions of $g$ to $f$ we are can find all of $f\text{s}$ solutions. Such a homotopy is called a *total degree homotopy*.
