# Jsoncraft

Jsoncraft is a lightweight JSON playground for formatting JSON, generating TypeScript types, and building Zod schemas.

## Features

- Pretty-print JSON with consistent indentation
- Convert JSON to TypeScript type definitions
- Convert JSON to Zod schemas
- Treat empty string fields as optional in TypeScript and Zod outputs

## Getting started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run start
```

Then open `http://localhost:4200/`.

## Scripts

- `npm run start`: run the development server
- `npm run build`: build the production bundle
- `npm test -- --watch=false`: run unit tests once

## Notes (Windows)

If PowerShell blocks `npm`, use `npm.cmd` instead:

