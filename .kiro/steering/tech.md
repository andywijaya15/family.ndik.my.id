# Tech Stack

## Core Technologies

- **React 19** with TypeScript
- **Vite 7** - Build tool with SWC for fast refresh
- **React Router 7** - Client-side routing
- **Supabase** - Backend (authentication, database, real-time)
- **Tailwind CSS 4** - Styling with @tailwindcss/vite plugin
- **shadcn/ui** - Component library built on Radix UI primitives

## Key Libraries

- **@tanstack/react-table** - Data tables
- **lucide-react** - Icons
- **sonner** - Toast notifications
- **next-themes** - Theme management (light/dark mode)
- **vite-plugin-pwa** - Progressive Web App support

## Development Tools

- **TypeScript 5.9** - Type safety
- **ESLint 9** - Linting with React hooks and refresh plugins
- **Path aliases** - `@/*` maps to `./src/*`

## Common Commands

```bash
# Development server with HMR
npm run dev

# Type check and build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Environment Variables

Required in `.env.local`:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` - Supabase anon/public key

## Build Configuration

- Chunk size limit: 2000 KB
- Vendor dependencies split into separate chunk
- PWA manifest configured for "Family Plan" app
