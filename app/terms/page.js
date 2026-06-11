export default function Terms() {
  return (
    <div style={{ background: '#1c1c24', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', padding: '80px 40px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <a href="/" style={{ fontSize: '13px', color: '#555', textDecoration: 'none', display: 'inline-block', marginBottom: '40px' }}>← sorano.space</a>
        <h1 style={{ fontSize: '28px', fontWeight: '500', color: '#ccc', marginBottom: '8px' }}>Terms of Service</h1>
        <p style={{ fontSize: '13px', color: '#3a3a44', marginBottom: '48px' }}>Last updated: May 27, 2026</p>

        {[
          {
            title: 'Use of the Service',
            body: 'You may use Sorano for personal and professional roadmap purposes. You agree not to use the service to store or distribute unlawful content, attempt to reverse-engineer the application, or interfere with its operation.'
          },
          {
            title: 'Your Content',
            body: 'You retain full ownership of all boards and cards you create in Sorano. We do not claim any rights to your content. You are responsible for the content you store in the service.'
          },
          {
            title: 'Account Termination',
            body: 'You may delete your account at any time. We reserve the right to suspend or terminate accounts that violate these terms.'
          },
          {
            title: 'Availability',
            body: 'We aim to provide a reliable service but do not guarantee uninterrupted availability. We are not liable for any loss of data or interruption of service.'
          },
          {
            title: 'Changes to These Terms',
            body: 'We may update these terms from time to time. Continued use of Sorano after changes are posted constitutes acceptance of the updated terms.'
          },
          {
            title: 'Refund Policy',
            id: 'refunds',
            body: 'For Pro subscriptions: if you are charged and feel it was in error, contact us at sorano@ryoka.xyz within 14 days of the charge and we will issue a full refund, no questions asked. For the Lifetime one-time purchase: refunds are available within 30 days of purchase if you are unsatisfied with the service. Refund requests after these windows will be considered on a case-by-case basis.'
          },
          {
            title: 'Contact',
            body: 'Questions? Email us at sorano@ryoka.xyz.'
          },
        ].map(section => (
          <div key={section.title} id={section.id || undefined} style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#bbb', marginBottom: '12px' }}>{section.title}</h2>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.8' }}>{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
