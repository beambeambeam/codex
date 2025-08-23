# Project-wide Conventions

This document outlines the conventions that apply to the entire project, including both the backend and frontend.

## Version Control

### Branching Strategy

This project follows a simple Gitflow-like branching model.

- `main`: This branch is for production-ready code. All pull requests to `main` must be reviewed and pass all CI checks.
- `develop`: This is the main development branch. All feature branches are created from `develop` and merged back into it.
- `feature/...`: For new features. Branched from `develop`. (e.g., `feature/add-user-authentication`)
- `fix/...`: For bug fixes. Branched from `develop`. (e.g., `fix/resolve-login-issue`)
- `chore/...`: For maintenance tasks. Branched from `develop`. (e.g., `chore/update-dependencies`)

### Commit Messages

All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This ensures a consistent and readable commit history.

**Format:**

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Common types:**

- `feat`: A new feature
- `fix`: A bug fix
- `chore`: Changes to the build process or auxiliary tools
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
