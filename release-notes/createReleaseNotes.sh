branch=`git rev-parse --abbrev-ref HEAD`
file=release-notes/unreleased/$branch.yml
echo $branch
prefix=${branch:0:7}
touch $file
echo issue_key: $prefix >> $file
out="show_in_stores: true\nplatforms:\n  - android\n  - ios\nde: $1"
echo -e "$out" >> $file
