import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }) {
  const slug = params.slug

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#1c1c24',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        {/* Top: logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: '#2e2e3a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="9" rx="1.5" fill="#7F77DD" opacity="0.9" />
              <rect x="9" y="1" width="6" height="5" rx="1.5" fill="#7F77DD" opacity="0.5" />
              <rect x="9" y="8" width="6" height="7" rx="1.5" fill="#7F77DD" opacity="0.7" />
            </svg>
          </div>
          <span style={{ fontSize: '16px', color: '#555', fontWeight: '500' }}>sorano</span>
        </div>

        {/* Middle: slug as title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#7F77DD',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: '56px',
                fontWeight: '600',
                color: '#ddd',
                lineHeight: '1.1',
                letterSpacing: '-0.03em',
              }}
            >
              {slug}
            </span>
          </div>
          <span style={{ fontSize: '22px', color: '#555', paddingLeft: '24px' }}>
            Public roadmap &amp; changelog
          </span>
        </div>

        {/* Bottom: url + status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '16px', color: '#3a3a44' }}>
            sorano.space/{slug}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#1D9E75',
              }}
            />
            <span style={{ fontSize: '14px', color: '#3a3a44' }}>actively building</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
