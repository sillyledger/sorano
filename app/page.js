export default function Home() {
  return (
    <div style={{ background: '#1c1c24', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', paddingBottom: '80px' }}>

      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#2e2e3a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="9" rx="1.5" fill="#7F77DD" opacity="0.9"/>
                <rect x="9" y="1" width="6" height="5" rx="1.5" fill="#7F77DD" opacity="0.5"/>
                <rect x="9" y="8" width="6" height="7" rx="1.5" fill="#7F77DD" opacity="0.7"/>
              </svg>
            </div>
            <span style={{ fontSize: '17px', fontWeight: '500', color: '#ddd' }}>sorano</span>
          </div>
          <div style={{ display: 'flex', gap: '28px' }}>
            <a href="#features" style={{ fontSize: '14px', color: '#aaa', textDecoration: 'none' }}>Features</a>
            <a href="#pricing" style={{ fontSize: '14px', color: '#aaa', textDecoration: 'none' }}>Pricing</a>
          </div>
          <a href="https://app.sorano.space/login" style={{ padding: '9px 20px', borderRadius: '8px', background: '#fff', fontSize: '14px', color: '#1c1c24', textDecoration: 'none', fontWeight: '500' }}>Get started free</a>
        </nav>

        <div style={{ padding: '100px 40px 80px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '99px', border: '0.5px solid rgba(255,255,255,0.1)', fontSize: '12px', color: '#555', marginBottom: '28px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75', display: 'inline-block' }}></span>
            built for founders building in public
          </div>
          <h1 style={{ fontSize: '52px', fontWeight: '500', color: '#ddd', lineHeight: '1.15', marginBottom: '20px', letterSpacing: '-0.03em' }}>
            Your product roadmap,<br /><span style={{ color: '#7F77DD' }}>publicly shared.</span>
          </h1>
          <p style={{ fontSize: '17px', color: '#444', maxWidth: '460px', margin: '0 auto 40px', lineHeight: '1.6' }}>
            Show users what you're building. Share progress in real time. One clean link, no login required.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <a href="https://app.sorano.space/login" style={{ padding: '12px 28px', borderRadius: '9px', background: '#fff', fontSize: '14px', color: '#1c1c24', textDecoration: 'none', fontWeight: '500' }}>Start for free</a>
            <a href="https://sorano.space/test-board" style={{ padding: '12px 28px', borderRadius: '9px', background: 'transparent', border: '0.5px solid rgba(255,255,255,0.1)', fontSize: '14px', color: '#666', textDecoration: 'none' }}>View an example</a>
          </div>
        </div>

        <div id="features" style={{ padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div style={{ gridColumn: 'span 2', background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '36px', minHeight: '320px' }}>
            <div style={{ fontSize: '11px', color: '#3a3a44', letterSpacing: '.08em', marginBottom: '16px' }}>ROADMAP BOARD</div>
            <div style={{ fontSize: '20px', fontWeight: '500', color: '#bbb', marginBottom: '8px' }}>Four columns. Add cards, ship fast.</div>
            <div style={{ fontSize: '13px', color: '#3a3a44', marginBottom: '28px' }}>Planned → In progress → In review → Shipped</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Planned', 'In progress', 'In review', 'Shipped'].map((col, i) => (
                <div key={col} style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', color: '#444', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ['#444','#185FA5','#854F0B','#0F6E56'][i], display: 'inline-block' }}></span>
                    {col}
                  </div>
                  {i === 0 && <><div style={{ background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', color: '#555', marginBottom: '5px' }}>Home redesign</div><div style={{ background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', color: '#555' }}>Dark mode</div></>}
                  {i === 1 && <div style={{ background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', color: '#555' }}>Split view</div>}
                  {i === 2 && <div style={{ background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', color: '#555' }}>Auth flow</div>}
                  {i === 3 && <><div style={{ background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', color: '#555', marginBottom: '5px' }}>Email verify</div><div style={{ background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', color: '#555' }}>Avatar upload</div></>}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '36px', minHeight: '320px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '11px', color: '#3a3a44', letterSpacing: '.08em', marginBottom: '16px' }}>PUBLIC URL</div>
            <div style={{ fontSize: '20px', fontWeight: '500', color: '#bbb', marginBottom: '10px' }}>One link to share everything.</div>
            <div style={{ fontSize: '13px', color: '#3a3a44', marginBottom: 'auto', paddingBottom: '28px' }}>No login needed to view.</div>
            <div style={{ background: '#1c1c24', borderRadius: '10px', padding: '14px 16px', fontSize: '13px', color: '#3a3a44', border: '0.5px solid rgba(255,255,255,0.06)' }}>
              sorano.space/<span style={{ color: '#7F77DD' }}>your-product</span>
            </div>
          </div>

          <div style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '36px', minHeight: '280px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '11px', color: '#3a3a44', letterSpacing: '.08em', marginBottom: '16px' }}>PRIVACY</div>
            <div style={{ fontSize: '20px', fontWeight: '500', color: '#bbb', marginBottom: '10px' }}>Public or private, your call.</div>
            <div style={{ fontSize: '13px', color: '#3a3a44', marginBottom: 'auto', paddingBottom: '28px' }}>Toggle visibility anytime.</div>
            <div style={{ background: '#1c1c24', borderRadius: '10px', padding: '14px 16px', border: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#555' }}>Board visibility · Public</span>
              <div style={{ width: '32px', height: '18px', borderRadius: '99px', background: '#0F6E56', position: 'relative', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: '3px', left: '16px', width: '12px', height: '12px', borderRadius: '50%', background: '#ccc' }}></div>
              </div>
            </div>
          </div>

          <div style={{ gridColumn: 'span 2', background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '36px', minHeight: '280px' }}>
            <div style={{ fontSize: '11px', color: '#3a3a44', letterSpacing: '.08em', marginBottom: '16px' }}>STATS</div>
            <div style={{ fontSize: '20px', fontWeight: '500', color: '#bbb', marginBottom: '28px' }}>Always know where you stand.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
              {[['6','Planned'],['3','In progress'],['2','In review'],['14','Shipped']].map(([val,lbl]) => (
                <div key={lbl} style={{ background: '#1c1c24', borderRadius: '10px', padding: '16px', border: '0.5px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '32px', fontWeight: '500', color: '#bbb', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: '12px', color: '#444', marginTop: '6px' }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="pricing" style={{ padding: '80px 40px 0' }}>
          <div style={{ fontSize: '28px', fontWeight: '500', color: '#ccc', textAlign: 'center', marginBottom: '10px' }}>Simple pricing</div>
          <div style={{ fontSize: '14px', color: '#444', textAlign: 'center', marginBottom: '40px' }}>Start free. Upgrade when you need more.</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '560px', margin: '0 auto' }}>
            <div style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '32px' }}>
              <div style={{ fontSize: '13px', color: '#555', marginBottom: '10px' }}>Free</div>
              <div style={{ fontSize: '36px', fontWeight: '500', color: '#ccc', marginBottom: '6px' }}>$0 <span style={{ fontSize: '14px', color: '#444', fontWeight: '400' }}>/ forever</span></div>
              <div style={{ fontSize: '13px', color: '#3a3a44', marginBottom: '20px' }}>Perfect for solo founders.</div>
              <a href="https://app.sorano.space/login" style={{ display: 'block', textAlign: 'center', padding: '11px', borderRadius: '9px', fontSize: '14px', fontWeight: '500', background: 'transparent', border: '0.5px solid rgba(255,255,255,0.08)', color: '#666', textDecoration: 'none' }}>Get started</a>
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['1 public board','Unlimited cards','Public URL'].map(f => (
                  <div key={f} style={{ fontSize: '13px', color: '#444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#1D9E75' }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#22222c', border: '0.5px solid rgba(127,119,221,0.3)', borderRadius: '16px', padding: '32px' }}>
              <div style={{ fontSize: '13px', color: '#555', marginBottom: '10px' }}>Pro</div>
              <div style={{ fontSize: '36px', fontWeight: '500', color: '#ccc', marginBottom: '6px' }}>$7 <span style={{ fontSize: '14px', color: '#444', fontWeight: '400' }}>/ month</span></div>
              <div style={{ fontSize: '13px', color: '#3a3a44', marginBottom: '20px' }}>For founders with multiple products.</div>
              <a href="https://app.sorano.space/login" style={{ display: 'block', textAlign: 'center', padding: '11px', borderRadius: '9px', fontSize: '14px', fontWeight: '500', background: '#fff', border: 'none', color: '#1c1c24', textDecoration: 'none' }}>Upgrade to Pro</a>
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Unlimited boards','Custom domain','Feature voting','Remove branding'].map(f => (
                  <div key={f} style={{ fontSize: '13px', color: '#444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#1D9E75' }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '60px 40px 0', borderTop: '0.5px solid rgba(255,255,255,0.05)', marginTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', color: '#333' }}>sorano © 2026</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy','Terms','Twitter'].map(l => (
              <span key={l} style={{ fontSize: '13px', color: '#2a2a32' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
