


**This guide assumes that you have Julia 1.0 installed and running.**


If this is not the case follow the instructions at [julialang.org](https://julialang.org/downloads/). <h3 class="section-head" id="h-installation"><a href="#h-installation">Installation</a></h3>


HomotopyContinuation.jl is available through the Julia package manager by


```julia-repl
pkg> add HomotopyContinuation
```


you can enter the Julia package manager by pressing `[` in the REPL.


<h3 class="section-head" id="h-basic-usage"><a href="#h-basic-usage">Basic usage</a></h3> HomotopyContinuation.jl aims at having easy-to-understand top-level commands. For instance, suppose we want to solve the following polynomial system $f=\begin{bmatrix}x^2+2y \\\\ y^2-2 \end{bmatrix}$


This can be accomplished as follows


```julia
using HomotopyContinuation
@polyvar x y; # declare the variables x and y
result = solve([x^2+2y, y^2-2])
```

```
AffineResult with 4 tracked paths
==================================
• 4 non-singular finite solutions (2 real)
• 0 singular finite solutions (0 real)
• 0 solutions at infinity
• 0 failed paths
• random seed: 751138
```


Let us see what is the information that we get. Four paths were attempted to be solved, four of which were completed successfully. Since we tried to solve an affine system, the algorithm checks whether there are solutions at infinity: in this case there are none. With *solutions at infinity* we mean solutions of the [homogenization](https://en.wikipedia.org/wiki/Homogeneous_polynomial#Homogenization) of the system which are no solutions of the affine system. None of the solutions are singular and two of them are real. To access the first solution in the array we write


```julia
# Assume we are only interested in the *real* solutions. We can obtain these by
real(result)
```

```
2-element Array{HomotopyContinuation.Solving.PathResult{Complex{Float64},Float64,Complex{Float64}},1}:
 • returncode: success
 • solution: Complex{Float64}[1.68179+5.55112e-17im, -1.41421-1.38778e-17im]
 • residual: 1.130e-16
 • pathnumber: 3

 • returncode: success
 • solution: Complex{Float64}[-1.68179-2.77556e-17im, -1.41421+0.0im]
 • residual: 1.119e-16
 • pathnumber: 4
```


where we can see that there are 2 real solutions, $(2^{\frac34},-\sqrt{2})$ and $(-2^{\frac34}, -\sqrt{2})$. We also can look into more detail into the first result by


```julia
real(result)[1]
```

```
PathResult
==========
 • returncode: success
 • solution: Complex{Float64}[1.68179+5.55112e-17im, -1.41421-1.38778e-17im]
 • residual: 1.130e-16
 • condition_number: 1.640e+00
 • windingnumber: 1

 • pathnumber: 3
 • start_solution: Complex{Float64}[1.0+0.0im, -1.0+1.22465e-16im]

 • t: 0.0
 • iterations: 6
 • npredictions: 3
```


The returncode tells us that the pathtracking was successfull. What do the other entries of that table tell us? Let us consider the most relevant:


  * `solution`: the zero that is computed (here it is $(2^{\frac34},-\sqrt{2})$).
  * `singular`: boolean that shows whether the zero is singular.
  * `residual`: the computed value of $|f([1.68179+1.27738e-17im, -1.41421-1.18454e-17im])|$.
  * `windingnumber`: This is a lower bound on the multiplicity of the solution. A windingnumber greater than 1 indicates that the solution is singular.


To extract the solutions you can do


```julia
solutions(result)
```

```
4-element Array{Array{Complex{Float64},1},1}:
 [1.11022e-16+1.68179im, 1.41421+0.0im]
 [-1.11022e-16-1.68179im, 1.41421+1.11022e-16im]
 [1.68179+5.55112e-17im, -1.41421-1.38778e-17im]
 [-1.68179-2.77556e-17im, -1.41421+0.0im]
```


or if you only want real solutions


```julia
realsolutions(result)
```

```
2-element Array{Array{Float64,1},1}:
 [1.68179, -1.41421]
 [-1.68179, -1.41421]
```

