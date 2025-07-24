'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Verificar se admin já está logado no localStorage
  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_authenticated')
    if (adminAuth === 'true') {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoginLoading(true)

    try {
      // Login hardcoded para admin - sistema completamente separado
      if (email === 'admin@usecreatorhub.com' && password === 'admincreatorhub102030') {
        localStorage.setItem('admin_authenticated', 'true')
        setIsAuthenticated(true)
        setError(null)
      } else {
        setError('Credenciais administrativas inválidas')
      }
    } catch (err) {
      setError('Erro inesperado durante o login')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Se admin não está autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">Entre com suas credenciais administrativas</p>
          </div>
          
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email Administrativo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@usecreatorhub.com"
                required
                disabled={loginLoading}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loginLoading}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>

            {error && (
              <div className="text-sm text-red-500 text-center bg-red-50 dark:bg-red-950 p-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar no Admin'
              )}
            </button>
          </form>
          
          <div className="text-center text-xs text-muted-foreground">
            Acesso restrito apenas para administradores
          </div>
        </div>
      </div>
    )
  }

  // Admin autenticado - mostrar conteúdo administrativo com logout
  return (
    <div>
      {/* Botão de logout no topo */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
        >
          Sair Admin
        </button>
      </div>
      {children}
    </div>
  )
}