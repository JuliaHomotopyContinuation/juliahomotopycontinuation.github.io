# Pathtracking routines

Pathtracking is at the core of each homotopy continuation method.
It is the routine to track a given homotopy ``H(x, t)`` from
a start value ``x_1`` at time ``t_1`` to a target value ``x_0`` at time ``t_0``.

At the heart of the pathtracking routine is the  `mutable struct` `Pathtracker`.
```@docs
Pathtracker
```
## Examples
The follwing example demonstrates the usual workflow. You first create
a `Pathtracker` object, then you can track a path from a given start value
and finally you create a `PathtrackerResult`.
```julia
pathtracker = Pathtracker(H, SphericalPredictorCorrector())
track!(pathtracker, x, 1.0, 0.0)
result = PathtrackerResult(pathtracker)
```
You can reuse (and should!) resuse a `Pathtracker` for multiple paths
```julia
pathtracker = Pathtracker(H, SphericalPredictorCorrector())
results = map(xs) do x
  track!(pathtracker, x, 1.0, 0.0)
  PathtrackerResult(pathtracker)
end
```

`Pathtracker` also supports the iterator interface. This returns the *complete* `Pathtracker` object at each iteration. This enables all sort
of nice features. For example you could store the actual path the pathtracker takes:
```julia
pathtracker = Pathtracker(H, SphericalPredictorCorrector())
setup_pathtracker!(pathtracker, x, 1.0, 0.0)
path = []
for t in pathtracker
  push!(path, current_value(t))
end
```

## Result
See also [here](@ref result).
```@docs
PathtrackerResult
```

## Algorithms
Currently, the following pathtracking routines are implemented

```@docs
SphericalPredictorCorrector
AffinePredictorCorrector
```

## Reference
```@docs
track!
setup_pathtracker!
current_value
```
