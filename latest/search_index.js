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
    "text": "HomotopyContinuation.jl is a package for solving square polynomial systems via homotopy continuation.The aim of this project is twofold: establishing a fast numerical polynomial solver in Julia and at the same time providing a highly customizable algorithmic environment for researchers for designing and performing individual experiments.Since this package is pre-release and also relies on couple of unreleased packages. To satisfy all dependencies you have to install it viaPkg.clone(\"https://github.com/JuliaHomotopyContinuation/Homotopy.jl\");\nPkg.clone(\"https://github.com/JuliaHomotopyContinuation/HomotopyContinuation.jl.git\")"
},

{
    "location": "index.html#A-first-example-1",
    "page": "Introduction",
    "title": "A first example",
    "category": "section",
    "text": "HomotopyContinuation.jl aims at having easy-to-understand top-level commands. For instance, suppose we wanted to solve the following systemf= beginbmatrix x^2+y y^2-1endbmatrix  First, we have to define f in Julia. For this purpose HomotopyContinuation.jl provides an interface to DynamicPolynomials.jl for human-readable input and output.import DynamicPolynomials: @polyvar # @polyvar is a function for initializing variables.\n\n@polyvar x y # initialize the variables x y\nf = [x^2+y, y^2-1]To solve  f=0 we execute the following command.using HomotopyContinuation # load the module HomotopyContinuation\n\nsolve(f) # solves for f=0The last command will return a type HomotopyContinuation.Result{Complex{Float64}} of length 4 (one entry for each solution):julia> ans\n\njulia> HomotopyContinuation.Result{Complex{Float64}}\n# paths → 4\n# successfull paths → 4\n# solutions at infinity → 0\n# singular solutions → 0\n# real solutions → 2\nHomotopyContinuation.PathResult{Complex{Float64}}[4]Let us see what is the information that we get. Four paths were attempted to be solved, four of which were completed successfully. Since we tried to solve an affine system, the algorithm checks whether there are solutions at infinity: in this case there are none. None of the solutions is singular and two of them are real. To access the first solution in the array we writejulia> ans[1]\n\njulia> HomotopyContinuation.PathResult{Complex{Float64}}\nreturncode → :success\nsolution → Complex{Float64}[2]\nsingular → false\nresidual → 1.02e-15…\nnewton_residual → 8.95e-16…\nlog10_condition_number → 0.133…\nwindingnumber → 1\nangle_to_infinity → 0.615…\nreal_solution → true\nstartvalue → Complex{Float64}[2]\niterations → 17\nendgame_iterations → 5\nnpredictions → 2The returncode tells us that the pathtracking was successfull. What do the entries of that table tell us? Let us consider the most relevant (for a complete list of explanations consider this section).solution: the zero that is computed (here it is -1-1).\nsingular: boolean that shows whether the zero is singular.\nresidual: the computed value of f(-1-1).\nangle_to_infinity: the algorithms homogenizes the system f and then computes all solutions in projective space. The angle to infinity is the angle of the solution to the hyperplane where the homogenizing coordinate is 0.\nreal_solution: boolean that shows whether the zero is real.Suppose we were only interested in the real solutions. The command to extract them issolutions(solve(f), success=true, at_infinity=true, only_real=true, singular=true)Indeed, we havejulia> [ans[i].solution for i=1:2]\njulia> Vector{Complex{Float64}}[2]\nComplex{Float64}[2]\n1.00… - 2.66e-15…im\n-1.00… + 1.33e-15…im\nComplex{Float64}[2]\n-1.00… + 2.72e-15…im\n-1.00… + 1.44e-15…imwhich are the two real zeros of f. By assigning the boolean values in the solutions function we can filter the solutions given by solve(f) according to our needs.We solve some more elaborate systems in the example section."
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
    "text": "Consider the projective variety in the 2-dimensional complex projective space CP^2.V = { x^2 + y^2 - z^2 = 0 }The degree of V is the number of intersection points of V with a generic line.   Let us see what it is. First we initialize the defining equation of V.import DynamicPolynomials: @polyvar\n\n@polyvar x y z\nf = x^2 + y^2 - z^2Let us sample the equation of a random line.L = randn(1,3) * [x; y; z]Now we compute the number of solutions to f=0 L=0.using HomotopyContinuation\nsolve([f; L])We find two distinct solutions and conclude that the degree of V is 2."
},

{
    "location": "examples.html#Using-different-types-of-homotopies-1",
    "page": "Examples",
    "title": "Using different types of homotopies",
    "category": "section",
    "text": "the following example is from section 7.3 of [The numerical solution of systems of polynomials, Sommese, Wampler].Consider a triangle with sides a,b,c and let θ be the angle opposite of c. The goal is to compute θ from a,b,c. We define sθ := sin θ and cθ := cos θ. The polynomial corresponding system is.import DynamicPolynomials: @polyvar\n\na = 5\nb = 4\nc = 3\n\n@polyvar sθ cθ\nf = [cθ^2 + sθ^2 - 1, (a * cθ - b)^2 + (a * sθ)^2 - c^2]To set up a totaldegree homotopy of type StraightLineHomotopy we have to writeusing HomotopyContinuation\nH, s = totaldegree(StraightLineHomotopy, f)This sets up a homotopy H of the specified type using a random starting system that comes with a vector s of solutions. To solve for f = 0 we executesolve(H, s)If instead we wanted to use GeodesicOnTheSphere as homotopy type, we writeH, s = totaldegree(GeodesicOnTheSphere, f)\nsolve(H, s)The angles are of course only the real solutions of f = 0. We get them by usingsolution(ans, only_real=true)"
},

{
    "location": "examples.html#Using-different-types-of-pathrackers-1",
    "page": "Examples",
    "title": "Using different types of pathrackers",
    "category": "section",
    "text": "The following polynomial system is what is called a binding polynomial in chemistry.import DynamicPolynomials: @polyvar\n\n@polyvar w1 w2 w3 w4 w5 w6\n\nf = [11*(2*w1+3*w3+5*w5)+13*(2*w2+3*w4+5*w6),\n    11*(6*w1*w3+10*w1*w5+15*w3*w5)+13*(6*w2*w4+10*w2*w6+15*w4*w6),\n    330*w1*w3*w5+390*w2*w4*w6,\n    143*(2*w1*w2+3*w3*w4+5*w5*w6),\n    143*(6*w1*w2*w3*w4+10*w1*w2*w5*w6+15*w3*w4*w5*w6),\n    4290*w1*w2*w3*w4*w5*w6]Suppose we wanted to solve f(w)=a, wherea=[71, 73, 79, 101, 103, 107]To get an initial solution we compute a random forward solution with FixedPolynomials.jl. We use Julia's convert function to convert f into the correct type. Then, we use the  evaluate command from FixedPolynomials.jl.const FP = FixedPolynomials\nw_0 = vec(randn(6,1))\na_0 = FP.evaluate(convert(Vector{FixedPolynomials.Polynomial{Float64}}, f), w_0)Now we set up the homotopy.H = StraightLineHomotopy(f-a_0, f-a)and compute a backward solution with starting value w_0 bysolve(H, w_0)By default the solve function uses SphericalPredictorCorrector as the pathtracking routing. To use the AffinePredictorCorrector instead we must writesolve(H, w_0, AffinePredictorCorrector())"
},

{
    "location": "examples.html#R-Serial-Link-Robots-1",
    "page": "Examples",
    "title": "6-R Serial-Link Robots",
    "category": "section",
    "text": "The following example is from section 9.4 of [The numerical solution of systems of polynomials, Sommese, Wampler].A robot that consists of 7 links connected by 6 joints. The first link is fixed on the ground. Let us denote by z_1z_6 the unit vectors that point in the direction of the joint axes.  They satisfy the following polynomial equationsz_i  z_i = 1\n\nz_i  z_i+1 = cos _i\n\na_1 * z_1  z_2 +  + a_5 * z_5  z_6 + a_6 * z_2 +  + a_9 * z_5 = pfor some (α,a,p) (see [The numerical solution of systems of polynomials, Sommese, Wampler] for a detailed explanation on how these numbers are to be interpreted).The forward problem consists of computing (α,a,p) given the z_i. The backward problem consists of computing  z_i that realize some fixed (α,a,p).We now compute first a forward solution (α_0, a_0, p_0), and then use (α_0, a_0, p_0) to compute a backward solution for the problem imposed by some random (α, a, p).using HomotopyContinuation\nimport DynamicPolynomials: @polyvar\n\n@polyvar z2[1:3] z3[1:3] z4[1:3] z5[1:3]\nz1 = [1, 0, 0]\nz6 = [1, 0, 0]\np = [1,1,0]\nz = [z1, z2, z3, z4, z5, z6]\n\nf = [z[i] ⋅ z[i] for i=2:5]\ng = [z[i] ⋅ z[i+1] for i=1:5]\nh = hcat([[z[i] × z[i+1] for i=1:5]; [z[i] for i=2:5]]...)\n\nα = randexp(5)\na = randexp(9)\np = randexp(3)Let us compute a random forward solution.z_0=rand(3,4); # Compute a random assignment for the variable z\nfor i = 1:4\n    z_0[:,i] = z_0[:,i]./ norm(z_0[:,i]) # normalize the columns of z_0 to norm 1\nendWe want to compute the angles g(z_0) with FixedPolynomials.jl. We use Julia's convert function to convert g into the correct type. Then, we use the  evaluate command from FixedPolynomials.jl.import FixedPolynomials: evaluate\nconst FP = FixedPolynomials\n\nz_0 = vec(z_0) # vectorize z_0, because the evaluate function takes vectors as input\n\n# compute the forward solution of α\nα_0 = FP.evaluate(convert(Vector{FixedPolynomials.Polynomial{Float64}}, g), z_0)\n\n# evaluate h at z_0\nh_0 = FP.evaluate(convert(Vector{FixedPolynomials.Polynomial{Float64}}, vec(h)), z_0)\n# compute a solution to h(z_0) * a = p\nh_0 = reshape(h_0,3,9)\na_0 = h_0\\pNow we have forward solutions _0 and a_0. From this we construct the following StraightLineHomotopy.H = StraightLineHomotopy([f-1; g-α_0; h*a_0-p], [f-1; g-α; h*a-p])To compute a backward solution with starting value z_0 we finally executesolve(H,z_0)"
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
    "text": "As an example we construct a homotopy between the polynomial systemsf= beginbmatrix x + y^3  x^2y-2yendbmatrixquad  \ng= beginbmatrixx^3+2 y^3+2endbmatrixCurrently, there are two types of homotopies implemented:StraightLineHomotopy\nGeodesicOnTheSphereThe code to initialize a StraightLineHomotopy is as follows.using HomotopyContinuation\nimport DynamicPolynomials: @polyvar # @polyvar is a function for initializing variables.\n@polyvar x y # initilize the variables x y\n\nf = [x + y^3, x^2*y-2y]\ng = [x^3+2, y^3+2]\n\nH = StraightLineHomotopy(f, g) # H is now StraightLineHomotopy{Int64}\n\n# to avoid unnecessary conversions one could also have\nH = StraightLineHomotopy{Complex128}([x + y^3, x^2*y-2y], [x^3+2, y^3+2])\n\n# we can now evaluate H\nevaluate(H, rand(Complex128, 2), 0.42)\n# or alternatively\nH(rand(Complex128, 2), 0.42)"
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
    "location": "pathtracker.html#HomotopyContinuation.Pathtracker",
    "page": "Pathtracking",
    "title": "HomotopyContinuation.Pathtracker",
    "category": "Type",
    "text": "Pathtracker(H::AbstractHomotopy{T}, alg, [HT::Type=widen(T)]; kwargs...)\n\nConstruct a Pathtracker object. This contains all informations to track a single path for H with the given pathtracking algorithm alg. The optional type HT is used if the pathracker decides to switch to a high precision mode.\n\nThe following keyword arguments are supported:\n\npath_precision=1e-6: The precision for which a correction step is decleared successfull.\ncorrector_maxiters=3: The maximal number of correction iterations. A higher value as 3 is not recommended.\ninitial_steplength=0.1: The initial steplength a preditor-corrector algorithm uses.\nconsecutive_successfull_steps_until_steplength_increase=3:   The number of consecutive successfull steps until the step length is increased multiplied   with the factor steplength_increase_factor.\nsteplength_increase_factor=2.0\nsteplength_decrease_factor=inv(steplength_increase_factor): If a correction step fails the step length is multiplied   with this factor.\nmaxiters=10_000: The maximum number of iterations.\nvebose=false: Print additional informations / warnings during the computation.\n\n\n\n"
},

{
    "location": "pathtracker.html#Pathtracking-routines-1",
    "page": "Pathtracking",
    "title": "Pathtracking routines",
    "category": "section",
    "text": "Pathtracking is at the core of each homotopy continuation method. It is the routine to track a given homotopy H(x t) from a start value x_1 at time t_1 to a target value x_0 at time t_0.At the heart of the pathtracking routine is the  mutable struct Pathtracker.Pathtracker"
},

{
    "location": "pathtracker.html#Examples-1",
    "page": "Pathtracking",
    "title": "Examples",
    "category": "section",
    "text": "The follwing example demonstrates the usual workflow. You first create a Pathtracker object, then you can track a path from a given start value and finally you create a PathtrackerResult.pathtracker = Pathtracker(H, SphericalPredictorCorrector())\ntrack!(pathtracker, x, 1.0, 0.0)\nresult = PathtrackerResult(pathtracker)You can reuse (and should!) resuse a Pathtracker for multiple pathspathtracker = Pathtracker(H, SphericalPredictorCorrector())\nresults = map(xs) do x\n  track!(pathtracker, x, 1.0, 0.0)\n  PathtrackerResult(pathtracker)\nendPathtracker also supports the iterator interface. This returns the complete Pathtracker object at each iteration. This enables all sort of nice features. For example you could store the actual path the pathtracker takes:pathtracker = Pathtracker(H, SphericalPredictorCorrector())\nsetup_pathtracker!(pathtracker, x, 1.0, 0.0)\npath = []\nfor t in pathtracker\n  push!(path, current_value(t))\nend"
},

{
    "location": "pathtracker.html#HomotopyContinuation.PathtrackerResult",
    "page": "Pathtracking",
    "title": "HomotopyContinuation.PathtrackerResult",
    "category": "Type",
    "text": "PathtrackerResult(pathtracker, extended_analysis=false)\n\nReads the result from the current pathtracker state. A PathtrackerResult contains:\n\nreturncode: One of :max_iterations, :singularity, :invalid_startvalue, :success.\nsolution::Vector{T}: The solution.\nresidual::Float64: The value of the infinity norm of H(solution, 0).\niterations: The number of iterations the pathtracker needed.\nangle_to_infinity: The angle to infinity is the angle of the solution to the hyperplane where the homogenizing coordinate is 0.\n\nIf extended_analysis=true there is also:\n\nnewton_residual: The value of the 2-norm of J_H(textsolution)^-1H(textsolution 0)\ncondition_number: A high condition number indicates singularty. See Homotopy.κ for details.\n\n\n\n"
},

{
    "location": "pathtracker.html#Result-1",
    "page": "Pathtracking",
    "title": "Result",
    "category": "section",
    "text": "PathtrackerResult"
},

{
    "location": "pathtracker.html#HomotopyContinuation.SphericalPredictorCorrector",
    "page": "Pathtracking",
    "title": "HomotopyContinuation.SphericalPredictorCorrector",
    "category": "Type",
    "text": "SphericalPredictorCorrector\n\nThis algorithm uses as an prediction step an explicit Euler method. For the prediction and correction step the Jacobian is augmented by Hermitian transposed x^* to get a square system. Therefore the prediciton step looks like\n\nx_k+1 = x_k - tbeginbmatrix\n    J_H(x t) \n    x^*\nendbmatrix^-1\nfracHt(x t)\n\nand the correction step looks like\n\nx_k+1 = x_k+1 - beginbmatrix\n    J_H(x t) \n    x^*\nendbmatrix^-1\nH(x t)\n\nAfter each prediciton and correction the algorithm normalizes x again, i.e. x is then a point on the sphere again.\n\nThis algorithm tracks the path in the projective space.\n\n\n\n"
},

{
    "location": "pathtracker.html#HomotopyContinuation.AffinePredictorCorrector",
    "page": "Pathtracking",
    "title": "HomotopyContinuation.AffinePredictorCorrector",
    "category": "Type",
    "text": "AffinePredictorCorrector\n\nThis algorithm uses as an prediction step an explicit Euler method. Therefore the prediciton step looks like\n\nx_k+1 = x_k - tJ_H(x t)^-1fracHt(x t)\n\nand the correction step looks like\n\nx_k+1 = x_k+1 - J_H(x t)^-1H(x t)\n\nThis algorithm tracks the path in the affine space.\n\n\n\n"
},

{
    "location": "pathtracker.html#Algorithms-1",
    "page": "Pathtracking",
    "title": "Algorithms",
    "category": "section",
    "text": "Currently, the following pathtracking routines are implementedSphericalPredictorCorrector\nAffinePredictorCorrector"
},

{
    "location": "pathtracker.html#HomotopyContinuation.track!",
    "page": "Pathtracking",
    "title": "HomotopyContinuation.track!",
    "category": "Function",
    "text": "track!(pathtracker, x0, s_start, s_target)\n\nTrack a startvalue x0 from s_start to s_target using the given pathtracker.\n\ntrack!(pathtracker)\n\nRun the given pathtracker. You can use this in combination with setup_pathtracker!.\n\n\n\n"
},

{
    "location": "pathtracker.html#HomotopyContinuation.setup_pathtracker!",
    "page": "Pathtracking",
    "title": "HomotopyContinuation.setup_pathtracker!",
    "category": "Function",
    "text": "setup_pathtracker!(tracker, x0, s_start, s_end)\n\nReset the given pathtracker tracker and set it up to track x0 form s_start to s_end.\n\n\n\n"
},

{
    "location": "pathtracker.html#HomotopyContinuation.current_value",
    "page": "Pathtracking",
    "title": "HomotopyContinuation.current_value",
    "category": "Function",
    "text": "current_value(pathtracker)\n\nGet the current value of the pathtracker.\n\n\n\n"
},

{
    "location": "pathtracker.html#Reference-1",
    "page": "Pathtracking",
    "title": "Reference",
    "category": "section",
    "text": "track!\nsetup_pathtracker!\ncurrent_value"
},

{
    "location": "endgame.html#",
    "page": "Endgame",
    "title": "Endgame",
    "category": "page",
    "text": ""
},

{
    "location": "endgame.html#HomotopyContinuation.Endgamer",
    "page": "Endgame",
    "title": "HomotopyContinuation.Endgamer",
    "category": "Type",
    "text": "Endgamer(endgame_algorithm, pathtracker, [x, R]; kwargs...)\n\nConstruct an Endgamer object. The Endgamer 'plays' the endgame with the given endgame_algorithm and uses the given pathtracker to move forward. The endgame is start at x to time R (the endgame radius). In each iteration the endgame moves forward and then performs one iteration of the endgame algorithm. In each iteration we could get another prediction and an estimate of the winding number. Convergence is declared if two consecutive predictions are smaller than a defined tolerance (endgame_abstol).\n\nThe following options are available:\n\ngeometric_series_factor=0.5: The Endgamer moves forward using the geometric series   ^kR where  is geometric_series_factor.\nmax_winding_number=16 the maximal winding number we allow. If we get a higher winding number\n\nthe path is declared failed.\n\nendgame_abstol=pathtracker.options.abstol: The tolerance necessary to declare convergence.\n\nEndgamer supports similar to Pathtracker an iterator interface.\n\n\n\n"
},

{
    "location": "endgame.html#Endgame-1",
    "page": "Endgame",
    "title": "Endgame",
    "category": "section",
    "text": "Assume we want to find the all solutions of the polynomial (x-2)^4 with homotopy continuation. Then the pathtracker gets into severe trouble near the end of the path since the derivative is 0 at x=2.How do we solve that problem? The idea is to split the pathtracking into two parts. We first track the path x(t) until the so called endgame zone (starting by default at t=01). Then we switch to the endgame. The idea is to estimate the value of x(0.0) without tracking the path all the way to t=00(since this would fail due to a singular Jacobian).There are two well known endgame strategies. The Power Series Endgame and the Cauchy Endgame. Currently only the Cauchy Endgame is implemented.At the heart of the endgame routine is the  mutable struct Endgamer.Endgamer"
},

{
    "location": "endgame.html#Examples-1",
    "page": "Endgame",
    "title": "Examples",
    "category": "section",
    "text": "The follwing example demonstrates the usual workflow. You first create an Endgamer object, then you can track a path from a given start value and finally you create a EndgamerResult.endgamer = Endgamer(CauchyEndgame(), pathtracker)\nendgamer!(endgamer, x, 0.1)\nresult = EndgamerResult(endgamer)You can reuse (and should!) resuse an Endgamer for multiple pathsendgamer = Endgamer(CauchyEndgame(), pathtracker))\nresults = map(xs) do x\n  endgame!(endgamer, x, 0.1)\n  EndgamerResult(endgamer)\nend"
},

{
    "location": "endgame.html#HomotopyContinuation.CauchyEndgame",
    "page": "Endgame",
    "title": "HomotopyContinuation.CauchyEndgame",
    "category": "Type",
    "text": "CauchyEndgame(;kwargs...)\n\nThe main idea of the Cauchy Endgame is to use Cauchy's integral formula to predict the solution of the path x(t), i.e. x(0). At each iteration we are at some point (x t). We then track the polygon defined by te^i2kn until we end again at x. Here n is the number of samples we take per loop.\n\nThe following options are available:\n\nsamples_per_loop=8: The number of samples we take at one loop.\nloopclosed_tolerance=1e-5: The tolerance when a loop is considered closed.\nL=0.75 and K=05: These are paramters for heuristics. For more details see \"A Parallel Endgame \" by Bates, Hauenstein and Sommese [1],   page 8 and 9.\n\n[1]: Bates, Daniel J., Jonathan D. Hauenstein, and Andrew J. Sommese. \"A Parallel Endgame.\" Contemp. Math 556 (2011): 25-35.\n\n\n\n"
},

{
    "location": "endgame.html#Algorithms-1",
    "page": "Endgame",
    "title": "Algorithms",
    "category": "section",
    "text": "CauchyEndgame"
},

{
    "location": "endgame.html#HomotopyContinuation.endgame!",
    "page": "Endgame",
    "title": "HomotopyContinuation.endgame!",
    "category": "Function",
    "text": "endgame!(endgamer, x, R)\n\nPlay the endgame for x starting from time R.\n\nendgame!(endgamer)\n\nStart the endgamer. You probably want to setup things in prior with setup_endgamer!.\n\n\n\n"
},

{
    "location": "endgame.html#HomotopyContinuation.setup_endgamer!",
    "page": "Endgame",
    "title": "HomotopyContinuation.setup_endgamer!",
    "category": "Function",
    "text": "setup_endgamer!(endgamer, x, R)\n\nSetup endgamer to play the endgame starting from x at time R.\n\n\n\n"
},

{
    "location": "endgame.html#Reference-1",
    "page": "Endgame",
    "title": "Reference",
    "category": "section",
    "text": "endgame!\nsetup_endgamer!"
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
    "text": "We shall illustrate how to set up your own homotopy by work out the following example.For a polynomial systems fg we want to define the homotopyH(xt) = t * f( U(t) x ) + (1 - t) * g( U(t) x )where U(t) is a random path in the space of unitary matrices with U(0) = U(1) = I, the identity matrix. I.e.,U(t) = U beginbmatrix\ncos(2 t)  -sin(2 t)  0 cdots  0\nsin(2 t)  cos(2 t)  0 cdots  0\n0  0  1 cdots  0\n0  0  0 cdots  0\n0  0  0 cdots  1\nendbmatrix U^Twith a random unitary matrix U.To start we make a copy of the file straigthline.jl (or of any other appropriate file like geodesic_on_the_sphere.jl) and rename it rotation_and_straightline.jl. Now we have to do two things:Adapt the struct and its constructors.\nAdapt the evaluation functions.\nInclude rotation_and_straightline.jl in Homotopy.jl."
},

{
    "location": "set_up_homotopy.html#Adapt-the-struct-and-its-constructors-1",
    "page": "How to set up your own homotopy",
    "title": "Adapt the struct and its constructors",
    "category": "section",
    "text": "We now assume that the file we copied is straigthline.jl. It is convenient to make a search-and-replace on StraightLineHomotopy and replace it by RotationAndStraightLine. In the code we use the abbreviation SLH{T} for StraightLineHomotopy{T}. So we also search-and-replace SLH{T} by RSL{T}.First we adapt the contructor. Note that in the initialization of the struct we sample a random matrix and extract a unitary matrix U from its QR-decomposition. From this we define the function U(t) and save it together with its derivative in the struct.\nmutable struct RotationAndStraightLine{T<:Number} <: AbstractPolynomialHomotopy{T}\n    start::Vector{FP.Polynomial{T}}\n    target::Vector{FP.Polynomial{T}}\n    U::Function\n    U_dot::Function\n\n    function RotationAndStraightLine{T}(start::Vector{FP.Polynomial{T}}, target::Vector{FP.Polynomial{T}}) where {T<:Number}\n        @assert length(start) == length(target) \"Expected the same number of polynomials, but got $(length(start)) and $(length(target))\"\n\n\n        s_nvars = maximum(FP.nvariables.(start))\n        @assert all(s_nvars .== FP.nvariables.(start)) \"Not all polynomials of the start system have $(s_nvars) variables.\"\n\n        t_nvars = maximum(FP.nvariables.(target))\n        @assert all(t_nvars .== FP.nvariables.(target)) \"Not all polynomials of the target system have $(t_nvars) variables.\"\n\n        @assert s_nvars == t_nvars \"Expected start and target system to have the same number of variables, but got $(s_nvars) and $(t_nvars).\"\n\n        U = qrfact(randn(s_nvars,s_nvars) + im * randn(s_nvars,s_nvars))[:Q]\n\n        function U_fct(t)\n                (cos(2 * pi * t) - 1) .* U[:,1] * U[:,1]' - sin(2 * pi * t) .* U[:,2] * U[:,1]' + sin(2 * pi * t) .* U[:,1] * U[:,2]' + (cos(2 * pi * t) - 1) .* U[:,2] * U[:,2]' + eye(U)\n        end\n\n        function U_dot(t)\n                2 * pi .* (-sin(2 * pi * t) .* U[:,1] * U[:,1]' - cos(2 * pi * t) .* U[:,2] * U[:,1]' + cos(2 * pi * t) .* U[:,1] * U[:,2]' - sin(2 * pi * t) .* U[:,2] * U[:,2]')\n        end\n\n        new(start, target, U_fct, U_dot)\n    end\n\n    function RotationAndStraightLine{T}(start, target) where {T<:Number}\n        s, t = construct(T, start, target)\n        RotationAndStraightLine{T}(s, t)\n    end\nend\n\n\nfunction RotationAndStraightLine(start, target)\n    T, s, t = construct(start, target)\n    RotationAndStraightLine{T}(s, t)\nendThe conversion functions are adapted easily with copy-and-paste.#\n# SHOW\n#\nfunction Base.deepcopy(H::RSL)\n    RotationAndStraightLine(deepcopy(H.start), deepcopy(H.target))\nend\n#\n# PROMOTION AND CONVERSION\n#ß\nBase.promote_rule(::Type{RSL{T}}, ::Type{RSL{S}}) where {S<:Number,T<:Number} = RSL{promote_type(T,S)}\nBase.promote_rule(::Type{RSL}, ::Type{S}) where {S<:Number} = RSL{S}\nBase.promote_rule(::Type{RSL{T}}, ::Type{S}) where {S<:Number,T<:Number} = RSL{promote_type(T,S)}\nBase.convert(::Type{RSL{T}}, H::RSL) where {T} = RotationAndStraightLine{T}(H.start, H.target)"
},

{
    "location": "set_up_homotopy.html#Adapt-the-evaluation-functions.-1",
    "page": "How to set up your own homotopy",
    "title": "Adapt the evaluation functions.",
    "category": "section",
    "text": "The essential part of the homotopy struct are the evaluation functions. Here is where we define the orthogonal rotation.The function to be edited are evaluate, jacobian, dt and weylnorm. For fast evaluation there is a function evaluate_start_target that evaluates start and target system efficiently.The function that evaluates the homotopy at x at time t is#\n# EVALUATION + DIFFERENTATION\n#\nfunction evaluate!(u::AbstractVector, H::RSL{T}, x::Vector, t::Number) where T\n    y = H.U(t) * x\n    for i = 1:length(H.target)\n        f = H.target[i]\n        g = H.start[i]\n        u[i] = (one(T) - t) * FP.evaluate(f, y) + t * FP.evaluate(g, y)\n    end\n    u\nend\n(H::RSL)(x,t) = evaluate(H,x,t)\n\nfunction evaluate!(u::AbstractVector{T}, H::RSL, x::Vector, t::Number, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}\n    y = H.U(t) * x\n    evaluate_start_target!(cfg, H, y, precomputed)\n    u .= (one(t) - t) .* value_target(cfg) .+ t .* value_start(cfg)\nendThe derivative of the homotopy with respect to x isfunction jacobian!(u::AbstractMatrix, H::RSL{T}, x::AbstractVector, t, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}\n    U = H.U(t)\n    y = U * x\n    jacobian_start_target!(cfg, H, y, precomputed)\n    u .= ((one(t) - t) .* jacobian_target(cfg) .+ t .* jacobian_start(cfg)) * U\nend\n\nfunction jacobian!(r::JacobianDiffResult, H::RSL{T}, x::AbstractVector, t, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}\n    U = H.U(t)\n    y = U * x\n    evaluate_and_jacobian_start_target!(cfg, H, y)\n\n    r.value .= (one(t) - t) .* value_target(cfg) .+ t .* value_start(cfg)\n    r.jacobian .= ((one(t) - t) .* jacobian_target(cfg) .+ t .* jacobian_start(cfg)) * U\n    r\nendThe derivative of the homotopy with respect to t isfunction dt!(u, H::RSL{T}, x::AbstractVector, t, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}\n    y = H.U(t) * x\n    evaluate_and_jacobian_start_target!(cfg, H, y)\n\n    u .= value_start(cfg) .- value_target(cfg) .+ ((one(t) - t) .* jacobian_target(cfg) .+ t .* jacobian_start(cfg)) * H.U_dot(t) * x\nend\n\nfunction dt!(r::DtDiffResult, H::RSL{T}, x::AbstractVector, t, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}\n    y = H.U(t) * x\n    evaluate_and_jacobian_start_target!(cfg, H, y)\n    r.value .= (one(T) - t) .* value_target(cfg) .+ t .* value_start(cfg)\n    r.dt .= value_start(cfg) .- value_target(cfg) .+ ((one(t) - t) .* jacobian_target(cfg) .+ t .* jacobian_start(cfg)) * H.U_dot(t) * x\n    r\nendFinally, we adapt the function to compute the Weylnorm. Note that precomposing with unitary matrices preserves the Weyl inner product.function weylnorm(H::RSL{T})  where {T<:Number}\n    f = FP.homogenize.(H.start)\n    g = FP.homogenize.(H.target)\n    λ_1 = FP.weyldot(f,f)\n    λ_2 = FP.weyldot(f,g)\n    λ_3 = FP.weyldot(g,g)\n\n    function (t)\n        sqrt(abs2(one(T) - t) * λ_1 + 2 * real((one(T) - t) * conj(t) * λ_2) + abs2(t) * λ_3)\n    end\nend"
},

{
    "location": "set_up_homotopy.html#Include-rotation_and_straightline.jl-in-Homotopy.jl.-1",
    "page": "How to set up your own homotopy",
    "title": "Include rotation_and_straightline.jl in Homotopy.jl.",
    "category": "section",
    "text": "To enable julia to recognize our new homotopy, we have to include the following line in the Homotopy.jl fileinclude(\"homotopies/rotation_and_straightline.jl\")Now we are ready to use RotationAndStraightLine as homotopy type:import DynamicPolynomials: @polyvar\nusing HomotopyContinuation\n\n@polyvar x y\n\nf = [x^2 - x*y]\nH = RotationAndStraightLine(f,f)\n\nsolve(H,[0.0, 1.0 + im * 0.0])gives another solution of f. The technique of making loops in the space of polynomials to track zeros to other zeros is called monodromy.."
},

{
    "location": "set_up_homotopy.html#The-complete-code-1",
    "page": "How to set up your own homotopy",
    "title": "The complete code",
    "category": "section",
    "text": "After having completed all of the above tasks, we have the following rotation_and_straightline.jl file:export RotationAndStraightLine\n\n\"\"\"\n    RotationAndStraightLine(start, target)\n\nConstruct the homotopy `t * start( U(t) x ) + (1-t) * target( U(t) x)`,\n\nwhere `U(t)` is a path in the space of orthogonal matrices with `U(0)=U(1)=I`, the identity matrix.\n\n`start` and `target` have to match and to be one of the following\n* `Vector{<:MP.AbstractPolynomial}` where `MP` is [`MultivariatePolynomials`](https://github.com/blegat/MultivariatePolynomials.jl)\n* `MP.AbstractPolynomial`\n* `Vector{<:FP.Polynomial}` where `FP` is [`FixedPolynomials`](https://github.com/saschatimme/FixedPolynomials.jl)\n\n\n    RotationAndStraightLine{T}(start, target)\n\nYou can also force a specific coefficient type `T`.\n\"\"\"\nmutable struct RotationAndStraightLine{T<:Number} <: AbstractPolynomialHomotopy{T}\n    start::Vector{FP.Polynomial{T}}\n    target::Vector{FP.Polynomial{T}}\n    U::Function\n    U_dot::Function\n\n    function RotationAndStraightLine{T}(start::Vector{FP.Polynomial{T}}, target::Vector{FP.Polynomial{T}}) where {T<:Number}\n        @assert length(start) == length(target) \"Expected the same number of polynomials, but got $(length(start)) and $(length(target))\"\n\n\n        s_nvars = maximum(FP.nvariables.(start))\n        @assert all(s_nvars .== FP.nvariables.(start)) \"Not all polynomials of the start system have $(s_nvars) variables.\"\n\n        t_nvars = maximum(FP.nvariables.(target))\n        @assert all(t_nvars .== FP.nvariables.(target)) \"Not all polynomials of the target system have $(t_nvars) variables.\"\n\n        @assert s_nvars == t_nvars \"Expected start and target system to have the same number of variables, but got $(s_nvars) and $(t_nvars).\"\n\n        U = qrfact(randn(s_nvars,s_nvars) + im * randn(s_nvars,s_nvars))[:Q]\n\n        function U_fct(t)\n                (cos(2 * pi * t) - 1) .* U[:,1] * U[:,1]' - sin(2 * pi * t) .* U[:,2] * U[:,1]' + sin(2 * pi * t) .* U[:,1] * U[:,2]' + (cos(2 * pi * t) - 1) .* U[:,2] * U[:,2]' + eye(U)\n        end\n\n        function U_dot(t)\n                2 * pi .* (-sin(2 * pi * t) .* U[:,1] * U[:,1]' - cos(2 * pi * t) .* U[:,2] * U[:,1]' + cos(2 * pi * t) .* U[:,1] * U[:,2]' - sin(2 * pi * t) .* U[:,2] * U[:,2]')\n        end\n\n        new(start, target, U_fct, U_dot)\n    end\n\n    function RotationAndStraightLine{T}(start, target) where {T<:Number}\n        s, t = construct(T, start, target)\n        RotationAndStraightLine{T}(s, t)\n    end\nend\n\n\nfunction RotationAndStraightLine(start, target)\n    T, s, t = construct(start, target)\n    RotationAndStraightLine{T}(s, t)\nend\n\n\nconst RSL{T} = RotationAndStraightLine{T}\n\n#\n# SHOW\n#\nfunction Base.deepcopy(H::RSL)\n    RotationAndStraightLine(deepcopy(H.start), deepcopy(H.target))\nend\n\n#\n# PROMOTION AND CONVERSION\n#ß\nBase.promote_rule(::Type{RSL{T}}, ::Type{RSL{S}}) where {S<:Number,T<:Number} = RSL{promote_type(T,S)}\nBase.promote_rule(::Type{RSL}, ::Type{S}) where {S<:Number} = RSL{S}\nBase.promote_rule(::Type{RSL{T}}, ::Type{S}) where {S<:Number,T<:Number} = RSL{promote_type(T,S)}\nBase.convert(::Type{RSL{T}}, H::RSL) where {T} = RotationAndStraightLine{T}(H.start, H.target)\n\n\n#\n# EVALUATION + DIFFERENTATION\n#\nfunction evaluate!(u::AbstractVector, H::RSL{T}, x::Vector, t::Number) where T\n    y = H.U(t) * x\n    for i = 1:length(H.target)\n        f = H.target[i]\n        g = H.start[i]\n        u[i] = (one(T) - t) * FP.evaluate(f, y) + t * FP.evaluate(g, y)\n    end\n    u\nend\n(H::RSL)(x,t) = evaluate(H,x,t)\n\n\nfunction evaluate!(u::AbstractVector{T}, H::RSL, x::Vector, t::Number, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}\n    y = H.U(t) * x\n    evaluate_start_target!(cfg, H, y, precomputed)\n    u .= (one(t) - t) .* value_target(cfg) .+ t .* value_start(cfg)\nend\n\nfunction jacobian!(u::AbstractMatrix, H::RSL{T}, x::AbstractVector, t, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}\n    U = H.U(t)\n    y = U * x\n    jacobian_start_target!(cfg, H, y, precomputed)\n    u .= ((one(t) - t) .* jacobian_target(cfg) .+ t .* jacobian_start(cfg)) * U\nend\n\nfunction jacobian!(r::JacobianDiffResult, H::RSL{T}, x::AbstractVector, t, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}\n    U = H.U(t)\n    y = U * x\n    evaluate_and_jacobian_start_target!(cfg, H, y)\n\n    r.value .= (one(t) - t) .* value_target(cfg) .+ t .* value_start(cfg)\n    r.jacobian .= ((one(t) - t) .* jacobian_target(cfg) .+ t .* jacobian_start(cfg)) * U\n    r\nend\n\nfunction dt!(u, H::RSL{T}, x::AbstractVector, t, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}\n    y = H.U(t) * x\n    evaluate_and_jacobian_start_target!(cfg, H, y)\n\n    u .= value_start(cfg) .- value_target(cfg) .+ ((one(t) - t) .* jacobian_target(cfg) .+ t .* jacobian_start(cfg)) * H.U_dot(t) * x\nend\n\nfunction dt!(r::DtDiffResult, H::RSL{T}, x::AbstractVector, t, cfg::PolynomialHomotopyConfig, precomputed=false) where {T<:Number}\n    y = H.U(t) * x\n    evaluate_and_jacobian_start_target!(cfg, H, y)\n    r.value .= (one(T) - t) .* value_target(cfg) .+ t .* value_start(cfg)\n    r.dt .= value_start(cfg) .- value_target(cfg) .+ ((one(t) - t) .* jacobian_target(cfg) .+ t .* jacobian_start(cfg)) * H.U_dot(t) * x\n    r\nend\n\nfunction weylnorm(H::RSL{T})  where {T<:Number}\n    f = FP.homogenize.(H.start)\n    g = FP.homogenize.(H.target)\n    λ_1 = FP.weyldot(f,f)\n    λ_2 = FP.weyldot(f,g)\n    λ_3 = FP.weyldot(g,g)\n\n    function (t)\n        sqrt(abs2(one(T) - t) * λ_1 + 2 * real((one(T) - t) * conj(t) * λ_2) + abs2(t) * λ_3)\n    end\nend"
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
