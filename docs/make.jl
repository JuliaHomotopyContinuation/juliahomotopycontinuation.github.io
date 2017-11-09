using Documenter, HomotopyContinuation

makedocs(format   = :html,
         sitename = "Julia Homotopy Continuation",
         pages    = ["Home"=>"index.md",
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
