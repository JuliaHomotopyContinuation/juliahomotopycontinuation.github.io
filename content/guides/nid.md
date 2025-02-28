+++
title = "Numerical Irreducible Decomposition"
description = "Computing positive dimensional solution sets."
weight = 2
draft = false
toc = true
bref = "Decomposing the solution set into irreducible components"
group = "feature-guide"
+++




<h3 class="section-head" id="nid"><a href="#nid">Numerical Irreducible Decomposition</a></h3>

A numerical irreducible decomposition of a system of polynomial equations $F(x)$ is the decomposition of the zero set of $F$ into [irreducible components](https://en.wikipedia.org/wiki/Irreducible_component). 

**Careful:** The implementation is not yet final and should be considered experimental.

For example, the following code decomposes the zero set of a system that consists of a hypersurface of degree 2, two curves of degree 4 and eight points. 


```julia
using HomotopyContinuation
@var x, y, z
p = (x * y - x^2) + 1 - z
q = x^4 + x^2 - y - 1
F = [p * q * (x - 3) * (x - 5);
     p * q * (y - 3) * (y - 5);
     p * (z - 3) * (z - 5)]

N = numerical_irreducible_decomposition(F)
```

The output is as follows. 
```
Numerical irreducible decomposition with 11 components
• 1 component(s) of dimension 2.
• 2 component(s) of dimension 1.
• 8 component(s) of dimension 0.

 degree table of components:
╭───────────┬──────────────────────────╮
│ dimension │  degrees of components   │
├───────────┼──────────────────────────┤
│     2     │            2             │
│     1     │          (4, 4)          │
│     0     │ (1, 1, 1, 1, 1, 1, 1, 1) │
╰───────────┴──────────────────────────╯
```

Notice that in dimension 0 the 8 points are summarized as one component (a single point is always an irreducible component).

One can also use 
```julia
nid(F)
``` 
This will compute exact same thing as `numerical_irreducible_decomposition(F)`.

See also the [documentation](https://www.juliahomotopycontinuation.org/HomotopyContinuation.jl/stable/witness_sets/).

## Regeneration

The algorithm consists of 2 steps. The first step is [u-regeneration](https://arxiv.org/abs/2206.02869) by Duff, Leykin and Rodriguez. The output of the regeneration algorithm is a vector of [witness sets](https://www.juliahomotopycontinuation.org/HomotopyContinuation.jl/stable/witness_sets/), one for each dimension. The witness set $W_i$ in dimension $i$ gives $\\{F=0\\} \cap L_i$ where $L_i$ is a random linear space of codimension $i$; i.e., $W_i$ represents the union of irreducible components in dimension $i$. 

```julia
R = regeneration(F)
```

```
3-element Vector{WitnessSet}:
 Witness set for dimension 2 of degree 2
 Witness set for dimension 1 of degree 8
 Witness set for dimension 0 of degree 8
```

The second step decomposes the output of `regeneration` into irreducible components using monodromy.

```julia
decompose(R)
```

The output of `decompose(R)` is then the same as the output of `nid(F)`.