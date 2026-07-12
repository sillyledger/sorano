'use client'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import SettingsModal from '../../dashboard/SettingsModal'

const TAG_COLORS = ['#7F77DD', '#EF9F27', '#E24B4A', '#1D9E75', '#378ADD', '#D4537E', '#888']

function tagColor(tag) {
  let sum = 0
  for (let i = 0; i < tag.length; i++) sum += tag.charCodeAt(i)
  return TAG_COLORS[sum % TAG_COLORS.length]
}

const COLORS = ['#7F77DD','#1D9E75','#EF9F27','#D4537E','#378ADD','#D85A30']

export default function NoteEditor() {
  const [note, setNote] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [boards, setBoards] = useState([])
  const [authChecked, setAuthChecked] = useState(false)
  const [user, setUser] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [title, setTitle] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [boardId, setBoardId] = useState('')
  const [saveStatus, setSaveStatus] = useState('saved')

  const editorRef = useRef(null)
  const bodyRef = useRef('')
  const editorLoaded = useRef(false)
  const saveTimeout = useRef(null)

  const router = useRouter()
  const params = useParams()
  const noteId = params.id

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
    const { data: noteData } = await supabase.from('notes').select('*').eq('id', noteId).eq('user_id', userId).single()
    if (!noteData) {
      setNotFound(true)
      return
    }
    setNote(noteData)
    setTitle(noteData.title || '')
    setTags(noteData.tags || [])
    setBoardId(noteData.board_id || '')
  }

  useEffect(() => {
    if (note && editorRef.current && !editorLoaded.current) {
      editorRef.current.innerHTML = note.body || ''
      bodyRef.current = note.body || ''
      editorLoaded.current = true
    }
  }, [note])

  function scheduleSave() {
    setSaveStatus('saving')
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(doSave, 1000)
  }

  async function doSave() {
    await supabase.from('notes').update({
      title,
      body: bodyRef.current,
      tags,
      board_id: boardId || null,
    }).eq('id', noteId)
    setSaveStatus('saved')
  }

  function handleTitleChange(e) {
    setTitle(e.target.value)
    scheduleSave()
  }

  function handleBoardChange(e) {
    setBoardId(e.target.value)
    scheduleSave()
  }

  function handleBodyInput() {
    bodyRef.current = editorRef.current.innerHTML
    scheduleSave()
  }

  function addTag(e) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const value = tagInput.trim()
    if (!value || tags.includes(value)) { setTagInput(''); return }
    setTags(prev => [...prev, value])
    setTagInput('')
    scheduleSave()
  }

  function removeTag(tag) {
    setTags(prev => prev.filter(t => t !== tag))
    scheduleSave()
  }

  function exec(command, value = null) {
    editorRef.current.focus()
    document.execCommand(command, false, value)
    handleBodyInput()
  }

  async function deleteNote() {
    await supabase.from('notes').delete().eq('id', noteId)
    router.push('/notes')
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!authChecked || (!note && !notFound)) {
    return (
      <div style={{ minHeight: '100vh', background: '#1c1c24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7F77DD', opacity: 0.5 }} />
      </div>
    )
  }

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', background: '#1c1c24', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
        <p style={{ color: '#888', fontSize: '14px' }}>Note not found.</p>
        <span onClick={() => router.push('/notes')} style={{ color: '#7F77DD', fontSize: '13px', cursor: 'pointer' }}>← Back to Notes</span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#1c1c24', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', overflow: 'hidden' }}>
      <style>{`
        .note-body { outline: none; font-size: 14px; line-height: 1.7; color: #c0c0cc; min-height: 320px; }
        .note-body h2 { font-size: 17px; font-weight: 500; color: #e0e0e6; margin: 18px 0 8px; }
        .note-body h3 { font-size: 15px; font-weight: 500; color: #d0d0d6; margin: 14px 0 6px; }
        .note-body ul, .note-body ol { padding-left: 22px; margin: 8px 0; }
        .note-body p { margin: 0 0 8px; }
        .note-body:empty:before { content: attr(data-placeholder); color: #666; }
      `}</style>

      {showSettings && (
        <SettingsModal user={user} onClose={() => setShowSettings(false)} />
      )}

      {showDeleteConfirm && (
        <div onClick={() => setShowDeleteConfirm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', width: '360px' }}>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#ccc', marginBottom: '8px' }}>Delete note?</div>
            <div style={{ fontSize: '13px', color: '#555', marginBottom: '24px' }}>This will permanently delete <span style={{ color: '#aaa' }}>{title || 'this note'}</span>. This cannot be undone.</div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', fontSize: '13px', color: '#444', cursor: 'pointer' }}>Cancel</button>
              <button onClick={deleteNote} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#E24B4A', fontSize: '13px', color: '#fff', cursor: 'pointer', fontWeight: '500' }}>Delete note</button>
            </div>
          </div>
        </div>
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
          onClick={() => router.push('/notes')}
          style={{ margin: '0 12px', padding: '7px 8px', borderRadius: '6px', fontSize: '14px', color: '#f5f5fa', fontWeight: '500', background: 'rgba(127,119,221,0.14)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
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
        <div style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <span onClick={() => router.push('/notes')} style={{ fontSize: '13px', color: '#888', cursor: 'pointer' }}>← Notes</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '12px', color: '#888' }}>{saveStatus === 'saving' ? 'Saving...' : 'Saved'}</span>
              <span onClick={() => setShowDeleteConfirm(true)} style={{ fontSize: '13px', color: '#888', cursor: 'pointer' }}>Delete</span>
            </div>
          </div>

          <input
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '24px', fontWeight: '500', color: '#f5f5fa', marginBottom: '14px', padding: 0 }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <select
              value={boardId}
              onChange={handleBoardChange}
              style={{ padding: '5px 10px', borderRadius: '6px', border: '0.5px solid rgba(255,255,255,0.08)', background: '#22222c', fontSize: '12px', color: '#aaa', outline: 'none' }}
            >
              <option value="">No board</option>
              {boards.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            {tags.map(tag => (
              <span key={tag} onClick={() => removeTag(tag)} style={{ fontSize: '12px', padding: '5px 10px', borderRadius: '99px', border: '0.5px solid #2e2e38', color: '#d0d0d6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: tagColor(tag), flexShrink: 0 }} />
                {tag}
                <span style={{ opacity: 0.5 }}>×</span>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="+ tag"
              style={{ width: '70px', border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', color: '#888' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', paddingBottom: '10px', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => exec('bold')} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#888', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>B</button>
            <button onClick={() => exec('italic')} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#888', cursor: 'pointer', fontStyle: 'italic', fontSize: '13px' }}>I</button>
            <button onClick={() => exec('formatBlock', 'h2')} style={{ padding: '0 8px', height: '28px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '12px' }}>H2</button>
            <button onClick={() => exec('formatBlock', 'h3')} style={{ padding: '0 8px', height: '28px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '12px' }}>H3</button>
            <button onClick={() => exec('insertUnorderedList')} style={{ padding: '0 8px', height: '28px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '12px' }}>• List</button>
            <button onClick={() => exec('insertOrderedList')} style={{ padding: '0 8px', height: '28px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '12px' }}>1. List</button>
          </div>

          <div
            ref={editorRef}
            className="note-body"
            contentEditable
            suppressContentEditableWarning
            onInput={handleBodyInput}
            data-placeholder="Start writing..."
          />

        </div>
      </div>
    </div>
  )
}
