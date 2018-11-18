repo_path = pwd()
travis_tag = get(ENV, "TRAVIS_TAG", "")

if !isempty(travis_tag)
    ver = VersionNumber(travis_tag)
    version = "$(ver.major).$(ver.minor)"
else
    version = "dev"
end

cd()
run(`git clone --branch=master https://$(ENV["GITHUB_TOKEN"])@github.com/$(ENV["TRAVIS_REPO_SLUG"]).git publish`)

cd("publish")
# Update pages
# delete old stuff
if version == "dev"
    # dev version
    run(`rm -rf dev`)
    run(`cp -r $repo_path/public/dev dev`)
else
    # tag and latest
    run(`rm -rf $version`)
    run(`cp -r $repo_path/public/$version $version`)

    run(`rm -rf latest`)
    run(`cp -r $repo_path/public/latest/. .`)
end

# Commit and push latest version
run(`git add .`)
run(`git config user.name  "Travis"`)
run(`git config user.email "travis@travis-ci.org"`)
run(`git commit -m "Deploy update."`)
run(`git push origin master`)
