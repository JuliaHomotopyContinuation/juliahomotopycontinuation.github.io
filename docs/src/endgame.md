# Endgame

Assume we want to find the all solutions of the polynomial ``(x-2)^4`` with
homotopy continuation. Then the pathtracker gets into severe trouble near the end of the path since the derivative is ``0`` at ``x=2``.

How do we solve that problem? The idea is to split the pathtracking into
two parts. We first track the path `x(t)` until the so called *endgame zone* (starting by default at ``t=0.1``). Then we switch to the *endgame*.
The idea is to estimate the value of `x(0.0)` without tracking the path
all the way to ``t=0.0``(since this would fail due to a singular Jacobian).

There are two well known endgame strategies. The *Power Series Endgame*
and the *Cauchy Endgame*. Currently only the *Cauchy Endgame* is implemented.

At the heart of the endgame routine is the  `mutable struct` `Endgamer`.

```@docs
Endgamer
```
## Examples
The follwing example demonstrates the usual workflow. You first create
an `Endgamer` object, then you can track a path from a given start value
and finally you create a `EndgamerResult`.
```julia
endgamer = Endgamer(CauchyEndgame(), pathtracker)
endgamer!(endgamer, x, 0.1)
result = EndgamerResult(endgamer)
```
You can reuse (and should!) resuse an `Endgamer` for multiple paths
```julia
endgamer = Endgamer(CauchyEndgame(), pathtracker))
results = map(xs) do x
  endgame!(endgamer, x, 0.1)
  EndgamerResult(endgamer)
end
```


## Algorithms

```@docs
CauchyEndgame
```

## Reference
```@docs
endgame!
setup_endgamer!
```
