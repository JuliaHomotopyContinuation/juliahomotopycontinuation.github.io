+++
title = "Installing HomotopyContinuation.jl"
description = "Up and running in under a minute"
weight = -1000
draft = false
toc = false
bref = "Up and running in under a minute"
group = "get-started"
+++

### Requirements
In order to use HomotopyContinuation.jl you need to have at least Julia 1.0 installed.
If this is not the case you can download it at [julialang.org](https://julialang.org/downloads/).
Please see the [platform specific instructions](https://julialang.org/downloads/platform.html) if you have trouble installing Julia.

### Installation
HomotopyContinuation.jl is available through the Julia package manager.
You can enter it by pressing `]` in the REPL and then typing

```julia
pkg> add HomotopyContinuation
```

Alternatively, you can also use

```julia-repl
julia> import Pkg
julia> Pkg.add("HomotopyContinuation")
```

After you completed the installation you are ready to [solve your first polynomial system](/guides/solve-first-system).
