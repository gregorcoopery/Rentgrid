'use client';

import React from 'react';
import NextLink from 'next/link';
import { useParams as useNextParams, usePathname } from 'next/navigation';

export const Link = React.forwardRef(({ to, href, replace, scroll, prefetch, ...props }, ref) => (
  <NextLink
    ref={ref}
    href={href || to || '#'}
    replace={replace}
    scroll={scroll}
    prefetch={prefetch}
    {...props}
  />
));

Link.displayName = 'RouterLinkShim';

export const NavLink = Link;

export function useLocation() {
  const pathname = usePathname() || '/';
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    setSearch(window.location.search);
  }, [pathname]);

  return {
    pathname,
    search,
  };
}

export function useParams() {
  return useNextParams();
}

export function useNavigate() {
  throw new Error('useNavigate is not supported in the Next.js migration shim. Use next/navigation instead.');
}

export function BrowserRouter({ children }) {
  return children;
}

export function Routes({ children }) {
  return children;
}

export function Route() {
  return null;
}
