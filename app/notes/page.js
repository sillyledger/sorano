'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import SettingsModal from '../dashboard/SettingsModal'

const TAG_COLORS = ['#7F77DD', '#EF9F27', '#E24B4A', '#1D9E75', '#378ADD', '#D4537E', '#888']

function tagColor(tag) {
  let sum = 0
  for (let i = 0; i < tag.length; i++) sum += tag.charCodeAt(i)
  return TAG_COLORS[sum % TAG_COLORS.length]
}

function stripHtml(html) {
  const text = (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return text.length > 110 ? text.slice(0, 110) + '...' : text
}

function formatRelative(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const hours = diffMs / 3600000
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${Math.floor(hours)}h ago`
  const days = hours / 24
  if (days < 7) return `${Math.floor(days)}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const COLORS = ['#7F77DD','#1D9E75','#EF9F27','#D4537E','#378ADD','#D85A30']
const LIGHT_COLORS = ['#AFA9EC','#5DCAA5','#F5C979','#ED93B1','#85B7EB','#F0A588']

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [user, setUser] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [search, setSearch] = useState('')
  const [boardFilter, setBoardFilter] = useState('all')
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
    fetchData(session.user.id)
  }

  async function fetchData(userId) {
    const { data: boardData } = await supabase.from('boards').select('id,name,slug').eq('owner_id', userId)
    setBoards(boardData || [])
    const { data: noteData } = await supabase.from('notes').select('*').eq('user_id', userId).order('updated_at', { ascending: false })
    setNotes(noteData || [])
    setLoading(false)
  }

  async function createNote() {
    if (!user) return
    const { data } = await supabase.from('notes').insert({ user_id: user.id, title: '', body: '', tags: [] }).select().single()
    if (data) router.push(`/notes/${data.id}`)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  function boardName(boardId) {
    return boards.find(b => b.id === boardId)?.name
  }

  function boardStyle(boardId) {
    const idx = boards.findIndex(b => b.id === boardId)
    if (idx === -1) return { dot: '#555', text: '#999' }
    return { dot: COLORS[idx % 6], text: LIGHT_COLORS[idx % 6] }
  }

  const filteredNotes = notes.filter(n => {
    if (boardFilter === 'none' && n.board_id) return false
    if (boardFilter !== 'all' && boardFilter !== 'none' && n.board_id !== boardFilter) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return n.title.toLowerCase().includes(q) || stripHtml(n.body).toLowerCase().includes(q)
  })

  if (!authChecked) {
    return (
      <div style={{ minHeight: '100vh', background: '#1c1c24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7F77DD', opacity: 0.5 }} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#1c1c24', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', overflow: 'hidden' }}>

      {showSettings && (
        <SettingsModal user={user} onClose={() => setShowSettings(false)} />
      )}

      <div style={{ width: '190px', flexShrink: 0, borderRight: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '20px 0', height: '100vh', overflowY: 'auto' }}>
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
        <div
          onClick={() => router.push('/dashboard')}
          style={{ padding: '7px 16px', fontSize: '14px', color: '#bbb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >⊞ All boards</div>
        <div
          style={{ margin: '0 12px', padding: '7px 8px', borderRadius: '6px', fontSize: '14px', color: '#f5f5fa', fontWeight: '500', background: 'rgba(127,119,221,0.14)', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="2" y="1.5" width="10" height="11" rx="1.5" stroke="#7F77DD" strokeWidth="1.1"/>
            <path d="M4.5 5h5M4.5 7.5h5M4.5 10h3" stroke="#7F77DD" strokeWidth="1.1" strokeLinecap="round"/>
          </svg>
          Notes
        </div>
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

      <div style={{ flex: 1, height: '100vh', overflowY: 'auto', padding: '40px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#ccc', marginBottom: '4px' }}>Notes</h1>
              <p style={{ fontSize: '13px', color: '#888' }}>{notes.length} note{notes.length === 1 ? '' : 's'}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search notes"
                style={{ padding: '8px 12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.08)', background: '#22222c', fontSize: '13px', color: '#ccc', outline: 'none', width: '160px' }}
              />
              <button
                onClick={createNote}
                style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#fff', fontSize: '14px', color: '#1c1c24', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}
              >+ New note</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '7px', marginBottom: '22px', flexWrap: 'wrap' }}>
            <span
              onClick={() => setBoardFilter('all')}
              style={{ fontSize: '12px', padding: '6px 13px', borderRadius: '99px', cursor: 'pointer', border: '0.5px solid', borderColor: boardFilter === 'all' ? 'rgba(255,255,255,0.15)' : '#2e2e38', background: boardFilter === 'all' ? 'rgba(255,255,255,0.09)' : 'transparent', color: boardFilter === 'all' ? '#f5f5fa' : '#888' }}
            >All</span>
            {boards.map((b, i) => (
              <span
                key={b.id}
                onClick={() => setBoardFilter(b.id)}
                style={{ fontSize: '12px', padding: '6px 13px', borderRadius: '99px', cursor: 'pointer', border: '0.5px solid', borderColor: boardFilter === b.id ? 'rgba(255,255,255,0.15)' : '#2e2e38', background: boardFilter === b.id ? 'rgba(255,255,255,0.09)' : 'transparent', color: boardFilter === b.id ? '#f5f5fa' : '#888', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: COLORS[i % 6], flexShrink: 0 }} />
                {b.name}
              </span>
            ))}
            <span
              onClick={() => setBoardFilter('none')}
              style={{ fontSize: '12px', padding: '6px 13px', borderRadius: '99px', cursor: 'pointer', border: '0.5px solid', borderColor: boardFilter === 'none' ? 'rgba(255,255,255,0.15)' : '#2e2e38', background: boardFilter === 'none' ? 'rgba(255,255,255,0.09)' : 'transparent', color: boardFilter === 'none' ? '#f5f5fa' : '#888', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#555', flexShrink: 0 }} />
              No board
            </span>
          </div>

          {loading ? (
            <p style={{ color: '#444', fontSize: '14px' }}>Loading...</p>
          ) : filteredNotes.length === 0 ? (
            <p style={{ color: '#444', fontSize: '14px' }}>
              {notes.length === 0 ? 'No notes yet. Create your first one.' : 'No notes match this filter.'}
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
              {filteredNotes.map(note => {
                const bStyle = boardStyle(note.board_id)
                return (
                  <div
                    key={note.id}
                    onClick={() => router.push(`/notes/${note.id}`)}
                    style={{ padding: '13px 15px', borderRadius: '10px', border: '0.5px solid rgba(255,255,255,0.07)', background: '#22222c', cursor: 'pointer' }}
                  >
                    {note.board_id && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: bStyle.dot, flexShrink: 0 }} />
                        <span style={{ fontSize: '11px', color: bStyle.text }}>{boardName(note.board_id)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#f5f5fa' }}>{note.title || 'Untitled'}</span>
                      <span style={{ fontSize: '10.5px', color: '#888', flexShrink: 0, marginLeft: '8px' }}>{formatRelative(note.updated_at)}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#c0c0cc', lineHeight: 1.5, margin: '0 0 12px', minHeight: '18px' }}>
                      {stripHtml(note.body) || 'No content yet'}
                    </p>
                    {(note.tags || []).length > 0 && (
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {note.tags.map(tag => (
                          <span key={tag} style={{ fontSize: '11px', color: '#d0d0d6', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: tagColor(tag), flexShrink: 0 }} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
