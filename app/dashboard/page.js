'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [boards, setBoards] = useState([])
  const [newBoard, setNewBoard] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  useEffect(() => { checkUser() }, [])

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }
    setUser(session.user)
    fetchBoards(session.user.id)
  }

  async function fetchBoards(userId) {
    const { data } = await supabase.from('boards').select('*').eq('owner_id', userId)
    setBoards(data || [])
    setLoading(false)
  }

  async function createBoard() {
    if (!newBoard.trim() || !user) return
    const slug = newBoard.toLowerCase().replace(/\s+/g, '-')
    await supabase.from('boards').insert({ name: newBoard, slug, owner_id: user.id })
    setNewBoard('')
    setShowModal(false)
    fetchBoards(user.id)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#1c1c24', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', width: '360px' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#ccc', marginBottom: '6px' }}>New board</div>
            <div style={{ fontSize: '12px', color: '#444', marginBottom: '20px' }}>Give your roadmap a name. You can change this later.</div>
            <input
              autoFocus
              value={newBoard}
              onChange={e => setNewBoard(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') createBoard(); if (e.key === 'Escape') setShowModal(false) }}
              placeholder="e.g. TWO app, Aegos intel..."
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.08)', background: '#1c1c24', fontSize: '13px', color: '#ccc', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', fontSize: '13px', color: '#444', cursor: 'pointer' }}>Cancel</button>
              <button onClick={createBoard} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#fff', fontSize: '13px', color: '#1c1c24', cursor: 'pointer', fontWeight: '500' }}>Create board</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ width: '190px', flexShrink: 0, borderRight: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
        <div style={{ padding: '0 16px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#2e2e3a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="9" rx="1.5" fill="#7F77DD" opacity="0.9"/>
              <rect x="9" y="1" width="6" height="5" rx="1.5" fill="#7F77DD" opacity="0.5"/>
              <rect x="9" y="8" width="6" height="7" rx="1.5" fill="#7F77DD" opacity="0.7"/>
            </svg>
          </div>
          <span style={{ fontSize: '13px', fontWeight: '500', color: '#ccc' }}>sorano</span>
        </div>
        <div style={{ padding: '7px 16px', fontSize: '13px', color: '#bbb', display: 'flex', alignItems: 'center', gap: '8px' }}>⊞ All boards</div>
        <div style={{ padding: '16px 16px 6px', fontSize: '10px', color: '#3a3a44', letterSpacing: '.06em' }}>TRACK</div>
        {boards.map(b => (
          <div key={b.id} onClick={() => router.push(`/board/${b.slug}`)} style={{ padding: '6px 16px', fontSize: '13px', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#333', flexShrink: 0, display: 'inline-block' }}></span>
            {b.name}
          </div>
        ))}
        <div style={{ marginTop: 'auto', padding: '16px', borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '11px', color: '#444', marginBottom: '10px' }}>{user?.email}</div>
          <div onClick={handleSignOut} style={{ fontSize: '12px', color: '#3a3a44', cursor: 'pointer' }}>Sign out</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '500', color: '#ccc', marginBottom: '4px' }}>All boards</h1>
            <p style={{ fontSize: '12px', color: '#444' }}>Your public roadmaps</p>
          </div>
          <button onClick={() => setShowModal(true)} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#fff', fontSize: '13px', color: '#1c1c24', cursor: 'pointer', fontWeight: '500' }}>
            + New board
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#444', fontSize: '13px' }}>Loading...</p>
        ) : boards.length === 0 ? (
          <p style={{ color: '#444', fontSize: '13px' }}>No boards yet. Create your first one.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
            {boards.map(board => (
              <div key={board.id} onClick={() => router.push(`/board/${board.slug}`)} style={{ padding: '16px', borderRadius: '10px', border: '0.5px solid rgba(255,255,255,0.07)', background: '#22222c', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#7F77DD', display: 'inline-block' }}></span>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#bbb' }}>{board.name}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#3a3a44' }}>sorano.space/{board.slug}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
