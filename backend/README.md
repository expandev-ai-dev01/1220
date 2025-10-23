# Editor de Música Cifrada - Backend API

Backend REST API for the Music Chord Editor application - A comprehensive catalog system for managing songs with lyrics and chord notations.

## Features

This backend supports the following features:

- Song management (create, read, update, delete)
- Chord transposition
- Category organization
- Search functionality
- Playlist management
- User management
- Song sharing
- Export capabilities

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Architecture**: REST API
- **Data Storage**: In-memory (arrays/objects)

## Project Structure

```
src/
├── api/                    # API controllers
│   └── v1/                 # API version 1
│       ├── external/       # Public endpoints
│       └── internal/       # Authenticated endpoints
├── routes/                 # Route definitions
│   └── v1/                 # Version 1 routes
├── middleware/             # Express middleware
├── services/               # Business logic
├── utils/                  # Utility functions
├── constants/              # Application constants
├── config/                 # Configuration
└── server.ts               # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`

### Development

Run the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Building for Production

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Linting

Run ESLint:

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

## API Documentation

### Base URL

- Development: `http://localhost:3000/api/v1`
- Production: `https://api.yourdomain.com/api/v1`

### Health Check

```
GET /health
```

Returns server health status.

### API Versioning

The API uses URL path versioning:

- `/api/v1/external/*` - Public endpoints
- `/api/v1/internal/*` - Authenticated endpoints

## Environment Variables

| Variable | Description | Default |
|----------|-------------|----------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 3000 |
| API_VERSION | API version | v1 |
| CORS_ORIGINS | Allowed CORS origins (comma-separated) | localhost:3000,localhost:5173 |
| LOG_LEVEL | Logging level | info |

## Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow ESLint configuration
- Use 2 spaces for indentation
- Maximum line length: 120 characters
- Use single quotes for strings

### Naming Conventions

- Files: camelCase (e.g., `userService.ts`)
- API routes: kebab-case (e.g., `/song-list`)
- Functions: camelCase with action verbs
- Types/Interfaces: PascalCase
- Constants: UPPER_SNAKE_CASE

### Testing

- Write unit tests for all services
- Write integration tests for API endpoints
- Maintain test coverage above 80%
- Place test files alongside source files

## Contributing

Features are implemented incrementally. Each feature should:

1. Follow the established project structure
2. Include comprehensive tests
3. Update relevant documentation
4. Follow TypeScript and ESLint standards

## License

ISC