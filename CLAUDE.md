# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AINodeAgent (巴特星球)** - A distributed AIGC (Artificial Intelligence Generated Content) task system built with React 19, TypeScript, and Vite. This is a Chinese-language application that manages AI content generation tasks with Web3 integration and a points-based reward system.

## Development Commands

```bash
# Install dependencies
pnpm install

# Development servers
pnpm dev                    # Main development server
pnpm run dev:client         # Development server on port 3000 with --host
pnpm run dev:electron       # Electron desktop app development

# Build commands
pnpm run build              # Full build with TypeScript and electron-builder
pnpm run build:client       # Client-only build to dist/static

# Code quality
pnpm run lint               # ESLint with strict rules

# Preview
pnpm run preview            # Preview production build
```

## Architecture Overview

### Tech Stack
- **React 19.1.1** with TypeScript 5.9.3 (latest features and strict mode)
- **Vite with rolldown-vite 7.1.14** for ultra-fast builds
- **Tailwind CSS 4.1.16** with CSS variables and animations
- **TanStack Router 1.133.20** for advanced routing with React Query integration
- **TanStack React Query 5.90.5** for data fetching and caching
- **Radix UI + shadcn/ui** for professional UI components
- **React Hook Form 7.65.0** with Zod 4.1.12 for form validation
- **Electron 38.3.0** for desktop app capabilities
- **Lucide React 0.548.0** for icons

### Key Directories
```
src/
├── components/
│   ├── layout/          # Layout components (RootLayout)
│   ├── ui/              # shadcn/ui components
│   └── Empty.tsx       # Empty state component
├── contexts/           # React contexts (authContext)
├── hooks/              # Custom hooks (useTheme, etc.)
├── lib/                # Utility functions (utils.ts)
└── pages/              # Page components
    ├── Dashboard.tsx   # Main dashboard
    ├── MyTasks.tsx     # User tasks
    ├── TaskHall.tsx    # Task marketplace
    ├── TaskEngine.tsx  # Task processing engine
    ├── UserCenter.tsx  # User profile
    └── PointsDetails.tsx
```

### Core Patterns
- **TanStack Router** for file-based routing with data loading
- **TanStack Query** for server state management and caching
- **Radix UI + shadcn/ui** for accessible, customizable components
- **React Hook Form + Zod** for form validation with TypeScript support
- **Component composition** with clear separation of concerns
- **Dark/Light theme** support with CSS variables and localStorage persistence

## Configuration Architecture

### Configuration Files Structure
- `vite.base.config.ts` - Base Vite configuration with plugins and proxy setup
- `vite.config.ts` - Main development configuration (extends base)
- `vite.config.electron.ts` - Electron-specific configuration
- `tsconfig.json` - Project references configuration
- `tsconfig.app.json` - Application-specific TypeScript settings
- `tsconfig.node.json` - Node.js/build tools TypeScript settings
- `eslint.config.js` - Modern ESLint flat configuration
- `components.json` - shadcn/ui component configuration

### Environment Configuration
The application uses environment-specific configurations:

**Development (.env)**:
- Uses API proxy endpoints for local development
- Model directory configuration: `VITE_MODEL_LOCAL_DIR="D:/myModels"`

**Production (.env.production)**:
- Direct API endpoints for production deployment
- Same model directory configuration

**API Endpoints**:
- `/api_1` → `http://www.byteverse.vip/oneapi` (Authentication API)
- `/api_2` → `http://8.130.135.47/parseapi` (Parse API)
- `/api_3` → `http://115.190.25.82:9999` (Model API)

### Package Management
- Uses **pnpm** for performance and disk space efficiency
- **.npmrc** configured with Chinese mirrors for Electron dependencies
- Supports both web and Electron desktop app deployment

## UI Component System

### shadcn/ui Integration
- **Style**: New York theme with neutral base color
- **CSS Variables**: Enabled for theme customization
- **Icon Library**: Lucide React
- **Path Aliases**: Pre-configured for easy imports:
  - `@/components` → Components directory
  - `@/lib/utils` → Utility functions
  - `@/components/ui` → shadcn/ui components
  - `@/hooks` → Custom hooks

### Available UI Components
- Avatar, Collapsible, Dialog, Dropdown Menu
- Label, Radio Group, Separator, Slot, Tooltip
- Plus all standard shadcn/ui components

## Development Features

### Advanced Build System
- **React Compiler** (babel-plugin-react-compiler) for automatic optimizations
- **Smart Code Splitting** with manual chunks configuration
- **Asset Optimization** with organized output structure
- **TypeScript Project References** for faster builds

### Code Quality Tools
- **ESLint** with React Hooks, React Refresh, and TypeScript support
- **Strict TypeScript** configuration with unused variable detection
- **TanStack ESLint Plugin** for query best practices

### Development Tools
- **TanStack React Query DevTools** for debugging data fetching
- **TanStack Router DevTools** for routing debugging
- **React Refresh** for hot module replacement

## Important Development Notes

### React 19 Migration
The project has been upgraded to React 19.1.1. Be aware of:
- New JSX Transform and automatic JSX runtime
- Updated TypeScript types
- Potential breaking changes from React 18

### Electron Desktop App
The application supports both web and desktop deployment:
- Main process entry: `electron/main.ts`
- Electron Builder configured for cross-platform builds
- Chinese mirror configuration for faster downloads

### Mock Data System
The application currently uses extensive mock data:
- User profiles and Web3 wallet addresses
- Task data and statistics
- Points and rewards system
- Real-time logs and engine status

When implementing real backend integration:
- Use the configured API endpoints in proxy settings
- Replace mock data in `src/contexts/authContext.ts`
- Update page components to use TanStack Query for data fetching

### Path Aliases and Imports
- `@/*` maps to `./src/*`
- UI components: `@/components/ui/*`
- Utilities: `@/lib/utils`
- Hooks: `@/hooks/*`

## Current Limitations and Next Steps

1. **Backend Integration** - Currently using mock data, need to connect to real APIs
2. **Web3 Integration** - Simulated only, needs real wallet integration
3. **Testing** - No test framework configured yet
4. **Documentation** - Component documentation needs to be created
5. **Error Handling** - Basic error handling, needs comprehensive implementation

## Global Type Definitions

The project includes a global `AnyObject` interface for flexible type usage:
```typescript
interface AnyObject {
  [key: string]: any;
}
```

This is available throughout the application for type-safe dynamic object handling.