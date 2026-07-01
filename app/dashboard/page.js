'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import SettingsModal from './SettingsModal'
import { getUserPlan, FREE_BOARD_LIMIT } from '../../lib/plan'

export default function Dashboard() {
  const [boards, setBoards] = useState([])
  const [newBoard, setNewBoard] = useState('')
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [user, setUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [boardToDelete, setBoardToDelete] = useState(null)
  const [stats, setStats] = useState({ planned: 0, 'in-progress': 0, 'in-review': 0, shipped: 0 })
  const [recentCards, setRecentCards] = useState([])
  const router = useRouter()

  useEffect(() => { checkUser() }, [])

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }
    setUser(session.user)
    setAuthChecked(true)
    fetchBoards(session.user.id)
  }

  async function fetchBoards(userId) {
    const { data: boardData } = await supabase.from('boards').select('*').eq('owner_id', userId)
    setBoards(boardData || [])
    if (boardData && boardData.length > 0) {
      const boardIds = boardData.map(b => b.id)
      const { data: cardData } = await supabase.from('cards').select('*').in('board_id', boardIds).order('created_at', { ascending: false }).limit(10)
      if (cardData) {
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
    if (getUserPlan(user?.email) === 'free' && boards.length >= FREE_BOARD_LIMIT) return
    const slug = newBoard.toLowerCase().replace(/\s+/g, '-')
    await supabase.from('boards').insert({ name: newBoard, slug, owner_id: user.id })
    setNewBoard('')
    setShowModal(false)
    fetchBoards(user.id)
  }

  async function deleteBoard() {
    if (!boardToDelete) return
    await supabase.from('boards').delete().eq('id', boardToDelete.id)
    setShowDeleteConfirm(false)
    setBoardToDelete(null)
    fetchBoards(user.id)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  function handleNewBoard() {
    if (getUserPlan(user?.email) === 'free' && boards.length >= FREE_BOARD_LIMIT) return
    setShowModal(true)
  }

  const isAtLimit = getUserPlan(user?.email) === 'free' && boards.length >= FREE_BOARD_LIMIT

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

  const COLORS = ['#7F77DD','#1D9E75','#EF9F27','#D4537E','#378ADD','#D85A30']

  if (!authChecked) {
    return (
      <div style={{ minHeight: '100vh', background: '#1c1c24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7F77DD', opacity: 0.5 }} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#1c1c24', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      {showSettings && (
        <SettingsModal user={user} onClose={() => setShowSettings(false)} />
      )}

      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', width: '360px' }}>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#ccc', marginBottom: '6px' }}>New board</div>
            <div style={{ fontSize: '13px', color: '#444', marginBottom: '20px' }}>Give your roadmap a name. You can change this later.</div>
            <input
              autoFocus
              value={newBoard}
              onChange={e => setNewBoard(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') createBoard(); if (e.key === 'Escape') setShowModal(false) }}
              placeholder="e.g. TWO app, Aegos intel..."
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.08)', background: '#1c1c24', fontSize: '14px', color: '#ccc', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', fontSize: '14px', color: '#444', cursor: 'pointer' }}>Cancel</button>
              <button onClick={createBoard} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#fff', fontSize: '14px', color: '#1c1c24', cursor: 'pointer', fontWeight: '500' }}>Create board</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div onClick={() => setShowDeleteConfirm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', width: '360px' }}>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#ccc', marginBottom: '8px' }}>Delete board?</div>
            <div style={{ fontSize: '13px', color: '#555', marginBottom: '24px' }}>This will permanently delete <span style={{ color: '#aaa' }}>{boardToDelete?.name}</span> and all its cards. This cannot be undone.</div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowDeleteConfirm(false); setBoardToDelete(null) }} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', fontSize: '13px', color: '#444', cursor: 'pointer' }}>Cancel</button>
              <button onClick={deleteBoard} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#E24B4A', fontSize: '13px', color: '#fff', cursor: 'pointer', fontWeight: '500' }}>Delete board</button>
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
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#ccc' }}>sorano</span>
        </div>
        <div style={{ padding: '7px 16px', fontSize: '14px', color: '#bbb', display: 'flex', alignItems: 'center', gap: '8px' }}>⊞ All boards</div>
        <div style={{ padding: '16px 16px 6px', fontSize: '11px', color: '#3a3a44', letterSpacing: '.06em' }}>TRACK</div>
        {boards.map((b, i) => (
          <div key={b.id} onClick={() => router.push(`/board/${b.slug}`)} style={{ padding: '6px 16px', fontSize: '14px', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: COLORS[i % 6], flexShrink: 0, display: 'inline-block' }}></span>
            {b.name}
          </div>
        ))}
        <div style={{ marginTop: 'auto', padding: '16px', borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '12px', color: '#444', marginBottom: '10px' }}>{user?.email}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div onClick={() => setShowSettings(true)} style={{ fontSize: '13px', color: '#3a3a44', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 1v1.2M6.5 10.8V12M1 6.5h1.2M10.8 6.5H12M2.757 2.757l.849.849M9.394 9.394l.849.849M2.757 10.243l.849-.849M9.394 3.606l.849-.849" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              Settings
            </div>
            <div onClick={handleSignOut} style={{ fontSize: '13px', color: '#3a3a44', cursor: 'pointer' }}>Sign out</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '40px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#ccc', marginBottom: '4px' }}>All boards</h1>
            <p style={{ fontSize: '13px', color: '#444' }}>Your public roadmaps</p>
          </div>

          <div style={{ position: 'relative' }} className="new-board-wrap">
            <button
              onClick={handleNewBoard}
              disabled={isAtLimit}
              title={isAtLimit ? 'Upgrade to Pro to add more boards' : ''}
              style={{
                padding: '8px 18px', borderRadius: '8px', border: 'none',
                background: isAtLimit ? '#2a2a34' : '#fff',
                fontSize: '14px',
                color: isAtLimit ? '#444' : '#1c1c24',
                cursor: isAtLimit ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                transition: 'background 0.15s',
              }}
            >
              + New board
            </button>
            {isAtLimit && (
              <div style={{
                position: 'absolute', bottom: 'calc(100% + 8px)', right: 0,
                background: '#2e2e3a', border: '0.5px solid rgba(255,255,255,0.08)',
                borderRadius: '8px', padding: '8px 12px',
                fontSize: '12px', color: '#aaa', whiteSpace: 'nowrap',
                pointerEvents: 'none', zIndex: 10,
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}>
                <span style={{ color: '#7F77DD', fontWeight: '500' }}>Free plan</span> · 3 board limit reached
                <div style={{ marginTop: '4px', color: '#555' }}>Upgrade to Pro for unlimited boards</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', marginBottom: '24px' }}>
          {statItems.map(s => (
            <div key={s.key} style={{ background: '#22222c', borderRadius: '10px', padding: '16px', border: '0.5px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color, display: 'inline-block' }}></span>
                <span style={{ fontSize: '12px', color: '#888' }}>{s.label}</span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '500', color: '#bbb', lineHeight: 1 }}>{stats[s.key]}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <p style={{ color: '#444', fontSize: '14px' }}>Loading...</p>
        ) : boards.length === 0 ? (
          <p style={{ color: '#444', fontSize: '14px' }}>No boards yet. Create your first one.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', marginBottom: '32px' }}>
            {boards.map((board, i) => (
              <div key={board.id} style={{ padding: '14px', borderRadius: '10px', border: '0.5px solid rgba(255,255,255,0.07)', background: '#22222c', position: 'relative' }}>
                <div onClick={() => router.push(`/board/${board.slug}`)} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: COLORS[i % 6], display: 'inline-block' }}></span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#bbb' }}>{board.name}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#3a3a44' }}>sorano.space/{board.slug}</div>
                </div>
                <div
                  onClick={e => { e.stopPropagation(); setBoardToDelete(board); setShowDeleteConfirm(true) }}
                  style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '16px', color: '#2e2e38', cursor: 'pointer', lineHeight: 1, padding: '2px 6px', borderRadius: '4px' }}
                >···</div>
              </div>
            ))}
          </div>
        )}

        {recentCards.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#888' }}>Recent activity</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {recentCards.map(card => {
                const t = tagStyles[card.status] || tagStyles['planned']
                return (
                  <div key={card.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '8px', background: '#22222c', border: '0.5px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '99px', fontWeight: '500', background: t.bg, color: t.color, flexShrink: 0 }}>{t.label}</span>
                    <span style={{ fontSize: '13px', color: '#aaa', flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.title}</span>
                    <span style={{ fontSize: '12px', color: '#3a3a44', flexShrink: 0 }}>{card.boardName}</span>
                    <span style={{ fontSize: '12px', color: '#2e2e38', flexShrink: 0, minWidth: '40px', textAlign: 'right' }}>{formatDate(card.created_at)}</span>
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
