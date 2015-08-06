#!/usr/bin/env bash

# Update list of contributers
tail -n +3 AUTHORS > AUTHORS.tmp
git log --format='%aN' >> AUTHORS.tmp
echo -e "List of Visual Markdown Editor contributors. Updated before every release.\n" > AUTHORS
sort --ignore-case --unique AUTHORS.tmp >> AUTHORS
rm -f AUTHORS.tmp
