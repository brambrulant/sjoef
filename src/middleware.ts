import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';

export const config = {
  matcher: [
    '/events',
    '/points',
    '/admin',
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

export default withAuth({});
