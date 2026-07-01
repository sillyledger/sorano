'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

function getTag(tags, tagId) {
  return tags.find(t => t.id === tagId) || null
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ChangelogPage({ params }) {
  const [board, setBoard] = useState(null)
  const [cards, setCards] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const { data: b } = await supabase.from('boards').select('*').eq('slug', params.slug).single()
    if (!b) { setLoading(false); return }
    setBoard(b)

    const { data: t } = await supabase.from('tags').select('*').eq('board_id', b.id)
    setTags(t || [])

    const { data: c } = await supabase
      .from('cards')
      .select('*')
      .eq('board_id', b.id)
      .eq('status', 'shipped')
      .order('shipped_at', { ascending: false })
    setCards(c || [])
    setLoading(false)
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

  return (
    <div style={{ minHeight: '100vh', background: '#1c1c24', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      {/* Header */}
      <div style={{ padding: '20px 28px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7F77DD', display: 'inline-block' }}></span>
          <span style={{ fontSize: '17px', fontWeight: '600', color: '#f5f5fa' }}>{board.name}</span>
          <span className="board-header-slug" style={{ fontSize: '13px', color: '#666' }}>sorano.space/{board.slug}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#666' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75', display: 'inline-block' }}></span>
          <span className="board-building-label">actively building</span>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ padding: '0 28px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', gap: '24px' }}>
        <a href={`/${board.slug}`} style={{ padding: '12px 0', fontSize: '13px', color: '#888', textDecoration: 'none', borderBottom: '2px solid transparent' }}>Roadmap</a>
        <a href={`/${board.slug}/changelog`} style={{ padding: '12px 0', fontSize: '13px', color: '#f5f5fa', textDecoration: 'none', borderBottom: '2px solid #7F77DD' }}>Changelog</a>
      </div>

      {/* Feed */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 28px' }}>
        {cards.length === 0 && (
          <div style={{ fontSize: '13px', color: '#666', textAlign: 'center', paddingTop: '40px' }}>Nothing shipped yet.</div>
        )}
        {cards.map((card, i) => {
          const tag = getTag(tags, card.tag)
          const isLast = i === cards.length - 1
          return (
            <div key={card.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: isLast ? '0' : '48px' }}>

              {/* Timeline line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4px', flexShrink: 0 }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1D9E75', flexShrink: 0 }}></div>
                {!isLast && <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)', flex: 1, marginTop: '6px', minHeight: '60px' }}></div>}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', letterSpacing: '.06em' }}>
                  {card.shipped_at ? formatDate(card.shipped_at).toUpperCase() : 'SHIPPED'}
                </div>
                <div style={{ fontSize: '18px', fontWeight: '500', color: '#f5f5fa', marginBottom: card.shipped_note ? '10px' : '12px', lineHeight: '1.3' }}>{card.title}</div>
                {card.shipped_note && (
                  <div style={{ fontSize: '14px', color: '#c0c0cc', lineHeight: '1.7', marginBottom: '12px' }}>{card.shipped_note}</div>
                )}
                {tag && (
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: tag.color + '22', color: tag.color }}>{tag.name}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: '24px 32px', borderTop: '0.5px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <span style={{ fontSize: '11px', color: '#555' }}>Public changelog powered by </span>
        <a href="https://sorano.space" style={{ fontSize: '11px', color: '#666', textDecoration: 'none' }}>sorano.space</a>
      </div>

    </div>
  )
}
