const COLUMNS = [
  { key: 'planned', label: 'Planned', color: '#444' },
  { key: 'in-progress', label: 'In progress', color: '#185FA5' },
  { key: 'in-review', label: 'In review', color: '#854F0B' },
  { key: 'shipped', label: 'Shipped', color: '#0F6E56' },
]

const CARDS = [
  { id: 1, title: 'Onboarding flow redesign', status: 'planned', tag: 'UX' },
  { id: 2, title: 'Mobile app beta', status: 'planned', tag: 'Feature' },
  { id: 3, title: 'API rate limiting', status: 'planned', tag: 'Core' },
  { id: 4, title: 'Team permissions system', status: 'planned', tag: 'Feature' },
  { id: 5, title: 'Stripe integration', status: 'in-progress', tag: 'Feature' },
  { id: 6, title: 'Dashboard v2', status: 'in-progress', tag: 'UI' },
  { id: 7, title: 'Email notifications', status: 'in-progress', tag: 'Feature' },
  { id: 8, title: 'Invite team members flow', status: 'in-review', tag: 'UX' },
  { id: 9, title: 'Usage analytics page', status: 'in-review', tag: 'Feature' },
  { id: 10, title: 'Magic link auth', status: 'shipped', tag: 'Auth' },
  { id: 11, title: 'Workspace settings', status: 'shipped', tag: 'Core' },
  { id: 12, title: 'Billing page', status: 'shipped', tag: 'Feature' },
  { id: 13, title: 'CSV export', status: 'shipped', tag: 'Feature' },
  { id: 14, title: 'Public API docs', status: 'shipped', tag: 'Core' },
]

const TAG_STYLES = {
  UI: { bg: '#22203a', color: '#7F77DD' },
  Core: { bg: '#26262e', color: '#666' },
  Feature: { bg: '#122218', color: '#1D9E75' },
  Auth: { bg: '#122218', color: '#1D9E75' },
  UX: { bg: '#241e10', color: '#BA7517' },
}

export default function ExampleBoard() {
  return (
    <div style={{ minHeight: '100vh', background: '#1c1c24', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ padding: '20px 28px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#2e2e3a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="9" rx="1.5" fill="#7F77DD" opacity="0.9"/>
              <rect x="9" y="1" width="6" height="5" rx="1.5" fill="#7F77DD" opacity="0.5"/>
              <rect x="9" y="8" width="6" height="7" rx="1.5" fill="#7F77DD" opacity="0.7"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7F77DD', display: 'inline-block' }}></span>
              Launchpad
            </div>
            <div style={{ fontSize: '11px', color: '#3a3a44', marginTop: '1px' }}>sorano.space/launchpad</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '11px', color: '#3a3a44', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0F6E56', display: 'inline-block' }}></span>
            actively building
          </div>
          <a href="https://sorano.space" style={{ padding: '6px 14px', borderRadius: '7px', background: '#fff', fontSize: '12px', color: '#1c1c24', textDecoration: 'none', fontWeight: '500' }}>
            Create yours free →
          </a>
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        {COLUMNS.map(col => (
          <div key={col.key} style={{ flex: 1, borderRight: '0.5px solid rgba(255,255,255,0.05)', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: col.color, display: 'inline-block' }}></span>
              <span style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>{col.label}</span>
              <span style={{ fontSize: '11px', color: '#333', background: '#22222c', padding: '1px 6px', borderRadius: '99px' }}>
                {CARDS.filter(c => c.status === col.key).length}
              </span>
            </div>
            {CARDS.filter(c => c.status === col.key).map(card => (
              <div key={card.id} style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '11px 12px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#aaa', lineHeight: '1.45', marginBottom: card.tag ? '8px' : '0' }}>{card.title}</div>
                {card.tag && (
                  <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '99px', fontWeight: '500', background: TAG_STYLES[card.tag]?.bg || '#26262e', color: TAG_STYLES[card.tag]?.color || '#666' }}>{card.tag}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ padding: '24px', borderTop: '0.5px solid rgba(255,255,255,0.05)', textAlign: 'center', marginTop: '20px' }}>
        <span style={{ fontSize: '12px', color: '#555' }}>Public roadmap powered by </span>
        <a href="https://sorano.space" style={{ fontSize: '12px', color: '#7F77DD', textDecoration: 'none' }}>sorano.space</a>
      </div>
    </div>
  )
}
