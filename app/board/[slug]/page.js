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

const PRESET_COLORS = [
  '#7F77DD', '#1D9E75', '#EF9F27', '#D4537E', '#378ADD', '#D85A30', '#666', '#BA7517'
]

export default function BoardPage({ params }) {
  const [board, setBoard] = useState(null)
  const [cards, setCards] = useState([])
  const [boards, setBoards] = useState([])
  const [tags, setTags] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [voteCounts, setVoteCounts] = useState({})
  const [newCard, setNewCard] = useState({ col: null, title: '', tag: '' })
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRename, setShowRename] = useState(false)
  const [showTagManager, setShowTagManager] = useState(false)
  const [labelPickerCardId, setLabelPickerCardId] = useState(null)
  const [pickerNewName, setPickerNewName] = useState('')
  const [pickerNewColor, setPickerNewColor] = useState('#7F77DD')
  const [pickerShowCreate, setPickerShowCreate] = useState(false)
  const [editingNoteCardId, setEditingNoteCardId] = useState(null)
  const [noteValue, setNoteValue] = useState('')
  const [renameValue, setRenameValue] = useState('')
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#7F77DD')
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
    const { data: t } = await supabase.from('tags').select('*').eq('board_id', b.id).order('created_at', { ascending: true })
    setTags(t || [])
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

  async function addTag() {
    if (!newTagName.trim()) return
    const { data } = await supabase.from('tags').insert({ board_id: board.id, name: newTagName.trim(), color: newTagColor }).select().single()
    if (data) setTags(prev => [...prev, data])
    setNewTagName('')
    setNewTagColor('#7F77DD')
  }

  async function addTagFromPicker(cardId) {
    if (!pickerNewName.trim()) return
    const { data } = await supabase.from('tags').insert({ board_id: board.id, name: pickerNewName.trim(), color: pickerNewColor }).select().single()
    if (data) {
      setTags(prev => [...prev, data])
      await updateCardLabel(cardId, data.id)
    }
    setPickerNewName('')
    setPickerNewColor('#7F77DD')
    setPickerShowCreate(false)
  }

  async function deleteTag(tagId) {
    await supabase.from('tags').delete().eq('id', tagId)
    setTags(prev => prev.filter(t => t.id !== tagId))
    setCards(prev => prev.map(c => c.tag === tagId ? { ...c, tag: null } : c))
  }

  async function updateCardLabel(cardId, tagId) {
    await supabase.from('cards').update({ tag: tagId || null }).eq('id', cardId)
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, tag: tagId || null } : c))
    setLabelPickerCardId(null)
    setPickerShowCreate(false)
    setPickerNewName('')
    setPickerNewColor('#7F77DD')
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
    const isShipping = newStatus === 'shipped'
    const wasShipped = cards.find(c => c.id === cardId)?.status === 'shipped'
    const updates = { status: newStatus }
    if (isShipping && !wasShipped) updates.shipped_at = new Date().toISOString()
    if (!isShipping && wasShipped) { updates.shipped_at = null; updates.shipped_note = null }
    await supabase.from('cards').update(updates).eq('id', cardId)
    setCards(cards.map(c => c.id === cardId ? { ...c, ...updates } : c))
  }

  async function saveNote(cardId) {
    await supabase.from('cards').update({ shipped_note: noteValue.trim() || null }).eq('id', cardId)
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, shipped_note: noteValue.trim() || null } : c))
    setEditingNoteCardId(null)
    setNoteValue('')
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

  function getTag(tagId) {
    return tags.find(t => t.id === tagId) || null
  }

  function openPicker(cardId) {
    setLabelPickerCardId(cardId)
    setPickerShowCreate(false)
    setPickerNewName('')
    setPickerNewColor('#7F77DD')
  }

  function formatDate(iso) {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (loading) return <div style={{ background: '#1c1c24', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontFamily: 'sans-serif', fontSize: '13px' }}>Loading...</div>

  const topVotedId = getTopVotedId()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#1c1c24', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
      onClick={() => { setLabelPickerCardId(null); setPickerShowCreate(false) }}
    >

      {/* Rename modal */}
      {showRename && (
        <div onClick={() => setShowRename(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', width: '360px' }}>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#ccc', marginBottom: '6px' }}>Rename board</div>
            <input autoFocus value={renameValue} onChange={e => setRenameValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') renameBoard(); if (e.key === 'Escape') setShowRename(false) }} placeholder={board.name} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.08)', background: '#1c1c24', fontSize: '14px', color: '#ccc', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }} />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowRename(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', fontSize: '13px', color: '#444', cursor: 'pointer' }}>Cancel</button>
              <button onClick={renameBoard} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#fff', fontSize: '13px', color: '#1c1c24', cursor: 'pointer', fontWeight: '500' }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
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

      {/* Tag manager modal */}
      {showTagManager && (
        <div onClick={() => setShowTagManager(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', width: '400px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#ccc', marginBottom: '20px' }}>Manage labels</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {tags.length === 0 && <div style={{ fontSize: '13px', color: '#3a3a44' }}>No labels yet. Create one below.</div>}
              {tags.map(tag => (
                <div key={tag.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#1c1c24', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: tag.color, flexShrink: 0 }}></div>
                    <span style={{ fontSize: '13px', padding: '2px 10px', borderRadius: '99px', background: tag.color + '22', color: tag.color }}>{tag.name}</span>
                  </div>
                  <button onClick={() => deleteTag(tag.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#3a3a44', fontSize: '14px', padding: '0' }}>✕</button>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
              <div style={{ fontSize: '11px', color: '#3a3a44', marginBottom: '10px', letterSpacing: '.06em' }}>NEW LABEL</div>
              <input value={newTagName} onChange={e => setNewTagName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} placeholder="Label name..." style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.08)', background: '#1c1c24', fontSize: '13px', color: '#ccc', outline: 'none', boxSizing: 'border-box', marginBottom: '10px' }} />
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
                {PRESET_COLORS.map(c => (
                  <div key={c} onClick={() => setNewTagColor(c)} style={{ width: '20px', height: '20px', borderRadius: '50%', background: c, cursor: 'pointer', border: newTagColor === c ? '2px solid #fff' : '2px solid transparent' }}></div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {newTagName && <span style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '99px', background: newTagColor + '22', color: newTagColor }}>{newTagName}</span>}
                <button onClick={addTag} style={{ marginLeft: 'auto', padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#7F77DD', fontSize: '13px', color: '#fff', cursor: 'pointer', fontWeight: '500' }}>Add label</button>
              </div>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowTagManager(false)} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: 'transparent', fontSize: '13px', color: '#444', cursor: 'pointer' }}>Done</button>
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
          <div onClick={() => { supabase.auth.signOut(); router.push('/login') }} style={{ fontSize: '13px', color: '#444', cursor: 'pointer' }}>⚙ Settings</div>
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
            <button onClick={() => setShowTagManager(true)} style={{ padding: '5px 11px', borderRadius: '6px', border: '0.5px solid rgba(255,255,255,0.08)', background: 'transparent', fontSize: '12px', color: '#555', cursor: 'pointer' }}>Labels</button>
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
                const tag = getTag(card.tag)
                const pickerOpen = labelPickerCardId === card.id
                const isEditingNote = editingNoteCardId === card.id

                return (
                  <div key={card.id} style={{ background: '#22222c', borderRadius: '8px', padding: '10px 11px', position: 'relative', borderTop: '0.5px solid rgba(255,255,255,0.05)', borderRight: '0.5px solid rgba(255,255,255,0.05)', borderBottom: '0.5px solid rgba(255,255,255,0.05)', borderLeft: isTop ? '2px solid #7F77DD' : '0.5px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px', marginBottom: '7px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#aaa', lineHeight: '1.45' }}>{card.title}</div>
                      <button onClick={() => deleteCard(card.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#2e2e38', fontSize: '14px', padding: '0', lineHeight: 1, flexShrink: 0 }}>✕</button>
                    </div>

                    {/* Shipped note */}
                    {col.key === 'shipped' && (
                      <div style={{ marginBottom: '7px' }}>
                        {isEditingNote ? (
                          <div onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <textarea
                              autoFocus
                              value={noteValue}
                              onChange={e => setNoteValue(e.target.value)}
                              placeholder="Add a release note..."
                              rows={2}
                              style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '0.5px solid rgba(255,255,255,0.1)', background: '#1c1c24', fontSize: '11px', color: '#ccc', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                            />
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button onClick={() => saveNote(card.id)} style={{ fontSize: '11px', color: '#7F77DD', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>Save</button>
                              <button onClick={() => { setEditingNoteCardId(null); setNoteValue('') }} style={{ fontSize: '11px', color: '#444', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div onClick={e => { e.stopPropagation(); setEditingNoteCardId(card.id); setNoteValue(card.shipped_note || '') }} style={{ cursor: 'pointer' }}>
                            {card.shipped_note ? (
                              <div style={{ fontSize: '11px', color: '#555', lineHeight: '1.5' }}>{card.shipped_note}</div>
                            ) : (
                              <div style={{ fontSize: '11px', color: '#2e2e38', fontStyle: 'italic' }}>+ add release note</div>
                            )}
                          </div>
                        )}
                        {card.shipped_at && <div style={{ fontSize: '10px', color: '#2e2e38', marginTop: '4px' }}>{formatDate(card.shipped_at)}</div>}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', position: 'relative' }}>
                        <div onClick={e => { e.stopPropagation(); openPicker(pickerOpen ? null : card.id) }} style={{ cursor: 'pointer' }}>
                          {tag ? (
                            <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '99px', fontWeight: '500', background: tag.color + '22', color: tag.color }}>{tag.name}</span>
                          ) : (
                            <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '99px', color: '#333', border: '0.5px dashed #2e2e38' }}>+ label</span>
                          )}
                        </div>

                        {pickerOpen && (
                          <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: '22px', left: 0, background: '#2a2a34', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '4px', zIndex: 30, minWidth: '160px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                            <div onClick={() => updateCardLabel(card.id, null)} style={{ padding: '6px 10px', fontSize: '12px', color: '#555', cursor: 'pointer', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '10px' }}>✕</span> No label
                            </div>
                            {tags.map(t => (
                              <div key={t.id} onClick={() => updateCardLabel(card.id, t.id)} style={{ padding: '6px 10px', fontSize: '12px', cursor: 'pointer', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.color, flexShrink: 0, display: 'inline-block' }}></span>
                                <span style={{ color: t.color }}>{t.name}</span>
                                {card.tag === t.id && <span style={{ marginLeft: 'auto', color: '#7F77DD', fontSize: '10px' }}>✓</span>}
                              </div>
                            ))}
                            <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', marginTop: '4px', paddingTop: '4px' }}>
                              {!pickerShowCreate ? (
                                <div onClick={() => setPickerShowCreate(true)} style={{ padding: '6px 10px', fontSize: '12px', color: '#555', cursor: 'pointer', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span>+</span> New label
                                </div>
                              ) : (
                                <div style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  <input autoFocus value={pickerNewName} onChange={e => setPickerNewName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addTagFromPicker(card.id); if (e.key === 'Escape') setPickerShowCreate(false) }} placeholder="Label name..." style={{ padding: '5px 8px', borderRadius: '5px', border: '0.5px solid rgba(255,255,255,0.1)', background: '#1c1c24', fontSize: '11px', color: '#ccc', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                    {PRESET_COLORS.map(c => (
                                      <div key={c} onClick={() => setPickerNewColor(c)} style={{ width: '14px', height: '14px', borderRadius: '50%', background: c, cursor: 'pointer', border: pickerNewColor === c ? '2px solid #fff' : '2px solid transparent', flexShrink: 0 }}></div>
                                    ))}
                                  </div>
                                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                    {pickerNewName && <span style={{ fontSize: '10px', padding: '1px 7px', borderRadius: '99px', background: pickerNewColor + '22', color: pickerNewColor }}>{pickerNewName}</span>}
                                    <button onClick={() => addTagFromPicker(card.id)} style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: '5px', border: 'none', background: '#7F77DD', fontSize: '11px', color: '#fff', cursor: 'pointer' }}>Add</button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
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
                    <option value="">No label</option>
                    {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
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
