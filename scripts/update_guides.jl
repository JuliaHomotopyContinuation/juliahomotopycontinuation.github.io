using HomotopyContinuation, Pkg

const repo_path = pwd()
# const HC_VERSION = "0.4"

# switch to HomotopyContinuation folder (assumes it is `dev`ed)
cd(joinpath(Pkg.devdir(), "HomotopyContinuation"))
# build markdown files form guides
run(`julia guides/make_markdown.jl`)
# Copy each guide to the current HC_VERSION subfolder
for f in readdir("guides/build")
    if endswith(f, ".md")
        # mkpath("$repo_path/guides/$HC_VERSION")
        # rm("$repo_path/guides/$HC_VERSION/$f", force=true)
        # cp(joinpath("guides", "build", f), "$repo_path/guides/$HC_VERSION/$f")
        rm("$repo_path/guides/$f", force=true)
        cp(joinpath("guides", "build", f), "$repo_path/guides/$f")
    end
end
