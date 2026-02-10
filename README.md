# Jsoncraft

Jsoncraft is a lightweight web app for working with JSON quickly. You can format raw JSON, generate TypeScript types, and generate Zod schemas from the same input.

## What it does

- ✅ Format/pretty-print JSON with 2-space indentation
- ✅ Validate JSON as you type
- ✅ Convert JSON to TypeScript type definitions
- ✅ Convert JSON to Zod schema definitions
- ✅ Treat empty string fields as optional in TypeScript and Zod outputs
- ✅ Clear/reset both editors with one click

## Tech stack

- Angular 21 (standalone components)
- TypeScript
- Tailwind CSS 4
- Docker + Docker Compose support

## Prerequisites

- Node.js 20+ (recommended)
- npm 11+ (project uses `npm@11.7.0`)

## Getting started (local)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run start
   ```

3. Open in browser:

   - `http://localhost:4200/`

## How to use

1. Paste JSON into **Left JSON**.
2. By default, the right panel shows formatted JSON.
3. Use the top action buttons:
   - **Change to JSON** → pretty-print JSON
   - **Change to TypeScript** → generate TypeScript types
   - **Change to Zod Schema** → generate Zod schema
   - **Clear** → reset both editors
4. Check status labels to quickly see if input is valid.

## Available scripts

- `npm run start` — run development server
- `npm run build` — create production build
- `npm run watch` — build in watch mode (development config)
- `npm run test -- --watch=false` — run unit tests once
- `npm run serve:ssr:jsoncraft` — serve SSR build output

## Run with Docker

Build and run:

```bash
docker compose up -d --build
```

Then open:

- `http://localhost:4000/`

Stop:

```bash
docker compose down
```

### Docker notes

- First production build needs internet access because Google Fonts are inlined.
- To change host port, edit `ports` in `docker-compose.yml`.

## Troubleshooting

### PowerShell blocks `npm`

Use `npm.cmd` instead:

```powershell
npm.cmd install
npm.cmd run start
```

### Invalid JSON status

If the left panel shows **Invalid JSON**, check for common issues:

- Trailing commas
- Missing quotes around keys/strings
- Unescaped special characters
- Mismatched braces/brackets
