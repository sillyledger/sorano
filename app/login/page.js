'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  async function handleLogin() {
    if (!email.trim()) return
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'https://app.sorano.space/dashboard' }
    })
    setSent(true)
  }

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '40px', maxWidth: '400px', margin: '80px auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '4px' }}>Sorano</h1>
      <p style={{ fontSize: '13px', color: '#888', marginBottom: '32px' }}>Sign in to manage your boards</p>

      {sent ? (
        <p style={{ fontSize: '14px', color: '#1D9E75' }}>Check your email for a magic link.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="your@email.com"
            style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '14px' }}
          />
          <button
            onClick={handleLogin}
            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e0e0e0', background: 'transparent', fontSize: '14px', cursor: 'pointer' }}
          >
            Send magic link
          </button>
        </div>
      )}
    </main>
  )
}
