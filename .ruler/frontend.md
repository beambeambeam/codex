# Frontend Style Guide (Next.js/TypeScript)

This document outlines the coding style and conventions for the Next.js/TypeScript frontend.

## Code Formatting & Linting

This project uses [Prettier](https://prettier.io/) for code formatting and [ESLint](https://eslint.org/) for linting.

- **Formatting**: Prettier is configured to run automatically on save in VS Code. You can also run it manually from the command line.
- **Linting**: The project uses a shared ESLint configuration from the monorepo (`@repo/eslint-config`).

**To format and lint your code, run:**

```bash
npm run lint
```

## Naming Conventions

- **Components**: Use `PascalCase` for all React components (e.g., `MyComponent.tsx`).
- **Variables & Functions**: Use `camelCase` for all variables and functions.
- **Types & Interfaces**: Use `PascalCase` for all custom types and interfaces (e.g., `type UserProfile = { ... }`).

## React/Next.js Best Practices

- **Component Structure**: Each component should be in its own folder with an `index.tsx` file. Styles should be co-located in a `styles.module.css` file.
- **State Management**: For simple, local state, use React's built-in hooks (`useState`, `useReducer`). For complex, global state, use [Zustand](https://github.com/pmndrs/zustand) (it is already a dependency).
- **Data Fetching**: Use [TanStack Query](https://tanstack.com/query/latest) for all server-side data fetching. It provides caching, refetching, and many other powerful features.
