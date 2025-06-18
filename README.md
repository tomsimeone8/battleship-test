# Battleship Game

A modern Battleship game built with React, TypeScript, and Vite.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS v4
- **State Management**: Zustand
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier
- **Pre-commit Hooks**: Husky + lint-staged
- **Deployment**: Netlify via GitHub Actions

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd battleship-test
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view the app.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Development Workflow

### Pre-commit Hooks

This project uses Husky and lint-staged to automatically run linting and formatting on staged files before each commit.

### Testing

Tests are written using Vitest and React Testing Library. Run tests with:

```bash
npm run test
```

### Code Style

- ESLint for code quality
- Prettier for code formatting
- Pre-commit hooks ensure consistent code style

## Deployment

The app is automatically deployed to Netlify when changes are pushed to the main branch via GitHub Actions.

### Manual Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider

## Project Structure

```
src/
├── components/     # Reusable UI components
├── store/         # Zustand state management
├── test/          # Test utilities and setup
├── App.tsx        # Main application component
├── main.tsx       # Application entry point
└── index.css      # Global styles (TailwindCSS)
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure tests pass: `npm run test:run`
4. Ensure linting passes: `npm run lint`
5. Create a pull request

## License

MIT
