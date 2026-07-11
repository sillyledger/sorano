import { NextResponse } from 'next/server'
export function middleware(request) {
  const host = request.headers.get('host') || ''
  const isAppSubdomain = host.startsWith('app.')
  if (isAppSubdomain) {
    const url = request.nextUrl.clone()
    const pathname = url.pathname
    // Already going to a valid app route — let it through
    if (
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/board') ||
      pathname.startsWith('/notes') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/update-password') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.')
    ) {
      return NextResponse.next()
    }
    // Root or anything else on app subdomain → dashboard
    url.pathname = '/dashboard'
    return NextResponse.rewrite(url)
  }
  return NextResponse.next()
}
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
