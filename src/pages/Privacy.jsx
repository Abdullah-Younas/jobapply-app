import { useNavigate } from 'react-router-dom'

export default function Privacy() {
  const navigate = useNavigate()
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text)'}}>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 48px',borderBottom:'1px solid var(--border)',background:'var(--bg2)'}}>
        <div onClick={() => navigate('/')} style={{fontSize:'20px',fontWeight:'700',color:'var(--violet)',cursor:'pointer',fontFamily:'Georgia,serif'}}>Nuxply</div>
        <button onClick={() => navigate('/')} style={{fontSize:'13px',color:'var(--text2)',background:'none',border:'none',cursor:'pointer',fontFamily:'sans-serif'}}>← Back</button>
      </nav>
      <div style={{maxWidth:'720px',margin:'0 auto',padding:'48px 24px',fontFamily:'sans-serif',lineHeight:'1.8'}}>
        <h1 style={{fontSize:'32px',fontWeight:'700',fontFamily:'Georgia,serif',marginBottom:'8px'}}>Privacy Policy</h1>
        <p style={{color:'var(--text3)',fontSize:'14px',marginBottom:'40px'}}>Last updated: March 2026</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>1. Information We Collect</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>We collect information you provide directly: your name, email address, skills, work experience, job preferences, and CV documents. We also collect usage data such as which jobs you viewed and applied to.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>2. How We Use Your Information</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>We use your information to match you with relevant jobs, generate personalized cover letters, send you job match notifications, and improve our AI matching algorithms. We do not sell your personal information to third parties.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>3. CV and Profile Data</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>Your CV is stored securely and is only used to extract skills and experience for job matching. It is never shared with employers directly — only the cover letters we generate on your behalf are shared when you choose to apply.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>4. AI Processing</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>We use Claude AI (by Anthropic) to process your profile data and generate cover letters. Your data is processed according to Anthropic's privacy policy. We do not use your data to train AI models.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>5. Data Storage</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>Your data is stored securely using Supabase, a trusted cloud database provider. Data is encrypted at rest and in transit. We retain your data as long as your account is active.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>6. Cookies</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>We use essential cookies for authentication and session management. We do not use advertising or tracking cookies.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>7. Your Rights</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>You can request access to your data, correction of inaccurate data, or deletion of your account and all associated data at any time by contacting us at support@nuxply.com</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>8. Third Party Services</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>We use the following third-party services: Supabase (database), Anthropic Claude (AI), Paddle (payments), and Google (authentication). Each has their own privacy policy governing their use of data.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>9. Contact</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>For privacy questions or data requests, contact us at support@nuxply.com</p>
      </div>
    </div>
  )
}