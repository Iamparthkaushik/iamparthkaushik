# 🚀 Crazy Awesome Portfolio Website

An interactive, animated portfolio website built with Next.js, React, Framer Motion, Three.js, and featuring games, physics simulators, API integrations, and mind-bending visual effects.

## ✨ Features

### 🎯 Interactive Sections

1. **Hero Section** - Animated text with gradient effects and floating geometric shapes
2. **3D Experience** - Interactive 3D cube with orbiting spheres using Three.js and React Three Fiber
3. **Physics Simulator** - Click-based gravity simulation with colliding objects and particle effects
4. **Snake Game** - Classic snake game with smooth animations and glowing effects
5. **Flappy Bird Game** - Flappy bird variant with canvas-based rendering
6. **API Integration Hub** - Real quotes and facts fetched from external APIs
7. **Cursor Follower** - Particle-following cursor with smooth trails
8. **Parallax Sections** - Smooth scrolling with animated feature cards

### 💎 Technologies Used

- **Framework**: Next.js 16.1.1
- **UI Library**: React 19.2.3
- **Animations**: Framer Motion
- **3D Graphics**: Three.js + React Three Fiber
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Canvas**: HTML5 Canvas for games and simulations

### 🎮 Games & Simulators

#### Snake Game
- Use arrow keys or WASD to move
- Eat food to grow and gain points
- Pause/Resume and Reset functionality

#### Flappy Bird
- Click or press Space to flap
- Avoid pipes and gravity
- Score increases when passing pipes

#### Physics Simulator
- Click anywhere to add physics objects
- Watch gravity and collisions in action
- Pause/Resume physics simulation
- Clear all objects with one click

### 🔗 API Integrations

- **Quotable API** - Inspirational quotes that refresh on demand
- **Useless Facts API** - Random interesting facts

### 📱 Responsive Design

- Fully responsive for mobile and desktop
- Optimized layouts for:
  - Large desktop screens (1920px+)
  - Standard desktop (1024px)
  - Tablets (768px)
  - Mobile phones (480px)
- Touch-friendly game controls
- Adaptive canvas rendering

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

```bash
cd d:\CODE\projects\Node\iamparthkaushik
npm install
```

### Development

```bash
npm run dev
```

The website will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## 📋 Testing Checklist

### ✅ Desktop Testing (1920x1080)

- [x] Hero section loads with animations
- [x] Cursor follower particles appear on mouse movement
- [x] Gradient text animations visible
- [x] Feature cards animate on scroll
- [x] 3D scene loads with rotating cube
- [x] Physics simulator works with gravity and collisions
- [x] Snake game is playable (arrow keys or WASD)
- [x] Flappy bird game is playable (click or space)
- [x] API cards load with quotes and facts
- [x] All hover effects work smoothly

### ✅ Mobile Testing (iPhone 12 - 390x844)

- [x] Hero section is readable and centered
- [x] Text sizes are appropriate
- [x] Games are playable on mobile
- [x] Buttons are touch-friendly
- [x] No horizontal scrolling
- [x] Responsive images and canvas
- [x] Animations run smoothly

### ✅ Tablet Testing (iPad - 768x1024)

- [x] Layout adapts properly
- [x] Two-column grid for features visible
- [x] Touch interactions work
- [x] 3D scene responsive

### ✅ Feature Testing

#### Hero Section
- [x] Animated gradient text
- [x] Smooth fade-in animations
- [x] Particle background effects
- [x] Glowing rotating shapes
- [x] Call-to-action buttons

#### 3D Section
- [x] Three.js scene renders
- [x] Cube rotates smoothly
- [x] Spheres orbit around cube
- [x] OrbitControls work (drag to rotate)
- [x] Lighting and materials render correctly

#### Physics Simulator
- [x] Click to add objects
- [x] Objects fall with gravity
- [x] Collisions between objects work
- [x] Wall bouncing works
- [x] Pause/Resume button works
- [x] Clear button resets simulation

#### Snake Game
- [x] Snake moves with arrow keys
- [x] Snake moves with WASD
- [x] Food collision detected
- [x] Snake growth works
- [x] Self-collision detection works
- [x] Wall collision works
- [x] Score updates correctly
- [x] Game pause/resume works
- [x] Game reset works

#### Flappy Bird Game
- [x] Bird responds to click
- [x] Bird responds to space bar
- [x] Gravity affects bird
- [x] Pipes generate randomly
- [x] Collision detection works
- [x] Score increments on passing pipes

#### API Integration
- [x] Quotes load on page load
- [x] Facts load on page load
- [x] "Get New Quote" button refreshes quotes
- [x] "Get New Fact" button refreshes facts
- [x] Loading states display correctly

#### Animations
- [x] Text shimmer animations
- [x] Blob animations in background
- [x] Card hover scale effects
- [x] Button hover effects
- [x] Smooth scroll behavior
- [x] Staggered item animations

## 🎨 Design Highlights

- **Color Scheme**: Purple, Pink, Cyan gradient
- **Typography**: Bold, modern sans-serif fonts
- **Effects**: Glows, shadows, blur effects
- **Animations**: Smooth transitions and keyframe animations
- **Accessibility**: Focus states, reduced motion preferences

## 📊 Performance

- Production build size optimized
- Lazy loading for heavy components (3D, Games)
- Canvas rendering for optimal performance
- Efficient animation frame handling

## 🐛 Known Limitations

- 3D scene requires WebGL support
- Some animations may be reduced on lower-end devices
- Physics simulator limited to ~8 objects for performance

## 🔮 Future Enhancements

- [ ] Add more games (Asteroid, Breakout, etc.)
- [ ] WebSocket support for multiplayer games
- [ ] More complex 3D scenes
- [ ] Additional API integrations (weather, stock prices, etc.)
- [ ] PWA support for offline access
- [ ] Dark/Light theme toggle
- [ ] Sound effects and background music

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Parth Kaushik**
- GitHub: [@iamparthkaushik](https://github.com/iamparthkaushik)
- Email: iamparthkaushik@gmail.com
- Location: Based in India • Open to Work

---

**Built with 💜 and 🚀 powered by crazy ideas**
