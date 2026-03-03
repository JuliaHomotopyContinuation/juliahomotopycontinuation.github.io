+++
date = "2019-06-16T21:56:55+01:00"
title = "Bacillus Subtilis"
tags = ["example"]
categories = ["general"]
draft = false
description = "environmental and energy stress response of the bacterium Bacillus subtilis"
weight = 1
author = "Paul Breiding, Kemal Rose and Sascha Timme"
group = "applications"
+++


The environmental and energy stress response of the bacterium *Bacillus subtilis* are modelled in the article

Narula,Tiwari, and Igoshin: *Role of Autoregulation and Relative Synthesis of Operon Partners in Alternative Sigma Factor Networks.* PLoS Comput. Biology, 12(12), 2016.


The protein $\sigma_B$ is the focus of this paper.
It is responsible for activating a general stress-response of the bacterium.
$\sigma_B$ belongs to the family of $\sigma$ factors.
These are a type of so called transcription factors;
proteins which govern the expression of genes.


In the article, regulatory networks are studied that mediate the activity of $\sigma$ factors.
They consist of other proteins involved in feedback loops that influence the $\sigma$-factors.
Since there can be many possible reactants involved in many reactions, the resulting system of differential equations might be very complicated.

In the case of Bacillus subtilis the experimental data can be backed up by a satisfactory model of the regulatory network of $\sigma_B$: the activity of $\sigma_B$ is regulated by a partner-switching network consisting of an anti-$\sigma$ factor $\mathrm{RsbW}$ and an anti-anti-$\sigma$ factor $\mathrm{RsbV}$.
The factor $\mathrm{RsbW}$ is able to bind $\sigma_B$.
Under normal circumstances $\mathrm{RsbV}$ is in a phosphorylated form, in which it does not effectively interact with $\mathrm{RsbW}$.
Hence, $\sigma_B$ is prevented from initiating a stress response.
However, stress activates a phosphatase which dephosphorylates $\mathrm{RsbV}$, allowing it to bind $\mathrm{RsbW}$.
This releases $\sigma_B$ from its binding to $\mathrm{RsbW}$, allowing $\sigma_B$ to initiate the stress response.

This biochemical reactions dynamical system is modelled by a system of differential equations in the 10 variables $w$, $w_\mathrm{2}$, $w_\mathrm{2v}$, $v$, $w_\mathrm{2v2}$, $v_P$, $\sigma_B$, $w_\mathrm{2\sigma B}$, $v_\mathrm{Pp}$ and $\mathrm{phos}$.
These represent the total amounts of $\sigma$ B, $\mathrm{RsbW}$, $\sigma$ factor $\mathrm{RsbV}$, and of various protein complexes formed by these components.
The variable $\mathrm{phos}$ measures the concentration of the phosphatase which serves as a measure for the amount of stress the bacterium experiences. Let us define these variables in `Julia`.

```julia
using HomotopyContinuation
@var w w2 w2v v w2v2 vP σB w2σB vPp phos
```

There are also 23 parameters describing the speed of different reactions.

```julia
@var kBw kDw kD kB1 kB2 kB3 kB4 kB5 kD1 kD2 kD3 kD4 kD5 kK1 kK2 kP kDeg v0 F K λW λV pTot
```

The following parameter values are derived from experimental data.

```julia
p = [
3600; # kBw
18; # kDw
18; # kD
3600; # kB1
3600; # kB2
3600; # kB3
1800; # kB4
3600; # kB5
18; # kD1
18; # kD2
18; # kD3
1800; # kD4
18; # kD5
36; # kK1
36; # kK2
180; # kP
0.7; # kDeg
0.4; # v0
30; # F
0.2; # K
4; # λW
4.5; # λV
2 # pTot
]
```

With our implementation we can determine the steady states of the described dynamical system.
The vanishing of the differentials of each of the concentrations with respect to time is equivalent to the vanishing of the ten polynomials below.

```julia
SteadyStates = [
(-1 * kDeg * w + -2 * kBw * (w^2 / 2) + 2 * kDw * w2) * (K + σB) + λW * v0 * (1 + F * σB),
-1 * kDeg * w2 + kBw * (w^2 / 2) + -1 * kDw * w2 + -1 * kB1 * w2 * v + kD1 * w2v + kK1 * w2v + -1 * kB3 * w2 * σB + kD3 * w2σB,
-1 * kDeg * w2v + kB1 * w2 * v + -1 * kD1 * w2v + -1 * kB2 * w2v * v + kD2 * w2v2 + -1 * kK1 * w2v + kK2 * w2v2 + kB4 * w2σB * v + -1 * kD4 * w2v * σB,
(-1 * kDeg * v + -1 * kB1 * w2 * v + kD1 * w2v + -1 * kB2 * w2v * v + kD2 * w2v2 + -1 * kB4 * w2σB * v + kD4 * w2v * σB + kP * vPp) * (K + σB) + λV * v0 * (1 + F * σB),
-1 * kDeg * w2v2 + kB2 * w2v * v + -1 * kD2 * w2v2 + -1 * kK2 * w2v2,
-1 * kDeg * vP + kK1 * w2v + kK2 * w2v2 + -1 * kB5 * vP * phos + kD5 * vPp,
(-1 * kDeg * σB + -1 * kB3 * w2 * σB + kD3 * w2σB + kB4 * w2σB * v + -1 * kD4 * w2v * σB) * (K + σB) + v0 * (1 + F * σB),
-1 * kDeg * w2σB + kB3 * w2 * σB + -1 * kD3 * w2σB + -1 * kB4 * w2σB * v + kD4 * w2v * σB,
-1 * kDeg * vPp + kB5 * vP * phos + -1 * kD5 * vPp + -1 * kP * vPp,
(phos + vPp) - pTot
]
```

We can now solve the system of equations `SteadyStates = 0`for these values of parameters as follows.

First, we define a system `F` that declares parameters for the polynomials in `SteadyStates`:

```julia
F = System(SteadyStates,
           parameters =
           [kBw; kDw; kD; kB1; kB2; kB3; kB4; kB5; kD1; kD2; kD3; kD4; kD5; kK1; kK2; kP; kDeg; v0; F; K; λW; λV; pTot])
```

Now, we solve `F=0` for the parameter values `p`.

```julia
S = solve(F, target_parameters = p)
Result with 44 solutions
========================
• 76 paths tracked
• 44 non-singular solutions (12 real)
• random_seed: 0x055252ab
• start_system: :polyhedral
```

Only real positive zeros are physically meaningful. Using our implementation we can certify that there are 12 real zeros:

```julia
cert = certify(F, S, target_parameters = p)
CertificationResult
===================
• 44 solution candidates given
• 44 certified solution intervals (12 real)
• 44 distinct certified solution intervals (12 real)
```

We can also certify that among them there is a unique positive one.

```julia
c = certificates(cert)
pos_real = c[findall(is_positive.(c))]
length(pos_real)
1
```

The positive real solution has the following values:

```julia
certified_solution_interval(pos_real[1])
10×1 Arblib.AcbMatrix:
[0.00406661084 +/- 5.50e-12] + [+/- 2.45e-12]im
[0.0557971948 +/- 5.02e-11] + [+/- 2.14e-11]im
[27.0899869 +/- 4.02e-8] + [+/- 1.63e-8]im
[1.99593338916 +/- 5.54e-12] + [+/- 2.49e-12]im
[0.10633375735 +/- 8.88e-12] + [+/- 5.35e-12]im
[0.303554095 +/- 5.67e-10] + [+/- 2.48e-10]im
[2.25701026 +/- 2.13e-9] + [+/- 6.14e-10]im
[8.28821625 +/- 5.01e-9] + [+/- 9.18e-10]im
[10.42034597 +/- 8.48e-9] + [+/- 6.47e-9]im
[0.240800757 +/- 5.42e-10] + [+/- 2.59e-10]im
```

This is a proof that the dynamical system has a physically meaningful steady state. Moreover, the intervals above provably contain this steady state.

We thank [Torkel Loman](https://www.slcu.cam.ac.uk/people/torkel-loman) for pointing out this example to us.


{{<bibtex >}}
