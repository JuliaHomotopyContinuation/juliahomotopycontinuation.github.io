+++
title = "3264 conics tangent to five conics"
description = "And all of them can be real."
+++

<script type="text/javascript" src="/js/paper-full.min.js"></script>
<script type="text/javascript" src="/js/conics.js"></script>
<script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
<script type="text/javascript" src="/js/all_real_conics_data.js"></script>

A [*conic*](https://en.wikipedia.org/wiki/Conic) in the plane $\mathbb{R}^2$ is the zero set of a
quadratic polynomial in two variables:

$$ \,\, a_1 x^2 \,+\, a_2 xy \,+\, a_3 y^2 \, +\, a_4 x \, + \, a_5 y \, + \, a_6 \,.$$

Geometrically, a conic can be either a circle, an ellipse, a hyperbola, a parabola or a union of two lines.
The last case is called a degenerate conic.


A classic problem in [enumerative geometry](https://en.wikipedia.org/wiki/Enumerative_geometry)
is [Steiner's conic problem](https://en.wikipedia.org/wiki/Steiner%27s_conic_problem) which asks:
<p style="width: 100%; text-align: center;">
How many conics are tangent to five given conics?
</p>

Steiner himself claimed in 1848 that there are at most 7776.
He phrased his problem as that of solving five equations
of degree six on the five-dimensional space $\mathbb{P}^5$.
Using Bézout's Theorem he argued that the equations coming from this question
have $6^5 = 7776$ solutions over the [complex numbers](https://en.wikipedia.org/wiki/Complex_numbers).
However, this number overcounts because
there is a *Veronese surface* of extraneous solutions, namely 
the conics that are squares of linear forms, i.e., degenerate conics.


The correct count of non-degenerate conics is **3264**.
This was shown in 1859 by [Jonquières](https://en.wikipedia.org/wiki/Ernest_de_Jonquières) and
independently in 1864 by [Chasles](https://en.wikipedia.org/wiki/Michel_Chasles).
This was further developed by Schubert, whose 1879 book led to Hilbert's 15th problem, and thus to the 20th century development of intersection theory.
The number 3264 appears prominently in the book
[*3264 and all that*](https://scholar.harvard.edu/files/joeharris/files/000-final-3264.pdf)
by [Eisenbud](https://en.wikipedia.org/wiki/David_Eisenbud) and
[Harris](https://en.wikipedia.org/wiki/Joe_Harris_(mathematician)).
It is worth mentioning that it was not until the work of [Fulton](https://en.wikipedia.org/wiki/Michel_Chasles) and [MacPherson](https://en.wikipedia.org/wiki/Robert_MacPherson) in 1978 who gave intersection theory a rigorous foundation.

A delightful introduction to Steiner's problem was given by
Bashelor, Ksir and Traves in \cite{BKT}.
Ronga, Tognoli and Vust \cite{RTV} and Sottile \cite{Sot} showed how to
choose five real conics such that all
3264 complex solutions are real.

But their proof is not fully constructive. They do not state five conic rather they only show the *existence* of such an instance.
The following animation shows five conics depicted in blue. The red conics are randomly chosen among the 3264 real conics which are tangent to the five blue conics.


<div id="all_real_conics_container"></div>


The five blue conics are given by the following quadrics:

$$
\small{
\begin{array}{rcrcrcrcrcl}
\frac{10124547}{662488724}x^2 &+&\frac{8554609}{755781377}xy&+& \frac{5860508}{2798943247}y^2 &-&\frac{251402893}{1016797750}x &-& \frac{ 25443962}{277938473} y &+& 1\\\\[1em]
\frac{520811}{178801844}x^2 &+&\frac{2183697}{542440933}xy &+&\frac{9030222}{652429049}y^2 &-& \frac{ 12680955}{370629407} x &-& \frac{24872323}{105706890} y&+& 1 \\\\[1em]
\frac{6537193}{241535591}x^2 &-& \frac{7424602}{363844915}xy&+& \frac{6264373}{1630169777} y^2&+& \frac{13097677}{39806827} x &-& \frac{29825861}{240478169} y&+& 1 \\\\[1em]
\frac{13173269}{2284890206}x^2 &+& \frac{4510030}{483147459}xy&+& \frac{2224435}{588965799} y^2&+&  \frac{33318719}{219393000} x &+& \frac{92891037}{755709662} y&+& 1 \\\\[1em]
\frac{8275097}{452566634}x^2 &-& \frac{19174153}{408565940}xy&+& \frac{5184916}{172253855} y^2&-& \frac{23713234}{87670601}x &+& \frac{28246737}{81404569} y &+& 1
\end{array}
}
$$

Those equations were obtained by following the construction described by Frank Sottile
[on his website](http://www.math.tamu.edu/~sottile/research/stories/3264/index.html),
on which he recalls a [paper](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.36.1425&rep=rep1&type=pdf)  by Ronga, Tognoli, and Vust.

<script type="text/javascript" src="/js/all_real_conics.js"></script>