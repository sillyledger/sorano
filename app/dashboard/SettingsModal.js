'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const TIMEZONES = [
  { value: 'UTC-12:00', label: 'UTC−12:00 — Baker Island' },
  { value: 'UTC-11:00', label: 'UTC−11:00 — Pago Pago' },
  { value: 'UTC-10:00', label: 'UTC−10:00 — Honolulu' },
  { value: 'UTC-09:00', label: 'UTC−9:00 — Anchorage' },
  { value: 'UTC-08:00', label: 'UTC−8:00 — Los Angeles' },
  { value: 'UTC-07:00', label: 'UTC−7:00 — Denver' },
  { value: 'UTC-06:00', label: 'UTC−6:00 — Chicago' },
  { value: 'UTC-05:00', label: 'UTC−5:00 — New York' },
  { value: 'UTC-04:00', label: 'UTC−4:00 — Halifax' },
  { value: 'UTC-03:00', label: 'UTC−3:00 — São Paulo' },
  { value: 'UTC-02:00', label: 'UTC−2:00 — Mid-Atlantic' },
  { value: 'UTC-01:00', label: 'UTC−1:00 — Azores' },
  { value: 'UTC+00:00', label: 'UTC±0:00 — London' },
  { value: 'UTC+01:00', label: 'UTC+1:00 — Paris / Berlin' },
  { value: 'UTC+02:00', label: 'UTC+2:00 — Cairo / Helsinki' },
  { value: 'UTC+03:00', label: 'UTC+3:00 — Moscow / Nairobi' },
  { value: 'UTC+04:00', label: 'UTC+4:00 — Dubai' },
  { value: 'UTC+05:00', label: 'UTC+5:00 — Karachi' },
  { value: 'UTC+05:30', label: 'UTC+5:30 — Mumbai / Delhi' },
  { value: 'UTC+06:00', label: 'UTC+6:00 — Dhaka' },
  { value: 'UTC+07:00', label: 'UTC+7:00 — Bangkok / Jakarta' },
  { value: 'UTC+08:00', label: 'UTC+8:00 — Taipei / Singapore' },
  { value: 'UTC+09:00', label: 'UTC+9:00 — Tokyo / Seoul' },
  { value: 'UTC+09:30', label: 'UTC+9:30 — Adelaide' },
  { value: 'UTC+10:00', label: 'UTC+10:00 — Sydney' },
  { value: 'UTC+11:00', label: 'UTC+11:00 — Solomon Islands' },
  { value: 'UTC+12:00', label: 'UTC+12:00 — Auckland' },
]

const DATE_FORMATS = [
  { value: 'MMM D, YYYY', label: 'Jun 12, 2026' },
  { value: 'D MMM YYYY', label: '12 Jun 2026' },
  { value: 'MM/DD/YYYY', label: '06/12/2026' },
  { value: 'DD/MM/YYYY', label: '12/06/2026' },
  { value: 'YYYY-MM-DD', label: '2026-06-12' },
]

function BillingIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1.5" y="3.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M1.5 6.5h12" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="3.5" y="8.5" width="3" height="1.5" rx="0.5" fill="currentColor"/>
    </svg>
  )
}

const NAV = [
  { key: 'account', label: 'Account', icon: AccountIcon },
  { key: 'preferences', label: 'Preferences', icon: PreferencesIcon },
  { key: 'security', label: 'Security', icon: SecurityIcon },
  { key: 'billing', label: 'Billing', icon: BillingIcon },
]

function AccountIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M2 13c0-3 2.5-4.5 5.5-4.5S13 10 13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

function PreferencesIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M7.5 1v2M7.5 12v2M1 7.5h2M12 7.5h2M2.929 2.929l1.414 1.414M10.657 10.657l1.414 1.414M2.929 12.071l1.414-1.414M10.657 4.343l1.414-1.414" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

function SecurityIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="3" y="6" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="7.5" cy="9.5" r="1" fill="currentColor"/>
    </svg>
  )
}

export default function SettingsModal({ user, onClose }) {
  const [tab, setTab] = useState('account')

  // Account
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || '')
  const [accountMsg, setAccountMsg] = useState(null)
  const [accountLoading, setAccountLoading] = useState(false)

  // Preferences
  const [timezone, setTimezone] = useState(
    typeof window !== 'undefined' ? (localStorage.getItem('sorano_tz') || 'UTC+08:00') : 'UTC+08:00'
  )
  const [dateFormat, setDateFormat] = useState(
    typeof window !== 'undefined' ? (localStorage.getItem('sorano_datefmt') || 'MMM D, YYYY') : 'MMM D, YYYY'
  )
  const [prefMsg, setPrefMsg] = useState(null)

  // Security
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwMsg, setPwMsg] = useState(null)
  const [pwLoading, setPwLoading] = useState(false)

  const [newEmail, setNewEmail] = useState('')
  const [emailMsg, setEmailMsg] = useState(null)
  const [emailLoading, setEmailLoading] = useState(false)

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function saveAccount() {
    setAccountLoading(true)
    setAccountMsg(null)
    const { error } = await supabase.auth.updateUser({ data: { display_name: displayName } })
    setAccountLoading(false)
    if (error) setAccountMsg({ type: 'error', text: error.message })
    else setAccountMsg({ type: 'success', text: 'Display name saved.' })
  }

  function savePreferences() {
    localStorage.setItem('sorano_tz', timezone)
    localStorage.setItem('sorano_datefmt', dateFormat)
    setPrefMsg({ type: 'success', text: 'Preferences saved.' })
    setTimeout(() => setPrefMsg(null), 2500)
  }

  async function updatePassword() {
    setPwMsg(null)
    if (!newPw) { setPwMsg({ type: 'error', text: 'Enter a new password.' }); return }
    if (newPw !== confirmPw) { setPwMsg({ type: 'error', text: 'Passwords do not match.' }); return }
    if (newPw.length < 6) { setPwMsg({ type: 'error', text: 'Password must be at least 6 characters.' }); return }
    setPwLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPw })
    setPwLoading(false)
    if (error) setPwMsg({ type: 'error', text: error.message })
    else {
      setPwMsg({ type: 'success', text: 'Password updated.' })
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    }
  }

  async function updateEmail() {
    setEmailMsg(null)
    if (!newEmail || !newEmail.includes('@')) { setEmailMsg({ type: 'error', text: 'Enter a valid email address.' }); return }
    setEmailLoading(true)
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    setEmailLoading(false)
    if (error) setEmailMsg({ type: 'error', text: error.message })
    else {
      setEmailMsg({ type: 'success', text: 'Check your new email to confirm the change.' })
      setNewEmail('')
    }
  }

  const s = styles

  return (
    <div onClick={onClose} style={s.overlay}>
      <div onClick={e => e.stopPropagation()} style={s.modal}>

        {/* Left sidebar */}
        <div style={s.sidebar}>
          <div style={s.sidebarHeader}>Settings</div>
          <nav style={s.nav}>
            {NAV.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setTab(key)} style={{
                ...s.navItem,
                background: tab === key ? 'rgba(255,255,255,0.05)' : 'transparent',
                color: tab === key ? '#ccc' : '#555',
              }}>
                <span style={{ color: tab === key ? '#7F77DD' : '#444', display: 'flex' }}>
                  <Icon />
                </span>
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right panel */}
        <div style={s.panel}>
          <button onClick={onClose} style={s.closeBtn} aria-label="Close settings">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {tab === 'account' && (
            <Section title="Account" subtitle="Manage your profile information.">
              <Field label="Display name">
                <input
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  style={s.input}
                />
              </Field>
              <Row>
                {accountMsg && <Msg msg={accountMsg} />}
                <SaveBtn onClick={saveAccount} loading={accountLoading}>Save changes</SaveBtn>
              </Row>
            </Section>
          )}

          {tab === 'preferences' && (
            <Section title="Preferences" subtitle="Regional and display settings.">
              <FieldRow label="Time zone" sublabel="Used for timestamps in the app">
                <select value={timezone} onChange={e => setTimezone(e.target.value)} style={s.select}>
                  {TIMEZONES.map(tz => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </FieldRow>
              <Divider />
              <FieldRow label="Date format" sublabel="How dates are displayed across the app">
                <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} style={s.select}>
                  {DATE_FORMATS.map(df => (
                    <option key={df.value} value={df.value}>{df.label}</option>
                  ))}
                </select>
              </FieldRow>
              <Row>
                {prefMsg && <Msg msg={prefMsg} />}
                <SaveBtn onClick={savePreferences}>Save preferences</SaveBtn>
              </Row>
            </Section>
          )}

          {tab === 'security' && (
            <Section title="Security" subtitle="Manage your password and email address.">
              <SectionLabel>PASSWORD</SectionLabel>
              <Field label="New password">
                <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="········" style={s.input} />
              </Field>
              <Field label="Confirm new password">
                <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="········" style={s.input} onKeyDown={e => e.key === 'Enter' && updatePassword()} />
              </Field>
              <Row>
                {pwMsg && <Msg msg={pwMsg} />}
                <SaveBtn onClick={updatePassword} loading={pwLoading}>Update password</SaveBtn>
              </Row>

              <Divider />

              <SectionLabel>EMAIL ADDRESS</SectionLabel>
              <div style={{ fontSize: '12px', color: '#444', marginBottom: '12px' }}>
                Current: <span style={{ color: '#666' }}>{user?.email}</span>
              </div>
              <Field label="New email">
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="new@email.com"
                  style={s.input}
                  onKeyDown={e => e.key === 'Enter' && updateEmail()}
                />
              </Field>
              <Row>
                {emailMsg && <Msg msg={emailMsg} />}
                <SaveBtn onClick={updateEmail} loading={emailLoading}>Update email</SaveBtn>
              </Row>
            </Section>
          )}

          {tab === 'billing' && (
            <Section title="Billing" subtitle="Manage your plan.">
              <SectionLabel>PLANS</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                {/* Free */}
                <div style={{
                  padding: '16px 20px', borderRadius: '10px',
                  border: '0.5px solid rgba(255,255,255,0.08)', background: '#1c1c24',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#bbb', marginBottom: '3px' }}>Free</div>
                    <div style={{ fontSize: '12px', color: '#444' }}>3 public boards · Voting disabled · Public roadmap</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '20px', fontWeight: '600', color: '#888' }}>$0</span>
                    <span style={{ fontSize: '12px', color: '#444' }}> /mo</span>
                  </div>
                </div>

                {/* Pro */}
                <div style={{
                  padding: '16px 20px', borderRadius: '10px',
                  border: '0.5px solid rgba(127,119,221,0.4)', background: 'rgba(127,119,221,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#ccc' }}>Pro</span>
                      <span style={{ fontSize: '10px', fontWeight: '500', color: '#7F77DD', background: 'rgba(127,119,221,0.15)', border: '0.5px solid rgba(127,119,221,0.3)', padding: '2px 7px', borderRadius: '20px' }}>Upgrade</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#444' }}>Unlimited boards · Upvoting enabled · Custom labels · Remove branding</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '20px', fontWeight: '600', color: '#ccc' }}>$4</span>
                      <span style={{ fontSize: '12px', color: '#444' }}> /mo</span>
                    </div>
                    <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#7F77DD', color: '#fff', fontSize: '13px', fontWeight: '500', cursor: 'not-allowed', opacity: 0.7 }}>Upgrade</button>
                  </div>
                </div>

                {/* Lifetime */}
                <div style={{
                  padding: '16px 20px', borderRadius: '10px',
                  border: '0.5px solid rgba(239,159,39,0.35)', background: 'rgba(239,159,39,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#ccc' }}>Lifetime</span>
                      <span style={{ fontSize: '10px', fontWeight: '500', color: '#EF9F27', background: 'rgba(239,159,39,0.12)', border: '0.5px solid rgba(239,159,39,0.3)', padding: '2px 7px', borderRadius: '20px' }}>Best value</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#444', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Everything in Pro · Pay once, use forever · All future features</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '20px', fontWeight: '600', color: '#ccc' }}>$60</span>
                      <span style={{ fontSize: '12px', color: '#444' }}> once</span>
                    </div>
                    <button style={{ padding: '8px 16px', borderRadius: '8px', border: '0.5px solid rgba(239,159,39,0.3)', background: 'rgba(239,159,39,0.15)', color: '#EF9F27', fontSize: '13px', fontWeight: '500', cursor: 'not-allowed', opacity: 0.7 }}>Get lifetime</button>
                  </div>
                </div>

              </div>
              <div style={{ fontSize: '11px', color: '#333', marginTop: '4px' }}>Payments coming soon — check back shortly.</div>
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Small helpers ────────────────────────────────────────────────────────────

function Section({ title, subtitle, children }) {
  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '16px', fontWeight: '500', color: '#ccc', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '12px', color: '#444' }}>{subtitle}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{children}</div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '12px', color: '#666' }}>{label}</label>
      {children}
    </div>
  )
}

function FieldRow({ label, sublabel, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
      <div>
        <div style={{ fontSize: '13px', color: '#bbb' }}>{label}</div>
        {sublabel && <div style={{ fontSize: '11px', color: '#444', marginTop: '2px' }}>{sublabel}</div>}
      </div>
      {children}
    </div>
  )
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: '10px', letterSpacing: '.08em', color: '#3a3a44', marginBottom: '14px', marginTop: '4px' }}>{children}</div>
}

function Divider() {
  return <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />
}

function Row({ children }) {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '4px' }}>{children}</div>
}

function Msg({ msg }) {
  return (
    <span style={{ fontSize: '12px', color: msg.type === 'error' ? '#E24B4A' : '#1D9E75' }}>{msg.text}</span>
  )
}

function SaveBtn({ onClick, loading, children }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        padding: '8px 18px',
        borderRadius: '8px',
        border: 'none',
        background: '#fff',
        fontSize: '13px',
        color: '#1c1c24',
        cursor: loading ? 'default' : 'pointer',
        fontWeight: '500',
        opacity: loading ? 0.6 : 1,
        flexShrink: 0,
      }}
    >
      {loading ? 'Saving...' : children}
    </button>
  )
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  modal: {
    display: 'flex',
    width: '680px',
    maxWidth: 'calc(100vw - 32px)',
    height: '480px',
    maxHeight: 'calc(100vh - 64px)',
    background: '#22222c',
    border: '0.5px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    overflow: 'hidden',
    position: 'relative',
  },
  sidebar: {
    width: '200px',
    flexShrink: 0,
    borderRight: '0.5px solid rgba(255,255,255,0.06)',
    padding: '24px 0',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#888',
    padding: '0 18px 16px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '0 8px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '7px 10px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    textAlign: 'left',
    transition: 'background 0.1s',
  },
  panel: {
    flex: 1,
    padding: '32px 32px 28px',
    overflowY: 'auto',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '28px',
    height: '28px',
    borderRadius: '7px',
    border: 'none',
    background: 'rgba(255,255,255,0.05)',
    color: '#555',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    padding: '9px 12px',
    borderRadius: '8px',
    border: '0.5px solid rgba(255,255,255,0.08)',
    background: '#1c1c24',
    fontSize: '13px',
    color: '#ccc',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  select: {
    padding: '7px 10px',
    borderRadius: '8px',
    border: '0.5px solid rgba(255,255,255,0.08)',
    background: '#1c1c24',
    fontSize: '12px',
    color: '#ccc',
    outline: 'none',
    cursor: 'pointer',
    minWidth: '200px',
  },
}
