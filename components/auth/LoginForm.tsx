'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const REMEMBERED_EMAIL_KEY = 'ticktock:remembered-email'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [authError, setAuthError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Prefill the email if the user previously checked "Remember me"
  useEffect(() => {
    const rememberedEmail = window.localStorage.getItem(REMEMBERED_EMAIL_KEY)
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAuthError('')

    const nextErrors: { email?: string; password?: string } = {}
    if (!email.trim()) nextErrors.email = 'Email is required'
    if (!password) nextErrors.password = 'Password is required'
    setErrors(nextErrors)
    if (nextErrors.email || nextErrors.password) return

    setSubmitting(true)
    const result = await signIn('credentials', { email, password, redirect: false })
    setSubmitting(false)

    if (result?.error) {
      setAuthError('Invalid email or password')
      return
    }

    if (rememberMe) {
      window.localStorage.setItem(REMEMBERED_EMAIL_KEY, email)
    } else {
      window.localStorage.removeItem(REMEMBERED_EMAIL_KEY)
    }

    router.push('/dashboard')
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          id="email"
          placeholder="name@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          id="password"
          placeholder="••••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
        />
        <label className="flex items-center gap-2 text-sm text-gray-500">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Remember me
        </label>
        {authError && <p className="text-sm text-red-600">{authError}</p>}
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}
