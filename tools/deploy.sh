#!/bin/zsh
# Assets rechnen, committen, site/ als gh-pages pushen
cd "${0:A:h}/.."
tools/assets.sh >/dev/null
git add -A && git commit -qm "${1:-Update}

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" ; git push -q origin main
git branch -D gh-pages -q 2>/dev/null; git subtree split --prefix site -b gh-pages -q >/dev/null && git push -q -f origin gh-pages && echo deployed
