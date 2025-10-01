import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// 🔒 Definir rotas públicas (acessíveis sem autenticação)
const isPublicRoute = createRouteMatcher([
  '/',
  '/auth/signin',
  '/auth/signup',
  '/api/auth/(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)'
]);

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
  publicRoutes: [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/api/auth/(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)'
  ]
};