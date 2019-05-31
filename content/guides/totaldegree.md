+++
title = "Total Degree Homotopy"
description = "The totaldegree start system"
weight = -11
draft = false
toc = false
bref = "The totaldegree start system"
group = "advanced"
+++

The simplest start system for


$$
F(x_1,\ldots,x_n)=\begin{bmatrix} f_1(x_1,\ldots,x_n) \\\ \vdots\\\ f_n(x_1,\ldots,x_n) \end{bmatrix}
$$

is the following system of polynomials:

$$
G(x_1,\ldots,x_n) = \begin{bmatrix} x_1^{d_1} - a_1 \\\ \\vdots \\\  x_n^{d_n} - a_n\end{bmatrix},
$$

where the $a_i$ are random numbers and $d_i$ is the degree of $f_i$. There are $d_1\\cdots d_n$ many solutions to this system, which are easy to write down. A [theorem by Bézout](https://en.wikipedia.org/wiki/Bézout%27s_theorem) says that a system whose $i$-th entry is a polynomial of degree $d_i$ has at most $d_1\cdots d_n$ solutions (if not infinitely many). Hence, tracking all $d_1 \\cdots d_n$ solutions of $G$ to $F$ we are can find all solutions of $f$. Such a homotopy is called a *total degree homotopy*.

Here is how it works:

```julia-repl
julia> using HomotopyContinuation
julia> @polyvar x y;
julia> f = [x^2 + 2y, y^2 - 2]
julia> solve(f; start_system = :total_degree)
Result with 4 solutions
==================================
• 4 non-singular solutions (2 real)
• 0 singular solutions (0 real)
• 4 paths tracked
• random seed: 161239
```
