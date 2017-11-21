# How to set up your own homotopy

We shall illustrate how to set up your own homotopy by work out the following example.

For a polynomial systems ``f,g`` we want to define the homotopy
```math
H(x,t) = t * f( U(t) x ) + (1 - t) * g( U(t) x )
```

where ``U(t)`` is a random path in the space of unitary matrices with ``U(0) = U(1) = I``, the identity matrix. I.e.,
```math
U(t) = U \begin{bmatrix}
\cos(2π t) & -\sin(2π t) & 0 &\cdots & 0\\
\sin(2π t) & \cos(2π t) & 0 &\cdots & 0\\
0 & 0 & 1 &\cdots & 0\\
0 & 0 & 0 &\cdots & 0\\
0 & 0 & 0 &\cdots & 1
\end{bmatrix} U^T.
```
with a random unitary matrix `U`.

To start we make a copy of the file `straigthline.jl` (or of any other appropriate file like `geodesic_on_the_sphere.jl`) and rename it `rotation_and_straightline.jl`. Now we have to do two things:

- Adapt the struct and its constructors.
- Adapt the evaluation functions.
- Include `rotation_and_straightline.jl` in `Homotopy.jl`.

## Adapt the struct and its constructors

We now assume that the file we copied is `straigthline.jl`. It is convenient to make a search-and-replace on `StraightLineHomotopy` and replace it by `RotationAndStraightLine`. In the code we use the abbreviation `SLH{T}` for `StraightLineHomotopy{T}`. So we also search-and-replace `SLH{T}` by `RSL{T}`.

First we adapt the contructor. Note that in the initialization of the struct we sample a random matrix and extract a unitary matrix ``U`` from its QR-decomposition. From this we define the function ``U(t)`` and save it together with its derivative in the struct.


```julia

mutable struct RotationAndStraightLine{T<:Number} <: AbstractPolynomialHomotopy{T}
    start::Vector{FP.Polynomial{T}}
    target::Vector{FP.Polynomial{T}}
    U::Function
    U_dot::Function

    function RotationAndStraightLine{T}(start::Vector{FP.Polynomial{T}}, target::Vector{FP.Polynomial{T}}) where {T<:Number}
        @assert length(start) == length(target) "Expected the same number of polynomials, but got $(length(start)) and $(length(target))"


        s_nvars = maximum(FP.nvariables.(start))
        @assert all(s_nvars .== FP.nvariables.(start)) "Not all polynomials of the start system have $(s_nvars) variables."

        t_nvars = maximum(FP.nvariables.(target))
        @assert all(t_nvars .== FP.nvariables.(target)) "Not all polynomials of the target system have $(t_nvars) variables."

        @assert s_nvars == t_nvars "Expected start and target system to have the same number of variables, but got $(s_nvars) and $(t_nvars)."

        U = qrfact(randn(s_nvars,s_nvars) + im * randn(s_nvars,s_nvars))[:Q]

        function U_fct(t)
                (cos(2 * pi * t) - 1) .* U[:,1] * U[:,1]' - sin(2 * pi * t) .* U[:,2] * U[:,1]' + sin(2 * pi * t) .* U[:,1] * U[:,2]' + (cos(2 * pi * t) - 1) .* U[:,2] * U[:,2]' + eye(U)
        end

        function U_dot(t)
                2 * pi .* (-sin(2 * pi * t) .* U[:,1] * U[:,1]' - cos(2 * pi * t) .* U[:,2] * U[:,1]' + cos(2 * pi * t) .* U[:,1] * U[:,2]' - sin(2 * pi * t) .* U[:,2] * U[:,2]')
        end

        new(start, target, U_fct, U_dot)
    end

    function RotationAndStraightLine{T}(start, target) where {T<:Number}
        s, t = construct(T, start, target)
        RotationAndStraightLine{T}(s, t)
    end
end


function RotationAndStraightLine(start, target)
    T, s, t = construct(start, target)
    RotationAndStraightLine{T}(s, t)
end
```

The conversion functions are adapted easily with copy-and-paste.

```julia
#
# SHOW
#
function Base.deepcopy(H::RSL)
    RotationAndStraightLine(deepcopy(H.start), deepcopy(H.target))
end
#
# PROMOTION AND CONVERSION
#ß
Base.promote_rule(::Type{RSL{T}}, ::Type{RSL{S}}) where {S<:Number,T<:Number} = RSL{promote_type(T,S)}
Base.promote_rule(::Type{RSL}, ::Type{S}) where {S<:Number} = RSL{S}
Base.promote_rule(::Type{RSL{T}}, ::Type{S}) where {S<:Number,T<:Number} = RSL{promote_type(T,S)}
Base.convert(::Type{RSL{T}}, H::RSL) where {T} = RotationAndStraightLine{T}(H.start, H.target)
```


## Adapt the evaluation functions.

The essential part of the homotopy struct are the evaluation functions. Here is where we define the orthogonal rotation.

The function to be edited are `evaluate`, `jacobian`, `dt` and `weylnorm`. For fast evaluation there is a function `evaluate_start_target` that evaluates start and target system efficiently.

The function that evaluates the homotopy at ``x`` at time ``t`` is

```julia
#
# EVALUATION + DIFFERENTATION
#
function evaluate!(u::AbstractVector, H::RSL{T}, x::Vector, t::Number) where T
    y = H.U(t) * x
    for i = 1:length(H.target)
        f = H.target[i]
        g = H.start[i]
        u[i] = (one(T) - t) * FP.evaluate(f, y) + t * FP.evaluate(g, y)
    end
    u
end
(H::RSL)(x,t) = evaluate(H,x,t)

function evaluate!(u::AbstractVector{T}, H::RSL, x::Vector, t::Number, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}
    y = H.U(t) * x
    evaluate_start_target!(cfg, H, y, precomputed)
    u .= (one(t) - t) .* value_target(cfg) .+ t .* value_start(cfg)
end
```

The derivative of the homotopy with respect to ``x`` is

```julia
function jacobian!(u::AbstractMatrix, H::RSL{T}, x::AbstractVector, t, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}
    U = H.U(t)
    y = U * x
    jacobian_start_target!(cfg, H, y, precomputed)
    u .= ((one(t) - t) .* jacobian_target(cfg) .+ t .* jacobian_start(cfg)) * U
end

function jacobian!(r::JacobianDiffResult, H::RSL{T}, x::AbstractVector, t, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}
    U = H.U(t)
    y = U * x
    evaluate_and_jacobian_start_target!(cfg, H, y)

    r.value .= (one(t) - t) .* value_target(cfg) .+ t .* value_start(cfg)
    r.jacobian .= ((one(t) - t) .* jacobian_target(cfg) .+ t .* jacobian_start(cfg)) * U
    r
end
```

The derivative of the homotopy with respect to ``t`` is

```julia
function dt!(u, H::RSL{T}, x::AbstractVector, t, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}
    y = H.U(t) * x
    evaluate_and_jacobian_start_target!(cfg, H, y)

    u .= value_start(cfg) .- value_target(cfg) .+ ((one(t) - t) .* jacobian_target(cfg) .+ t .* jacobian_start(cfg)) * H.U_dot(t) * x
end

function dt!(r::DtDiffResult, H::RSL{T}, x::AbstractVector, t, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}
    y = H.U(t) * x
    evaluate_and_jacobian_start_target!(cfg, H, y)
    r.value .= (one(T) - t) .* value_target(cfg) .+ t .* value_start(cfg)
    r.dt .= value_start(cfg) .- value_target(cfg) .+ ((one(t) - t) .* jacobian_target(cfg) .+ t .* jacobian_start(cfg)) * H.U_dot(t) * x
    r
end
```

Finally, we adapt the function to compute the Weylnorm. Note that precomposing with unitary matrices preserves the Weyl inner product.

```julia
function weylnorm(H::RSL{T})  where {T<:Number}
    f = FP.homogenize.(H.start)
    g = FP.homogenize.(H.target)
    λ_1 = FP.weyldot(f,f)
    λ_2 = FP.weyldot(f,g)
    λ_3 = FP.weyldot(g,g)

    function (t)
        sqrt(abs2(one(T) - t) * λ_1 + 2 * real((one(T) - t) * conj(t) * λ_2) + abs2(t) * λ_3)
    end
end
```

## Include `rotation_and_straightline.jl` in `Homotopy.jl`.

To enable `julia` to recognize our new homotopy, we have to include the following line in the `Homotopy.jl` file

```julia
include("homotopies/rotation_and_straightline.jl")
```

Now we are ready to use `RotationAndStraightLine` as homotopy type:

```julia
import DynamicPolynomials: @polyvar
using HomotopyContinuation

@polyvar x y

f = [x^2 - x*y]
H = RotationAndStraightLine(f,f)

solve(H,[0.0, 1.0 + im * 0.0])
```

gives another solution of ``f``. The technique of making loops in the space of polynomials to track zeros to other zeros is called monodromy..

## The complete code

After having completed all of the above tasks, we have the following `rotation_and_straightline.jl` file:


```julia
export RotationAndStraightLine

"""
    RotationAndStraightLine(start, target)

Construct the homotopy `t * start( U(t) x ) + (1-t) * target( U(t) x)`,

where `U(t)` is a path in the space of orthogonal matrices with `U(0)=U(1)=I`, the identity matrix.

`start` and `target` have to match and to be one of the following
* `Vector{<:MP.AbstractPolynomial}` where `MP` is [`MultivariatePolynomials`](https://github.com/blegat/MultivariatePolynomials.jl)
* `MP.AbstractPolynomial`
* `Vector{<:FP.Polynomial}` where `FP` is [`FixedPolynomials`](https://github.com/saschatimme/FixedPolynomials.jl)


    RotationAndStraightLine{T}(start, target)

You can also force a specific coefficient type `T`.
"""
mutable struct RotationAndStraightLine{T<:Number} <: AbstractPolynomialHomotopy{T}
    start::Vector{FP.Polynomial{T}}
    target::Vector{FP.Polynomial{T}}
    U::Function
    U_dot::Function

    function RotationAndStraightLine{T}(start::Vector{FP.Polynomial{T}}, target::Vector{FP.Polynomial{T}}) where {T<:Number}
        @assert length(start) == length(target) "Expected the same number of polynomials, but got $(length(start)) and $(length(target))"


        s_nvars = maximum(FP.nvariables.(start))
        @assert all(s_nvars .== FP.nvariables.(start)) "Not all polynomials of the start system have $(s_nvars) variables."

        t_nvars = maximum(FP.nvariables.(target))
        @assert all(t_nvars .== FP.nvariables.(target)) "Not all polynomials of the target system have $(t_nvars) variables."

        @assert s_nvars == t_nvars "Expected start and target system to have the same number of variables, but got $(s_nvars) and $(t_nvars)."

        U = qrfact(randn(s_nvars,s_nvars) + im * randn(s_nvars,s_nvars))[:Q]

        function U_fct(t)
                (cos(2 * pi * t) - 1) .* U[:,1] * U[:,1]' - sin(2 * pi * t) .* U[:,2] * U[:,1]' + sin(2 * pi * t) .* U[:,1] * U[:,2]' + (cos(2 * pi * t) - 1) .* U[:,2] * U[:,2]' + eye(U)
        end

        function U_dot(t)
                2 * pi .* (-sin(2 * pi * t) .* U[:,1] * U[:,1]' - cos(2 * pi * t) .* U[:,2] * U[:,1]' + cos(2 * pi * t) .* U[:,1] * U[:,2]' - sin(2 * pi * t) .* U[:,2] * U[:,2]')
        end

        new(start, target, U_fct, U_dot)
    end

    function RotationAndStraightLine{T}(start, target) where {T<:Number}
        s, t = construct(T, start, target)
        RotationAndStraightLine{T}(s, t)
    end
end


function RotationAndStraightLine(start, target)
    T, s, t = construct(start, target)
    RotationAndStraightLine{T}(s, t)
end


const RSL{T} = RotationAndStraightLine{T}

#
# SHOW
#
function Base.deepcopy(H::RSL)
    RotationAndStraightLine(deepcopy(H.start), deepcopy(H.target))
end

#
# PROMOTION AND CONVERSION
#ß
Base.promote_rule(::Type{RSL{T}}, ::Type{RSL{S}}) where {S<:Number,T<:Number} = RSL{promote_type(T,S)}
Base.promote_rule(::Type{RSL}, ::Type{S}) where {S<:Number} = RSL{S}
Base.promote_rule(::Type{RSL{T}}, ::Type{S}) where {S<:Number,T<:Number} = RSL{promote_type(T,S)}
Base.convert(::Type{RSL{T}}, H::RSL) where {T} = RotationAndStraightLine{T}(H.start, H.target)


#
# EVALUATION + DIFFERENTATION
#
function evaluate!(u::AbstractVector, H::RSL{T}, x::Vector, t::Number) where T
    y = H.U(t) * x
    for i = 1:length(H.target)
        f = H.target[i]
        g = H.start[i]
        u[i] = (one(T) - t) * FP.evaluate(f, y) + t * FP.evaluate(g, y)
    end
    u
end
(H::RSL)(x,t) = evaluate(H,x,t)


function evaluate!(u::AbstractVector{T}, H::RSL, x::Vector, t::Number, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}
    y = H.U(t) * x
    evaluate_start_target!(cfg, H, y, precomputed)
    u .= (one(t) - t) .* value_target(cfg) .+ t .* value_start(cfg)
end

function jacobian!(u::AbstractMatrix, H::RSL{T}, x::AbstractVector, t, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}
    U = H.U(t)
    y = U * x
    jacobian_start_target!(cfg, H, y, precomputed)
    u .= ((one(t) - t) .* jacobian_target(cfg) .+ t .* jacobian_start(cfg)) * U
end

function jacobian!(r::JacobianDiffResult, H::RSL{T}, x::AbstractVector, t, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}
    U = H.U(t)
    y = U * x
    evaluate_and_jacobian_start_target!(cfg, H, y)

    r.value .= (one(t) - t) .* value_target(cfg) .+ t .* value_start(cfg)
    r.jacobian .= ((one(t) - t) .* jacobian_target(cfg) .+ t .* jacobian_start(cfg)) * U
    r
end

function dt!(u, H::RSL{T}, x::AbstractVector, t, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}
    y = H.U(t) * x
    evaluate_and_jacobian_start_target!(cfg, H, y)

    u .= value_start(cfg) .- value_target(cfg) .+ ((one(t) - t) .* jacobian_target(cfg) .+ t .* jacobian_start(cfg)) * H.U_dot(t) * x
end

function dt!(r::DtDiffResult, H::RSL{T}, x::AbstractVector, t, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}
    y = H.U(t) * x
    evaluate_and_jacobian_start_target!(cfg, H, y)
    r.value .= (one(T) - t) .* value_target(cfg) .+ t .* value_start(cfg)
    r.dt .= value_start(cfg) .- value_target(cfg) .+ ((one(t) - t) .* jacobian_target(cfg) .+ t .* jacobian_start(cfg)) * H.U_dot(t) * x
    r
end

function weylnorm(H::RSL{T})  where {T<:Number}
    f = FP.homogenize.(H.start)
    g = FP.homogenize.(H.target)
    λ_1 = FP.weyldot(f,f)
    λ_2 = FP.weyldot(f,g)
    λ_3 = FP.weyldot(g,g)

    function (t)
        sqrt(abs2(one(T) - t) * λ_1 + 2 * real((one(T) - t) * conj(t) * λ_2) + abs2(t) * λ_3)
    end
end
```
