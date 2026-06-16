'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { isVotingEnabled } from '../../lib/plan'

const COLUMNS = [
  { key: 'planned', label: 'Planned', color: '#555' },
  { key: 'in-progress', label: 'In progress', color: '#378ADD' },
  { key: 'in-review', label: 'In review', color: '#EF9F27' },
  { key: 'shipped', label: 'Shipped', color: '#1D9E75' },
]

function getVoterToken() {
  let token = localStorage.getItem('sorano_voter_token')
  if (!token) {
    token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
    localStorage.setItem('sorano_voter_token', token)
  }
  return token
}

export default function BoardClient({ params }) {
  const [board, setBoard] = useState(null)
  const [cards, setCards] = useState([])
  const [tags, setTags] = useState([])
  const [voteCounts, setVoteCounts] = useState({})
  const [myVotes, setMyVotes] = useState({})
  const [tooltip, setTooltip] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchBoard() }, [])

  async function fetchBoard() {
    const { data: b } = await supabase.from('boards').select('*').eq('slug', params.slug).single()
    if (!b) { setLoading(false); return }
    setBoard(b)

    const { data: c } = await supabase.from('cards').select('*').eq('board_id', b.id).order('created_at', { ascending: true })
    const cardList = c || []
    setCards(cardList)

    const { data: t } = await supabase.from('tags').select('*').eq('board_id', b.id)
    setTags(t || [])

    if (cardList.length > 0) {
      const cardIds = cardList.map(card => card.id)
      const { data: votes } = await supabase.from('votes').select('*').in('card_id', cardIds)
      const allVotes = votes || []

      const counts = {}
      cardIds.forEach(id => counts[id] = 0)
      allVotes.forEach(v => { counts[v.card_id] = (counts[v.card_id] || 0) + 1 })
      setVoteCounts(counts)

      const token = getVoterToken()
      const mine = {}
      allVotes.filter(v => v.voter_token === token).forEach(v => { mine[v.card_id] = true })
      setMyVotes(mine)
    }

    setLoading(false)
  }

  async function toggleVote(cardId) {
    if (!isVotingEnabled()) return
    const token = getVoterToken()
    const hasVoted = myVotes[cardId]

    if (hasVoted) {
      await supabase.from('votes').delete().eq('card_id', cardId).eq('voter_token', token)
      setMyVotes(prev => { const n = { ...prev }; delete n[cardId]; return n })
      setVoteCounts(prev => ({ ...prev, [cardId]: Math.max(0, (prev[cardId] || 1) - 1) }))
    } else {
      await supabase.from('votes').insert({ card_id: cardId, voter_token: token })
      setMyVotes(prev => ({ ...prev, [cardId]: true }))
      setVoteCounts(prev => ({ ...prev, [cardId]: (prev[cardId] || 0) + 1 }))
    }
  }

  function getTopVotedId() {
    const plannedCards = cards.filter(c => c.status === 'planned')
    if (plannedCards.length === 0) return null
    let topId = null, topCount = 0
    plannedCards.forEach(c => {
      if ((voteCounts[c.id] || 0) > topCount) { topCount = voteCounts[c.id] || 0; topId = c.id }
    })
    return topCount > 0 ? topId : null
  }

  function getTag(tagId) {
    return tags.find(t => t.id === tagId) || null
  }

  if (loading) return (
    <div style={{ background: '#1c1c24', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontFamily: 'sans-serif', fontSize: '13px' }}>Loading...</div>
  )

  if (!board) return (
    <div style={{ background: '#1c1c24', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontFamily: 'sans-serif', fontSize: '13px' }}>Board not found.</div>
  )

  if (!board.is_public) return (
    <div style={{ background: '#1c1c24', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', flexDirection: 'column', gap: '8px' }}>
      <div style={{ fontSize: '13px', color: '#888' }}>This board is private.</div>
      <div style={{ fontSize: '11px', color: '#666' }}>The owner hasn't made it public yet.</div>
    </div>
  )

  const topVotedId = getTopVotedId()
  const votingEnabled = isVotingEnabled()

  return (
    <div style={{ minHeight: '100vh', background: '#1c1c24', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      {/* Header */}
      <div style={{ padding: '20px 28px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7F77DD', display: 'inline-block' }}></span>
          <span style={{ fontSize: '17px', fontWeight: '600', color: '#f5f5fa' }}>{board.name}</span>
          <span style={{ fontSize: '13px', color: '#666' }}>sorano.space/{board.slug}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#666' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75', display: 'inline-block' }}></span>
          actively building
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ padding: '0 28px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', gap: '24px' }}>
        <a href={`/${board.slug}`} style={{ padding: '12px 0', fontSize: '13px', color: '#f5f5fa', textDecoration: 'none', borderBottom: '2px solid #7F77DD' }}>Roadmap</a>
        <a href={`/${board.slug}/changelog`} style={{ padding: '12px 0', fontSize: '13px', color: '#888', textDecoration: 'none', borderBottom: '2px solid transparent' }}>Changelog</a>
      </div>

      {/* Board */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', height: 'calc(100vh - 57px - 41px - 44px)' }}>
        {COLUMNS.map((col, colIdx) => {
          const colCards = cards.filter(c => c.status === col.key)
          return (
            <div key={col.key} style={{ borderRight: colIdx < 3 ? '0.5px solid rgba(255,255,255,0.06)' : 'none', display: 'flex', flexDirection: 'column' }}>

              {/* Col header */}
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: col.color, display: 'inline-block' }}></span>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#bbb' }}>{col.label}</span>
                <span style={{ fontSize: '11px', color: '#555', marginLeft: '2px' }}>{colCards.length}</span>
              </div>

              {/* Cards */}
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1 }}>

                {col.key === 'shipped' && colCards.map(card => {
                  const tag = getTag(card.tag)
                  return (
                    <div key={card.id} style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#1D9E75', fontSize: '13px', flexShrink: 0 }}>✓</span>
                      <div>
                        <div style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>{card.title}</div>
                        {tag && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: tag.color + '22', color: tag.color }}>{tag.name}</span>}
                      </div>
                    </div>
                  )
                })}

                {(col.key === 'in-progress' || col.key === 'in-review') && (
                  <>
                    {colCards.map(card => {
                      const tag = getTag(card.tag)
                      return (
                        <div key={card.id} style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', flexShrink: 0 }}>
                            <span style={{ fontSize: '11px', color: '#555' }}>▲</span>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: '#666' }}>{voteCounts[card.id] || 0}</span>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '14px', color: '#c0c0cc', marginBottom: '6px', lineHeight: '1.3' }}>{card.title}</div>
                            {tag && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: tag.color + '22', color: tag.color }}>{tag.name}</span>}
                          </div>
                        </div>
                      )
                    })}
                    {colCards.length > 0 && <div style={{ fontSize: '12px', color: '#555', padding: '8px 4px' }}>Voting disabled — in progress</div>}
                  </>
                )}

                {col.key === 'planned' && colCards.map(card => {
                  const voted = !!myVotes[card.id]
                  const count = voteCounts[card.id] || 0
                  const isTop = card.id === topVotedId
                  const tag = getTag(card.tag)
                  return (
                    <div key={card.id} style={{ background: '#22222c', borderRadius: '10px', padding: '14px', display: 'flex', gap: '12px', alignItems: 'flex-start', ...(isTop ? { borderLeft: '2px solid #7F77DD', borderTop: '0.5px solid rgba(255,255,255,0.06)', borderRight: '0.5px solid rgba(255,255,255,0.06)', borderBottom: '0.5px solid rgba(255,255,255,0.06)' } : { border: '0.5px solid rgba(255,255,255,0.06)' }) }}>
                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={() => votingEnabled && toggleVote(card.id)}
                          onMouseEnter={() => setTooltip(card.id)}
                          onMouseLeave={() => setTooltip(null)}
                          style={{
                            width: '44px', height: '44px', borderRadius: '8px',
                            background: voted && votingEnabled ? 'rgba(127,119,221,0.15)' : '#1c1c24',
                            border: voted && votingEnabled ? '0.5px solid rgba(127,119,221,0.4)' : '0.5px solid rgba(255,255,255,0.06)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px',
                            cursor: votingEnabled ? 'pointer' : 'not-allowed',
                            flexShrink: 0,
                          }}
                        >
                          <span style={{ fontSize: '11px', color: voted && votingEnabled ? '#7F77DD' : '#555' }}>▲</span>
                          <span style={{ fontSize: '13px', fontWeight: '500', color: voted && votingEnabled ? '#7F77DD' : '#666' }}>{count}</span>
                        </button>
                        {tooltip === card.id && (
                          <div style={{ position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', background: '#2e2e3a', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '5px 10px', fontSize: '11px', color: '#aaa', whiteSpace: 'nowrap', zIndex: 10 }}>
                            {!votingEnabled ? (
                              <><span style={{ color: '#7F77DD', fontWeight: '500' }}>Pro feature</span> · Upgrade to enable voting</>
                            ) : voted ? 'Click to unvote' : 'Upvote this'}
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', color: '#e8e8f0', marginBottom: '6px', lineHeight: '1.3' }}>{card.title}</div>
                        {tag && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: tag.color + '22', color: tag.color }}>{tag.name}</span>}
                      </div>
                    </div>
                  )
                })}

                {colCards.length === 0 && col.key !== 'in-progress' && col.key !== 'in-review' && (
                  <div style={{ fontSize: '12px', color: '#444', padding: '8px 4px' }}>Nothing here yet</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ height: '44px', borderTop: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px', padding: '0 28px' }}>
        {[
          { icon: '▪', color: '#7F77DD', label: 'Top voted' },
          { icon: '▲', color: '#7F77DD', label: 'You voted' },
          { icon: '▲', color: '#555', label: 'Voting locked' },
          { icon: '✓', color: '#1D9E75', label: 'Shipped' },
        ].map(({ icon, color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#666' }}>
            <span style={{ color }}>{icon}</span> {label}
          </div>
        ))}
      </div>

    </div>
  )
}
