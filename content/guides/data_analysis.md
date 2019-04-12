+++
title = "Data analysis of solutions"
description = "Analysing arrays of vectors"
weight = 1
draft = false
toc = true
bref = "Analysing arrays of vectors"
group = "advanced"
+++


We provide two special functions for analysing data: [UniquePoints](https://www.juliahomotopycontinuation.org/HomotopyContinuation.jl/stable/sorting/#Computing-unique-points-in-an-array-of-vectors-1) and [Multiplicities](https://www.juliahomotopycontinuation.org/HomotopyContinuation.jl/stable/sorting/#Computing-points-in-an-array-of-vectors-which-appear-multiple-times-1). They do the following: suppose that `A` is an array of real or complex vectors. Then, `UniquePoints(A)` filters multiple elements of `A`, such that each entry appears once.  On the other hand, `multiplicities(A)` returns the indices of multiple elements in `A`.

<h3 class="section-head" id="uniquepoints"><a>UniquePoints</a></h3>

Here is the full syntax of `UniquePoints`

```julia
UniquePoints(A, distance; tol=1e-5)
```

where

* `distance` is a function to measure the distance between two vectors. The default option is using the euclidean distance.
* `tol` is the value, such that `v` and `w` are regarded equal, if `distance(v,w) < tol`.

Here is an example:

```julia-repl
julia> using HomotopyContinuation
julia> A = [[1.0,0.5], [0.99,0.49], [2.0,0.1], [0.5,1.0]]
julia> U = UniquePoints(A)
julia> points(U)
4-element Array{Array{Float64,1},1}:
 [1.0, 0.5]  
 [0.99, 0.49]
 [2.0, 0.1]  
 [0.5, 1.0]
```

If we relax the tolerance, we get

```julia-repl
julia> U = UniquePoints(A, tol = 0.5)
julia> points(U)
3-element Array{Array{Float64,1},1}:
 [1.0, 0.5]
 [2.0, 0.1]
 [0.5, 1.0]
```

We can also use another distance function:
```julia-repl
julia> U = UniquePoints(A, (v,w) -> 0.0)
julia> points(U)
1-element Array{Array{Float64,1},1}:
 [1.0, 0.5]
```



<h3 class="section-head" id="multiplicities"><a>Multiplicities</a></h3>

Here is the syntax of `multiplicities`

```julia
multiplicities(A; distance=euclidean_distance, tol::Real = 1e-5)
```

where `distance` and `tol` have the same meaning as above.

We use the `multiplicities` function on the same example as above:

```julia-repl
julia> M = multiplicities(A)
0-element Array{Array{Int64,1},1}
```

For the `tol = 0.5` we get one multiplicity:

```julia-repl
julia> M = multiplicities(A, tol = 0.5)
1-element Array{Array{Int64,1},1}:
 [1, 2]
```

This means that the first and the second entry of $A$ are the same up to `distance < 0.5`. For the all-zero distance function all points are equal:

```julia-repl
julia> M = multiplicities(A, distance = (v,w) -> 0.0)
1-element Array{Array{Int64,1},1}:
 [1, 2, 3, 4]
```


<h3 class="section-head" id="groupactions"><a>Group Actions</a></h3>

It is also possible to define equality up to group action. For instance, consider the group that interchanges the first and the second entry of a vector in `A`.

```julia-repl
julia> G = GroupActions( x -> ([x[2]; x[1]], ) )
```

Then, we have

```julia-repl
julia> U = UniquePoints(A, group_actions = G)
julia> points(U)
3-element Array{Array{Float64,1},1}:
 [1.0, 0.5]  
 [0.99, 0.49]
 [2.0, 0.1]  
```

because `A[1] = [1.0, 0.5]` and `A[4] = [0.5, 1.0]` are now considered equal:

```julia-repl
julia> M = multiplicities(A, group_actions = G)
1-element Array{Array{Int64,1},1}:
 [1, 4]
```
