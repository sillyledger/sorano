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

  useEffect(() => {
    checkUser()
  }, [])

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

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '4px' }}>Sorano</h1>
          <p style={{ color: '#888', fontSize: '13px' }}>{user?.email}</p>
        </div>
        <button onClick={handleSignOut} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #e0e0e0', background: 'transparent', fontSize: '13px', cursor: 'pointer', color: '#888' }}>
          Sign out
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        <input
          value={newBoard}
          onChange={e => setNewBoard(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && createBoard()}
          placeholder="New board name..."
          style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '14px' }}
        />
        <button onClick={createBoard} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e0e0e0', background: 'transparent', fontSize: '14px', cursor: 'pointer' }}>
          Create
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#888', fontSize: '13px' }}>Loading...</p>
      ) : boards.length === 0 ? (
        <p style={{ color: '#888', fontSize: '13px' }}>No boards yet. Create your first one above.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {boards.map(board => (
            <a key={board.id} href={`/board/${board.slug}`} style={{ display: 'block', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e0e0e0', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>{board.name}</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>sorano.space/{board.slug}</div>
            </a>
          ))}
        </div>
      )}
    </main>
  )
}
