# How to set up your own pathtracking algorithm

We want to illustrate how to setup your own pathtracking algorithm by the already implemented
`AffinePredictorCorrector`.

First you have to define a subtype of `AbstractPathtrackingAlgorithm`. This is the user facing
part.
```julia
struct AffinePredictorCorrector <: AbstractPathtrackingAlgorithm
end
```
Note that you could also allow the user to set certain options, e.g. maybe you want to give
him/her the choice between an explicit Euler method and a Runge-Kutta method.

You also have to clarify whether the algorithm will work in the projective or affine space.
Here we want to work in affine space.
```julia
is_projective(::AffinePredictorCorrector) = false
```

Now you have to define a struct which is subtype of `AbstractPathtrackerCache`.
This is used for the internal dispatch and also serves as an cache to avoid memory allocations.
We will need a working matrix and a vector. Thus we define the following
```julia
struct AffineCache{T} <: AbstractPathtrackerCache{T}
    A::Matrix{T}
    b::Vector{T}
end
```
Then you have to define a new method for `alg_cache(algorithm, homotopy, x)` which will
create our `AffineCache`:
```julia
function alg_cache(alg::AffinePredictorCorrector, H::AbstractHomotopy, x::AbstractVector{T}) where T
    n = length(x)
    A = zeros(T, n, n)
    b = zeros(T, n)
    AffineCache(A, b)
end
```

We are already half way done! Now comes the interesting part. We have to define
two methods.
The first one is a correction method. For us this is a simple newton iteration.
```julia
function correct!(x, # the startvalue
    t, # current 'time'
    H, # the homotopy itself
    cfg, # An AbstractHomotopyConfiguration for efficient evaluation
    abstol::Float64, # the target accuracy
    maxiters::Int, # the maximal number of iterations
    cache::AffineCache{Complex{T}} # our defined Cache
    ) where T
    @unpack A, b = cache
    m = size(A,2)
    k = 0
    while true
        k += 1
        evaluate!(b, H, x, t, cfg)

        if norm(b, Inf) < abstol
            return true
        elseif k > maxiters
            return false
        end

        # put jacobian in A
        jacobian!(A, H, x, t, cfg, true)

        # this computes A x = b and stores the result x in b
        LU = lufact!(A)
        # there is a bug in v0.6.0 see patches.jl
        my_A_ldiv_B!(LU, b)
        x .= x .- b
    end
end
```
This method will be used for the refinement of the final solutions. But we can also use it
for the next method.
We now want to define the method which will actually be used during the pathtracking!
For this we have to define the method
`perform_step!(pathtracker, values, cache::AffineCache)`.
The [`Pathtracker`](@ref) will invoke this function at each
iteration.
```julia
function perform_step!(tracker, values::PathtrackerPrecisionValues{T}, cache::AffineCache{Complex{T}}) where T
    @unpack s, ds = tracker # s is our current 'time', ds the step length
    @unpack H, cfg, x, xnext = values
    @unpack A, b = cache

    m = size(A,2)

    # PREDICT
    # put jacobian in A
    jacobian!(A, H, x, s, cfg)
    # put Hdt in b
    dt!(b, H, x, s, cfg, true)

    # this computes A x = b and stores the result x in b
    LU = lufact!(A)
    # there is a bug in v0.6.0 see patches.jl
    my_A_ldiv_B!(LU, b)

    xnext .= x .- ds .* b

    # CORRECT
    @unpack abstol, corrector_maxiters = tracker.options
    tracker.step_sucessfull = correct!(xnext, s + ds, H, cfg, abstol, corrector_maxiters, cache)
    nothing
end
```

With this in place you are ready to go! Now you can simply solve
a system using your own pathracking algorithm, e.g. using `solve(F, AffinePredictorCorrector())`.
