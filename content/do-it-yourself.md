+++
title = "Do It Yourself"
description = "Compute conics."
type = "special"
layout = "do-it-yourself"
date = "2019-01-21T21:56:55+01:00"
author = "Bernd Sturmfels, Paul Breiding and Sascha Timme"
+++


A [*conic*](https://en.wikipedia.org/wiki/Conic) in the plane $\mathbb{R}^2$ is the zero set of a
quadratic polynomial in two variables:

<p class="general-conic">
    $$\,\, a_1 x^2 \,+\, a_2 xy \,+\, a_3 y^2 \, +\, a_4 x \, + \, a_5 y \, + \, a_6 \,.$$
</p>

Geometrically, a conic can be either a circle, an ellipse, a hyperbola, a parabola or a union of two lines.
The last case is called a degenerate conic.


A classic problem in [enumerative geometry](https://en.wikipedia.org/wiki/Enumerative_geometry)
is [Steiner's conic problem](https://en.wikipedia.org/wiki/Steiner%27s_conic_problem) which asks:
<p style="width: 100%; text-align: center;">
*How many conics are tangent to five given conics?*
</p>

Here is an example of Steiner's problem:
<figure>
<img src="/images/given_conics_example.png" style="width:50%;display: block;margin-left: auto;margin-right: auto;">
  <figcaption>The five given conics are represented in blue. The red ellipse is tangential to all five blue conics. The tangential points are shown in black.</figcaption>
</figure>

Steiner himself claimed in 1848 that there are at most 7776.
He phrased his problem as that of solving five equations
of degree six on the five-dimensional space $\mathbb{P}^5$.
Using Bézout's Theorem he argued that the equations coming from this question
have $6^5 = 7776$ solutions over the [complex numbers](https://en.wikipedia.org/wiki/Complex_numbers).
However, this number over counts because
there is a *Veronese surface* of extraneous solutions, namely 
the conics that are squares of linear forms, i.e., degenerate conics.
The correct count of non-degenerate conics is **3264**.

[Recently](https://www.juliahomotopycontinuation.org/3264/) we found an arrangement of five conics such that all 3264 tangential conics are real.
Here is your chance to play:

<div id="do-it-yourself-container"></div>