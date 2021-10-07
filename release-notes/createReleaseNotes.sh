branch=`git rev-parse --abbrev-ref HEAD`
file=release-notes/unreleased/$branch.yml
echo $branch
touch $file
echo issue_key: `expr $branch : '^\(LUN-[0-9]*\)'` >> $file
out="show_in_stores: true\nplatforms:\n  - android\n  - ios\nde: $1"
echo -e "$out" >> $file
