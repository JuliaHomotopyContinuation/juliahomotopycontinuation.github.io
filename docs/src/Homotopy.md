# Setting up homotopies

`Homotopies.jl` is a package for constructing (polynomial) [homotopies](https://en.wikipedia.org/wiki/Homotopy) ``H(x,t)``. For the convient use
we export in `HomotopyContinuation` every function from `Homotopies`.

Each homotopy has the same [Interface](@ref) so that you can switch easily between
different homotopy types.
Based on this interface there are also some convenient [higher level constructs](@ref higherlevelconstructs) provided; e.g., the
construction of a total degree system and its start solutions.

Homotopies.jl provides an interface to [DynamicPolynomials.jl](https://github.com/JuliaAlgebra/DynamicPolynomials.jl) for human-readable input and output. Most of the examples in this introduction are written with [DynamicPolynomials.jl](https://github.com/JuliaAlgebra/DynamicPolynomials.jl) . Internally, `Homotopies.jl` uses [FixedPolynomials.jl](https://github.com/JuliaAlgebra/FixedPolynomials.jl) for fast evaluation.


## Example
As an example we construct a homotopy between the polynomial systems
```math
f= \begin{bmatrix} x + y^3\\  x^2y-2y\end{bmatrix},\quad  
g= \begin{bmatrix}x^3+2\\ y^3+2\end{bmatrix}.
```
Currently, there are two types of [homotopies](@ref Homotopies) implemented:
```julia
StraightLineHomotopy
GeodesicOnTheSphere
```
The code to initialize a StraightLineHomotopy is as follows.
```julia
using HomotopyContinuation
import DynamicPolynomials: @polyvar # @polyvar is a function for initializing variables.
@polyvar x y # initilize the variables x y

f = [x + y^3, x^2*y-2y]
g = [x^3+2, y^3+2]

H = StraightLineHomotopy(f, g) # H is now StraightLineHomotopy{Int64}

# to avoid unnecessary conversions one could also have
H = StraightLineHomotopy{Complex128}([x + y^3, x^2*y-2y], [x^3+2, y^3+2])

# we can now evaluate H
evaluate(H, rand(Complex128, 2), 0.42)
# or alternatively
H(rand(Complex128, 2), 0.42)
```


## Homotopies

The following homotopies are implemented. They are subtypes of `AbstractPolynomialHomotopy`
```@docs
StraightLineHomotopy
GeodesicOnTheSphere
```

## [Higher level constructs](@id higherlevelconstructs)

### [Total degree homotopy](@id totaldegree)
```@docs
totaldegree
TotalDegreeSolutionIterator
totaldegree_startsystem
```

### Random homotopies
```@docs
randomhomotopy
randomsystem
```

## Interface

### Evaluation
```@docs
evaluate
evaluate!
```

### Differentiation
```@docs
jacobian
jacobian!
dt
dt!
```

### Homogenization
```@docs
homogenize
dehomogenize
ishomogenized
ishomogenous
```

### Misc
```@docs
nvariables
weylnorm
gammatrick!
gammatrick
```

## Condition numbers
```@docs
κ
κ_norm
μ_norm
```
