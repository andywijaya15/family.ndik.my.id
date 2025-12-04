# Project Structure

## Directory Organization

```
src/
├── components/        # React components
│   ├── ui/           # shadcn/ui base components (Button, Dialog, Table, etc.)
│   ├── layouts/      # Layout wrapper components
│   └── *.tsx         # Feature components (AppLayout, AppSidebar, FormDialog, etc.)
├── pages/            # Route page components
│   ├── Auth/         # Authentication pages (Login)
│   ├── Master/       # Master data pages (Categories, Transactions)
│   └── Home.tsx      # Home/dashboard page
├── repositories/     # Data access layer - Supabase queries
├── context/          # React context providers (AuthContext)
├── hooks/            # Custom React hooks
├── lib/              # Utilities and configurations
│   ├── supabaseClient.ts  # Supabase client instance
│   ├── loadProfile.ts     # Profile loading logic
│   └── utils.ts           # Helper functions (cn, etc.)
├── router/           # React Router configuration
├── types/            # TypeScript type definitions
│   └── database.ts   # Database entity types
├── utils/            # Utility functions
└── assets/           # Static assets (images, icons)
```

## Architecture Patterns

### Repository Pattern
Data access is abstracted through repository files in `src/repositories/`. Each repository handles CRUD operations for a specific entity:
- `categoryRepository.ts` - Category management
- `transactionRepository.ts` - Transaction management
- `profileRepository.ts` - User profile management

Repository functions return `{ data, error }` or `{ data, count, error }` for paginated queries.

### Soft Deletes
Entities use soft delete pattern with audit fields:
- `deleted_at` - Timestamp of deletion (null if active)
- `deleted_by` - User ID who deleted the record
- `created_by`, `updated_by` - Audit trail fields
- Queries filter with `.is("deleted_at", null)`

### Component Conventions
- UI components in `components/ui/` are shadcn/ui primitives
- Feature components in `components/` compose UI primitives
- Page components in `pages/` represent routes
- Use `AppLayout` with `<Outlet>` for nested routing

### Data Transformation
- `uppercaseData()` utility transforms string fields to uppercase before saving
- Applied in repository create/update operations

### Type Safety
- Database entities defined in `src/types/database.ts`
- Use TypeScript interfaces for all data structures
- Repository functions cast Supabase responses to typed entities

### Styling
- Tailwind CSS utility classes for styling
- `cn()` utility from `lib/utils.ts` for conditional class merging
- Theme support via `ThemeProvider` (light/dark/system modes)

### State Management
- React Context for global state (AuthContext)
- Custom hooks for reusable logic (useProfile, use-mobile)
- Component-level state with useState

## Naming Conventions

- Components: PascalCase (e.g., `AppLayout.tsx`, `MasterCategory.tsx`)
- Utilities/hooks: camelCase (e.g., `supabaseClient.ts`, `useProfile.ts`)
- Repository functions: camelCase verbs (e.g., `getCategories`, `createCategory`)
- Types/Interfaces: PascalCase (e.g., `Profile`, `Category`, `Transaction`)
