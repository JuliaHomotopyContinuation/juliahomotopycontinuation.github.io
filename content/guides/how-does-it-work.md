+++
title = "What is Homotopy Continuation?"
description = "We briefly explain the ideas behind HomotopyContinuation.jl"
weight = -750
draft = false
toc = false
bref = "We briefly explain the ideas behind HomotopyContinuation.jl"
group = "theory"
+++



The basic idea of [homotopy continuation](https://en.wikipedia.org/wiki/Numerical_algebraic_geometry#Homotopy_continuation) is as follows. Suppose that you have a system of polynomials with as many variables as polynomials


$$
F(x)=\begin{bmatrix} f_1(x_1,\ldots,x_n) \\\ \vdots\\\ f_n(x_1,\ldots,x_n) \end{bmatrix}.
$$

(for more polynomials than variables, see the guide on [overdetermined tracking](overdetermined-tracking)). We wish to find a zero of $F$ in $\\mathbb{C}^n$. Suppose

$$G(x)=\begin{bmatrix} g_1(x_1,\ldots,x_n) \\\ \vdots\\\ g_n(x_1,\ldots,x_n) \end{bmatrix}$$

is another system with a known zero: $G(\\zeta) = 0$. We connect $F$ and $G$ in the space of polynomial systems
by a path $t\mapsto H(x,t)$ with $H(x,0) = F(x)$ and $H(x,1)=G(x)$ (the space of polynomial systems form a vector space, in which the notion of path is well-defined).

The idea in homotopy continuation is to approximately follow the solution path $x(t)$ defined by $H(x(t),t)=0$. For this, the path is discretized into
time steps $t_0 = 0 < t_1 < \\cdots < t_k = 1$. If the discretization is fine enough then the [Newton's operator](https://en.wikipedia.org/wiki/Newton%27s_method) of $H(x,t_1)$ applied to $\zeta$ converges to a zero of $H(x,t_1)$. Then, if $t_2-t_1$ is small enough and if $\\Vert \\zeta_i-\\xi\\Vert$ is small enough for some $i\\geq 0$, the iterate $\\zeta_i$ converges to a zero of $H(x,t_2)$. We may repeat the procedure for $H(x,t_2)$ and starting with $\zeta_i$. Inductively, we find an approximate zero of $H(x,t_j)$ for all $j$. In the end, we will find an approximate zero for the system $F(x)=H(x,t_k)$.

Most implementations of homotopy continuation, including Bertini and HomotopyContinuation.jl, use heuristics for setting the step-sizes $t_{j+1}-t_j$ and number of Newton iterations.

For instance, the homotopy could be the *straight-line homotopy* $tG + (1-t)F$. The default choice of HomotopyContinuation.jl is a slightly modified straight-line homotopy. If your system has parameters, you can also make a [parameter homotopy](parameter-homotopies). You can even make up your own [custom homotopy](custom-homotopy). For square systems is that we can *automatically generate* a start system $G$; either the [totaldegree](totaldegree) or the [polyhedral](polyhedral) start system (by default, HomotopyContinuation.jl uses totaldegree startsystems).

(For researchers interested in mathematical proofs: although the outcome of the homotopy continuation algorithms are numerical approximation of the true zeros of $F$, there is a way of rigorously certifying if a true zero is closeby or not. We refer to the [paper by Hauenstein and Sottile](https://arxiv.org/abs/1011.1091) and their algorithm [alpha-Certified](https://github.com/JuliaHomotopyContinuation/AlphaCertified.jl).)
