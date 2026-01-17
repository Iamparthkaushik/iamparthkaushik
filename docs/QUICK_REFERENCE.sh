#!/bin/bash
# Quick Reference Commands for Crazy Awesome Portfolio

# =============================================================================
# SETUP & INSTALLATION
# =============================================================================

# Install dependencies
npm install

# Install specific packages individually
npm install framer-motion
npm install three
npm install @react-three/fiber
npm install @react-three/drei
npm install axios
npm install canvas-confetti


# =============================================================================
# DEVELOPMENT
# =============================================================================

# Start development server (RECOMMENDED FOR TESTING)
npm run dev
# Runs on: http://localhost:3000

# Run in background (Windows PowerShell)
Start-Process "npm run dev"

# Stop development server
# Press Ctrl+C in terminal

# Check for errors
npm run lint


# =============================================================================
# PRODUCTION
# =============================================================================

# Build for production
npm run build

# Start production server
npm start

# Build and start together
npm run build && npm start


# =============================================================================
# TESTING & DEBUGGING
# =============================================================================

# Open in VS Code
code .

# Open DevTools in browser
# Press F12 in browser

# Performance profiling
# 1. Open DevTools (F12)
# 2. Go to Performance tab
# 3. Click Record
# 4. Interact with page
# 5. Stop recording

# Check TypeScript errors
npx tsc --noEmit

# Format code
npx prettier --write .

# Check bundle size
npm run build -- --analyze


# =============================================================================
# WEBSITE URLS
# =============================================================================

# Local development
http://localhost:3000

# Sections
http://localhost:3000#hero           # Hero section
http://localhost:3000#experiences   # Features
http://localhost:3000#3d            # 3D experience
http://localhost:3000#physics       # Physics simulator
http://localhost:3000#games         # Snake game
http://localhost:3000#games-2       # Flappy bird
http://localhost:3000#apis          # API integration


# =============================================================================
# GIT COMMANDS (if using version control)
# =============================================================================

git init
git add .
git commit -m "Initial crazy awesome portfolio"
git push origin main


# =============================================================================
# DEPLOYMENT
# =============================================================================

# Deploy to Vercel (recommended)
npm i -g vercel
vercel

# Deploy to Netlify
npm i -g netlify-cli
netlify deploy --prod

# Deploy with Docker
docker build -t portfolio .
docker run -p 3000:3000 portfolio


# =============================================================================
# TROUBLESHOOTING
# =============================================================================

# Clear Next.js cache
rm -r .next

# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install

# Reset everything
npm run clean  # (if available)
rm -r node_modules .next
npm install

# Check port 3000 is available
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process on port 3000
kill -9 $(lsof -t -i:3000)  # macOS/Linux
taskkill /F /PID <PID>      # Windows


# =============================================================================
# FILE LOCATIONS
# =============================================================================

Components:        d:\CODE\projects\Node\iamparthkaushik\app\components\
Styles:            d:\CODE\projects\Node\iamparthkaushik\app\globals.css
Main page:         d:\CODE\projects\Node\iamparthkaushik\app\page.tsx
Config:            d:\CODE\projects\Node\iamparthkaushik\next.config.ts
Dependencies:      d:\CODE\projects\Node\iamparthkaushik\package.json
Documentation:     d:\CODE\projects\Node\iamparthkaushik\*.md


# =============================================================================
# COMPONENT FILES
# =============================================================================

HeroSection.tsx          - Main landing page with animations
CursorFollower.tsx       - Particle-following cursor effects
Scene3D.tsx              - 3D cube with orbiting spheres
PhysicsSimulator.tsx     - Gravity and collision simulator
SnakeGame.tsx            - Classic snake arcade game
FlappyBirdGame.tsx       - Flappy bird style game
APIIntegration.tsx       - Quotes and facts from APIs
ParallaxSection.tsx      - Feature showcase with animations
Footer.tsx               - Footer with social links


# =============================================================================
# PACKAGE SCRIPTS
# =============================================================================

npm run dev      - Start development server (port 3000)
npm run build    - Build for production
npm start        - Start production server
npm run lint     - Run ESLint checks


# =============================================================================
# ENVIRONMENT VARIABLES (if needed)
# =============================================================================

# Create .env.local file with:
NEXT_PUBLIC_API_URL=http://localhost:3000

# Or for production:
NEXT_PUBLIC_API_URL=https://yourdomain.com


# =============================================================================
# USEFUL BROWSER SHORTCUTS
# =============================================================================

F12                    - Open DevTools
Ctrl+Shift+M          - Toggle device emulation
Ctrl+Shift+C          - Inspect element
Ctrl+K                - Search in DevTools
Ctrl+Alt+J            - Open JS Console
Ctrl+Alt+I            - Open Inspector


# =============================================================================
# QUICK TESTING TIPS
# =============================================================================

# Test desktop
1. Open http://localhost:3000
2. Check animations with F12 Performance tab
3. Test all game controls
4. Verify API calls in Network tab

# Test mobile
1. Open DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Select iPhone 12 or similar
4. Rotate to landscape
5. Test touch controls

# Test games
1. Snake: Use arrow keys + Start
2. Flappy: Click or Space to flap
3. Physics: Click to add objects

# Test APIs
1. Check Network tab in DevTools
2. Look for quotes.quotable.io and uselessfacts.jsph.pl
3. Verify response in Response tab


# =============================================================================
# NOTES
# =============================================================================

# The website is completely self-contained
# No database needed
# All APIs are public (free tier)
# Runs on any Node.js 16+ environment
# TypeScript for type safety
# Tailwind CSS for styling
# Framer Motion for animations
# Three.js for 3D graphics

# Good luck, and enjoy your crazy awesome portfolio! 🚀
