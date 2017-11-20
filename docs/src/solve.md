# [Solving homotopies](@id solve)

## The solve function
The `solve` function solves homotopies with given starting values.
```@docs
solve
```
The output of `solve` is an array of type `HomotopyContinuation.Result`.

## [The solutions function](@id solutions)
The `solution` function helps to extract information from `HomotopyContinuation.Result` arrays
```@docs
solutions
```

## [The result array](@id result)
The `HomotopyContinuation.PathResult` struct carries the following informations.
- `returncode`:
- `solution`: the zero that is computed (here it is ``[-i,1]``).
- `singular`: boolean that shows whether the zero is singular.
- `residual`: the computed value of ``|f([-i,1])|``.
- `newton_residual`:
- `log10_condition_number`:
- `windingnumber`
- `angle_to_infinity`: the algorithms homogenizes the system ``f`` and then computes all solutions in projective space. The angle to infinity is the angle of the solution to the hyperplane where the homogenizing coordinate is ``0``.
-  `real_solution`: boolean that shows whether the zero is real.
- `startvalue`:
- `iterations`:
- `endgame_iterations`:
- `npredictions`:
