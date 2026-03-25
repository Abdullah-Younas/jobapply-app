import { useNavigate } from 'react-router-dom'

export default function Refund() {
  const navigate = useNavigate()
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text)'}}>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 48px',borderBottom:'1px solid var(--border)',background:'var(--bg2)'}}>
        <div onClick={() => navigate('/')} style={{fontSize:'20px',fontWeight:'700',color:'var(--violet)',cursor:'pointer',fontFamily:'Georgia,serif'}}>Nuxply</div>
        <button onClick={() => navigate('/')} style={{fontSize:'13px',color:'var(--text2)',background:'none',border:'none',cursor:'pointer',fontFamily:'sans-serif'}}>← Back</button>
      </nav>
      <div style={{maxWidth:'720px',margin:'0 auto',padding:'48px 24px',fontFamily:'sans-serif',lineHeight:'1.8'}}>
        <h1 style={{fontSize:'32px',fontWeight:'700',fontFamily:'Georgia,serif',marginBottom:'8px'}}>Refund Policy</h1>
        <p style={{color:'var(--text3)',fontSize:'14px',marginBottom:'40px'}}>Last updated: March 2026</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>Subscription Plans</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>We offer a 14-day refund policy on all paid subscriptions (Standard and Premium). If you are not satisfied within the first 14 days of your subscription, contact us at support@nuxply.com for a full refund. No questions asked.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>Top-up Credits</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>Top-up credit packs are eligible for a full refund within 14 days of purchase. Contact support@nuxply.com to request a refund.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>Cancellations</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>You can cancel your subscription at any time from your Settings page. Upon cancellation you retain access until the end of your billing period.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>How to Request a Refund</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>Email support@nuxply.com within 14 days of purchase. We will process your refund within 5-10 business days.</p>

        <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'12px',marginTop:'32px'}}>Contact</h2>
        <p style={{color:'var(--text2)',marginBottom:'16px'}}>For refund requests or billing questions, contact us at support@nuxply.com</p>
      </div>
    </div>
  )
}