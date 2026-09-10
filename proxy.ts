import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

const PUBLIC_SISTEMA_PATHS = ["/sistema/login", "/sistema/setup"]

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isPublicSistemaPath = PUBLIC_SISTEMA_PATHS.some((p) => path.startsWith(p))

  if (path.startsWith("/sistema") && !isPublicSistemaPath && !user) {
    return NextResponse.redirect(new URL("/sistema/login", request.url))
  }

  return response
}

export const config = {
  matcher: ["/sistema/:path*"],
}
