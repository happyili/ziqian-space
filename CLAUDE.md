# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3-based educational math game called "坦克数学大战" (Tank Math Battle). It's a single-file HTML application that teaches two-digit addition and subtraction through an interactive tank battle game.

## Architecture

### Single-File Application Structure
- **Main file**: `index.html` - Contains all HTML, CSS, and JavaScript in one file
- **Framework**: Vue 3 via CDN (Composition API)
- **CSS**: Embedded CSS with CSS custom properties for responsive design
- **JavaScript**: ES6 class-based game engine (`MathTankGame`)

### Key Game Components
- **Settings Screen** (`setupScreen`) - Game configuration interface
- **Battle Field** (`battleField`) - Main game area with tank graphics
- **Question Area** (`questionArea`) - Math problem display and answer options
- **Timer System** - Visual progress bar with countdown warnings
- **Health/Score System** - Player and enemy tank health bars and scoring

### Game Architecture Patterns
- **State Management**: Game state handled by `MathTankGame` class properties
- **Event-Driven**: DOM event listeners for user interactions and keyboard shortcuts
- **Animation System**: CSS animations with JavaScript coordination
- **Mobile Optimization**: Responsive design with touch event handling

## Development Commands

This project uses no build tools or package managers. Development is straightforward:

### Running the Game
```bash
# Open the HTML file directly in a web browser
open index.html
# or
python -m http.server 8000  # then visit http://localhost:8000
```

### Mobile Testing
- Use browser dev tools device emulation
- Test on actual mobile devices via local server

## Key Features

### Math Problem Generation
- **Simple Mode**: Single-digit addition and subtraction under 20
- **Complex Mode**: Two-digit problems with optional carry/borrow requirements
- **Smart Question Pool**: Prevents recent question repetition
- **Multiple Choice**: Three similar answer options for each question

### Game Mechanics
- **Timer System**: Configurable countdown with visual warnings
- **Health System**: Player (5 HP) vs Enemy tanks with scaling difficulty
- **Scoring**: Base points + quick answer bonuses + combo multipliers
- **Special Modes**: "Ultraman Mode" activated at level 6+ with themed graphics

### Responsive Design
- **Desktop**: Full-featured experience with keyboard shortcuts (1/2/3)
- **Mobile**: Optimized touch interface with larger buttons
- **Orientation**: Portrait mode recommended with automatic warnings

## Code Style and Patterns

### CSS Organization
- CSS custom properties for consistent sizing and theming
- Media queries for mobile-first responsive design
- Animation keyframes for smooth visual effects
- Modular class naming for game components

### JavaScript Architecture
- **Class-based**: Main `MathTankGame` class encapsulates all game logic
- **Constants**: Extensive use of class properties for configuration values
- **Event Handling**: Centralized keyboard and touch event management
- **Animation Timing**: Coordinated setTimeout/setInterval usage

### Vue 3 Integration
- Minimal Vue usage for basic reactivity
- DOM manipulation primarily through vanilla JavaScript for performance
- Event handling through traditional addEventListener approach

## Common Development Tasks

### Adding New Game Features
1. Add configuration constants to `MathTankGame` constructor
2. Implement feature logic in appropriate class methods
3. Update UI elements in HTML structure if needed
4. Add corresponding CSS styles and animations

### Modifying Math Problem Logic
- Edit `generateRawQuestion()` method for new problem types
- Modify `generateAnswerOptions()` for different answer strategies
- Update settings UI checkboxes for new game modes

### Customizing Visual Effects
- Modify CSS custom properties in `:root` for sizing changes
- Add new animation keyframes for visual effects
- Update mobile responsive breakpoints in media queries

## Mobile Considerations

The game includes extensive mobile optimizations:
- Touch event handling with gesture prevention
- Responsive typography and button sizing
- Viewport meta tag configuration
- Orientation change handling
- Performance optimizations for mobile browsers