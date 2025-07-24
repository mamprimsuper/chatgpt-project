import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// ===== IMPLEMENTAÇÃO LEGACY BASEADA EM COOKIES =====
// NOTA: As funções abaixo são mantidas para compatibilidade
// mas não são mais usadas. Podem ser removidas no futuro.
// Use as funções baseadas em Bearer token abaixo.

function createSupabaseServerClient() {
  const cookieStore = cookies()
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ 
              name, 
              value, 
              ...options,
              httpOnly: false,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax'
            })
          } catch (error) {
            // Em alguns contextos, não podemos setar cookies
            console.warn('Cannot set cookie in this context:', name)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ 
              name, 
              value: '', 
              ...options,
              maxAge: 0
            })
          } catch (error) {
            // Em alguns contextos, não podemos remover cookies
            console.warn('Cannot remove cookie in this context:', name)
          }
        },
      },
    }
  )
}

export async function getUser() {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Supabase getUser error:', error)
    }
    
    return { user, error }
  } catch (err) {
    console.error('getUser caught error:', err)
    return { user: null, error: err as any }
  }
}

export async function requireAuth() {
  try {
    const { user, error } = await getUser()
    
    if (error) {
      console.error('Auth error:', error)
      return NextResponse.json(
        { error: 'Unauthorized - Auth error' },
        { status: 401 }
      )
    }
    
    if (!user) {
      console.error('No user found')
      return NextResponse.json(
        { error: 'Unauthorized - No user' },
        { status: 401 }
      )
    }
    
    return { user }
  } catch (err) {
    console.error('requireAuth caught error:', err)
    return NextResponse.json(
      { error: 'Unauthorized - Exception' },
      { status: 401 }
    )
  }
}

export async function requireAdmin() {
  const { user, error } = await getUser()
  
  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const isAdmin = user.user_metadata?.is_admin === true
  
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    )
  }
  
  return { user }
}

export async function getOptionalUser() {
  const { user, error } = await getUser()
  return { user: error ? null : user, error }
}

// ===== IMPLEMENTAÇÃO BASEADA EM BEARER TOKEN (ATUAL) =====
// As funções abaixo implementam autenticação via JWT Bearer token
// que é mais confiável e elimina problemas de cookies

/**
 * Extrai o token Bearer do header Authorization
 */
function extractTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader) {
    return null
  }
  
  if (!authHeader.startsWith('Bearer ')) {
    return null
  }
  
  return authHeader.slice(7) // Remove "Bearer "
}

/**
 * Cria cliente Supabase para validação de token server-side
 */
function createSupabaseTokenClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Valida token JWT e retorna usuário
 */
export async function getUserFromToken(token: string) {
  try {
    const supabase = createSupabaseTokenClient()
    
    // Validar token diretamente com Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error) {
      console.error('Token validation error:', error.message)
      return { user: null, error }
    }
    
    return { user, error: null }
  } catch (err) {
    console.error('getUserFromToken caught error:', err)
    return { user: null, error: err as any }
  }
}

/**
 * Middleware de autenticação baseado em Bearer token
 */
export async function requireAuthFromToken(request: NextRequest) {
  try {
    const token = extractTokenFromRequest(request)
    
    if (!token) {
      return NextResponse.json(
        { error: 'Missing Authorization header' },
        { status: 401 }
      )
    }
    
    const { user, error } = await getUserFromToken(token)
    
    if (error) {
      console.error('Token auth error:', error)
      return NextResponse.json(
        { error: 'Invalid token - Authentication failed' },
        { status: 401 }
      )
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token - User not found' },
        { status: 401 }
      )
    }
    
    return { user }
  } catch (err) {
    console.error('requireAuthFromToken caught error:', err)
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 401 }
    )
  }
}

/**
 * Middleware de admin baseado em Bearer token
 */
export async function requireAdminFromToken(request: NextRequest) {
  const authResult = await requireAuthFromToken(request)
  
  if ('status' in authResult) {
    return authResult // Retorna erro de autenticação
  }
  
  const { user } = authResult
  const isAdmin = user.user_metadata?.is_admin === true
  
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    )
  }
  
  return { user }
}