+++
title = "Installing HomotopyContinuation.jl"
description = "Up and running in under a minute"
weight = -1000
draft = false
toc = true
bref = "Up and running in under a minute"
group = "get-started"
+++




**This guide assumes that you have Julia 1.0 installed and running.**


If this is not the case follow the instructions at [julialang.org](https://julialang.org/downloads/). <h3 class="section-head" id="h-installation"><a href="#h-installation">Installation</a></h3>


HomotopyContinuation.jl is available through the Julia package manager by


```julia-repl
pkg> add HomotopyContinuation
```


you can enter the Julia package manager by pressing `]` in the REPL.


Alternatively, you can use


```julia-repl
julia> import Pkg
julia> Pkg.add("HomotopyContinuation")
```
