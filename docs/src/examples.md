# [Examples](@id examples)


## Computing the degree of a variety
Consider the projective variety in the 2-dimensional complex projective space ``CP^2``.
```math
V = \{ x^2 + y^2 - z^2 = 0 \}
```
The degree of ``V`` is the number of intersection points of ``V`` with a generic line.  
Let us see what it is. First we initialize the defining equation of ``V``.
```julia
import DynamicPolynomials: @polyvar

@polyvar x y z
f = x^2 + y^2 - z^2
```
Let us sample the equation of a random line.
```julia
L = randn(1,3) * [x; y; z]
```
Now we compute the number of solutions to ``[f=0, L=0]``.
```julia
using HomotopyContinuation
solve([f; L])
```
We find two distinct solutions and conclude that the degree of ``V`` is 2.

## Using different types of homotopies
the following example is from section 7.3 of [The numerical solution of systems of polynomials, Sommese, Wampler].

Consider a triangle with sides a,b,c and let θ be the angle opposite of c. The goal is to compute θ from a,b,c. We define sθ := sin θ and cθ := cos θ. The polynomial corresponding system is.

```julia
import DynamicPolynomials: @polyvar

a = 5
b = 4
c = 3

@polyvar sθ cθ
f = [cθ^2 + sθ^2 - 1, (a * cθ - b)^2 + (a * sθ)^2 - c^2]
```
To set up a [totaldegree](@ref totaldegree) homotopy of type StraightLineHomotopy we have to write

```julia
using HomotopyContinuation
H, s = totaldegree(StraightLineHomotopy, f)
```

This sets up a homotopy `H` of the specified type using a random starting system that comes with a vector `s` of solutions. To solve for f = 0 we execute

```julia
solve(H, s)
```

If instead we wanted to use GeodesicOnTheSphere as homotopy type, we write

```julia
H, s = totaldegree(GeodesicOnTheSphere, f)
solve(H, s)
```

The angles are of course only the real solutions of f = 0. We get them by using

```julia
solution(ans, only_real=true)
```

## Using different types of pathrackers
The following polynomial system is what is called a binding polynomial in chemistry.

```julia
using HomotopyContinuation
import DynamicPolynomials: @polyvar

@polyvar w1 w2 w3 w4 w5 w6

f = [11*(2*w1+3*w3+5*w5)+13*(2*w2+3*w4+5*w6),
    11*(6*w1*w3+10*w1*w5+15*w3*w5)+13*(6*w2*w4+10*w2*w6+15*w4*w6),
    330*w1*w3*w5+390*w2*w4*w6,
    143*(2*w1*w2+3*w3*w4+5*w5*w6),
    143*(6*w1*w2*w3*w4+10*w1*w2*w5*w6+15*w3*w4*w5*w6),
    4290*w1*w2*w3*w4*w5*w6]
```

Suppose we wanted to solve ``f(w)=a``, where

```julia
a=[71, 73, 79, 101, 103, 107]
```

To get an initial solution we compute a random forward solution with `FixedPolynomials.jl`.

```julia
w_0 = vec(randn(6,1))
a_0 = evaluate(f, w_0)
```

Now we set up the homotopy.

```julia
H = StraightLineHomotopy(f-a_0, f-a)
```

and compute a backward solution with starting value ``w_0`` by

```julia
solve(H, w_0)
```

By default the `solve` function uses `SphericalPredictorCorrector` as the pathtracking routing. To use the `AffinePredictorCorrector` instead we must write

```julia
solve(H, w_0, AffinePredictorCorrector())
```


## 6-R Serial-Link Robots
The following example is from section 9.4 of

[The numerical solution of systems of polynomials, Sommese, Wampler].

Consider a robot that consists of 7 links connected by 6 joints. The first link is fixed on the ground. Let us denote by ``z_1,...,z_6`` the unit vectors that point in the direction of the joint axes.  They satisfy the following polynomial equations

```math
z_i ⋅ z_i = 1\\

z_i ⋅ z_{i+1} = \cos α_i\\

a_1 * z_1 × z_2 + ... + a_5 * z_5 × z_6 + a_6 * z_2 + ... + a_9 * z_5 = p
```

for some ``(α,a)`` and a known ``p`` (see the aforementioned reference for a detailed explanation on how these numbers are to be interpreted).

The forward problem consists of computing ``(α,a)`` given the ``z_i`` and ``p``. The backward problem consists of computing  ``z_i`` that realize some fixed ``(α,a)``.

We now compute first a forward solution ``(α_0, a_0)``, and then use ``(α_0, a_0)`` to compute a backward solution for the problem imposed by some random ``(α, a)``.


```julia
using HomotopyContinuation
import DynamicPolynomials: @polyvar

@polyvar z2[1:3] z3[1:3] z4[1:3] z5[1:3]
z1 = [1, 0, 0]
z6 = [1, 0, 0]
p = [1, 1, 0]
z = [z1, z2, z3, z4, z5, z6]

f = [z[i] ⋅ z[i] for i=2:5]
g = [z[i] ⋅ z[i+1] for i=1:5]
h = hcat([[z[i] × z[i+1] for i=1:5]; [z[i] for i=2:5]]...)

α = randexp(5)
a = randexp(9)
```

Let us compute a random forward solution.

```julia
z_0=rand(3,4); # Compute a random assignment for the variable z
for i = 1:4
    z_0[:,i] = z_0[:,i]./ norm(z_0[:,i]) # normalize the columns of z_0 to norm 1
end
```
We want to compute the angles ``g(z_0)`` with `FixedPolynomials.jl`.
```julia
z_0 = vec(z_0) # vectorize z_0, because the evaluate function takes vectors as input

# compute the forward solution of α
α_0 = acos.( evaluate(g, z_0) )

# evaluate h at z_0
h_0 = evaluate(vec(h), z_0)
# compute a solution to h(z_0) * a = p
h_0 = reshape(h_0,3,9)
a_0 = h_0\p
```
Now we have forward solutions ``α_0`` and ``a_0``. From this we construct the following StraightLineHomotopy.
```julia
H = StraightLineHomotopy([f-1; g-cos.(α_0); h*a_0-p], [f-1; g-cos.(α); h*a-p])
```
To compute a backward solution with starting value ``z_0`` we finally execute
```julia
solve(H, z_0)
```

To compute all the backward solutions we may perform a totaldegree homotopy. Although the Bezout number of the system is 1024 the generic number of solutions is 16. We find all 16 solutions by

```julia
H, s = totaldegree(StraightLineHomotopy, [f-1; g-cos.(α_0); h*a_0-p])
solutions(solve(H, s), singular=false)
```

On a MacBook Pro with 2,6 GHz Intel Core i7 and 16 GB RAM memory the above operation takes about 572 seconds. With parallel computing provided by the `addprocs()` command in `Julia` it takes about 93 seconds.
