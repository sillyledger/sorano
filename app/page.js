'use client'
import { useState } from 'react'

export default function Home() {
  const [billing, setBilling] = useState('monthly')

  return (
    <div style={{ background: '#1c1c24', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 40px' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '11px', background: '#2e2e3a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="9" rx="1.5" fill="#7F77DD" opacity="0.9"/>
                <rect x="9" y="1" width="6" height="5" rx="1.5" fill="#7F77DD" opacity="0.5"/>
                <rect x="9" y="8" width="6" height="7" rx="1.5" fill="#7F77DD" opacity="0.7"/>
              </svg>
            </div>
            <span style={{ fontSize: '17px', fontWeight: '500', color: '#ddd' }}>sorano</span>
          </a>
          <div style={{ display: 'flex', gap: '28px' }}>
            <a href="#features" style={{ fontSize: '14px', color: '#aaa', textDecoration: 'none' }}>Features</a>
            <a href="#pricing" style={{ fontSize: '14px', color: '#aaa', textDecoration: 'none' }}>Pricing</a>
          </div>
          <a href="https://app.sorano.space/login" style={{ padding: '9px 20px', borderRadius: '8px', background: '#fff', fontSize: '14px', color: '#1c1c24', textDecoration: 'none', fontWeight: '500' }}>Sign in</a>
        </nav>

        {/* Hero */}
        <div style={{ padding: '100px 40px 80px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '99px', border: '0.5px solid rgba(255,255,255,0.1)', fontSize: '12px', color: '#555', marginBottom: '28px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75', display: 'inline-block' }}></span>
            built for founders building in public
          </div>
          <h1 style={{ fontSize: '52px', fontWeight: '500', color: '#ddd', lineHeight: '1.15', marginBottom: '20px', letterSpacing: '-0.03em' }}>
            Your roadmap, changelog,<br /><span style={{ color: '#7F77DD' }}>and community votes.</span>
          </h1>
          <p style={{ fontSize: '17px', color: '#666', maxWidth: '500px', margin: '0 auto 40px', lineHeight: '1.6' }}>
            Share what you're building. Let users vote on what's next. Publish a changelog when you ship. One clean link, no login required.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <a href="https://app.sorano.space/login" style={{ padding: '12px 28px', borderRadius: '9px', background: '#fff', fontSize: '14px', color: '#1c1c24', textDecoration: 'none', fontWeight: '500' }}>Start for free</a>
            <a href="https://sorano.space/example" style={{ padding: '12px 28px', borderRadius: '9px', background: 'transparent', border: '0.5px solid rgba(255,255,255,0.1)', fontSize: '14px', color: '#666', textDecoration: 'none' }}>View an example</a>
          </div>
        </div>

        {/* Features */}
        <div id="features" style={{ padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>

          {/* Roadmap board — spans 2 */}
          <div style={{ gridColumn: 'span 2', background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '36px', minHeight: '320px' }}>
            <div style={{ fontSize: '11px', color: '#3a3a44', letterSpacing: '.08em', marginBottom: '16px' }}>ROADMAP BOARD</div>
            <div style={{ fontSize: '20px', fontWeight: '500', color: '#bbb', marginBottom: '8px' }}>Four columns. Plan, build, ship.</div>
            <div style={{ fontSize: '13px', color: '#3a3a44', marginBottom: '28px' }}>Planned → In progress → In review → Shipped</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Planned', 'In progress', 'In review', 'Shipped'].map((col, i) => (
                <div key={col} style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', color: '#444', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ['#444','#185FA5','#854F0B','#0F6E56'][i], display: 'inline-block' }}></span>
                    {col}
                  </div>
                  {i === 0 && <>
                    <div style={{ background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.06)', borderLeft: '2px solid #7F77DD', borderRadius: '0 6px 6px 0', padding: '8px 10px', fontSize: '12px', color: '#555', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '10px', color: '#7F77DD' }}>▲ 31</span> API access
                    </div>
                    <div style={{ background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', color: '#555' }}>Dark mode</div>
                  </>}
                  {i === 1 && <div style={{ background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', color: '#555' }}>Split view</div>}
                  {i === 2 && <div style={{ background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', color: '#555' }}>Auth flow</div>}
                  {i === 3 && <>
                    <div style={{ background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', color: '#555', marginBottom: '5px' }}>Email verify</div>
                    <div style={{ background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', color: '#555' }}>Avatar upload</div>
                  </>}
                </div>
              ))}
            </div>
          </div>

          {/* Upvoting */}
          <div style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '36px', minHeight: '320px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '11px', color: '#3a3a44', letterSpacing: '.08em', marginBottom: '16px' }}>UPVOTING</div>
            <div style={{ fontSize: '20px', fontWeight: '500', color: '#bbb', marginBottom: '10px' }}>Let users vote on what's next.</div>
            <div style={{ fontSize: '13px', color: '#3a3a44', marginBottom: 'auto', paddingBottom: '24px' }}>No login needed. Anonymous tokens.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <div style={{ background: '#1c1c24', borderRadius: '8px', padding: '10px 12px', border: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '7px', background: 'rgba(127,119,221,0.15)', border: '0.5px solid rgba(127,119,221,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1px', flexShrink: 0 }}>
                  <span style={{ fontSize: '10px', color: '#7F77DD' }}>▲</span>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: '#7F77DD' }}>31</span>
                </div>
                <span style={{ fontSize: '12px', color: '#888' }}>Mobile app beta</span>
              </div>
              <div style={{ background: '#1c1c24', borderRadius: '8px', padding: '10px 12px', border: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '7px', background: '#1c1c24', border: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1px', flexShrink: 0 }}>
                  <span style={{ fontSize: '10px', color: '#555' }}>▲</span>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: '#555' }}>12</span>
                </div>
                <span style={{ fontSize: '12px', color: '#666' }}>Dark mode</span>
              </div>
            </div>
          </div>

          {/* Changelog */}
          <div style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '36px', minHeight: '260px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '11px', color: '#3a3a44', letterSpacing: '.08em', marginBottom: '16px' }}>CHANGELOG</div>
            <div style={{ fontSize: '20px', fontWeight: '500', color: '#bbb', marginBottom: '10px' }}>Ship. Write a note. Publish.</div>
            <div style={{ fontSize: '13px', color: '#3a3a44', marginBottom: 'auto', paddingBottom: '24px' }}>A public feed at /your-slug/changelog.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '3px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75', flexShrink: 0 }}></div>
                  <div style={{ width: '1px', background: 'rgba(255,255,255,0.06)', flex: 1, marginTop: '4px', minHeight: '20px' }}></div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#3a3a44', marginBottom: '3px' }}>JUN 11, 2026</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Upvote system launched</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '3px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75', flexShrink: 0 }}></div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#3a3a44', marginBottom: '3px' }}>JUN 8, 2026</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Custom labels shipped</div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '36px', minHeight: '260px', display: 'flex', flexDirection: 'column' }}>
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

          {/* Stats — spans 2 */}
          <div style={{ gridColumn: 'span 2', background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '36px', minHeight: '260px' }}>
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

          {/* Public URL */}
          <div style={{ gridColumn: 'span 3', background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '36px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '11px', color: '#3a3a44', letterSpacing: '.08em' }}>PUBLIC URL</div>
            <div style={{ fontSize: '20px', fontWeight: '500', color: '#bbb' }}>One link for everything.</div>
            <div style={{ fontSize: '13px', color: '#3a3a44' }}>Roadmap and changelog, both public. No login needed to view.</div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <div style={{ background: '#1c1c24', borderRadius: '10px', padding: '14px 16px', fontSize: '13px', color: '#3a3a44', border: '0.5px solid rgba(255,255,255,0.06)', flex: 1 }}>
                sorano.space/<span style={{ color: '#7F77DD' }}>your-product</span>
              </div>
              <div style={{ background: '#1c1c24', borderRadius: '10px', padding: '14px 16px', fontSize: '13px', color: '#3a3a44', border: '0.5px solid rgba(255,255,255,0.06)', flex: 1 }}>
                sorano.space/<span style={{ color: '#7F77DD' }}>your-product</span>/changelog
              </div>
            </div>
          </div>

        </div>

        {/* Pricing */}
        <div id="pricing" style={{ padding: '80px 40px 0' }}>
          <div style={{ fontSize: '28px', fontWeight: '500', color: '#ccc', textAlign: 'center', marginBottom: '10px' }}>Pricing</div>
          <div style={{ fontSize: '14px', color: '#444', textAlign: 'center', marginBottom: '28px' }}>Start free. Upgrade when you're ready.</div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'flex', background: '#22222c', borderRadius: '99px', padding: '4px', border: '0.5px solid rgba(255,255,255,0.08)', gap: '2px' }}>
              <button onClick={() => setBilling('monthly')} style={{ padding: '7px 20px', borderRadius: '99px', border: 'none', background: billing === 'monthly' ? '#fff' : 'transparent', color: billing === 'monthly' ? '#1c1c24' : '#555', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Monthly</button>
              <button onClick={() => setBilling('yearly')} style={{ padding: '7px 20px', borderRadius: '99px', border: 'none', background: billing === 'yearly' ? '#fff' : 'transparent', color: billing === 'yearly' ? '#1c1c24' : '#555', fontSize: '13px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px' }}>
                Yearly
                <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '99px', background: '#0a1a12', color: '#1D9E75', fontWeight: '500' }}>Save 37%</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', maxWidth: '820px', margin: '0 auto' }}>

            <div style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '28px' }}>
              <div style={{ fontSize: '13px', color: '#555', marginBottom: '10px' }}>Free</div>
              <div style={{ fontSize: '32px', fontWeight: '500', color: '#ccc', marginBottom: '4px' }}>$0 <span style={{ fontSize: '13px', color: '#444', fontWeight: '400' }}>/ forever</span></div>
              <div style={{ fontSize: '13px', color: '#3a3a44', marginBottom: '20px' }}>Perfect for solo founders.</div>
              <a href="https://app.sorano.space/login" style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: '9px', fontSize: '13px', fontWeight: '500', background: 'transparent', border: '0.5px solid rgba(255,255,255,0.08)', color: '#666', textDecoration: 'none', marginBottom: '20px' }}>Get started</a>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['3 public boards', 'Unlimited cards', 'Public roadmap', 'Public changelog', 'View vote counts'].map(f => (
                  <div key={f} style={{ fontSize: '13px', color: '#444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#1D9E75' }}>✓</span> {f}
                  </div>
                ))}
                <div style={{ fontSize: '13px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#333' }}>–</span> Voting disabled
                </div>
              </div>
            </div>

            <div style={{ background: '#22222c', border: '1.5px solid rgba(127,119,221,0.5)', borderRadius: '16px', padding: '28px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#7F77DD', color: '#fff', fontSize: '11px', fontWeight: '500', padding: '3px 12px', borderRadius: '99px', whiteSpace: 'nowrap' }}>Most popular</div>
              <div style={{ fontSize: '13px', color: '#555', marginBottom: '10px' }}>Lifetime</div>
              <div style={{ fontSize: '32px', fontWeight: '500', color: '#ccc', marginBottom: '4px' }}>$60 <span style={{ fontSize: '13px', color: '#444', fontWeight: '400' }}>/ once</span></div>
              <div style={{ fontSize: '13px', color: '#3a3a44', marginBottom: '20px' }}>Pay once, use forever.</div>
              <a href="https://app.sorano.space/login" style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: '9px', fontSize: '13px', fontWeight: '500', background: '#7F77DD', border: 'none', color: '#fff', textDecoration: 'none', marginBottom: '20px' }}>Get lifetime access</a>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Unlimited boards', 'Upvoting enabled', 'Custom labels', 'Remove branding', 'All future features'].map(f => (
                  <div key={f} style={{ fontSize: '13px', color: '#444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#1D9E75' }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#22222c', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '28px' }}>
              <div style={{ fontSize: '13px', color: '#555', marginBottom: '10px' }}>Pro</div>
              <div style={{ fontSize: '32px', fontWeight: '500', color: '#ccc', marginBottom: '4px' }}>
                {billing === 'monthly' ? <>${'4'} <span style={{ fontSize: '13px', color: '#444', fontWeight: '400' }}>/ month</span></> : <>${'30'} <span style={{ fontSize: '13px', color: '#444', fontWeight: '400' }}>/ year</span></>}
              </div>
              <div style={{ fontSize: '13px', color: '#3a3a44', marginBottom: '20px' }}>For founders with multiple products.</div>
              <a href="https://app.sorano.space/login" style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: '9px', fontSize: '13px', fontWeight: '500', background: '#fff', border: 'none', color: '#1c1c24', textDecoration: 'none', marginBottom: '20px' }}>Upgrade to Pro</a>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Unlimited boards', 'Upvoting enabled', 'Custom labels', 'Remove branding'].map(f => (
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
