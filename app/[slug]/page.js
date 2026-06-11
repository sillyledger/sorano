'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const COLUMNS = [
  { key: 'planned', label: 'Planned', color: '#555' },
  { key: 'in-progress', label: 'In progress', color: '#378ADD' },
  { key: 'in-review', label: 'In review', color: '#EF9F27' },
  { key: 'shipped', label: 'Shipped', color: '#1D9E75' },
]

const TAG_STYLES = {
  UI: { bg: '#22203a', color: '#7F77DD' },
  Core: { bg: '#26262e', color: '#666' },
  Feature: { bg: '#122218', color: '#1D9E75' },
  Auth: { bg: '#122218', color: '#1D9E75' },
  UX: { bg: '#241e10', color: '#BA7517' },
}

function getVoterToken() {
  let token = localStorage.getItem('sorano_voter_token')
  if (!token) {
    token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
    localStorage.setItem('sorano_voter_token', token)
  }
  return token
}

export default function PublicBoard({ params }) {
  const [board, setBoard] = useState(null)
  const [cards, setCards] = useState([])
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

  if (loading) return (
    <div style={{ background: '#1c1c24', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontFamily: 'sans-serif', fontSize: '13px' }}>Loading...</div>
  )

  if (!board) return (
    <div style={{ background: '#1c1c24', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontFamily: 'sans-serif', fontSize: '13px' }}>Board not found.</div>
  )

  if (!board.is_public) return (
    <div style={{ background: '#1c1c24', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', flexDirection: 'column', gap: '8px' }}>
      <div style={{ fontSize: '13px', color: '#555' }}>This board is private.</div>
      <div style={{ fontSize: '11px', color: '#333' }}>The owner hasn't made it public yet.</div>
    </div>
  )

  const topVotedId = getTopVotedId()

  return (
    <div style={{ minHeight: '100vh', background: '#1c1c24', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      {/* Header */}
      <div style={{ padding: '20px 28px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7F77DD', display: 'inline-block' }}></span>
          <span style={{ fontSize: '17px', fontWeight: '600', color: '#ddd' }}>{board.name}</span>
          <span style={{ fontSize: '13px', color: '#3a3a44' }}>sorano.space/{board.slug}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#3a3a44' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75', display: 'inline-block' }}></span>
          actively building
        </div>
      </div>

      {/* Board */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', height: 'calc(100vh - 57px - 44px)' }}>
        {COLUMNS.map((col, colIdx) => {
          const colCards = cards.filter(c => c.status === col.key)
          return (
            <div key={col.key} style={{ borderRight: colIdx < 3 ? '0.5px solid rgba(255,255,255,0.06)' : 'none', display: 'flex', flexDirection: 'column' }}>

              {/* Col header */}
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: col.color, display: 'inline-block' }}></span>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#888' }}>{col.label}</span>
                <span style={{ fontSize: '11px', color: '#3a3a44', marginLeft: '2px' }}>{colCards.length}</span>
              </div>

              {/* Cards */}
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1 }}>

                {col.key === 'shipped' && colCards.map(card => (
                  <div key={card.id} style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#1D9E75', fontSize: '13px', flexShrink: 0 }}>✓</span>
                    <div>
                      <div style={{ fontSize: '14px', color: '#555', marginBottom: '4px' }}>{card.title}</div>
                      {card.tag && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: TAG_STYLES[card.tag]?.bg, color: TAG_STYLES[card.tag]?.color }}>{card.tag}</span>}
                    </div>
                  </div>
                ))}

                {(col.key === 'in-progress' || col.key === 'in-review') && (
                  <>
                    {colCards.map(card => (
                      <div key={card.id} style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', flexShrink: 0 }}>
                          <span style={{ fontSize: '11px', color: '#333' }}>▲</span>
                          <span style={{ fontSize: '13px', fontWeight: '500', color: '#444' }}>{voteCounts[card.id] || 0}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '14px', color: '#888', marginBottom: '6px', lineHeight: '1.3' }}>{card.title}</div>
                          {card.tag && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: TAG_STYLES[card.tag]?.bg, color: TAG_STYLES[card.tag]?.color }}>{card.tag}</span>}
                        </div>
                      </div>
                    ))}
                    {colCards.length > 0 && <div style={{ fontSize: '12px', color: '#2a2a32', padding: '8px 4px' }}>Voting disabled — in progress</div>}
                  </>
                )}

                {col.key === 'planned' && colCards.map(card => {
                  const voted = !!myVotes[card.id]
                  const count = voteCounts[card.id] || 0
                  const isTop = card.id === topVotedId
                  return (
                    <div key={card.id} style={{ background: '#22222c', borderRadius: '10px', padding: '14px', display: 'flex', gap: '12px', alignItems: 'flex-start', borderLeft: isTop ? '2px solid #7F77DD' : '0.5px solid rgba(255,255,255,0.06)', border: isTop ? undefined : '0.5px solid rgba(255,255,255,0.06)', ...(isTop ? { borderLeft: '2px solid #7F77DD', borderTop: '0.5px solid rgba(255,255,255,0.06)', borderRight: '0.5px solid rgba(255,255,255,0.06)', borderBottom: '0.5px solid rgba(255,255,255,0.06)' } : {}) }}>
                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={() => toggleVote(card.id)}
                          onMouseEnter={() => setTooltip(card.id)}
                          onMouseLeave={() => setTooltip(null)}
                          style={{ width: '44px', height: '44px', borderRadius: '8px', background: voted ? 'rgba(127,119,221,0.15)' : '#1c1c24', border: voted ? '0.5px solid rgba(127,119,221,0.4)' : '0.5px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', cursor: 'pointer', flexShrink: 0 }}
                        >
                          <span style={{ fontSize: '11px', color: voted ? '#7F77DD' : '#555' }}>▲</span>
                          <span style={{ fontSize: '13px', fontWeight: '500', color: voted ? '#7F77DD' : '#666' }}>{count}</span>
                        </button>
                        {tooltip === card.id && (
                          <div style={{ position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', background: '#2e2e3a', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '5px 10px', fontSize: '11px', color: '#aaa', whiteSpace: 'nowrap', zIndex: 10 }}>
                            {voted ? 'Click to unvote' : 'Upvote this'}
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '6px', lineHeight: '1.3' }}>{card.title}</div>
                        {card.tag && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: TAG_STYLES[card.tag]?.bg, color: TAG_STYLES[card.tag]?.color }}>{card.tag}</span>}
                      </div>
                    </div>
                  )
                })}

                {colCards.length === 0 && col.key !== 'in-progress' && col.key !== 'in-review' && (
                  <div style={{ fontSize: '12px', color: '#2a2a32', padding: '8px 4px' }}>Nothing here yet</div>
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
          { icon: '▲', color: '#333', label: 'Voting locked' },
          { icon: '✓', color: '#1D9E75', label: 'Shipped' },
        ].map(({ icon, color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#3a3a44' }}>
            <span style={{ color }}>{icon}</span> {label}
          </div>
        ))}
      </div>

    </div>
  )
}
