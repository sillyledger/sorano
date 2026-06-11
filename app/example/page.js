'use client'
import { useState } from 'react'

const COLUMNS = ['Planned', 'In progress', 'In review', 'Shipped']

const INITIAL_CARDS = [
  { id: '1', title: 'Mobile app beta', tag: 'Feature', status: 'Planned', votes: 31, voted: true, topVoted: true },
  { id: '2', title: 'Onboarding flow redesign', tag: 'UX', status: 'Planned', votes: 18, voted: false, topVoted: false },
  { id: '3', title: 'API rate limiting', tag: 'Core', status: 'Planned', votes: 9, voted: false, topVoted: false },
  { id: '4', title: 'Team permissions system', tag: 'Feature', status: 'Planned', votes: 4, voted: false, topVoted: false },
  { id: '5', title: 'Stripe integration', tag: 'Feature', status: 'In progress', votes: 24, voted: false, topVoted: false },
  { id: '6', title: 'Dashboard v2', tag: 'UI', status: 'In progress', votes: 17, voted: false, topVoted: false },
  { id: '7', title: 'Email notifications', tag: 'Feature', status: 'In progress', votes: 11, voted: false, topVoted: false },
  { id: '8', title: 'Invite team members flow', tag: 'UX', status: 'In review', votes: 8, voted: false, topVoted: false },
  { id: '9', title: 'Usage analytics page', tag: 'Feature', status: 'In review', votes: 5, voted: false, topVoted: false },
  { id: '10', title: 'Magic link auth', tag: 'Auth', status: 'Shipped', votes: 0, voted: false, topVoted: false },
  { id: '11', title: 'Workspace settings', tag: 'Core', status: 'Shipped', votes: 0, voted: false, topVoted: false },
  { id: '12', title: 'CSV export', tag: 'Feature', status: 'Shipped', votes: 0, voted: false, topVoted: false },
]

const TAG_COLORS = {
  Feature: { bg: 'rgba(127,119,221,0.15)', color: '#7F77DD' },
  UX: { bg: 'rgba(239,159,39,0.15)', color: '#EF9F27' },
  Core: { bg: 'rgba(100,100,120,0.2)', color: '#888' },
  Auth: { bg: 'rgba(29,158,117,0.15)', color: '#1D9E75' },
  UI: { bg: 'rgba(55,138,221,0.15)', color: '#378ADD' },
}

const COL_COLORS = { 'Planned': '#555', 'In progress': '#378ADD', 'In review': '#EF9F27', 'Shipped': '#1D9E75' }

export default function ExampleBoard() {
  const [cards, setCards] = useState(INITIAL_CARDS)
  const [tooltip, setTooltip] = useState(null)

  function toggleVote(id) {
    setCards(prev => {
      const updated = prev.map(c => {
        if (c.id !== id) return c
        return { ...c, voted: !c.voted, votes: c.voted ? c.votes - 1 : c.votes + 1 }
      })
      const plannedCards = updated.filter(c => c.status === 'Planned')
      const maxVotes = Math.max(...plannedCards.map(c => c.votes))
      return updated.map(c => ({
        ...c,
        topVoted: c.status === 'Planned' && c.votes === maxVotes && maxVotes > 0
      }))
    })
  }

  return (
    <div style={{ background: '#1c1c24', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Header */}
      <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7F77DD', display: 'inline-block' }}></span>
          <span style={{ fontSize: '17px', fontWeight: '600', color: '#ddd' }}>Launchpad</span>
          <span style={{ fontSize: '13px', color: '#3a3a44' }}>sorano.space/launchpad</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#3a3a44' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75', display: 'inline-block' }}></span>
          actively building
        </div>
      </div>

      {/* Board */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0', height: 'calc(100vh - 57px - 44px)' }}>
        {COLUMNS.map((col, colIdx) => {
          const colCards = cards.filter(c => c.status === col)
          return (
            <div key={col} style={{ borderRight: colIdx < 3 ? '0.5px solid rgba(255,255,255,0.06)' : 'none', display: 'flex', flexDirection: 'column' }}>
              {/* Col header */}
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: COL_COLORS[col], display: 'inline-block' }}></span>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#888' }}>{col}</span>
                <span style={{ fontSize: '11px', color: '#3a3a44', marginLeft: '2px' }}>{colCards.length}</span>
              </div>

              {/* Cards */}
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1 }}>
                {col === 'Shipped' ? (
                  colCards.map(card => (
                    <div key={card.id} style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#1D9E75', fontSize: '13px', flexShrink: 0 }}>✓</span>
                      <div>
                        <div style={{ fontSize: '14px', color: '#555', marginBottom: '4px' }}>{card.title}</div>
                        {card.tag && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: TAG_COLORS[card.tag]?.bg, color: TAG_COLORS[card.tag]?.color }}>{card.tag}</span>}
                      </div>
                    </div>
                  ))
                ) : col === 'In progress' || col === 'In review' ? (
                  <>
                    {colCards.map(card => (
                      <div key={card.id} style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        {/* Locked vote box */}
                        <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', flexShrink: 0 }}>
                          <span style={{ fontSize: '11px', color: '#333' }}>▲</span>
                          <span style={{ fontSize: '13px', fontWeight: '500', color: '#444' }}>{card.votes}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '14px', color: '#888', marginBottom: '6px', lineHeight: '1.3' }}>{card.title}</div>
                          {card.tag && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: TAG_COLORS[card.tag]?.bg, color: TAG_COLORS[card.tag]?.color }}>{card.tag}</span>}
                        </div>
                      </div>
                    ))}
                    <div style={{ fontSize: '12px', color: '#2a2a32', padding: '8px 4px' }}>Voting disabled — in progress</div>
                  </>
                ) : (
                  colCards.map(card => (
                    <div key={card.id} style={{ background: '#22222c', border: `0.5px solid rgba(255,255,255,0.06)`, borderRadius: '10px', padding: '14px', display: 'flex', gap: '12px', alignItems: 'flex-start', borderLeft: card.topVoted ? '2px solid #7F77DD' : '0.5px solid rgba(255,255,255,0.06)', position: 'relative' }}>
                      {/* Vote button */}
                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={() => toggleVote(card.id)}
                          onMouseEnter={() => setTooltip(card.id)}
                          onMouseLeave={() => setTooltip(null)}
                          style={{ width: '44px', height: '44px', borderRadius: '8px', background: card.voted ? 'rgba(127,119,221,0.15)' : '#1c1c24', border: card.voted ? '0.5px solid rgba(127,119,221,0.4)' : '0.5px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', cursor: 'pointer', flexShrink: 0 }}
                        >
                          <span style={{ fontSize: '11px', color: card.voted ? '#7F77DD' : '#555' }}>▲</span>
                          <span style={{ fontSize: '13px', fontWeight: '500', color: card.voted ? '#7F77DD' : '#666' }}>{card.votes}</span>
                        </button>
                        {tooltip === card.id && (
                          <div style={{ position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', background: '#2e2e3a', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '5px 10px', fontSize: '11px', color: '#aaa', whiteSpace: 'nowrap', zIndex: 10 }}>
                            {card.voted ? 'Click to unvote' : 'Upvote this'}
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '6px', lineHeight: '1.3' }}>{card.title}</div>
                        {card.tag && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: TAG_COLORS[card.tag]?.bg, color: TAG_COLORS[card.tag]?.color }}>{card.tag}</span>}
                      </div>
                    </div>
                  ))
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
