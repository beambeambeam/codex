# Codex, Make every data askable.

An AI-Powered Knowledge Management System Using Graph-Based Structures for Unstructured Data

## Get Started

### Prerequisites

- Node.js 18+
- Python 3.12+
- pnpm 9.8.0+
- Docker and Docker Compose
- uv (Python package manager)

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd codex
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the database and services**

   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL with pgvector extension (port 3002)
   - MinIO object storage (port 9000, admin console on 9001)

5. **Run database migrations** (for the API)

   ```bash
   cd apps/api
   uv run alembic upgrade head
   ```

6. **Start the development servers**

   ```bash
   # Start both web and API servers
   pnpm dev
   ```

   Or run individually:

   ```bash
   # Web app (Next.js) - http://localhost:3000
   cd apps/web
   pnpm dev

   # API (FastAPI) - in another terminal
   cd apps/api
   pnpm dev
   ```

### Available Scripts

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all applications
- `pnpm lint` - Run linting across all packages
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code with Prettier
- `pnpm check-types` - Run TypeScript type checking

### Project Structure

- `apps/web/` - Next.js frontend application
- `apps/api/` - Python FastAPI backend
- `packages/` - Shared packages and configurations

### Services

- **Web App**: http://localhost:3000
- **API**: http://localhost:3001
- **PostgreSQL**: localhost:3002
- **MinIO Service**: http://localhost:9000
- **MinIO Console**: http://localhost:9001
