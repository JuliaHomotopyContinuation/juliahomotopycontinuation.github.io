repo_path = pwd()

travis_tag = get(ENV, "TRAVIS_TAG", "")
if !isempty(travis_tag)
    ver = VersionNumber(travis_tag)
    version = "$(ver.major).$(ver.minor)"
else
    version = "dev"
end
println("BUILD_VERSION: $version")
run(`hugo --destination public/$version --baseURL /$version`)

if version != "dev"
    run(`hugo --destination public/latest --baseURL /`)
end
