+++
title = "Changelog"
bref = "See what is new in HomotopyContinuation.jl"
type = "guides"
layout = "single"
+++

## Version 2.0

Version 2.0 of HomotopyContinuation.jl (HC.jl) is out!

This release comes with many exciting new features and a major revamp of the internals.

#### ModelKit

Creating polynomials is now based primarily on our own modeling language `ModelKit`. Variables are created using the `@var` macro.

Polynomials defined with the old `@polyvar` command continue to be compatible with `solve` and `monodromy_solve`. It is possible (and easy) to  convert expressions constructed with variables created by `@polyvar` to `ModelKit`.

While polynomials defined by `@polyvar` are represented in the monomial basis, polynomials created with `@var` are represented as straight line programs. The latter can be evaluated significantly more efficiently, which results in faster computations.

#### Witness Sets

We introduce support for witness sets. This is a data structure that allows to work with positive dimensional components of the solution set of a system of polynomials. The idea is to take a general (affine) linear subspace of the largest dimension such that the linear space intersects the positive dimensional component in finitely many points (in some publications this is referred to as witness-superset).

We built in special support for constructing (affine) linear subspaces, computing witness sets and moving witness sets around. Furthermore, it is possible to perform monodromy where the “parameters” are linear subspaces. In this case a trace test is used as a stopping criterion.

#### Certification

We provide certification of non-singular isolated solutions of a square system of polynomials. This is done using [interval arithmetic](https://en.wikipedia.org/wiki/Interval_arithmetic) and the Krawczyk method. This feature was developed in collaboration with [Kemal Rose](https://www.mis.mpg.de/de/nlalg/nlalg-people/kemal-rose.html).

#### Polyhedral homotopy

The `solve` method now uses by default the [polyhedral homotopy method](/guides/polyhedral.md) (before the default setting was [total-degree homotopy](/guides/totaldegree.md)). The computation of the mixed cells is done by [MixedSubdivsions.jl](https://github.com/saschatimme/MixedSubdivisions.jl).

#### More new features

Many internal routines have been updated, resulting in faster computations overall. The path tracker is now more robust and can track more numerically challenging paths. The implementation is based on the article Timme, S. "Mixed Precision Path Tracking for Polynomial Homotopy Continuation"(2020, [arXiv: 1902.02968](https://arxiv.org/abs/1902.02968)). We also reworked the endgame to better handle singular solutions of low multiplicity and to avoid degenerate cases where we wrongly classified solutions as singular.

### Summary:

**New features**

- Polyhedral homotopy as default for solving square polynomial systems
- New symbolic input (ModelKit)
    - Allows to generate efficient straight line programs (no unnecessary expansion into monomial basis).
    - Option to compile straight line programs (default; fast but compilation overhead) or to only interpret them (slower, but no compilation overhead)
    - Higher order automatic differentiation
    - Optimization of problems (common subexpression elimination, multivariate horner rewrite scheme)
- `monodromy_solve` doesn't require necessarily an initial start pair anymore. If none is provided, a heuristic is used to automatically find one.
- Improved path tracking algorithm as described in Mixed Precision Path Tracking for Polynomial Homotopy Continuation (2020, [arXiv: 1902.02968)](https://arxiv.org/abs/1902.02968)
- New tropical endgame algorithm
- Standalone Newton's method
- Standalone excess solution check
- (Affine) linear subspaces support
    - Easy to construct (affine) linear subspaces using extrinsic ({ x | Ax = b}) or intrinsic coordinates ({B * u + b | u })
    - Affine linear subspace homotopy in the affine Grassmanian (intrinsic formulation)
    - Affine linear subspace homotopy using extrinsic coordinates
- Witness set computations
- Monodromy with affine linear subspaces
- Certification of regular solutions using interval arithmetic (Krawczyk method)
- Easy storing of solutions as text files

**Notable changes**

- Solve with many parameters now has a progress bar.
- Regular solutions are now always refined to an accuracy of approximately machine precision.
- `monodromy_solve` doesn’t compute permutations anymore by default (set `permutations = true`).
- In `monodromy_solve` the check for duplicate solutions is now significantly more robust by using a dynamic relative tolerance.
- The options in `solve` are now grouped. For example, the options for the tracker have to be passed as `solve(F; tracker_options =(max_steps = 1_000,))`
- `CoreTracker` is now `Tracker` and `PathTracker` is now `EndgameTracker`
- `SPSystem` is succeeded by `CompiledSystem` and `FPSystem` by `InterpretedSystem`
