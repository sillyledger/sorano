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
  const [stats, setStats] = useState({ planned: 0, 'in-progress': 0, 'in-review': 0, shipped: 0 })
  const [recentCards, setRecentCards] = useState([])
  const router = useRouter()

  useEffect(() => { checkUser() }, [])

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }
    setUser(session.user)
    fetchBoards(session.user.id)
  }

  async function fetchBoards(userId) {
    const { data: boardData } = await supabase.from('boards').select('*').eq('owner_id', userId)
    setBoards(boardData || [])
    if (boardData && boardData.length > 0) {
      const boardIds = boardData.map(b => b.id)
      const { data: cardData } = await supabase.from('cards').select('*').in('board_id', boardIds).order('created_at', { ascending: false }).limit(10)
      if (cardData) {
        const counts = { planned: 0, 'in-progress': 0, 'in-review': 0, shipped: 0 }
        cardData.forEach(c => { if (counts[c.status] !== undefined) counts[c.status]++ })
        const allCards = await supabase.from('cards').select('*').in('board_id', boardIds)
        if (allCards.data) {
          const allCounts = { planned: 0, 'in-progress': 0, 'in-review': 0, shipped: 0 }
          allCards.data.forEach(c => { if (allCounts[c.status] !== undefined) allCounts[c.status]++ })
          setStats(allCounts)
        }
        const enriched = cardData.map(c => ({ ...c, boardName: boardData.find(b => b.id === c.board_id)?.name || '' }))
        setRecentCards(enriched)
      }
    }
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

  const statItems = [
    { label: 'Planned', key: 'planned', color: '#444' },
    { label: 'In progress', key: 'in-progress', color: '#185FA5' },
    { label: 'In review', key: 'in-review', color: '#854F0B' },
    { label: 'Shipped', key: 'shipped', color: '#0F6E56' },
  ]

  const tagStyles = {
    'planned': { bg: '#1e1e1c', color: '#555', label: 'Planned' },
    'in-progress': { bg: '#0d1829', color: '#185FA5', label: 'In progress' },
    'in-review': { bg: '#1a1005', color: '#854F0B', label: 'In review' },
    'shipped': { bg: '#0a1a12', color: '#0F6E56', label: 'Shipped' },
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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

      <div style={{ flex: 1, padding: '40px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '500', color: '#ccc', marginBottom: '4px' }}>All boards</h1>
            <p style={{ fontSize: '12px', color: '#444' }}>Your public roadmaps</p>
          </div>
          <button onClick={() => setShowModal(true)} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#fff', fontSize: '13px', color: '#1c1c24', cursor: 'pointer', fontWeight: '500' }}>
            + New board
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', marginBottom: '24px' }}>
          {statItems.map(s => (
            <div key={s.key} style={{ background: '#22222c', borderRadius: '10px', padding: '16px', border: '0.5px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color, display: 'inline-block' }}></span>
                <span style={{ fontSize: '11px', color: '#888' }}>{s.label}</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '500', color: '#bbb', lineHeight: 1 }}>{stats[s.key]}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <p style={{ color: '#444', fontSize: '13px' }}>Loading...</p>
        ) : boards.length === 0 ? (
          <p style={{ color: '#444', fontSize: '13px' }}>No boards yet. Create your first one.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', marginBottom: '32px' }}>
            {boards.map(board => (
              <div key={board.id} onClick={() => router.push(`/board/${board.slug}`)} style={{ padding: '14px', borderRadius: '10px', border: '0.5px solid rgba(255,255,255,0.07)', background: '#22222c', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#7F77DD', display: 'inline-block' }}></span>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#bbb' }}>{board.name}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#3a3a44' }}>sorano.space/{board.slug}</div>
              </div>
            ))}
          </div>
        )}

        {recentCards.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '500', color: '#888' }}>Recent activity</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {recentCards.map(card => {
                const t = tagStyles[card.status] || tagStyles['planned']
                return (
                  <div key={card.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '8px', background: '#22222c', border: '0.5px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '99px', fontWeight: '500', background: t.bg, color: t.color, flexShrink: 0 }}>{t.label}</span>
                    <span style={{ fontSize: '12px', color: '#aaa', flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.title}</span>
                    <span style={{ fontSize: '11px', color: '#3a3a44', flexShrink: 0 }}>{card.boardName}</span>
                    <span style={{ fontSize: '11px', color: '#2e2e38', flexShrink: 0, minWidth: '40px', textAlign: 'right' }}>{formatDate(card.created_at)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
