export default function Privacy() {
  return (
    <div style={{ background: '#1c1c24', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', padding: '80px 40px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <a href="/" style={{ fontSize: '13px', color: '#555', textDecoration: 'none', display: 'inline-block', marginBottom: '40px' }}>← sorano.space</a>
        <h1 style={{ fontSize: '28px', fontWeight: '500', color: '#ccc', marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ fontSize: '13px', color: '#3a3a44', marginBottom: '48px' }}>Last updated: May 27, 2026</p>

        {[
          {
            title: 'Information We Collect',
            body: 'We collect information you provide directly, including your email address and password when you create an account. We also collect the content you create within the app (boards and cards) in order to provide the service.'
          },
          {
            title: 'How We Use Your Information',
            body: null,
            list: [
              'To provide, maintain, and improve the Sorano service',
              'To authenticate your account and keep it secure',
              'To send you essential service communications (e.g. password resets)',
              'To process payments via our payment provider, Stripe',
            ]
          },
          {
            title: 'Data Storage',
            body: 'Your data is stored securely in a hosted database (Supabase). We do not sell your personal data or share it with third parties for marketing purposes.'
          },
          {
            title: 'Payments',
            body: 'Payment processing is handled by Stripe. We do not store your credit card information. Please refer to Stripe\'s Privacy Policy for how payment data is handled.'
          },
          {
            title: 'Cookies',
            body: 'We use cookies solely for authentication purposes (to keep you logged in). We do not use tracking or advertising cookies.'
          },
          {
            title: 'Your Rights',
            body: 'You may request deletion of your account and associated data at any time by contacting us at sorano@ryoka.xyz. We will process your request within 30 days.'
          },
          {
            title: 'Contact',
            body: 'Questions about this policy? Email us at sorano@ryoka.xyz.'
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#bbb', marginBottom: '12px' }}>{section.title}</h2>
            {section.body && <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.8' }}>{section.body}</p>}
            {section.list && (
              <ul style={{ paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {section.list.map(item => (
                  <li key={item} style={{ fontSize: '14px', color: '#555', lineHeight: '1.8', display: 'flex', gap: '10px' }}>
                    <span style={{ color: '#1D9E75', flexShrink: 0 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
