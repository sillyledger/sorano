export default function Home() {
  return (
    <div style={{ background: '#1c1c24', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', paddingBottom: '60px' }}>

      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#2e2e3a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="9" rx="1.5" fill="#7F77DD" opacity="0.9"/>
                <rect x="9" y="1" width="6" height="5" rx="1.5" fill="#7F77DD" opacity="0.5"/>
                <rect x="9" y="8" width="6" height="7" rx="1.5" fill="#7F77DD" opacity="0.7"/>
              </svg>
            </div>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#ccc' }}>sorano</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#features" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Features</a>
            <a href="#pricing" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Pricing</a>
          </div>
          <a href="https://app.sorano.space/login" style={{ padding: '7px 16px', borderRadius: '8px', background: '#fff', fontSize: '13px', color: '#1c1c24', textDecoration: 'none', fontWeight: '500' }}>Get started free</a>
        </nav>

        <div style={{ padding: '80px 40px 60px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '99px', border: '0.5px solid rgba(255,255,255,0.1)', fontSize: '11px', color: '#555', marginBottom: '24px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#1D9E75', display: 'inline-block' }}></span>
            built for founders building in public
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '500', color: '#ddd', lineHeight: '1.2', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Your product roadmap,<br /><span style={{ color: '#7F77DD' }}>publicly shared.</span>
          </h1>
          <p style={{ fontSize: '15px', color: '#444', maxWidth: '420px', margin: '0 auto 32px', lineHeight: '1.6' }}>
            Show users what you're building. Share progress in real time. One clean link, no login required.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <a href="https://app.sorano.space/login" style={{ padding: '10px 22px', borderRadius: '8px', background: '#fff', fontSize: '13px', color: '#1c1c24', textDecoration: 'none', fontWeight: '500' }}>Start for free</a>
            <a href="https://sorano.space/test-board" style={{ padding: '10px 22px', borderRadius: '8px', background: 'transparent', border: '0.5px solid rgba(255,255,255,0.1)', fontSize: '13px', color: '#666', textDecoration: 'none' }}>View an example</a>
          </div>
        </div>

        <div id="features" style={{ padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <div style={{ gridColumn: 'span 2', background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ fontSize: '10px', color: '#3a3a44', letterSpacing: '.06em', marginBottom: '12px' }}>ROADMAP BOARD</div>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#bbb', marginBottom: '6px' }}>Four columns. Add cards, ship fast.</div>
            <div style={{ fontSize: '12px', color: '#3a3a44' }}>Planned → In progress → In review → Shipped</div>
            <div style={{ marginTop: '16px', display: 'flex', gap: '6px' }}>
              {['Planned', 'In progress', 'In review', 'Shipped'].map((col, i) => (
                <div key={col} style={{ flex: 1 }}>
                  <div style={{ fontSize: '9px', color: '#333', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: ['#333','#185FA5','#854F0B','#0F6E56'][i], display: 'inline-block' }}></span>
                    {col}
                  </div>
                  {i === 0 && <><div style={{ background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.05)', borderRadius: '5px', padding: '5px 7px', fontSize: '9px', color: '#555', marginBottom: '3px' }}>Home redesign</div><div style={{ background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.05)', borderRadius: '5px', padding: '5px 7px', fontSize: '9px', color: '#555' }}>Dark mode</div></>}
                  {i === 1 && <div style={{ background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.05)', borderRadius: '5px', padding: '5px 7px', fontSize: '9px', color: '#555' }}>Split view</div>}
                  {i === 2 && <div style={{ background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.05)', borderRadius: '5px', padding: '5px 7px', fontSize: '9px', color: '#555' }}>Auth flow</div>}
                  {i === 3 && <><div style={{ background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.05)', borderRadius: '5px', padding: '5px 7px', fontSize: '9px', color: '#555', marginBottom: '3px' }}>Email verify</div><div style={{ background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.05)', borderRadius: '5px', padding: '5px 7px', fontSize: '9px', color: '#555' }}>Avatar upload</div></>}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ fontSize: '10px', color: '#3a3a44', letterSpacing: '.06em', marginBottom: '12px' }}>PUBLIC URL</div>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#bbb', marginBottom: '6px' }}>One link to share everything.</div>
            <div style={{ fontSize: '12px', color: '#3a3a44', marginBottom: '16px' }}>No login needed to view.</div>
            <div style={{ background: '#1c1c24', borderRadius: '8px', padding: '10px 12px', fontSize: '11px', color: '#3a3a44', border: '0.5px solid rgba(255,255,255,0.06)' }}>
              sorano.space/<span style={{ color: '#7F77DD' }}>your-product</span>
            </div>
          </div>

          <div style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ fontSize: '10px', color: '#3a3a44', letterSpacing: '.06em', marginBottom: '12px' }}>PRIVACY</div>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#bbb', marginBottom: '6px' }}>Public or private, your call.</div>
            <div style={{ fontSize: '12px', color: '#3a3a44', marginBottom: '16px' }}>Toggle visibility anytime.</div>
            <div style={{ background: '#1c1c24', borderRadius: '8px', padding: '10px 12px', border: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: '#555' }}>Board visibility · Public</span>
              <div style={{ width: '28px', height: '16px', borderRadius: '99px', background: '#0F6E56', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '2px', left: '14px', width: '12px', height: '12px', borderRadius: '50%', background: '#ccc' }}></div>
              </div>
            </div>
          </div>

          <div style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ fontSize: '10px', color: '#3a3a44', letterSpacing: '.06em', marginBottom: '12px' }}>STATS</div>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#bbb', marginBottom: '16px' }}>Always know where you stand.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[['6','Planned'],['3','In progress'],['2','In review'],['14','Shipped']].map(([val,lbl]) => (
                <div key={lbl} style={{ background: '#1c1c24', borderRadius: '8px', padding: '10px 12px', border: '0.5px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '20px', fontWeight: '500', color: '#bbb' }}>{val}</div>
                  <div style={{ fontSize: '10px', color: '#333', marginTop: '2px' }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="pricing" style={{ padding: '60px 40px 0' }}>
          <div style={{ fontSize: '22px', fontWeight: '500', color: '#ccc', textAlign: 'center', marginBottom: '8px' }}>Simple pricing</div>
          <div style={{ fontSize: '13px', color: '#444', textAlign: 'center', marginBottom: '32px' }}>Start free. Upgrade when you need more.</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px' }}>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px' }}>Free</div>
              <div style={{ fontSize: '28px', fontWeight: '500', color: '#ccc', marginBottom: '4px' }}>$0 <span style={{ fontSize: '13px', color: '#444', fontWeight: '400' }}>/ forever</span></div>
              <div style={{ fontSize: '12px', color: '#3a3a44', marginBottom: '16px' }}>Perfect for solo founders.</div>
              <a href="https://app.sorano.space/login" style={{ display: 'block', textAlign: 'center', padding: '9px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', background: 'transparent', border: '0.5px solid rgba(255,255,255,0.08)', color: '#666', textDecoration: 'none' }}>Get started</a>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {['1 public board','Unlimited cards','Public URL'].map(f => (
                  <div key={f} style={{ fontSize: '11px', color: '#444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#1D9E75' }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#22222c', border: '0.5px solid rgba(127,119,221,0.3)', borderRadius: '12px', padding: '24px' }}>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px' }}>Pro</div>
              <div style={{ fontSize: '28px', fontWeight: '500', color: '#ccc', marginBottom: '4px' }}>$7 <span style={{ fontSize: '13px', color: '#444', fontWeight: '400' }}>/ month</span></div>
              <div style={{ fontSize: '12px', color: '#3a3a44', marginBottom: '16px' }}>For founders with multiple products.</div>
              <a href="https://app.sorano.space/login" style={{ display: 'block', textAlign: 'center', padding: '9px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', background: '#fff', border: 'none', color: '#1c1c24', textDecoration: 'none' }}>Upgrade to Pro</a>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {['Unlimited boards','Custom domain','Feature voting','Remove branding'].map(f => (
                  <div key={f} style={{ fontSize: '11px', color: '#444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#1D9E75' }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '40px 40px 0', borderTop: '0.5px solid rgba(255,255,255,0.05)', marginTop: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', color: '#333' }}>sorano © 2026</span>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy','Terms','Twitter'].map(l => (
              <span key={l} style={{ fontSize: '12px', color: '#2a2a32' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
