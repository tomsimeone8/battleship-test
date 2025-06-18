# Battleship Game

A web-based recreation of the classic Hasbro board game Battleship, built with React 18 and TypeScript.

## 🎯 Game Features

- **Canonical Battleship Rules**: 10×10 grid (A-J, 1-10) with authentic fleet composition
- **Complete Game Flow**: Setup → Battle → Victory with smooth transitions
- **Smart CPU AI**: Hunt-and-target strategy that becomes more challenging after scoring hits
- **Accessibility First**: Full keyboard navigation support and screen reader compatibility
- **Responsive Design**: Clean, modern interface that works on all devices

## 🚢 Fleet Composition

- **Carrier** (5 cells)
- **Battleship** (4 cells) 
- **Cruiser** (3 cells)
- **Submarine** (3 cells)
- **Destroyer** (2 cells)

## 🎮 How to Play

### Setup Phase
1. Select a ship from the list
2. Click on the grid to place your ship
3. Use the orientation buttons to rotate ships horizontally/vertically
4. Ships cannot touch each other
5. Click "Start Battle" when all ships are placed

### Battle Phase
1. Take turns firing shots at enemy positions
2. Click on the enemy grid to attack
3. Get feedback: Hit, Miss, or Sunk
4. First player to sink all enemy ships wins!

### Controls
- **Mouse**: Click to select ships and fire shots
- **Keyboard**: Tab navigation + Enter/Space to interact
- **Accessibility**: Full screen reader support

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Testing**: Jest + React Testing Library
- **E2E Testing**: Cypress
- **Deployment**: Netlify with CI/CD

## 📊 Quality Metrics

- ✅ **96.91% Test Coverage** (exceeds 90% requirement)
- ✅ **53 Passing Tests** across 11 test suites
- ✅ **Lighthouse Performance**: 90%+ (target)
- ✅ **Lighthouse Accessibility**: 90%+ (target)
- ✅ **Full Keyboard Navigation**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/tomsimeone8/battleship-test.git
cd battleship-test

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
# Development
npm run dev          # Start dev server at http://localhost:5173

# Testing
npm test            # Run unit tests
npm run test:coverage # Run tests with coverage report
npm run test:e2e    # Run Cypress E2E tests

# Building
npm run build       # Create production build
npm run preview     # Preview production build locally

# Linting
npm run lint        # Run ESLint
```

## 🧪 Testing Strategy

### Unit Tests (Jest + React Testing Library)
- **Component Tests**: All major components with user interaction scenarios
- **Integration Tests**: Complete game flow testing with mock state
- **Store Tests**: Zustand state management logic
- **Coverage Target**: 90%+ (currently 96.91%)

### E2E Tests (Cypress)
- Complete game playthrough scenarios
- Accessibility testing
- Cross-browser compatibility

## 🏗 Architecture

### Component Structure
```
src/
├── components/
│   ├── App.tsx              # Main app component
│   ├── BattleScreen.tsx     # Battle phase UI
│   ├── GameBoard.tsx        # Reusable game grid
│   ├── ShipPlacement.tsx    # Setup phase UI
│   ├── VictoryModal.tsx     # End game modal
│   └── __tests__/           # Component tests
├── store/
│   ├── gameStore.ts         # Zustand state management
│   └── __tests__/           # Store tests
├── types/
│   └── game.ts              # TypeScript definitions
└── lib/
    └── utils.ts             # Utility functions
```

### State Management
- **Zustand Store**: Centralized game state with actions
- **Game Phases**: `setup` → `battle` → `victory`
- **Player Data**: Boards, ships, shots, and game statistics

### CPU AI Strategy
1. **Random Phase**: Initial shots using checkerboard pattern for efficiency
2. **Hunt Phase**: After a hit, target adjacent cells systematically
3. **Target Phase**: Continue along ship axis until sunk
4. **Fallback**: Return to random targeting when hunt is exhausted

## 🎨 Design Constraints

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard-only navigation
- Screen reader support
- High contrast ratios
- Focus indicators

### Performance
- Lighthouse score 90%+
- Optimized bundle size
- Efficient re-renders
- Responsive design

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- Touch and mouse input

## 🚀 Deployment

### Netlify (Recommended)
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Enable automatic deployments

### Manual Deployment
```bash
npm run build
# Deploy contents of `dist/` folder to your hosting provider
```

## 🔮 Future Enhancements

### Planned Features
- **Multiplayer Mode**: Real-time online battles
- **Game Variants**: Different board sizes and ship configurations
- **Statistics**: Win/loss tracking and performance analytics
- **Themes**: Multiple visual themes and sound effects
- **Mobile App**: React Native version for iOS/Android

### Technical Improvements
- **PWA Support**: Offline gameplay capability
- **WebRTC**: Peer-to-peer multiplayer
- **Animation**: Enhanced visual feedback and transitions
- **Internationalization**: Multi-language support

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Bug Reports

Please use the [GitHub Issues](https://github.com/tomsimeone8/battleship-test/issues) page to report bugs or request features.

## 👨‍💻 Development

Built with ❤️ by [Devin AI](https://app.devin.ai/sessions/e38f6607f6414738b82b195351053429)

---

**Link to Devin run**: https://app.devin.ai/sessions/e38f6607f6414738b82b195351053429
