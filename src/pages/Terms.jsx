import { useNavigate } from 'react-router-dom'

export default function Terms() {
  const navigate = useNavigate()
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text)'}}>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 48px',borderBottom:'1px solid var(--border)',background:'var(--bg2)'}}>
        <div onClick={() => navigate('/')} style={{fontSize:'20px',fontWeight:'700',color:'var(--violet)',cursor:'pointer',fontFamily:'Georgia,serif'}}>Nuxply</div>
        <button onClick={() => navigate('/')} style={{fontSize:'13px',color:'var(--text2)',background:'none',border:'none',cursor:'pointer',fontFamily:'sans-serif'}}>← Back</button>
      </nav>
      <div style={{maxWidth:'720px',margin:'0 auto',padding:'48px 24px',fontFamily:'sans-serif',lineHeight:'1.8'}}>
        <h1 style={{fontSize:'32px',fontWeight:'700',fontFamily:'Georgia,serif',marginBottom:'8px'}}>Terms of Service</h1>
        <p style={{color:'var(--text3)',fontSize:'14px',marginBottom:'40px'}}>Last updated: March 2026</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>1. Acceptance of Terms</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>By accessing or using Nuxply ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>2. Description of Service</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>Nuxply is an AI-powered job matching service. We use artificial intelligence to find job listings that match your skills, generate personalized cover letters, and present them to you through our dashboard. We do not guarantee job placement or interview results.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>3. User Accounts</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information when creating an account. You may not use another person's account without permission.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>4. Subscriptions and Payments</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>Nuxply offers Free, Standard ($8.99/month), and Premium ($25/month) plans. Paid plans are billed monthly. You can cancel at any time. Top-up credits are one-time purchases and are non-refundable once used. All prices are in USD.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>5. Acceptable Use</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>You agree not to misuse the service, including but not limited to: using the service to spam employers, creating fake profiles, or attempting to circumvent our systems. We reserve the right to suspend accounts that violate these terms.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>6. Intellectual Property</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>The Nuxply platform, including its design, code, and content, is owned by Nuxply. Cover letters generated for you are yours to use freely. You retain ownership of any CV or profile information you upload.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>7. Disclaimer of Warranties</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>The service is provided "as is" without warranties of any kind. We do not guarantee that job matches will be accurate, that cover letters will result in responses, or that the service will be uninterrupted.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>8. Limitation of Liability</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>Nuxply shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid in the past 3 months.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>9. Changes to Terms</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>We may update these terms from time to time. We will notify you of significant changes via email. Continued use of the service after changes constitutes acceptance of the new terms.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>10. Contact</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>For questions about these terms, contact us at support@nuxply.com</p>
      </div>
    </div>
  )
}