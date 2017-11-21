using Documenter, HomotopyContinuation

makedocs(format   = :html,
         sitename = "Julia Homotopy Continuation",
         pages    = ["Introduction"=>"index.md",
                  "Examples"=>"examples.md",
                  "Setting up homotopies with Homotopy.jl"=>"Homotopy.md",
                  "Solving homotopies"=>"solve.md",
                  "Pathtracking"=>"pathtracker.md",
                  "Endgame"=>"endgame.md",
                  "How to set up your own homotopy"=>"set_up_homotopy.md",
                  "How to set up your own pathtracking algorithm"=>"set_up_pathtracker.md",
                     ],
         html_edit_branch = "source")

deploydocs(repo    = "github.com/JuliaHomotopyContinuation/juliahomotopycontinuation.github.io.git",
           target  = "build",
           branch  = "master",
           latest  = "source",
           julia   = "0.6",
           osname  = "linux",
           deps    = nothing,
           make    = nothing)
