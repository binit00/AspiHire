import { useState, type FormEvent } from 'react'
import Button from '../../common/Button'
import Input from '../../common/Input'
import { login, register } from '../../../services/auth.service'
import useAuthStore from '../../../store/authStore'
import heroImage from '../../../assets/hero.png'

type AuthMode = 'login' | 'register'

const getErrorMessage = (err: unknown) => {
  if (err instanceof Error) return err.message
  if (typeof err === 'object' && err && 'message' in err) {
    const message = (err as { message?: unknown }).message
    if (typeof message === 'string') return message
  }
  return 'Authentication failed'
}

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((state) => state.setAuth)

  const isRegister = mode === 'register'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = isRegister
        ? await register({ name, email, password })
        : await login({ email, password })

      setAuth(response.data.token, response.data.user)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setError('')
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-5xl grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg md:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden min-h-[560px] bg-slate-900 md:block">
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-slate-950/35" />
          <div className="absolute inset-x-8 bottom-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">
              HireFlow
            </p>
            <h1 className="text-3xl font-bold leading-tight text-white">
              Keep every interview, offer, and follow-up moving.
            </h1>
          </div>
        </div>

        <div className="flex min-h-[560px] flex-col justify-center p-6 sm:p-10">
          <div className="mb-8">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="5" height="14" rx="1.5" fill="white" fillOpacity="0.9" />
                <rect x="8" y="1" width="5" height="9" rx="1.5" fill="white" fillOpacity="0.6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {isRegister
                ? 'Start tracking your search with a private board.'
                : 'Sign in to continue managing your job pipeline.'}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors focus-ring ${
                !isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors focus-ring ${
                isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Register
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {isRegister && (
              <Input
                id="auth-name"
                label="Name"
                value={name}
                onChange={setName}
                placeholder="Your name"
              />
            )}
            <Input
              id="auth-email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
            />
            <Input
              id="auth-password"
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder={isRegister ? 'At least 6 characters' : 'Your password'}
            />

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" disabled={loading} className="w-full">
              {loading ? 'Working...' : isRegister ? 'Create account' : 'Login'}
            </Button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default AuthPage
