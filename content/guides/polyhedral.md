+++
title = "Polyhedral homotopy"
description = "A start system from polyhedral geometry"
weight = -10
draft = false
toc = false
bref = "A start system from polyhedral geometry"
group = "advanced"
+++


Using polyhedral geometry for constructing start systems for homotopy continuation goes back to [Huber and Sturmfels](https://dl.acm.org/citation.cfm?id=213837). The advantage of so called polyhedral homotopies over [totaldegree homotopies](totaldegree) is that the number of paths to track can be significantly smaller for the polyhedral homotopy.

Here is how it works:

```julia-repl
julia> using HomotopyContinuation
julia> @polyvar z[1:7];
julia> f = [z[1] + z[2] + z[3] + z[4] + z[5] + z[6] + z[7];                                                                      
            z[1]*z[2] + z[1]*z[7] + z[2]*z[3] + z[3]*z[4] + z[4]*z[5] + z[5]*z[6] + z[6]*z[7];                                                    
            z[1]*z[2]*z[3] + z[1]*z[2]*z[7] + z[1]*z[6]*z[7] + z[2]*z[3]*z[4] + z[3]*z[4]*z[5]
            + z[4]*z[5]*z[6] + z[5]*z[6]*z[7];                                          
            z[1]*z[2]*z[3]*z[4] + z[1]*z[2]*z[3]*z[7] + z[1]*z[2]*z[6]*z[7] + z[1]*z[5]*z[6]*z[7]
            + z[2]*z[3]*z[4]*z[5] + z[3]*z[4]*z[5]*z[6] + z[4]*z[5]*z[6]*z[7];                            
            z[1]*z[2]*z[3]*z[4]*z[5] + z[1]*z[2]*z[3]*z[4]*z[7] + z[1]*z[2]*z[3]*z[6]*z[7]
            + z[1]*z[2]*z[5]*z[6]*z[7] + z[1]*z[4]*z[5]*z[6]*z[7] + z[2]*z[3]*z[4]*z[5]*z[6]
            + z[3]*z[4]*z[5]*z[6]*z[7];              
            z[1]*z[2]*z[3]*z[4]*z[5]*z[6] + z[1]*z[2]*z[3]*z[4]*z[5]*z[7] + z[1]*z[2]*z[3]*z[4]*z[6]*z[7]
            + z[1]*z[2]*z[3]*z[5]*z[6]*z[7] + z[1]*z[2]*z[4]*z[5]*z[6]*z[7] + z[1]*z[3]*z[4]*z[5]*z[6]*z[7]
            + z[2]*z[3]*z[4]*z[5]*z[6]*z[7];
            z[1]*z[2]*z[3]*z[4]*z[5]*z[6]*z[7] - 1
            ]#this system is called cyclic-7   
julia> solve(f; start_system = :polyhedral)
Result with 924 solutions
==================================
• 924 non-singular solutions (56 real)
• 0 singular solutions (0 real)
• 924 paths tracked
• random seed: 606778
```

For comparison:

```julia-repl
julia> solve(f; start_system = :total_degree)
Result with 924 solutions
==================================
• 924 non-singular solutions (56 real)
• 0 singular solutions (0 real)
• 5040 paths tracked
• random seed: 286291
```

The number of paths for the totaldegree start system is 5040, while for the polyhedral homotopy it is only 924.

In our implementation we use [Anders Jensen's algorithm](https://arxiv.org/pdf/1601.02818.pdf).
