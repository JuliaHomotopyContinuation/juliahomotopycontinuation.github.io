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

As the names suggest, these functions 

* evaluate $H(x,t)$ at $(x,t)$, 
* evaluate $H(x,t)$  and compute the jacobian at $(x,t)$, and 
* compute the taylor expansion of $H(x,t)$ with respect to $t$ at $(x,t)$. 

In fact, $H(x,t)$ does not even need to be a polynomial function, neither in $x$ nor $t$. The algorithm only depends the implementation of these three functions and tracks $t$ from $t=1$ to $t=0$. 

<h3 class="section-head" id="homotopies"><a href="#homotopies">Implementing an example homotopy</a></h3>

Let us illustrate how this works in an example. We want to implement a homotopy that, given systems of polynomials $F(x)$ and $G(x)$, is given by 

$$H(x,t) = \gamma\cdot \sin(t\cdot \pi/2)\cdot G(x) +  \cos(t\cdot \pi/2) \cdot F(x), \quad 0\leq t\leq 1,$$

where $\gamma \in\mathbb C$.  

In this case, we have $H(x,1)=G(x)$ and $H(x,0)=F(x)$. That is, $G(x)$ is our start system and $F(x)$ our target system. 

This is similar to a [straight line homotopy](https://www.juliahomotopycontinuation.org/HomotopyContinuation.jl/stable/homotopies/#StraightLineHomotopy) $H(x,t) = \gamma \cdot t \cdot G(x) + (1-t)\cdot F(x)$.
We copy the [code](https://github.com/JuliaHomotopyContinuation/HomotopyContinuation.jl/blob/main/src/homotopies/straight_line_homotopy.jl) for a `StraightLineHomotopy`, adapt it to our setting and call the result  `TrigonometricHomotopy`. 

In the following, we explain some of the implemented functions, but not all. The complete code is at the end of this guide. 

The `struct` that defines our `TrigonometricHomotopy` could look like this:

```julia
using HomotopyContinuation

struct TrigonometricHomotopy{S<:AbstractSystem, T<:AbstractSystem} <: AbstractHomotopy
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
```
Here, `start` and `target` are start and target system, respectively. We also save $\pi/24 in `half_pi` so that we don't need to compute it all the time. The remaining entries are for caching. 


The `evaluate!` function comes next:
```julia
function ModelKit.evaluate!(
    u,
    H::TrigonometricHomotopy,
    x::Vector{ComplexF64},
    t,
    p = nothing,
)
    evaluate!(H.v̄, H.start, x)
    evaluate!(H.ū, H.target, x)

    t0 = H.half_pi * t
    ts, tt = H.γ .* sin(t0), cos(t0)
    for i = 1:size(H, 1)
        @inbounds u[i] = ts * H.v̄[i] + tt * H.ū[i]
    end
end
```
Here, `ts` and `tt` are the coefficients at $t$ of $G$ and $F$, respectively. Notice that the coefficient of $G$ is indeed $\gamma \cdot \sin(t \cdot \pi/2)$ and the coefficient of $F$ is $\cos(t \cdot \pi/2)$.

The `evaluate_and_jacobian!` is similar, but includes the Jacobian:
```julia
function ModelKit.evaluate_and_jacobian!(
    u,
    U,
    H::TrigonometricHomotopy,
    x::AbstractVector{T},
    t,
    p = nothing,
) where {T}
    evaluate_and_jacobian!(u, U, H.start, x)
    evaluate_and_jacobian!(H.u, H.U, H.target, x)

    t0 = H.half_pi * t
    ts, tt = H.γ .* sin(t0), cos(t0)
    for i = 1:size(H, 1)
        @inbounds u[i] = ts * u[i] + tt * H.u[i]
    end
    for j = 1:size(H, 2), i = 1:size(H, 1)
        @inbounds U[i, j] = ts * U[i, j] + tt * H.U[i, j]
    end
    nothing
end
```

Finally, we implement `ModelKit.taylor!`:
```julia
function ModelKit.taylor!(u, ::Val{1}, H::TrigonometricHomotopy, x, t)
    evaluate!(u, H.start, x)
    evaluate!(H.u, H.target, x)

    t0 = H.half_pi * t
    ts, tt = H.γ * cos(t0) * H.half_pi, -sin(t0) * H.half_pi
    for i = 1:size(H, 1)
        @inbounds u[i] = ts * u[i] + tt * H.u[i]
    end
    u
end
```
Here, the coefficients are given by differentiating $\gamma \sin(t\cdot \pi/2)$ and $\cos(t\cdot \pi/2)$ at $t$. The input `::Val{1}` indicated that this function returns the first derivative with respect to $t$. We also have to implement higher order derivatives (see the complete code at the end of this guide). 

<h3 class="section-head" id="homotopies"><a href="#homotopies">Running our custom homotopy</a></h3>

Let us use our homotopy on the following data:

$$G(x) = \begin{pmatrix} x^2 - 1\\\ y^2 - 1\end{pmatrix}, \\quad F(x) = \begin{pmatrix} y^2 + xy + 1\\\ -x^2 + x + 2y - 2\end{pmatrix}$$

choosing $\gamma\in\mathbb C$ at random.

```julia 
@var x y
G = System([x^2 - 1; y^2 - 1])
F = System([y^2 + x * y + 1; -x^2 + x + 2y - 2])

γ = exp(rand() * 2 * pi * im)
H = TrigonometricHomotopy(G, F; γ = γ)
```

Now, `H` is a `TrigonometricHomotopy` and we can track the zeros of $G$ from $t=1$ to $t=0$ along this homotopy. 

```julia 
julia> starts = [[1,1], [1,-1], [-1,1], [-1,-1]]
julia> S = solve(H, starts)
 Result with 4 solutions
=======================
• 4 paths tracked
• 4 non-singular solutions (0 real)
• random_seed: nothing
```

The computation was successful and all $4$ zeros of $F$ were computed!


<h3 class="section-head" id="homotopies"><a href="#homotopies">Comparing with a straight line homotopy</a></h3>

Let us compare our newly implemented homotopy with a `StraightLineHomotopy`. 
```
H_SL = StraightLineHomotopy(G, F; γ = γ)
```

We wish to plot every single point tracked along the way. For this, we can use the following code:

```
T = Tracker(H)
T_SL = Tracker(H_SL)

pts = Vector{ComplexF64}()
for (x, t) in iterator(T, starts[1], 1.0, 0.0)
    push!(pts, x[1])
end

pts_SL = Vector{ComplexF64}()
for (x, t) in iterator(T_SL, starts[1], 1.0, 0.0)
    push!(pts_SL, x[1])
end
```

Now, `pts` contains the list of points tracked along our `TrigonometricHomotopy` when starting at `starts[1] = [1,1]`. Similarly, `pts_SL` contains the points tracked along a `StraightLineHomotopy`. 

We plot the result:

```
using Plots

scatter(real(pts), imag(pts), markercolor = :steelblue, markersize = 10, legend = false)
scatter!(real(pts_SL), imag(pts_SL), markercolor = :indianred, markersize = 10)
for i in 2:length(pts)
    v = pts[i] - pts[i-1]
    a = pts[i-1:i] + [0.25 .* v; -0.25 .* v]
    plot!(real(a) ,  imag(a) , linecolor = :black, linewidth = 2, arrow=true, opacity = 0.75)
end
plot!()
```

<p style="text-align:center;"><img src="/images/tracking.png" width="500px"/></p>

The blue points have been tracked by our `TrigonometricHomotopy` while the red points have been tracked by the `StraightLineHomotopy`.
As we can see, both homotopies start and arrive at the same point, but the intermediate points are different. 



<h3 class="section-head" id="homotopies"><a href="#homotopies">The complete code for our example</a></h3>


```julia
struct TrigonometricHomotopy{S<:AbstractSystem, T<:AbstractSystem} <: AbstractHomotopy
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

function TrigonometricHomotopy(
    start::System,
    target::System;
    kwargs...,
)
    TrigonometricHomotopy(
        fixed(start),
        fixed(target);
        kwargs...,
    )
end
function TrigonometricHomotopy(
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

    TrigonometricHomotopy(
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

Base.size(H::TrigonometricHomotopy) = size(H.start)

function Base.show(io::IO, mime::MIME"text/plain", H::TrigonometricHomotopy)
    println(io, typeof(H), ":")
    println(io, "γ: ", H.γ)
    println(io, "\nG: ")
    show(io, mime, H.start)
    println(io, "\n\nF:")
    show(io, mime, H.target)
end

function ModelKit.evaluate!(
    u,
    H::TrigonometricHomotopy,
    x::Vector{ComplexF64},
    t,
    p = nothing,
)
    evaluate!(H.v̄, H.start, x)
    evaluate!(H.ū, H.target, x)

    t0 = H.half_pi * t
    ts, tt = H.γ .* sin(t0), cos(t0)
    for i = 1:size(H, 1)
        @inbounds u[i] = ts * H.v̄[i] + tt * H.ū[i]
    end
end

function ModelKit.evaluate!(u, H::TrigonometricHomotopy, x, t, p = nothing)
    evaluate!(u, H.start, x)
    evaluate!(H.u, H.target, x)

    t0 = H.half_pi * t
    ts, tt = H.γ .* sin(t0), cos(t0)
    for i = 1:size(H, 1)
        @inbounds u[i] = ts * u[i] + tt * H.u[i]
    end
    u
end

function ModelKit.evaluate_and_jacobian!(
    u,
    U,
    H::TrigonometricHomotopy,
    x::AbstractVector{T},
    t,
    p = nothing,
) where {T}
    evaluate_and_jacobian!(u, U, H.start, x)
    evaluate_and_jacobian!(H.u, H.U, H.target, x)

    t0 = H.half_pi * t
    ts, tt = H.γ .* sin(t0), cos(t0)
    for i = 1:size(H, 1)
        @inbounds u[i] = ts * u[i] + tt * H.u[i]
    end
    for j = 1:size(H, 2), i = 1:size(H, 1)
        @inbounds U[i, j] = ts * U[i, j] + tt * H.U[i, j]
    end
    nothing
end

function ModelKit.taylor!(u, ::Val{1}, H::TrigonometricHomotopy, x, t)
    evaluate!(u, H.start, x)
    evaluate!(H.u, H.target, x)

    t0 = H.half_pi * t
    ts, tt = H.γ * cos(t0) * H.half_pi, -sin(t0) * H.half_pi
    for i = 1:size(H, 1)
        @inbounds u[i] = ts * u[i] + tt * H.u[i]
    end
    u
end

function ModelKit.taylor!(
    u,
    v::Val{K},
    H::TrigonometricHomotopy,
    tx::TaylorVector,
    t,
) where {K}
    taylor!(H.dv_start, v, H.start, tx)
    taylor!(H.dv_target, v, H.target, tx)

    t0 = H.half_pi * t
    for i = 1:size(H, 1)
        start = H.γ * (cos(t0) * H.half_pi * H.dv_start[i, K] + sin(t0) * H.dv_start[i, K+1])
        target = cos(t0) * H.dv_target[i, K+1] - sin(t0) * H.half_pi * H.dv_target[i, K]
        u[i] = start + target
    end
    u
end
```