+++
date = "2021-03-15T21:37:00+02:00"
title = "Polynomial systems arising from Nash equilibria"
tags = ["example"]
categories = ["general"]
draft = false
description = "A story about how game theory meets multilinear systems and product of simplices."
weight = 1
author = "Irem Portakal"
group = "applications"
+++

<span style="color:gray">Author:</span> <a href="https://math.ovgu.de/iportakal.html">Irem Portakal</a>


Consider three people $A$, $B$ and $C$ playing a non-cooperative game and they have all 3 (mixed) strategies each. Each person has a payoff matrix depending on which strategies have been performed. For example for the person $A$, the entry $A_{ijk} \in \mathbb{Q}$ is the value of the payoff for person $A$ when $A$ performs the strategy $i$, $B$ the strategy $j$ and $C$ the strategy $k$. The indices $i$, $j$, and $k$ run over $\{1,2,3\}$, thus these define three $3\times 3 \times 3$ matrices (or tensors). Now the question is

<p style="text-align:center;">
    <em>
    When can no player increase their payoff by changing their strategy while assuming the other players have fixed strategies?
    </em>
</p>

This brings us to the notion of *Nash equilibria*. By <a href="https://www.pnas.org/content/36/1/48">Nash's famous result</a> in 1950, we know that a Nash equilibrium exists for every finite game.


#### Nash equilibria and multilinear equations

Let us understand Nash equilibria for a 3-person game in terms of multilinear equations. First we denote $a_1$ for the probability that $A$ chooses their first strategy, $a_2$ for the second and $a_3$ for their third. We notate the probabilities for the other players the same way. That means we have

\begin{equation}
\begin{array}{l}
a_1 + a_2 + a_3 = b_1 + b_2 + b_3 = c_1 + c_2 + c_3 = 1 \\\\a_i, b_i, c_i \geq 0, \ \forall i \in \{1,2,3\}
\end{array}
\end{equation}


Moreover, each player has their payoff matrix $A_{ijk}, B_{ijk}, C_{ijk}$ and these numbers are known to every player.

Now including the probabilities into our setup, we express how much payoff each player will receive:

$$ \text{A's payoff} = \pi_1 = \sum_{i=1}^3  \sum_{j=1}^3  \sum_{k=1}^3 A_{ijk} \cdot a_{i} b_{j} c_{k} $$
$$ \text{B's payoff} = \pi_2 = \sum_{i=1}^3  \sum_{j=1}^3  \sum_{k=1}^3 B_{ijk} \cdot a_{i} b_{j} c_{k} $$
$$ \text{C's payoff} = \pi_3 = \sum_{i=1}^3  \sum_{j=1}^3  \sum_{k=1}^3 C_{ijk} \cdot a_{i} b_{j} c_{k} $$

A vector $(a_1,a_2,a_3,b_1,b_2,b_3,c_1,c_2,c_3)$ satisfying $(1)$ is called a *Nash equilibrium*, if no player can increase their expected payoff by changing their strategy while other two players keep their strategies fixed. This translates to a system of inequalities: For all triples $(u_1,u_2,u_3)$ with $u_1,u_2,u_3 \geq 0$ and $u_1+u_2+u_3=1$

\begin{equation}
\begin{darray}{l}
\pi_1 \geq \sum_{i=1}^3  \sum_{j=1}^3  \sum_{k=1}^3 A_{ijk} \cdot u_{i}  \cdot b_{j}  \cdot c_{k} \\\\[0.5em] \pi_2 \geq \sum_{i=1}^3  \sum_{j=1}^3  \sum_{k=1}^3 B_{ijk}  \cdot a_{i}  \cdot u_{j}  \cdot c_{k} \\\\[0.5em]  \pi_3 \geq \sum_{i=1}^3  \sum_{j=1}^3  \sum_{k=1}^3 C_{ijk}  \cdot a_{i}  \cdot b_{j}  \cdot u_{k}.
\end{darray}
\end{equation}

We observe that there are some relations that we can utilize to perceive this semi-algebraic set better. Since $a_1,a_2,a_3 \geq 0$ and $a_1 + a_2 + a_3 = 1$ we obtain the following three equalities from the first inequality of $(2)$:

$$a_1 (\pi_1 - \sum_{j=1}^3  \sum_{k=1}^3 A_{1jk} \cdot b_{j} \cdot c_{k}) = 0$$
$$a_2 (\pi_1 - \sum_{j=1}^3  \sum_{k=1}^3 A_{2jk} \cdot b_{j} \cdot c_{k}) = 0$$
$$a_3 (\pi_1 - \sum_{j=1}^3  \sum_{k=1}^3 A_{3jk} \cdot b_{j} \cdot c_{k}) = 0$$

and the other six equalities follow similarly:

$$b_1 (\pi_2 - \sum_{i=1}^3  \sum_{k=1}^3 B_{i1k} \cdot a_{i} \cdot c_{k}) = 0$$
$$b_2 (\pi_2 - \sum_{i=1}^3  \sum_{k=1}^3 B_{i1k} \cdot a_{i} \cdot c_{k}) = 0$$
$$b_3 (\pi_2 - \sum_{i=1}^3  \sum_{k=1}^3 B_{i1k} \cdot a_{i} \cdot c_{k}) = 0$$
$$c_1 (\pi_3 - \sum_{i=1}^3  \sum_{j=1}^3 C_{ij1} \cdot a_{i} \cdot b_{j}) = 0$$
$$c_2 (\pi_3 - \sum_{i=1}^3  \sum_{j=1}^3 C_{ij2} \cdot a_{i} \cdot b_{j}) = 0$$
$$c_3 (\pi_3 - \sum_{i=1}^3  \sum_{j=1}^3 C_{ij3} \cdot a_{i} \cdot b_{j}) = 0$$

where the expressions in the parenthesis are all non-negative. This is a system of 12 multilinear equations in 12 variables.

Let us investigate the *totally mixed Nash equilibria* of this game, i.e., all 9 probabilities are strictly positive. Then we can erase the left factors in the nine equations above. Moreover, we can eliminate the variables $\pi_1,\pi_2, \pi_3$ and we set $a_3 = 1 - a_1 - a_2$ etc. This gives rise to a system of 6 equations in 6 variables $\{a_1,a_2,b_1,b_2,c_1,c_2\}$:

$$ f_k = \sum_{j=1}^3  \sum_{k=1}^3 (A_{ijk} - A_{1jk}) \cdot b_{j} \cdot c_{k}, \ i = 2,3  $$
$$ g_k = \sum_{i=1}^3  \sum_{k=1}^3 (B_{ijk} - B_{i1k}) \cdot a_{i} \cdot c_{k}, \ j = 2,3  $$
$$ h_k = \sum_{i=1}^3  \sum_{j=1}^3 (C_{ijk} - C_{ij1}) \cdot a_{i} \cdot b_{j}, \ k = 2,3  $$

For a more detailed discussion also with a general setting, we refer to <a href="https://math.berkeley.edu/~bernd/cbms.pdf">Solving systems of polynomial equations</a> by Bernd Sturmfels.

#### Systems of polynomials and mixed volume

There is a boundary for the number of solutions of this system of multilinear equations:

By <a href="https://en.wikipedia.org/wiki/Bernstein%E2%80%93Kushnirenko_theorem">Bernstein, Khovanskii and Kushnirenko (BKK) theorem</a> from 1975, we know that the number of isolated solutions in $(\mathbb{C}^*)^n$ for a system of $n$ polynomials in $n$ variables is bounded by the mixed volume of the associated <a href="https://en.wikipedia.org/wiki/Newton_polytope">Newton polytope</a> of those polynomials. In our case, we have a mutinomial system where the associated Newton polytopes are products of simplices. More precisely we investigate the mixed volume of the tuple $(\Delta^{(1)}, \Delta^{(1)}, \Delta^{(2)}, \Delta^{(2)}, \Delta^{(3)}, \Delta^{(3)})$ where

$$ \text{New}(f_k) = \Delta^{(1)} := \{0\} \times \Delta_{2} \times \Delta_{2} $$
$$ \text{New}(g_k) = \Delta^{(2)} := \Delta_{2} \times \{0\} \times \Delta_{2} $$
$$ \text{New}(h_k) = \Delta^{(3)} := \Delta_{2} \times \Delta_{2} \times \{0\}. $$

Although in general it is challenging to calculate mixed volumes, there is a combinatorial way for the tuples of product of simplices introduced by <a href="https://www.sciencedirect.com/science/article/abs/pii/S0022053196922140"> McKelvey & McLennan (1997)</a>. Let us label our players $A$, $B$, and $C$ as first, second and third player. The mixed volume of the tuple is the number of certain partitions of the set of six unknowns $\{a_2,a_3,b_2,b_3,c_2,c_3\}$ (the first indices removed) into 3 disjoint subsets (number of people playing) $B_1, B_2, B_3$ such that

* the cardinality of each subset is $2$ (the number of strategies of the $i$th person minus $1$)
and
* the $i$th block $B_i$ is disjoint from the set of variables of the $i$th person.

This results gives us that there are 10 such partitions. This is also the maximal number of the totally mixed Nash equilibria of a non-cooperative 3-person game.



#### Using HomotopyContinuation

How do we calculate this in Julia using `HomotopyContinuation.jl`? We do not need to eliminate our system to 6 equations as before, since the calculation is already very fast. However, the observation was crucial in order to observe the relation to product of simplices and mixed volume.

Let us choose $81$ rational number for payoff matrices of three players and declare the variables and the system of 12 multilinear equations.
```julia
using HomotopyContinuation

# small helper to transform a 3x9 matrix into a 3x3x3 tensor
unflatten(M) = reshape(M, 3, 3, 3)

# Setup payoff matrices
A = [
  34 162 170 140 174 -183 104 68 18
  136 200 72 166 140 -854 126 72 20
  80 32 106 132 196 122 174 86 94
] |> unflatten

B = [
  56 6 22 1712 -1506 74 150 10 150
  8 80 196 182 116 22 44 186 60
  12 48 22 64 160 46 80 192 82
] |> unflatten

C = [
  104 162 655 116 130 559 134 138 4
  72 192 162 122 188 62 168 62 108
  134 24 70 118 98 30 132 180 52
] |> unflatten

# Define the system
@var a[1:3] b[1:3] c[1:3] π[1:3]

f = System([
  sum(a) - 1
  sum(b) - 1
  sum(c) - 1
  [a[i] * (π[1] - sum(A[i,j,k] * b[j] * c[k] for j in 1:3, k in 1:3)) for i in 1:3]
  [b[j] * (π[2] - sum(a[i] * B[i,j,k] * c[k] for i in 1:3, k in 1:3)) for j in 1:3]
  [c[k] * (π[3] - sum(a[i] * b[j] * C[i,j,k] for i in 1:3, j in 1:3)) for k in 1:3]
])
```

Since we are interested in solutions in $(\mathbb{C}^*)^{12}$, we specify the `only_non_zero` option.
```julia
res = solve(f, only_non_zero = true)
```
This results in 10 solutions, which makes sense, since we have chosen the coefficients "generic enough" and the mixed volume we calculated is 10.

```julia
Result with 10 solutions
========================
• 10 paths tracked
• 10 non-singular solutions (2 real)
• random_seed: 0xf49c340b
• start_system: :polyhedral
```

Since the variables we deal with are probabilities, let us check the real positive solutions.

```julia
real_solutions(res)
2-element Array{Array{Float64,1},1}:
[0.4986377135389655, 0.20497746403393063, 0.29638482242710384, 24.110739028828174, -24.959899763377788, 1.849160734549614, -0.48668613393152915, -0.007206923748673497, 1.4938930576802028, 2685.5086474566797, 137.95452288150625, 91.36517280277019]
 [0.14285714285714288, 0.28571428571428575, 0.5714285714285714, 0.375, 0.37499999999999994, 0.25000000000000006, 0.5555555555555556, 0.1111111111111111, 0.33333333333333326, 95.44444444444444, 73.11111111111111, 121.35714285714286]

valid_real_solutions = filter(s -> all(s[1:9] .> 0), real_solutions(res))
1-element Array{Array{Float64,1},1}:
[0.14285714285714288, 0.28571428571428575, 0.5714285714285714, 0.375, 0.37499999999999994, 0.25000000000000006, 0.5555555555555556, 0.1111111111111111, 0.33333333333333326, 95.44444444444444, 73.11111111111111, 121.35714285714286]
```

This is actually a rational solution. We use a chained fraction approximation to find the rational approximation and evaluate it to see if this is the correct one. It turns out that this specific 3-person game has exactly one totally mixed Nash equilibrium. 
```julia
rationalize.(valid_real_solutions[1], tol = 1e-8)
12-element Array{Rational{Int64},1}:
    1//7
    2//7
    4//7
    3//8
    3//8
    1//4
    5//9
    1//9
    1//3
  859//9
  658//9
 1699//14

f(rat)
12-element Array{Int32,1}:
 0
 0
 0
 0
 0
 0
 0
 0
 0
 0
 0
 0
```

{{<bibtex >}}
