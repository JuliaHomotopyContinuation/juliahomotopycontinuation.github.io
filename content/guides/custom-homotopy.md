+++
title = "Implement a custom homotopy"
description = "How to set up customized homotopies"
weight = 100
draft = false
toc = true
bref = "How to set up a custom homotopy"
group = "feature-guide"
+++


This guide explains how to implement a homotopy of the form
$$H(x,t).$$
In `HomotopyContinuation.jl` a homotopy is a `struct` for which one must implement a few (in-place) functions, namely

```julia
ModelKit.evaluate!
ModelKit.evaluate_and_jacobian!
ModelKit.taylor!
```

As the names suggest, these functions (1) evaluate $H(x,t)$ at $(x,t)$, (2) evaluate $H(x,t)$  and compute the jacobian at $(x,t)$, and (3) compute the taylor expansion of $H(x,t)$ with respect to $t$ at $(x,t)$. In fact, $H(x,t)$ does not even need to be a polynomial function, neither in $x$ nor $t$. The algorithm only depends the implementation of these three functions and tracks $t$ from $t=1$ to $t=0$. 

<h3 class="section-head" id="homotopies"><a href="#homotopies">Implementing an example homotopy</a></h3>

Let us illustrate how this works in an example. We want to implement a homotopy that, given systems of polynomials $F(x)$ and $G(x)$, is given by 
$$H(x,t) = \cos(t\cdot \pi/2) F(x) + \sin(t\cdot \pi/2) G(x), \quad 0\leq t\leq 1.$$
In this case, we have $H(x,1)=G(x)$ and $H(x,0)=F(x)$. That is, $G(x)$ is our start system and $F(x)$ our target system. 
 

using Pkg
Pkg.activate(".")

using HomotopyContinuation

struct CircularHomotopy{S<:AbstractSystem, T<:AbstractSystem} <: AbstractHomotopy
    start::S
    target::T
    γ::ComplexF64
    half_pi::Float64

    u::Vector{ComplexF64}
    ū::Vector{ComplexF64}
    v̄::Vector{ComplexF64}
    U::Matrix{ComplexF64}

    dv_start::TaylorVector{5,ComplexF64}
    dv_target::TaylorVector{5,ComplexF64}
end

function CircularHomotopy(
    start::System,
    target::System;
    kwargs...,
)
    CircularHomotopy(
        fixed(start),
        fixed(target);
        kwargs...,
    )
end
function CircularHomotopy(
    start::AbstractSystem,
    target::AbstractSystem;
    γ = 1.0,
    gamma = γ,
)
    size(start) == size(target) || throw(
        ArgumentError(
            "Start and target do not have the same size, got $(size(start)) and $(size(target))",
        ),
    )

    m, n = size(start)
    u = zeros(ComplexF64, m)
    ū = zeros(ComplexF64, m)
    v̄ = zeros(ComplexF64, m)
    U = zeros(ComplexF64, m, n)
    half_pi = π / 2

    dv_start = TaylorVector{5}(ComplexF64, m)
    dv_target = TaylorVector{5}(ComplexF64, m)

    CircularHomotopy(
        start,
        target,
        ComplexF64(gamma),
        half_pi,
        u,
        ū,
        v̄,
        U,
        dv_start,
        dv_target,
    )
end

Base.size(H::CircularHomotopy) = size(H.start)

function Base.show(io::IO, mime::MIME"text/plain", H::CircularHomotopy)
    println(io, typeof(H), ":")
    println(io, "γ: ", H.γ)
    println(io, "\nG: ")
    show(io, mime, H.start)
    println(io, "\n\nF:")
    show(io, mime, H.target)
end

function ModelKit.evaluate!(
    u,
    H::CircularHomotopy,
    x::Vector{ComplexF64},
    t,
    p = nothing,
)
    evaluate!(H.v̄, H.start, x)
    evaluate!(H.ū, H.target, x)

    t0 = H.half_pi * t
    ts, tt = H.γ .* sin(t0), -cos(t0)
    for i = 1:size(H, 1)
        @inbounds u[i] = ts * H.v̄[i] + tt * H.ū[i]
    end
end

function ModelKit.evaluate!(u, H::CircularHomotopy, x, t, p = nothing)
    evaluate!(u, H.start, x)
    evaluate!(H.u, H.target, x)

    t0 = H.half_pi * t
    ts, tt = H.γ .* sin(t0), -cos(t0)
    for i = 1:size(H, 1)
        @inbounds u[i] = ts * u[i] + tt * H.u[i]
    end
    u
end

function ModelKit.evaluate_and_jacobian!(
    u,
    U,
    H::CircularHomotopy,
    x::AbstractVector{T},
    t,
    p = nothing,
) where {T}
    evaluate_and_jacobian!(u, U, H.start, x)
    evaluate_and_jacobian!(H.u, H.U, H.target, x)

    t0 = H.half_pi * t
    ts, tt = H.γ .* sin(t0), -cos(t0)
    for i = 1:size(H, 1)
        @inbounds u[i] = ts * u[i] + tt * H.u[i]
    end
    for j = 1:size(H, 2), i = 1:size(H, 1)
        @inbounds U[i, j] = ts * U[i, j] + tt * H.U[i, j]
    end
    nothing
end

function ModelKit.taylor!(u, ::Val{1}, H::CircularHomotopy, x, t)
    evaluate!(u, H.start, x)
    evaluate!(H.u, H.target, x)

    t0 = H.half_pi * t
    ts, tt = H.γ * cos(t0) * H.half_pi, sin(t0) * H.half_pi
    for i = 1:size(H, 1)
        @inbounds u[i] = ts * u[i] + tt * H.u[i]
    end
    u
end

function ModelKit.taylor!(
    u,
    v::Val{K},
    H::CircularHomotopy,
    tx::TaylorVector,
    t,
) where {K}
    taylor!(H.dv_start, v, H.start, tx)
    taylor!(H.dv_target, v, H.target, tx)

    t0 = H.half_pi * t
    for i = 1:size(H, 1)
        start = H.γ * (cos(t0) * H.half_pi * H.dv_start[i, K] + sin(t0) * H.dv_start[i, K+1])
        target = cos(t0) * H.dv_target[i, K+1] - sin(t0) * H.half_pi * H.dv_target[i, K]
        u[i] = start - target
    end
    u
end


@var x y

f = System([x^2 - 1; y^2 - 1])
g = System([y^2 + x * y + 1; -x^2 + x + 2y - 2])
γ = exp(rand() * 2 * pi * im)

H = CircularHomotopy(f,g; γ = γ)
H2 = StraightLineHomotopy(f,g; γ = γ)

starts = [[1,1], [1,-1], [-1,1], [-1,-1]]
starts = convert(Vector{Vector{ComplexF64}}, starts)


S = solve(H, starts)
S2 = solve(H2, starts)

T = Tracker(H)
T2 = Tracker(H2)



using Plots, LinearAlgebra

Xs = Vector{ComplexF64}()
for (x, t) in iterator(T, starts[4], 1.0, 0.0)
    push!(Xs, x[1])
end


Xs2 = Vector{ComplexF64}()
for (x, t) in iterator(T2, starts[4], 1.0, 0.0)
    push!(Xs2, x[1])
end


scatter(real(Xs), imag(Xs), markercolor = :steelblue, markersize = 10, legend = false)
scatter!(real(Xs2), imag(Xs2), markercolor = :indianred, markersize = 10)
for i in 2:length(Xs)
    v = Xs[i] - Xs[i-1]
    a = Xs[i-1:i] + [0.2 .* v; -0.2 .* v]
    plot!(real(a) ,  imag(a) , linecolor = :black, linewidth = 2, arrow=true, opacity = 0.75)
end
for i in 2:length(Xs2)
    v = Xs2[i] - Xs2[i-1]
    a = Xs2[i-1:i] + [0.2 .* v; -0.2 .* v]
    plot!(real(a) ,  imag(a) , linecolor = :black, linewidth = 2, arrow=true, opacity = 0.75)
end
plot!()