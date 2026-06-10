'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit() {
    setError('')
    setMessage('')
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      router.push('/dashboard')
    }

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      if (data.session) {
        router.push('/dashboard')
      } else {
        setMessage('Account created. You can now sign in.')
        setMode('login')
        setLoading(false)
      }
    }

    if (mode === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://app.sorano.space/update-password'
      })
      if (error) { setError(error.message); setLoading(false); return }
      setMessage('Password reset link sent. Check your email.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1c1c24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ width: '360px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#2e2e3a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="9" rx="1.5" fill="#7F77DD" opacity="0.9"/>
              <rect x="9" y="1" width="6" height="5" rx="1.5" fill="#7F77DD" opacity="0.5"/>
              <rect x="9" y="8" width="6" height="7" rx="1.5" fill="#7F77DD" opacity="0.7"/>
            </svg>
          </div>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#ccc' }}>sorano</span>
        </div>

        <div style={{ fontSize: '18px', fontWeight: '500', color: '#ccc', marginBottom: '6px' }}>
          {mode === 'login' && 'Sign in'}
          {mode === 'signup' && 'Create account'}
          {mode === 'reset' && 'Reset password'}
        </div>
        <div style={{ fontSize: '12px', color: '#444', marginBottom: '28px' }}>
          {mode === 'login' && 'Welcome back.'}
          {mode === 'signup' && 'Start building your public roadmap.'}
          {mode === 'reset' && "We'll send you a reset link."}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            style={{ padding: '10px 12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.08)', background: '#22222c', fontSize: '13px', color: '#ccc', outline: 'none' }}
          />
          {mode !== 'reset' && (
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Password"
              style={{ padding: '10px 12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.08)', background: '#22222c', fontSize: '13px', color: '#ccc', outline: 'none' }}
            />
          )}

          {error && <div style={{ fontSize: '12px', color: '#E24B4A' }}>{error}</div>}
          {message && <div style={{ fontSize: '12px', color: '#1D9E75' }}>{message}</div>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ padding: '10px', borderRadius: '8px', border: 'none', background: '#fff', fontSize: '13px', color: '#1c1c24', cursor: 'pointer', fontWeight: '500', marginTop: '4px', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
          </button>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {mode === 'login' && (
            <>
              <div onClick={() => { setMode('signup'); setError(''); setMessage('') }} style={{ fontSize: '12px', color: '#444', cursor: 'pointer' }}>Don't have an account? <span style={{ color: '#7F77DD' }}>Sign up</span></div>
              <div onClick={() => { setMode('reset'); setError(''); setMessage('') }} style={{ fontSize: '12px', color: '#444', cursor: 'pointer' }}>Forgot password? <span style={{ color: '#7F77DD' }}>Reset it</span></div>
            </>
          )}
          {mode !== 'login' && (
            <div onClick={() => { setMode('login'); setError(''); setMessage('') }} style={{ fontSize: '12px', color: '#444', cursor: 'pointer' }}>Back to <span style={{ color: '#7F77DD' }}>sign in</span></div>
          )}
        </div>
      </div>
    </div>
  )
}
