'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: 'signin' | 'signup'
  onSuccess?: () => void
}

export function AuthModal({ 
  open, 
  onOpenChange, 
  defaultTab = 'signin',
  onSuccess 
}: AuthModalProps) {
  const { signIn, signUp, user } = useAuth()
  const [tab, setTab] = useState<'signin' | 'signup'>(defaultTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [awaitingAuth, setAwaitingAuth] = useState(false)

  // Detectar quando usuário é autenticado após signup
  useEffect(() => {
    if (awaitingAuth && user && open) {
      // Usuário foi autenticado, fechar modal
      setAwaitingAuth(false)
      onOpenChange(false)
      onSuccess?.()
    }
  }, [user, awaitingAuth, open, onOpenChange, onSuccess])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setLoading(true)

    try {
      if (tab === 'signin') {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message)
        } else {
          onOpenChange(false)
          onSuccess?.()
        }
      } else {
        const { error } = await signUp(email, password)
        if (error) {
          setError(error.message)
        } else {
          // Signup bem-sucedido, aguardar contexto ser atualizado
          setAwaitingAuth(true)
          // O useEffect acima vai detectar quando user for setado e fechar o modal
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setError(null)
    setSuccessMessage(null)
  }

  const switchTab = (newTab: 'signin' | 'signup') => {
    setTab(newTab)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {tab === 'signin' ? 'Entrar na sua conta' : 'Criar uma conta'}
          </DialogTitle>
          <DialogDescription>
            {tab === 'signin' 
              ? 'Digite seu email e senha para entrar'
              : 'Digite seu email e senha para criar uma nova conta'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex w-full rounded-lg bg-muted p-1 mb-4">
          <button
            type="button"
            onClick={() => switchTab('signin')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              tab === 'signin' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => switchTab('signup')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              tab === 'signup' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Cadastrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="text-sm text-green-600 text-center">
              {successMessage}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tab === 'signin' ? 'Entrando...' : 'Criando conta...'}
              </>
            ) : (
              tab === 'signin' ? 'Entrar' : 'Cadastrar'
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          {tab === 'signin' ? (
            <>
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={() => switchTab('signup')}
                className="text-primary hover:underline"
              >
                Cadastre-se
              </button>
            </>
          ) : (
            <>
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={() => switchTab('signin')}
                className="text-primary hover:underline"
              >
                Entre aqui
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}