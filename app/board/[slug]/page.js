'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

const COLUMNS = [
  { key: 'planned', label: 'Planned', color: '#333' },
  { key: 'in-progress', label: 'In progress', color: '#185FA5' },
  { key: 'in-review', label: 'In review', color: '#854F0B' },
  { key: 'shipped', label: 'Shipped', color: '#0F6E56' },
]

const TAG_STYLES = {
  UI: { bg: '#22203a', color: '#7F77DD' },
  Core: { bg: '#26262e', color: '#666' },
  Feature: { bg: '#122218', color: '#1D9E75' },
  Auth: { bg: '#122218', color: '#1D9E75' },
  UX: { bg: '#241e10', color: '#BA7517' },
}

export default function BoardPage({ params }) {
  const [board, setBoard] = useState(null)
  const [cards, setCards] = useState([])
  const [boards, setBoards] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [voteCounts, setVoteCounts] = useState({})
  const [newCard, setNewCard] = useState({ col: null, title: '', tag: '' })
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRename, setShowRename] = useState(false)
  const [renameValue, setRenameValue] = useState('')
  const router = useRouter()

  useEffect(() => { checkUser() }, [])

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }
    setUser(session.user)
    fetchBoard(session.user.id)
    fetchBoards(session.user.id)
  }

  async function fetchBoard(userId) {
    const { data: b } = await supabase.from('boards').select('*').eq('slug', params.slug).eq('owner_id', userId).single()
    if (!b) { router.push('/dashboard'); return }
    setBoard(b)
    const { data: c } = await supabase.from('cards').select('*').eq('board_id', b.id).order('created_at', { ascending: true })
    const cardList = c || []
    setCards(cardList)

    if (cardList.length > 0) {
      const cardIds = cardList.map(card => card.id)
      const { data: votes } = await supabase.from('votes').select('*').in('card_id', cardIds)
      const counts = {}
      cardIds.forEach(id => counts[id] = 0)
      ;(votes || []).forEach(v => { counts[v.card_id] = (counts[v.card_id] || 0) + 1 })
      setVoteCounts(counts)
    }

    setLoading(false)
  }

  async function fetchBoards(userId) {
    const { data } = await supabase.from('boards').select('*').eq('owner_id', userId)
    setBoards(data || [])
  }

  async function addCard(col) {
    if (!newCard.title.trim()) return
    await supabase.from('cards').insert({ board_id: board.id, title: newCard.title, status: col, tag: newCard.tag || null })
    setNewCard({ col: null, title: '', tag: '' })
    fetchBoard(user.id)
  }

  async function togglePublic() {
    const updated = !board.is_public
    await supabase.from('boards').update({ is_public: updated }).eq('id', board.id)
    setBoard({ ...board, is_public: updated })
  }

  async function deleteCard(cardId) {
    await supabase.from('cards').delete().eq('id', cardId)
    setCards(cards.filter(c => c.id !== cardId))
  }

  async function moveCard(cardId, newStatus) {
    await supabase.from('cards').update({ status: newStatus }).eq('id', cardId)
    setCards(cards.map(c => c.id === cardId ? { ...c, status: newStatus } : c))
  }

  async function renameBoard() {
    if (!renameValue.trim()) return
    await supabase.from('boards').update({ name: renameValue }).eq('id', board.id)
    setBoard({ ...board, name: renameValue })
    setShowRename(false)
    setRenameValue('')
  }

  async function deleteBoard() {
    await supabase.from('boards').delete().eq('id', board.id)
    router.push('/dashboard')
  }

  function getTopVotedId() {
    const plannedCards = cards.filter(c => c.status === 'planned')
    let topId = null, topCount = 0
    plannedCards.forEach(c => {
      if ((voteCounts[c.id] || 0) > topCount) { topCount = voteCounts[c.id] || 0; topId = c.id }
    })
    return topCount > 0 ? topId : null
  }

  if (loading) return <div style={{ background: '#1c1c24', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontFamily: 'sans-serif', fontSize: '13px' }}>Loading...</div>

  const topVotedId = getTopVotedId()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#1c1c24', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      {showRename && (
        <div onClick={() => setShowRename(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', width: '360px' }}>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#ccc', marginBottom: '6px' }}>Rename board</div>
            <input
              autoFocus
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') renameBoard(); if (e.key === 'Escape') setShowRename(false) }}
              placeholder={board.name}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.08)', background: '#1c1c24', fontSize: '14px', color: '#ccc', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowRename(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', fontSize: '13px', color: '#444', cursor: 'pointer' }}>Cancel</button>
              <button onClick={renameBoard} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#fff', fontSize: '13px', color: '#1c1c24', cursor: 'pointer', fontWeight: '500' }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div onClick={() => setShowDeleteConfirm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', width: '360px' }}>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#ccc', marginBottom: '8px' }}>Delete board?</div>
            <div style={{ fontSize: '13px', color: '#555', marginBottom: '24px' }}>This will permanently delete <span style={{ color: '#aaa' }}>{board.name}</span> and all its cards. This cannot be undone.</div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', fontSize: '13px', color: '#444', cursor: 'pointer' }}>Cancel</button>
              <button onClick={deleteBoard} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#E24B4A', fontSize: '13px', color: '#fff', cursor: 'pointer', fontWeight: '500' }}>Delete board</button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div style={{ width: '190px', flexShrink: 0, background: '#1c1c24', borderRight: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
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
        <div style={{ padding: '7px 16px', fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => router.push('/dashboard')}>
          ⊞ All boards
        </div>
        <div style={{ padding: '16px 16px 6px', fontSize: '11px', color: '#3a3a44', letterSpacing: '.06em' }}>TRACK</div>
        {boards.map((b, i) => (
          <div key={b.id} onClick={() => router.push(`/board/${b.slug}`)} style={{ padding: '6px 16px', fontSize: '14px', color: b.slug === params.slug ? '#bbb' : '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ['#7F77DD','#1D9E75','#EF9F27','#D4537E','#378ADD','#D85A30'][i % 6], flexShrink: 0, display: 'inline-block' }}></span>
            {b.name}
          </div>
        ))}
        <div style={{ marginTop: 'auto', padding: '16px', borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>
          <div onClick={() => { supabase.auth.signOut(); router.push('/login') }} style={{ fontSize: '13px', color: '#444', cursor: 'pointer' }}>
            ⚙ Settings
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7F77DD', display: 'inline-block' }}></span>
            {board.name}
            <span style={{ fontSize: '12px', color: '#333', fontWeight: '400' }}>sorano.space/{board.slug}</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 11px', borderRadius: '6px', border: '0.5px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '12px', color: '#555' }}>{board?.is_public ? 'Public' : 'Private'}</span>
              <div onClick={togglePublic} style={{ width: '28px', height: '16px', borderRadius: '99px', background: board?.is_public ? '#0F6E56' : '#2e2e38', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}>
                <div style={{ position: 'absolute', top: '2px', left: board?.is_public ? '14px' : '2px', width: '12px', height: '12px', borderRadius: '50%', background: '#ccc', transition: 'left .2s' }}></div>
              </div>
            </div>
            {board?.is_public && (
              <button onClick={() => navigator.clipboard?.writeText(`https://sorano.space/${board.slug}`)} style={{ padding: '5px 11px', borderRadius: '6px', border: '0.5px solid rgba(255,255,255,0.08)', background: 'transparent', fontSize: '12px', color: '#555', cursor: 'pointer' }}>Copy link</button>
            )}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowMenu(!showMenu)} style={{ padding: '5px 10px', borderRadius: '6px', border: '0.5px solid rgba(255,255,255,0.08)', background: 'transparent', fontSize: '16px', color: '#555', cursor: 'pointer', lineHeight: 1 }}>···</button>
              {showMenu && (
                <div onClick={() => setShowMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }}>
                  <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', right: 0, top: '32px', background: '#22222c', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '4px', minWidth: '160px', zIndex: 41 }}>
                    <div onClick={() => { setShowMenu(false); setRenameValue(board.name); setShowRename(true) }} style={{ padding: '8px 12px', fontSize: '13px', color: '#888', cursor: 'pointer', borderRadius: '6px' }}>Rename board</div>
                    <div onClick={() => { setShowMenu(false); setShowDeleteConfirm(true) }} style={{ padding: '8px 12px', fontSize: '13px', color: '#E24B4A', cursor: 'pointer', borderRadius: '6px' }}>Delete board</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1 }}>
          {COLUMNS.map(col => (
            <div key={col.key} style={{ flex: 1, borderRight: '0.5px solid rgba(255,255,255,0.05)', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ fontSize: '13px', color: '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: col.color, display: 'inline-block' }}></span>
                  {col.label}
                  <span style={{ fontSize: '11px', color: '#333', background: '#22222c', padding: '1px 5px', borderRadius: '99px' }}>{cards.filter(c => c.status === col.key).length}</span>
                </div>
                <span onClick={() => setNewCard({ col: col.key, title: '', tag: '' })} style={{ fontSize: '15px', color: '#2e2e38', cursor: 'pointer', lineHeight: 1 }}>+</span>
              </div>

              {cards.filter(c => c.status === col.key).map(card => {
                const count = voteCounts[card.id] || 0
                const isTop = card.id === topVotedId
                return (
                  <div key={card.id} style={{ background: '#22222c', borderRadius: '8px', padding: '10px 11px', position: 'relative', borderTop: '0.5px solid rgba(255,255,255,0.05)', borderRight: '0.5px solid rgba(255,255,255,0.05)', borderBottom: '0.5px solid rgba(255,255,255,0.05)', borderLeft: isTop ? '2px solid #7F77DD' : '0.5px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px', marginBottom: '7px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#aaa', lineHeight: '1.45' }}>{card.title}</div>
                      <button onClick={() => deleteCard(card.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#2e2e38', fontSize: '14px', padding: '0', lineHeight: 1, flexShrink: 0 }}>✕</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                        {card.tag && (
                          <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '99px', fontWeight: '500', background: TAG_STYLES[card.tag]?.bg || '#26262e', color: TAG_STYLES[card.tag]?.color || '#666' }}>{card.tag}</span>
                        )}
                        <select onChange={e => moveCard(card.id, e.target.value)} value={card.status} style={{ fontSize: '11px', color: '#333', background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none' }}>
                          {COLUMNS.map(c => <option key={c.key} value={c.key} style={{ background: '#22222c', color: '#aaa' }}>{c.label}</option>)}
                        </select>
                      </div>
                      {count > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: isTop ? '#7F77DD' : '#444' }}>
                          <span style={{ fontSize: '9px' }}>▲</span>
                          <span>{count}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {newCard.col === col.key ? (
                <div style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 11px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <input autoFocus value={newCard.title} onChange={e => setNewCard({ ...newCard, title: e.target.value })} onKeyDown={e => e.key === 'Enter' && addCard(col.key)} placeholder="Card title..." style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '13px', color: '#aaa', width: '100%' }} />
                  <select value={newCard.tag} onChange={e => setNewCard({ ...newCard, tag: e.target.value })} style={{ background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '4px', fontSize: '11px', color: '#555', padding: '3px 6px', outline: 'none' }}>
                    <option value="">No tag</option>
                    <option>UI</option><option>Core</option><option>Feature</option><option>Auth</option><option>UX</option>
                  </select>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => addCard(col.key)} style={{ fontSize: '12px', color: '#7F77DD', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>Add</button>
                    <button onClick={() => setNewCard({ col: null, title: '', tag: '' })} style={{ fontSize: '12px', color: '#444', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div onClick={() => setNewCard({ col: col.key, title: '', tag: '' })} style={{ padding: '7px 11px', borderRadius: '8px', border: '0.5px dashed rgba(255,255,255,0.05)', fontSize: '13px', color: '#2e2e38', cursor: 'pointer' }}>+ Add card</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
