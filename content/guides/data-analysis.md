+++
title = "Data analysis of solutions"
description = "Analysing arrays of vectors"
weight = 100
draft = false
toc = true
bref = "Analysing arrays of vectors"
group = "feature-guide"
+++


We provide two special functions for analysing data: [unique_points](https://www.juliahomotopycontinuation.org/HomotopyContinuation.jl/stable/misc/#HomotopyContinuation.unique_points) and [multiplicities](https://www.juliahomotopycontinuation.org/HomotopyContinuation.jl/stable/misc/#HomotopyContinuation.multiplicities). They do the following: suppose that `A` is an array of real or complex vectors. Then, `unique_points(A)` filters multiple elements of `A`, such that each entry appears once (given a provided tolerance).  On the other hand, `multiplicities(A)` returns the indices of multiple elements in `A`.

<h3 class="section-head" id="uniquepoints"><a>Unique points</a></h3>

Here is an example:

```julia-repl
julia> using HomotopyContinuation
julia> A = [[1.0,0.5], [0.99,0.49], [2.0,0.1], [0.5,1.0]]
julia> unique_points(A)
4-element Array{Array{Float64,1},1}:
 [1.0, 0.5]  
 [0.99, 0.49]
 [2.0, 0.1]  
 [0.5, 1.0]
```

If we relax the tolerance, we get

```julia-repl
julia> unique_points(A, atol = 0.3)
3-element Array{Array{Float64,1},1}:
 [1.0, 0.5]
 [2.0, 0.1]
 [0.5, 1.0]
```

Note that by default the Euclidean metric is used.

We can also use another metric:
```julia-repl
julia> unique_points(A, atol = 0.5, metric = InfNorm())
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
julia> M = multiplicities(A, atol = 0.3)
1-element Array{Array{Int64,1},1}:
 [1, 2]
```

This means that the first and the second entry of $A$ are the same up to `distance < 0.3`.


<h3 class="section-head" id="groupactions"><a>Group Actions</a></h3>

It is also possible to define equality up to group action. For instance, consider the group that interchanges the first and the second entry of a vector in `A`.

```julia
G = GroupActions( x -> ([x[2]; x[1]], ) )
```

Then, we have

```julia-repl
julia> unique_points(A, group_actions = G)
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
