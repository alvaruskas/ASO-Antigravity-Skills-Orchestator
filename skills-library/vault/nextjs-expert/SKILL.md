---
description: Guía completa para desarrollo con Next.js 15+ utilizando App Router, Server Components y patrones modernos de React.
category: "🖥️ Desarrollo Web"
---

# Next.js Expert (v15+)

## Purpose
Guide the development of high-performance, SEO-optimized web applications using the latest Next.js standards (v15+). Prioritize Server Components, App Router architecture, and modern React patterns for optimal user experience and developer productivity.

## Instructions

### 1. Modern Architecture (App Router First)
- **App Router**: ALWAYS use the App Router (`app/` directory), NOT the Pages Router unless maintaining legacy code.
- **File Conventions**:
  - `page.tsx`: Define routes (e.g., `app/dashboard/page.tsx` → `/dashboard`)
  - `layout.tsx`: Shared UI that wraps pages and persists across navigation
  - `loading.tsx`: Automatic loading states with React Suspense
  - `error.tsx`: Error boundaries for graceful error handling
  - `not-found.tsx`: Custom 404 pages
  - `route.ts`: API endpoints (e.g., `app/api/users/route.ts`)
- **Nested Layouts**: Leverage nested layouts for complex UIs (e.g., dashboard with sidebar)
- **Route Groups**: Use `(folder)` syntax to organize routes without affecting URL structure

### 2. Server Components (Default Choice)
- **Server Components (RSC)**: Use by default for ALL components unless interactivity is required
  - Zero JavaScript sent to client
  - Direct database/API access
  - Better security (keep secrets server-side)
  - Improved SEO
- **Client Components**: Only when needed:
  - Use `'use client'` directive at the top of the file
  - Required for: `useState`, `useEffect`, event handlers, browser APIs
  - Push client boundaries down the tree (keep as much server-rendered as possible)
- **Composition Pattern**: Wrap Client Components with Server Components to minimize client bundle

### 3. Data Fetching (Modern Patterns)
- **Server-Side Fetching**:
  - Use native `fetch()` with automatic deduplication and caching
  - Async/await in Server Components (no `useEffect` needed)
  - Example:
    ```tsx
    async function Page() {
      const data = await fetch('https://api.example.com/data', { 
        cache: 'force-cache' // or 'no-store'
      })
      return <div>{data}</div>
    }
    ```
- **Caching Strategies**:
  - `cache: 'force-cache'`: Static (default, regenerates on rebuild)
  - `cache: 'no-store'`: Dynamic (every request)
  - `next: { revalidate: 60 }`: ISR (Incremental Static Regeneration)
- **Client-Side Data (When Needed)**:
  - Use `useSuspenseQuery` for async data in Client Components
  - Wrap with `<Suspense>` boundary for loading states
  - Example:
    ```tsx
    'use client'
    import { useSuspenseQuery } from '@tanstack/react-query'
    
    function UserProfile() {
      const { data } = useSuspenseQuery({
        queryKey: ['user'],
        queryFn: fetchUser
      })
      return <div>{data.name}</div>
    }
    
    // In parent:
    <Suspense fallback={<Spinner />}>
      <UserProfile />
    </Suspense>
    ```
- **Server Actions**: Use for mutations (forms, data updates)
  - `'use server'` directive
  - Progressive enhancement (works without JS)
  - Example:
    ```tsx
    async function createUser(formData: FormData) {
      'use server'
      // Server-side logic
    }
    ```

### 4. Routing & Navigation
- **Dynamic Routes**: `[id]`, `[...slug]`, `[[...catchAll]]`
- **Parallel Routes**: Use `@slot` for simultaneous rendering (e.g., modals, dashboards)
- **Intercepting Routes**: `(..)` syntax for advanced patterns
- **Navigation**:
  - `<Link>` component for client-side transitions
  - `useRouter()` (Client Component only) or `redirect()` (Server Component)
  - Prefetching enabled by default on `<Link>`

### 5. Styling & UI Best Practices
- **shadcn/ui**: Recommended component library for professional dashboards and SaaS apps
  - Copy-paste components, not npm package (full control)
  - Built on Radix UI primitives (accessible by default)
  - Fully customizable with Tailwind CSS
  - Example setup:
    ```bash
    npx shadcn-ui@latest init
    npx shadcn-ui@latest add button card dialog
    ```
- **Tailwind CSS**: Primary styling framework (already in your project)
  - Mobile-first responsive design
  - Dark mode support with `dark:` variant
  - Component composition patterns
- **CSS Modules**: For scoped component styles (`styles.module.css`)
- **Global Styles**: In `app/globals.css` for design tokens
- **CSS-in-JS**: Use libraries compatible with RSC (e.g., `styled-jsx`, not `styled-components` v5)

### 5.1. React 19 Features (Next.js 15 Compatible)
Next.js 15 is built on React 19, enabling powerful new primitives:
- **Actions**: Built-in form handling with `action` prop (no need for onSubmit)
  ```tsx
  <form action={async (formData) => {
    'use server'
    await saveData(formData)
  }}>
    <input name="email" />
    <button type="submit">Submit</button>
  </form>
  ```
- **useOptimistic**: Optimistic UI updates before server response
  ```tsx
  const [optimisticState, addOptimistic] = useOptimistic(state, updateFn)
  ```
- **use() Hook**: Unwrap promises and context in components
  ```tsx
  const data = use(fetchDataPromise) // No need for useEffect
  ```
- **useFormStatus**: Access form submission state
  ```tsx
  const { pending } = useFormStatus()
  return <button disabled={pending}>Submit</button>
  ```
- **Document Metadata**: Built-in `<title>` and `<meta>` in components (no Helmet needed)

### 6. Performance Optimization
- **Image Optimization**: ALWAYS use `<Image>` component from `next/image`
  - Automatic lazy loading, responsive images, WebP conversion
- **Font Optimization**: Use `next/font` for automatic font loading
  - Example: `import { Inter } from 'next/font/google'`
- **Code Splitting**: Automatic by default, use `next/dynamic` for manual control
- **Partial Prerendering (PPR)**: Enable experimental feature for best of static + dynamic
- **Streaming**: Use `loading.tsx` and Suspense boundaries for progressive rendering
- **Core Web Vitals** (Vercel Best Practices):
  - **LCP** (Largest Contentful Paint): < 2.5s
    - Optimize images with `priority` prop for above-the-fold content
    - Use Streaming for faster initial render
  - **FID** (First Input Delay): < 100ms
    - Minimize JavaScript bundle size
    - Use Server Components to reduce client JS
  - **CLS** (Cumulative Layout Shift): < 0.1
    - Always specify image dimensions
    - Reserve space for dynamic content
  - Monitor with Vercel Analytics or Web Vitals API

### 7. TypeScript (Mandatory)
- **Strict Mode**: Always enable `"strict": true` in `tsconfig.json`
- **Type Safety**:
  - Use `PageProps` and `LayoutProps` types from Next.js
  - Define API route types explicitly
  - Leverage `satisfies` operator for better inference

### 8. Environment Variables
- **Naming**:
  - `NEXT_PUBLIC_*`: Exposed to browser (client-side)
  - Without prefix: Server-side only
- **Files**: `.env.local` (gitignored), `.env.development`, `.env.production`

### 9. API Routes & Backend Logic
- **Route Handlers**: In `app/api/*/route.ts`
  - HTTP methods: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`
  - Return `Response` or `NextResponse`
- **Middleware**: Use `middleware.ts` for auth, redirects, headers
- **Server Actions**: Prefer over API routes for forms and mutations

### 10. Authentication & Security
- **Auth Solutions**:
  - **Supabase Auth**: Integrate with middleware for protected routes
    ```tsx
    // middleware.ts
    import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
    import { NextResponse } from 'next/server'
    
    export async function middleware(req) {
      const res = NextResponse.next()
      const supabase = createMiddlewareClient({ req, res })
      await supabase.auth.getSession()
      return res
    }
    ```
  - **Clerk**: Use webhooks for user sync, implement role-based access
    ```tsx
    import { auth } from '@clerk/nextjs'
    
    export default async function Page() {
      const { userId } = auth()
      if (!userId) redirect('/sign-in')
      // Protected content
    }
    ```
  - **NextAuth.js / Auth.js**: Recommended for custom implementations
- **Security**:
  - Never expose secrets in client components
  - Use CSRF protection with Server Actions
  - Implement rate limiting for API routes
  - Use middleware for authentication checks before page render

### 11. Testing
- **Unit/Integration**: Jest + React Testing Library
- **E2E**: Playwright (already in your project)
- **Component Testing**: Storybook or Vitest

### 12. Deployment
- **Vercel**: Native platform, zero-config (recommended)
- **Self-Hosted**: Docker, Node.js server, or static export
- **Edge Runtime**: Use for ultra-low latency (`export const runtime = 'edge'`)

## Key Principles

✅ **Server-First Mindset**: Default to Server Components, opt into client interactivity  
✅ **Progressive Enhancement**: Forms work without JavaScript via Server Actions  
✅ **Performance by Default**: Leverage Next.js automatic optimizations  
✅ **Type Safety**: TypeScript everywhere, no `any` types  
✅ **SEO & Accessibility**: Semantic HTML, metadata API, ARIA labels  

## Migration from Pages Router

If migrating from Pages Router:
1. Create `app/` directory alongside `pages/` (can coexist)
2. Move routes incrementally: `pages/about.tsx` → `app/about/page.tsx`
3. Replace `getServerSideProps`/`getStaticProps` with Server Component fetching
4. Update `_app.tsx` → `app/layout.tsx`
5. Convert `_document.tsx` → `app/layout.tsx` metadata

## Common Patterns

### Server Component with Client Island
```tsx
// app/dashboard/page.tsx (Server Component)
import ClientCounter from './ClientCounter'

export default async function Dashboard() {
  const data = await fetchData() // Server-side
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Client component island */}
      <ClientCounter initialCount={data.count} />
    </div>
  )
}
```

### Server Action with Form
```tsx
// app/actions.ts
'use server'

export async function createTodo(formData: FormData) {
  const title = formData.get('title')
  await db.insert({ title })
  revalidatePath('/todos')
}

// app/todos/page.tsx
import { createTodo } from './actions'

export default function Todos() {
  return (
    <form action={createTodo}>
      <input name="title" />
      <button type="submit">Add</button>
    </form>
  )
}
```

## Anti-Patterns to Avoid

❌ Using Pages Router for new projects  
❌ `useEffect` for data fetching in Server Components  
❌ Marking all components as `'use client'`  
❌ Fetching data in Client Components (use Server Components)  
❌ Not using `<Image>` and `next/font` optimizations  
❌ Ignoring TypeScript errors  

## Resources

- **Official Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **App Router Examples**: [github.com/vercel/next.js/tree/canary/examples](https://github.com/vercel/next.js/tree/canary/examples)
- **Performance**: [web.dev/vitals](https://web.dev/vitals)
