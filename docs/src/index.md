# Introduction
`HomotopyContinuation.jl` is a package for solving polynomial systems via homotopy continuation.

The aim of this project is twofold: establishing a fast numerical polynomial solver in `Julia` and at the same time providing a highly customizable algorithmic environment for researchers for designing and performing individual experiments.

## A first example
HomotopyContinuation.jl aims at having easy-to-understand top-level commands. For instance, suppose we wanted to solve the following system

```math
f= \begin{bmatrix} x^2+y\\ y^2-1\end{bmatrix}.  
```

First, we have to define ``f`` in Julia. For this purpose
HomotopyContinuation.jl provides an interface to [DynamicPolynomials.jl](https://github.com/JuliaAlgebra/DynamicPolynomials.jl) for human-readable input and output.

```julia
import DynamicPolynomials: @polyvar # @polyvar is a function for initializing variables.

@polyvar x y # initialize the variables x y
f = [x^2+y, y^2-1]
```

To solve  ``f=0`` we execute the following command.

```julia
using HomotopyContinuation # load the module HomotopyContinuation

solve(f) # solves for f=0
```

The last command will return a type `HomotopyContinuation.Result{Complex{Float64}}` of length 4 (one entry for each solution). Let us see what is the information that we get. To access the first solution in that array we write
```julia-repl
> ans[1]

>  HomotopyContinuation.PathResult{Complex{Float64}}:
  * returncode: success
  * solution: Complex{Float64}[-1.11022e-16-1.0im, 1.0-3.33067e-16im]
  * singular: false
  ---------------------------------------------
  * iterations: 7
  * endgame iterations: 5
  * npredictions: 2
  ---------------------------------------------
  * newton_residual: 2.412e-16
  * residual: 2.776e-16
  * log10 of the condition_number: 1.149e-01
  * windingnumber: 1
  * angle to infinity: 0.615
  * real solution: false
```
The returncode tells us that the pathtracking was successfull. What do the entries of that table tell us? Let us consider the most relevant (for a complete list of explanations consider [this](@ref result) section).

- `solution`: the zero that is computed (here it is ``[-i,1]``).
- `singular`: boolean that shows whether the zero is singular.
- `residual`: the computed value of ``|f([-i,1])|``.
- `angle_to_infinity`: the algorithms homogenizes the system ``f`` and then computes all solutions in projective space. The angle to infinity is the angle of the solution to the hyperplane where the homogenizing coordinate is ``0``.
-  `real_solution`: boolean that shows whether the zero is real.

Suppose we were only interested in the real solutions. The command to extract them is
```julia
solutions(solve(f), success=true, at_infinity=true, only_real=true, singular=true)
```
Indeed, we have
```julia-repl
> [ans[i].solution for i=1:2]
> Vector{Complex{Float64}}[2]
Complex{Float64}[2]
-1.00… - 2.50e-16…im
-1.00… + 5.27e-16…im
Complex{Float64}[2]
1.00… + 2.50e-16…im
-1.00… + 5.27e-16…im
```
which are the two real zeros of `f`. By assigning the boolean values in the [`solutions`](@ref solutions) function we can filter the solutions given by `solve(f)` .

We solve some more elaborate systems in the [example section](@ref examples).
