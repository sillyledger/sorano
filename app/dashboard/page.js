'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [boards, setBoards] = useState([])
  const [newBoard, setNewBoard] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
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
    fetchBoards(user.id)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#1c1c24', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
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
        <div style={{ marginTop: 'auto', padding: '16px', borderTop: '0.5px solid rgba(255,255,255,0.05)', fontSize: '11px', color: '#444' }}>
          {user?.email}
        </div>
      </div>

      <div style={{ flex: 1, padding: '40px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '500', color: '#ccc', marginBottom: '4px' }}>All boards</h1>
          <p style={{ fontSize: '12px', color: '#444' }}>Your public roadmaps</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          <input
            value={newBoard}
            onChange={e => setNewBoard(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createBoard()}
            placeholder="New board name..."
            style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.08)', background: '#22222c', fontSize: '13px', color: '#ccc', outline: 'none' }}
          />
          <button onClick={createBoard} style={{ padding: '9px 18px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.08)', background: 'transparent', fontSize: '13px', color: '#666', cursor: 'pointer' }}>
            Create
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#444', fontSize: '13px' }}>Loading...</p>
        ) : boards.length === 0 ? (
          <p style={{ color: '#444', fontSize: '13px' }}>No boards yet. Create your first one above.</p>
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
