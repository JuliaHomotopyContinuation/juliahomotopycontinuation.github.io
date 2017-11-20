var documenterSearchIndex = {"docs": [

{
    "location": "index.html#",
    "page": "Introduction",
    "title": "Introduction",
    "category": "page",
    "text": ""
},

{
    "location": "index.html#Introduction-1",
    "page": "Introduction",
    "title": "Introduction",
    "category": "section",
    "text": "HomotopyContinuation.jl is a package for solving polynomial systems via homotopy continuation.The aim of this project is twofold: establishing a fast numerical polynomial solver in Julia and at the same time providing a highly customizable algorithmic environment for researchers for designing and performing individual experiments."
},

{
    "location": "index.html#A-first-example-1",
    "page": "Introduction",
    "title": "A first example",
    "category": "section",
    "text": "HomotopyContinuation.jl aims at having easy-to-understand top-level commands. For instance, suppose we wanted to solve the following systemf= beginbmatrix x^2+y y^2-1endbmatrix  First, we have to define f in Julia. For this purpose HomotopyContinuation.jl provides an interface to DynamicPolynomials.jl for human-readable input and output.import DynamicPolynomials: @polyvar # @polyvar is a function for initializing variables.\n\n@polyvar x y # initialize the variables x y\nf = [x^2+y, y^2-1]To solve  f=0 we execute the following command.using HomotopyContinuation # load the module HomotopyContinuation\n\nsolve(f) # solves for f=0The last command will return a type HomotopyContinuation.Result{Complex{Float64}} of length 4 (one entry for each solution):julia> ans\n\njulia> HomotopyContinuation.Result{Complex{Float64}}\n# paths → 4\n# successfull paths → 4\n# solutions at infinity → 0\nHomotopyContinuation.PathResult{Complex{Float64}}[4]Let us see what is the information that we get. Four paths were attempted to be solved, four of which were completed successfully. Since we tried to solve an affine system, the algorithm checks whether there are solutions at infinity: in this case there are none. To access the first solution in the array we writejulia> ans[1]\n\njulia> HomotopyContinuation.PathResult{Complex{Float64}}\nreturncode → :success\nsolution → Complex{Float64}[2]\nsingular → false\nresidual → 1.02e-15…\nnewton_residual → 8.95e-16…\nlog10_condition_number → 0.133…\nwindingnumber → 1\nangle_to_infinity → 0.615…\nreal_solution → true\nstartvalue → Complex{Float64}[2]\niterations → 17\nendgame_iterations → 5\nnpredictions → 2The returncode tells us that the pathtracking was successfull. What do the entries of that table tell us? Let us consider the most relevant (for a complete list of explanations consider this section).solution: the zero that is computed (here it is -1-1).\nsingular: boolean that shows whether the zero is singular.\nresidual: the computed value of f(-1-1).\nangle_to_infinity: the algorithms homogenizes the system f and then computes all solutions in projective space. The angle to infinity is the angle of the solution to the hyperplane where the homogenizing coordinate is 0.\nreal_solution: boolean that shows whether the zero is real.Suppose we were only interested in the real solutions. The command to extract them issolutions(solve(f), success=true, at_infinity=true, only_real=true, singular=true)Indeed, we havejulia> [ans[i].solution for i=1:2]\njulia> Vector{Complex{Float64}}[2]\nComplex{Float64}[2]\n-1.00… - 2.50e-16…im\n-1.00… + 5.27e-16…im\nComplex{Float64}[2]\n1.00… + 2.50e-16…im\n-1.00… + 5.27e-16…imwhich are the two real zeros of f. By assigning the boolean values in the solutions function we can filter the solutions given by solve(f) .We solve some more elaborate systems in the example section."
},

{
    "location": "examples.html#",
    "page": "Examples",
    "title": "Examples",
    "category": "page",
    "text": ""
},

{
    "location": "examples.html#examples-1",
    "page": "Examples",
    "title": "Examples",
    "category": "section",
    "text": ""
},

{
    "location": "examples.html#Computing-the-degree-of-a-variety-1",
    "page": "Examples",
    "title": "Computing the degree of a variety",
    "category": "section",
    "text": "Consider the projective variety in the 2-dimensional complex projective space CP^2.V = { x^2 + y^2 - z^2 = 0 }The degree of V is the number of intersection points of V with a generic line.   Let us see what it is. First we initialize the defining equation of V.using HomotopyContinuation\nimport DynamicPolynomials: @polyvar\n\n@polyvar x y z\nf = x^2 + y^2 - z^2Let us sample the equation of a random line.L = randn(1,3) * [x; y; z]Now we compute the number of solutions to f=0 L=0.solve([f; L])We find two distinct solutions and conclude that the degree of V is 2."
},

{
    "location": "examples.html#Using-different-types-of-homotopies-1",
    "page": "Examples",
    "title": "Using different types of homotopies",
    "category": "section",
    "text": "In this example we compute the angles sθ, cθ of the triangle with sides of length 3, 4 and 5. The corresponding system is.using HomotopyContinuation\nimport DynamicPolynomials: @polyvar\n\na = 5\nb = 4\nc = 3\n\n@polyvar sθ cθ\nf = [cθ^2 + sθ^2 - 1, (a * cθ - b)^2 + (a * sθ)^2 - c^2]To set up a totaldegree homotopy of type StraightLineHomotopy we have to writeH, s = totaldegree(StraightLineHomotopy, f)This sets up a homotopy H of the specified type using a random starting system that comes with a vector s of solutions. To solve for f = 0 we executesolve(H, s)If instead we wanted to use GeodesicOnTheSphere as homotopy type, we writeH, s = totaldegree(GeodesicOnTheSphere, f)\nsolve(H, s)The angles are of course only the real solutions of f = 0. We get them by usingsolution(ans, success=true, at_infinity=true, only_real=true, singular=true)"
},

{
    "location": "examples.html#The-6R-Robot-1",
    "page": "Examples",
    "title": "The 6R Robot",
    "category": "section",
    "text": "using HomotopyContinuation\nimport DynamicPolynomials: @polyvar\n\n@polyvar z2[1:3] z3[1:3] z4[1:3] z5[1:3]\nz1 = [1, 0, 0]\nz6 = [1, 0, 0]\nz = [z1, z2, z3, z4, z5, z6]\n\nf = [z[i] ⋅ z[i] for i=2:5]\ng = [z[i] ⋅ z[i+1] for i=1:5]\nh = vec(hcat([[z[i] × z[i+1] for i=1:5]; [z[i] for i=2:5]]...))\n\nα = randexp(5)\na = randexp(9)Let us compute a random forward solution.z_0=rand(3,4); # Compute a random assignment for the variable z\nfor i = 1:4\n    z_0[:,i] = z_0[:,i]./ norm(z_0[:,i]) # normalize the columns of z_0 to norm 1\nendWe want to compute the angles g(z_0) with FixedPolynomials.jl. We use Julia's convert function to convert g into the correct type. Then, we use the  evaluate command from FixedPolynomials.jl.import FixedPolynomials: evaluate\nconst FP = FixedPolynomials\n\nz_0 = vec(z_0) # vectorize z_0, because the evaluate function takes vectors as input\n\n# compute the forward solution of α\nα_0 = FP.evaluate(convert(Vector{FixedPolynomials.Polynomial{Float64}}, g), z_0)\n\n# evaluate h at z_0\nh_0 = FP.evaluate(convert(Vector{FixedPolynomials.Polynomial{Float64}}, h), z_0)\n# compute a solution to h(z_0) * a = 0\nh_0 = reshape(h_0,3,9)\na_0 = nullspace(h_0)[:,1]Now we have forward solutions _0 and a_0. From this we construct the following StraightLineHomotopy.H = StraightLineHomotopy([f-1; g-α_0; h*a_0], [f-1; g-α; h*a])To compute a backward solution with starting value z_0 we finally executesolve(H,z_0)"
},

{
    "location": "Homotopy.html#",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Setting up homotopies with Homotopy.jl",
    "category": "page",
    "text": ""
},

{
    "location": "Homotopy.html#Setting-up-homotopies-with-Homotopy.jl-1",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Setting up homotopies with Homotopy.jl",
    "category": "section",
    "text": "Homotopy.jl is a package for constructing (polynomial) homotopies H(xt).Each homotopy has the same Interface so that you can switch easily between different homotopy types. Based on this interface there are also some convenient higher level constructs provided; e.g., the construction of a total degree system and its start solutions.Homotopy.jl provides an interface to DynamicPolynomials.jl for human-readable input and output. Most of the examples in this introduction are written with DynamicPolynomials.jl . Internally, Homotopy.jl uses FixedPolynomials.jl for fast evaluation."
},

{
    "location": "Homotopy.html#Example-1",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Example",
    "category": "section",
    "text": "As an example we construct a homotopy between the polynomial systemsf= beginbmatrix x + y^3  x^2y-2yendbmatrixquad  \ng= beginbmatrixx^3+2 y^3+2endbmatrixCurrently, there are two types of homotopies implemented:StraightLineHomotopy\nGeodesicOnTheSphereThe code to initialize a StraightLineHomotopy is as follows.using Homotopy\nimport DynamicPolynomials: @polyvar # @polyvar is a function for initializing variables.\n@polyvar x y # initilize the variables x y\n\nf = [x + y^3, x^2*y-2y]\ng = [x^3+2, y^3+2]\n\nH = StraightLineHomotopy(f, g) # H is now StraightLineHomotopy{Int64}\n\n# to avoid unnecessary conversions one could also have\nH = StraightLineHomotopy{Complex128}([x + y^3, x^2*y-2y], [x^3+2, y^3+2])\n\n# we can now evaluate H\nevaluate(H, rand(Complex128, 2), 0.42)\n# or alternatively\nH(rand(Complex128, 2), 0.42)"
},

{
    "location": "Homotopy.html#Homotopies-1",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopies",
    "category": "section",
    "text": "The following homotopies are implemented"
},

{
    "location": "Homotopy.html#Homotopy.StraightLineHomotopy",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.StraightLineHomotopy",
    "category": "Type",
    "text": "StraightLineHomotopy(start, target)\n\nConstruct the homotopy t * start + (1-t) * target.\n\nstart and target have to match and to be one of the following\n\nVector{<:MP.AbstractPolynomial} where MP is MultivariatePolynomials\nMP.AbstractPolynomial\nVector{<:FP.Polynomial} where FP is FixedPolynomials\n\nStraightLineHomotopy{T}(start, target)\n\nYou can also force a specific coefficient type T.\n\n\n\n"
},

{
    "location": "Homotopy.html#Homotopy.GeodesicOnTheSphere",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.GeodesicOnTheSphere",
    "category": "Type",
    "text": "GeodesicOnTheSphere(start, target)\n\nHomotopy is the geodesic from g=start/|start| (t=1) to f=target/|target|(t=0):H(x,t) = (cos(tα) - sin (tα)cos(α)/sin(α)) f + sin(tα) / sin(α) * g, whereα = cos <f,g>. The constructor automatically homgenizesstartandtarget`.\n\nstart and target have to match and to be one of the following\n\nVector{<:MP.AbstractPolynomial} where MP is MultivariatePolynomials\nMP.AbstractPolynomial\nVector{<:FP.Polynomial} where FP is FixedPolynomials\n\nGeodesicOnTheSphere{T}(start, target)\n\nYou can also force a specific coefficient type T.\n\n\n\n"
},

{
    "location": "Homotopy.html#Polynomial-homotopies-1",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Polynomial homotopies",
    "category": "section",
    "text": "These are subtypes of AbstractPolynomialHomotopyStraightLineHomotopy\nGeodesicOnTheSphere"
},

{
    "location": "Homotopy.html#higherlevelconstructs-1",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Higher level constructs",
    "category": "section",
    "text": ""
},

{
    "location": "Homotopy.html#Homotopy.totaldegree",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.totaldegree",
    "category": "Function",
    "text": "totaldegree(H::Type{AbstractPolynomialHomotopy}, F, [unitroots=false])\n\nConstruct a  total degree homotopy of type H with F and an iterator of its solutions. This is the homotopy with start system\n\nbeginalign*\n    z_1^d_1 - b_1\n    z_1^d_2 - b_2\n    vdots \n    z_n^d_n - b_n\nendalign*\n\nand target system F, where d_i is the degree of the i-th polynomial of F. If unitroots=true then b_i=1 otherwise b_i is a random complex number (with real and imaginary part in the unit interval).\n\nExample\n\nH, startsolutions = totaldegree(StraightLineHomotopy{Complex128}, [x^2+y+1, x^3*y-2])\n\n\n\n"
},

{
    "location": "Homotopy.html#Homotopy.TotalDegreeSolutionIterator",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.TotalDegreeSolutionIterator",
    "category": "Type",
    "text": "TotalDegreeSolutionIterator(degrees, b)\n\nGiven the Vectors degrees and b TotalDegreeSolutionIterator enumerates all solutions of the system\n\nbeginalign*\n    z_1^d_1 - b_1 = 0 \n    z_1^d_2 - b_2 = 0 \n    vdots \n    z_n^d_n - b_n = 0 \nendalign*\n\nwhere d_i is degrees[i] and b_i is b[i].\n\n\n\n"
},

{
    "location": "Homotopy.html#Homotopy.totaldegree_startsystem",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.totaldegree_startsystem",
    "category": "Function",
    "text": "totaldegree_startsystem(F::Vector{FP.Polynomial{<:Complex}}, [unit_roots=false])\n\nReturn the system\n\nbeginalign*\n    z_1^d_1 - b_1\n    z_1^d_2 - b_2\n    vdots \n    z_n^d_n - b_n\nendalign*\n\nwhere d_i is the degree of the i-th polynomial of F and an iterator of its solutions. If unitroots=true then b_i=1 otherwise b_i is a random complex number (with real and imaginary part in the unit interval).\n\n\n\n"
},

{
    "location": "Homotopy.html#totaldegree-1",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Total degree homotopy",
    "category": "section",
    "text": "totaldegree\nTotalDegreeSolutionIterator\ntotaldegree_startsystem"
},

{
    "location": "Homotopy.html#Homotopy.randomhomotopy",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.randomhomotopy",
    "category": "Function",
    "text": "randomhomotopy(::Type{AbstractPolynomialHomotopy{T}}, size::Int; kwargs...)\n\nCreate a total degree homotopy where the target system is a randomsystem(T, size, size; kwargs...).\n\nExample\n\njulia> H, solutions = randomhomotopy(StraightLineHomotopy{Complex128}, 2, mindegree=3, maxdegree=6);\njulia> length(H)\n3\njulia> nvariables(H)\n3\n\n\n\n"
},

{
    "location": "Homotopy.html#Homotopy.randomsystem",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.randomsystem",
    "category": "Function",
    "text": "randomsystem([T=Complex128,] nequations::Int, nvars::Int; mindegree=0, maxdegree=5, rng=Base.Random.GLOBAL_RNG, density=rand() * 0.8 + 0.1)\n\nCreates a random polynomial system of nequations equations with nvars variables (named x_1, ...x_nvars). Each polynomial has a total degree uniformly drawn from mindegree maxdegree. The coefficients are drawn independently from the given rng. With density you can control how many coefficients are non-zero. A value of 1.0 creates a dense polynomial (i.e. every coefficient is non-zero). A value of 0.5 creates a polynomial where only half of all monomials are non zero.\n\nrandomsystem([T=Complex128,] degrees::Vector{Int}, variables::Vector{Symbol}; rng=N(0,1))\n\nCreate a random polynomial system with the given degrees and variables.\n\n\n\n"
},

{
    "location": "Homotopy.html#Random-homotopies-1",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Random homotopies",
    "category": "section",
    "text": "randomhomotopy\nrandomsystem"
},

{
    "location": "Homotopy.html#Interface-1",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Interface",
    "category": "section",
    "text": ""
},

{
    "location": "Homotopy.html#Homotopy.evaluate",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.evaluate",
    "category": "Function",
    "text": "evaluate(H::AbstractPolynomialHomotopy, x, t)\n\nEvaluate the homotopy H at x to time t, i.e. H(xt).\n\nevaluate(H::AbstractPolynomialHomotopy, x, t, cfg::PolynomialHomotopyConfig)\n\nEvaluate the homotopy H at x to time t using the precompuated values in cfg. Note that this is significantly faster than evaluate(H, x, t).\n\n\n\n"
},

{
    "location": "Homotopy.html#Homotopy.evaluate!",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.evaluate!",
    "category": "Function",
    "text": "evaluate!(u::Vector, H::AbstractPolynomialHomotopy, x, t)\n\nEvaluate the homotopy H at x to time t, i.e. H(xt), and store the result in u.\n\nevaluate!(u::AbstractVector, H::AbstractPolynomialHomotopy, x, t, cfg::PolynomialHomotopyConfig)\n\nEvaluate the homotopy H at x to time t using the precompuated values in cfg and store the result in u.\n\n\n\n"
},

{
    "location": "Homotopy.html#Evaluation-1",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Evaluation",
    "category": "section",
    "text": "evaluate\nevaluate!"
},

{
    "location": "Homotopy.html#Homotopy.jacobian",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.jacobian",
    "category": "Function",
    "text": "jacobian(H::AbstractPolynomialHomotopy, x, t, cfg::PolynomialHomotopyConfig)\n\nCompute the jacobian of H at x and t using the precomputed values in cfg. The jacobian is constructed w.r.t. x, i.e. it doesn't contain the partial derivatives w.r.t. t.\n\n\n\n"
},

{
    "location": "Homotopy.html#Homotopy.jacobian!",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.jacobian!",
    "category": "Function",
    "text": "jacobian!(u, H::AbstractPolynomialHomotopy, x, t, cfg::PolynomialHomotopyConfig)\n\nCompute the jacobian of H at x and t using the precomputed values in cfg and store the result in u.\n\njacobian!(r::JacobianDiffResult, H::AbstractPolynomialHomotopy, x, t, cfg::PolynomialHomotopyConfig)\n\nCompute H(x t) and the jacobian of H at x and t at once using the precomputated values in cfg and store thre result in r. This is faster than computing both values separetely.\n\nExample\n\ncfg = PolynomialHomotopyConfig(H)\nr = JacobianDiffResult(cfg)\njacobian!(r, H, x, t, cfg)\n\nvalue(r) == H(x, t)\njacobian(r) == jacobian(H, x, t, cfg)\n\n\n\n"
},

{
    "location": "Homotopy.html#Homotopy.dt",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.dt",
    "category": "Function",
    "text": "dt(H::AbstractPolynomialHomotopy, x, t, cfg::PolynomialHomotopyConfig)\n\nCompute the derivative of H w.r.t. t at x and t using the precomputed values in cfg.\n\n\n\n"
},

{
    "location": "Homotopy.html#Homotopy.dt!",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.dt!",
    "category": "Function",
    "text": "dt!(u, H::AbstractPolynomialHomotopy, x, t, cfg::PolynomialHomotopyConfig)\n\nCompute the derivative of H w.r.t. t at x and t using the precomputed values in cfg and store the result in u.\n\ndt!(r::DtDiffResult, H::AbstractPolynomialHomotopy, x, t, cfg::PolynomialHomotopyConfig)\n\nCompute the derivative of H w.r.t. t at x and t using the precomputed values in cfg and store the result in r. This is faster than computing both values separetely.\n\nExample\n\ncfg = PolynomialHomotopyConfig(H)\nr = DtDiffResult(cfg)\ndt!(r, H, x, t, cfg)\n\nvalue(r) == H(x, t)\ndt(r) == dt(H, x, t, cfg)\n\n\n\n"
},

{
    "location": "Homotopy.html#Differentiation-1",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Differentiation",
    "category": "section",
    "text": "jacobian\njacobian!\ndt\ndt!"
},

{
    "location": "Homotopy.html#Homotopy.homogenize",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.homogenize",
    "category": "Function",
    "text": "homogenize(H::AbstractPolynomialHomotopy)\n\nHomogenize the homotopy H. This adds an additional variable. If H is already homogenized, this is the identity.\n\n\n\n"
},

{
    "location": "Homotopy.html#Homotopy.dehomogenize",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.dehomogenize",
    "category": "Function",
    "text": "dehomogenize(H::AbstractPolynomialHomotopy)\n\nDehomogenize the homotopy H. This removes the first variable. If H is not homogenized, this is the identity.\n\n\n\n"
},

{
    "location": "Homotopy.html#Homotopy.ishomogenized",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.ishomogenized",
    "category": "Function",
    "text": "ishomogenized(H::AbstractPolynomialHomotopy)\n\nCheck whether the homotopy H was homogenized.\n\n\n\n"
},

{
    "location": "Homotopy.html#Homotopy.ishomogenous",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.ishomogenous",
    "category": "Function",
    "text": "ishomogenous(H::AbstractPolynomialHomotopy)\n\nCheck whether the homotopy H is homogenous. This does not imply that H was homogenized.\n\n\n\n"
},

{
    "location": "Homotopy.html#Homogenization-1",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homogenization",
    "category": "section",
    "text": "homogenize\ndehomogenize\nishomogenized\nishomogenous"
},

{
    "location": "Homotopy.html#Homotopy.nvariables",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.nvariables",
    "category": "Function",
    "text": "nvariables(H::AbstractPolynomialHomotopy)\n\nThe number of variables which H expects as input, i.e. to evaluate H(x,t) x has to be a vector of length nvariables(H).\n\n\n\n"
},

{
    "location": "Homotopy.html#Homotopy.weylnorm",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.weylnorm",
    "category": "Function",
    "text": "weylnorm(H::AbstractPolynomialHomotopy)\n\nCreates a function with variable t that computes the Weyl norm (or Bombieri norm) of H(xt). See here for details about the Weyl norm.\n\n\n\n"
},

{
    "location": "Homotopy.html#Misc-1",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Misc",
    "category": "section",
    "text": "nvariables\nweylnorm"
},

{
    "location": "Homotopy.html#Homotopy.κ",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.κ",
    "category": "Function",
    "text": "κ(H, z, t, cfg)\n\nComputes the condition number of H at (z, t) (with config cfg). See Condition^[1] for details\n\nProposition 16.10: κ(f,z) := ‖f‖ ‖ Df(z)^† diag(‖ z ‖^{d_i-1}) ‖\n\n[1]: Condition, Bürgisser and Cucker\n\n\n\n"
},

{
    "location": "Homotopy.html#Homotopy.κ_norm",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.κ_norm",
    "category": "Function",
    "text": "κ_norm(H, z, t, cfg)\n\nComputes the condition number of H at (z, t) (with config cfg). See Condition^[1] for details\n\nEq. (16.11): κ_norm(f,z) := ‖f‖ ‖ Df(z)^† diag(√{d_i}‖ z ‖^{d_i-1}) ‖\n\n[1]: Condition, Bürgisser and Cucker\n\n\n\n"
},

{
    "location": "Homotopy.html#Homotopy.μ_norm",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Homotopy.μ_norm",
    "category": "Function",
    "text": "μ_norm(H, z, t, cfg)\n\nComputes the condition number of H at (z, t) (with config cfg). See Condition^[1] for details\n\nDefinition 16.43: μ_norm(f,z) := ‖f‖ ‖ (Df(z)-(T_z))^{-1} diag(√{d_i}‖ z ‖^{d_i-1}) ‖\n\n[1]: Condition, Bürgisser and Cucker\n\n\n\n"
},

{
    "location": "Homotopy.html#Condition-numbers-1",
    "page": "Setting up homotopies with Homotopy.jl",
    "title": "Condition numbers",
    "category": "section",
    "text": "κ\nκ_norm\nμ_norm"
},

{
    "location": "solve.html#",
    "page": "Solving homotopies",
    "title": "Solving homotopies",
    "category": "page",
    "text": ""
},

{
    "location": "solve.html#solve-1",
    "page": "Solving homotopies",
    "title": "Solving homotopies",
    "category": "section",
    "text": ""
},

{
    "location": "solve.html#HomotopyContinuation.solve",
    "page": "Solving homotopies",
    "title": "HomotopyContinuation.solve",
    "category": "Function",
    "text": "solve(H::AbstractHomotopy, startvalues_s, [algorithm]; kwargs...)\n\nSolve the homotopy H via homotopy continuation with the given startvalues_s and the given algorithm.\n\nsolve(f::Vector{<:MP.AbstractPolynomial{T}}; homotopytype=GeodesicOnTheSphere, algorithm=SphericalPredictorCorrector(), kwargs...)\nsolve(f::MP.AbstractPolynomial{T}; homotopytype=GeodesicOnTheSphere, algorithm=SphericalPredictorCorrector(), kwargs...)\n\nSolves the polynomial system f via homotopy continuation. This uses a totaldegree homotopy of the given homotopytype and uses the given algorithm for pathtracking.\n\n\n\n"
},

{
    "location": "solve.html#The-solve-function-1",
    "page": "Solving homotopies",
    "title": "The solve function",
    "category": "section",
    "text": "The solve function solves homotopies with given starting values.solveThe output of solve is an array of type HomotopyContinuation.Result."
},

{
    "location": "solve.html#HomotopyContinuation.solutions",
    "page": "Solving homotopies",
    "title": "HomotopyContinuation.solutions",
    "category": "Function",
    "text": "solutions(r::Result; success=true, at_infnity=true, only_real=false, singular=true)\n\nFilters the solutions which satisfy the constraints.\n\n\n\n"
},

{
    "location": "solve.html#solutions-1",
    "page": "Solving homotopies",
    "title": "The solutions function",
    "category": "section",
    "text": "The solution function helps to extract information from HomotopyContinuation.Result arrayssolutions"
},

{
    "location": "solve.html#result-1",
    "page": "Solving homotopies",
    "title": "The result array",
    "category": "section",
    "text": "The HomotopyContinuation.PathResult struct carries the following informations.returncode:\nsolution: the zero that is computed (here it is -i1).\nsingular: boolean that shows whether the zero is singular.\nresidual: the computed value of f(-i1).\nnewton_residual:\nlog10_condition_number:\nwindingnumber\nangle_to_infinity: the algorithms homogenizes the system f and then computes all solutions in projective space. The angle to infinity is the angle of the solution to the hyperplane where the homogenizing coordinate is 0.\nreal_solution: boolean that shows whether the zero is real.\nstartvalue:\niterations:\nendgame_iterations:\nnpredictions:"
},

{
    "location": "pathtracker.html#",
    "page": "Pathtracking",
    "title": "Pathtracking",
    "category": "page",
    "text": ""
},

{
    "location": "pathtracker.html#HomotopyContinuation.AffinePredictorCorrector",
    "page": "Pathtracking",
    "title": "HomotopyContinuation.AffinePredictorCorrector",
    "category": "Type",
    "text": "AffinePredictorCorrector\n\nThis algorithm uses as an prediction step an explicit Euler method. Therefore the prediciton step looks like\n\nx_k+1 = x_k - tJ_H(x t)^-1fracHt(x t)\n\nand the correction step looks like\n\nx_k+1 = x_k+1 - J_H(x t)^-1H(x t)\n\nThis algorithm tracks the path in the affine space.\n\n\n\n"
},

{
    "location": "pathtracker.html#HomotopyContinuation.SphericalPredictorCorrector",
    "page": "Pathtracking",
    "title": "HomotopyContinuation.SphericalPredictorCorrector",
    "category": "Type",
    "text": "SphericalPredictorCorrector\n\nThis algorithm uses as an prediction step an explicit Euler method. For the prediction and correction step the Jacobian is augmented by Hermitian transposed x^* to get a square system. Therefore the prediciton step looks like\n\nx_k+1 = x_k - tbeginbmatrix\n    J_H(x t) \n    x^*\nendbmatrix^-1\nfracHt(x t)\n\nand the correction step looks like\n\nx_k+1 = x_k+1 - beginbmatrix\n    J_H(x t) \n    x^*\nendbmatrix^-1\nH(x t)\n\nAfter each prediciton and correction the algorithm normalizes x again, i.e. x is then a point on the sphere again.\n\nThis algorithm tracks the path in the projective space.\n\n\n\n"
},

{
    "location": "pathtracker.html#Pathtracking-routines-1",
    "page": "Pathtracking",
    "title": "Pathtracking routines",
    "category": "section",
    "text": "Currently, there are kinds of pathtracking routines implementedAffinePredictorCorrector\nSphericalPredictorCorrector"
},

{
    "location": "endgame.html#",
    "page": "Endgame",
    "title": "Endgame",
    "category": "page",
    "text": ""
},

{
    "location": "endgame.html#Endgame-1",
    "page": "Endgame",
    "title": "Endgame",
    "category": "section",
    "text": ""
},

{
    "location": "set_up_homotopy.html#",
    "page": "How to set up your own homotopy",
    "title": "How to set up your own homotopy",
    "category": "page",
    "text": ""
},

{
    "location": "set_up_homotopy.html#How-to-set-up-your-own-homotopy-1",
    "page": "How to set up your own homotopy",
    "title": "How to set up your own homotopy",
    "category": "section",
    "text": ""
},

{
    "location": "set_up_pathtracker.html#",
    "page": "How to set up your own pathtracker",
    "title": "How to set up your own pathtracker",
    "category": "page",
    "text": ""
},

{
    "location": "set_up_pathtracker.html#How-to-set-up-your-own-pathtracker-1",
    "page": "How to set up your own pathtracker",
    "title": "How to set up your own pathtracker",
    "category": "section",
    "text": ""
},

]}
