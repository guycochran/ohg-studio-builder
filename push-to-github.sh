#!/bin/bash
cd /home/guycochran/oh/studiobuilder
echo "Adding GitHub remote..."
git remote add origin git@github.com:guycochran/ohg-studio-builder.git
echo "Setting main branch..."
git branch -M main
echo "Pushing to GitHub..."
git push -u origin main
echo ""
echo "✅ SUCCESS! Your code is now at:"
echo "   https://github.com/guycochran/ohg-studio-builder"
echo ""
echo "Next step: Deploy to Coolify"
echo "   https://coolify.cochran.cloud"
