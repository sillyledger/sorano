'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [boards, setBoards] = useState([])
  const [newBoard, setNewBoard] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBoards()
  }, [])

  async function fetchBoards() {
    const { data } = await supabase.from('boards').select('*')
    setBoards(data || [])
    setLoading(false)
  }

  async function createBoard() {
    if (!newBoard.trim()) return
    const slug = newBoard.toLowerCase().replace(/\s+/g, '-')
    await supabase.from('boards').insert({ name: newBoard, slug })
    setNewBoard('')
    fetchBoards()
  }

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '4px' }}>Sorano</h1>
      <p style={{ color: '#888', fontSize: '13px', marginBottom: '32px' }}>Your boards</p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        <input
          value={newBoard}
          onChange={e => setNewBoard(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && createBoard()}
          placeholder="New board name..."
          style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '14px' }}
        />
        <button
          onClick={createBoard}
          style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e0e0e0', background: 'transparent', fontSize: '14px', cursor: 'pointer' }}
        >
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
            <a key={board.id} href={`/${board.slug}`} style={{ display: 'block', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e0e0e0', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>{board.name}</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>sorano.space/{board.slug}</div>
            </a>
          ))}
        </div>
      )}
    </main>
  )
}
