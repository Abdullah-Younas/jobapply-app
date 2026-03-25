import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Pricing() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  const plans = [
    {
      name: 'Free', price: '$0', period: 'forever', apps: '10 job matches/month',
      desc: 'Get started, no card needed',
      features: ['AI skill matching','AI cover letter','Application log','CV upload'],
      notIncluded: ['Daily auto-matching','Priority support','Top-up credits'],
      cta: 'Get started free', action: () => navigate('/login'), highlight: false
    },
    {
      name: 'Standard', price: '$8.99', period: '/month', apps: '50 job matches/month',
      desc: 'Best for active job seekers',
      features: ['AI skill matching','AI cover letter','Daily auto-matching','Application log','CV upload','Top-up credits available'],
      notIncluded: ['Priority support'],
      cta: 'Get Standard', action: () => window.open('https://xautoapplyai.lemonsqueezy.com/checkout/buy/347cdda1-5173-4863-983a-c9b0ea673931','_blank'), highlight: true
    },
    {
      name: 'Premium', price: '$25', period: '/month', apps: '100 job matches/month',
      desc: 'Maximum reach, fast results',
      features: ['AI skill matching','AI cover letter','Daily auto-matching','Application log','CV upload','Top-up credits available','Priority support'],
      notIncluded: [],
      cta: 'Get Premium', action: () => window.open('https://xautoapplyai.lemonsqueezy.com/checkout/buy/62955451-5397-41d6-966b-f7c1ea364655','_blank'), highlight: false
    }
  ]

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text)'}}>
      <style>{`
        .pricing-nav{display:flex;justify-content:space-between;align-items:center;padding:16px 48px;border-bottom:1px solid var(--border);background:var(--bg2);}
        .pricing-logo{font-size:20px;font-weight:700;color:var(--violet);cursor:pointer;font-family:Georgia,serif;}
        .back-btn{font-size:13px;color:var(--text2);background:none;border:none;cursor:pointer;font-family:sans-serif;}
        .theme-btn{width:36px;height:36px;border-radius:50%;border:1px solid var(--border);background:var(--bg2);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;}
        .pricing-body{max-width:1000px;margin:0 auto;padding:64px 24px;}
        .pricing-title{font-size:42px;font-weight:700;letter-spacing:-1px;color:var(--text);margin:0 0 12px;font-family:Georgia,serif;text-align:center;}
        .pricing-sub{font-size:16px;color:var(--text2);font-family:sans-serif;text-align:center;margin-bottom:56px;}
        .plans-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:48px;}
        .plan-card{border-radius:20px;padding:28px;border:1px solid var(--border);background:var(--bg2);display:flex;flex-direction:column;transition:all 0.2s;}
        .plan-card.pop{border-color:var(--violet);background:var(--card-dark);}
        .plan-card:hover{transform:translateY(-4px);}
        .pop-badge{background:var(--violet);color:white;font-size:11px;font-weight:700;padding:4px 12px;border-radius:100px;display:inline-block;margin-bottom:16px;font-family:sans-serif;text-transform:uppercase;letter-spacing:0.5px;}
        .plan-name{font-size:18px;font-weight:700;color:var(--text);margin:0 0 4px;font-family:sans-serif;}
        .plan-card.pop .plan-name{color:#e0e0e0;}
        .plan-desc{font-size:13px;color:var(--text3);margin:0 0 16px;font-family:sans-serif;}
        .plan-price{font-size:36px;font-weight:700;color:var(--text);letter-spacing:-1px;font-family:Georgia,serif;}
        .plan-card.pop .plan-price{color:#f0f0f0;}
        .plan-period{font-size:13px;color:var(--text3);font-family:sans-serif;}
        .plan-apps{font-size:13px;font-weight:700;color:var(--violet);margin:12px 0 20px;font-family:sans-serif;}
        .plan-features{flex:1;display:flex;flex-direction:column;gap:8px;margin-bottom:24px;}
        .feat-on{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text2);font-family:sans-serif;}
        .plan-card.pop .feat-on{color:#ccc;}
        .feat-off{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text3);opacity:0.5;font-family:sans-serif;}
        .plan-btn{padding:13px;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s;font-family:sans-serif;border:1px solid var(--border);background:transparent;color:var(--text);}
        .plan-btn:hover{border-color:var(--violet);color:var(--violet);}
        .plan-btn.primary{background:var(--violet);color:white;border-color:var(--violet);}
        .plan-btn.primary:hover{background:var(--violet2);}
        .topup-section{background:var(--bg2);border:1px solid var(--border);border-radius:20px;padding:32px;}
        .topup-cards{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px;}
        .topup-card{border:1px solid var(--border);border-radius:14px;padding:20px;display:flex;justify-content:space-between;align-items:center;}
        .topup-price-btn{background:var(--violet);color:white;border:none;padding:8px 16px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:sans-serif;}
        .topup-price-btn:hover{background:var(--violet2);}
        @media(max-width:768px){.plans-grid{grid-template-columns:1fr;}.topup-cards{grid-template-columns:1fr;}.pricing-nav{padding:16px 24px;}}
      `}</style>

      <nav className="pricing-nav">
        <div className="pricing-logo" onClick={() => navigate('/')}>Nuxply</div>
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <button className="back-btn" onClick={() => navigate('/')}>Back</button>
          <button className="theme-btn" onClick={() => setDark(d => !d)}>{dark ? '☀️' : '🌙'}</button>
        </div>
      </nav>

      <div className="pricing-body">
        <h1 className="pricing-title">Simple, honest pricing</h1>
        <p className="pricing-sub">Start free. Upgrade when you need more matches.</p>

        <div className="plans-grid">
          {plans.map(plan => (
            <div key={plan.name} className={`plan-card ${plan.highlight ? 'pop' : ''}`}>
              {plan.highlight && <div className="pop-badge">Most popular</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-desc">{plan.desc}</div>
              <div><span className="plan-price">{plan.price}</span><span className="plan-period">{plan.period}</span></div>
              <div className="plan-apps">{plan.apps}</div>
              <div className="plan-features">
                {plan.features.map(f => <div key={f} className="feat-on"><span style={{color:'#4ade80'}}>✓</span>{f}</div>)}
                {plan.notIncluded.map(f => <div key={f} className="feat-off"><span>✗</span>{f}</div>)}
              </div>
              <button className={`plan-btn ${plan.highlight ? 'primary' : ''}`} onClick={plan.action}>{plan.cta}</button>
            </div>
          ))}
        </div>

        <div className="topup-section">
          <div style={{fontSize:'20px',fontWeight:'700',color:'var(--text)',fontFamily:'Georgia,serif',marginBottom:'4px'}}>Need more matches?</div>
          <div style={{fontSize:'14px',color:'var(--text2)',fontFamily:'sans-serif'}}>Buy top-up credits anytime — they never expire and work on any plan.</div>
          <div className="topup-cards">
            <div className="topup-card">
              <div>
                <div style={{fontSize:'14px',fontWeight:'700',color:'var(--text)',fontFamily:'sans-serif'}}>Small pack</div>
                <div style={{fontSize:'12px',color:'var(--text3)',fontFamily:'sans-serif',marginTop:'2px'}}>10 extra job matches</div>
              </div>
              <button className="topup-price-btn" onClick={() => window.open('https://xautoapplyai.lemonsqueezy.com/checkout/buy/6a62072c-9f2b-4cbb-b37f-0d634828d72a','_blank')}>$3</button>
            </div>
            <div className="topup-card">
              <div>
                <div style={{fontSize:'14px',fontWeight:'700',color:'var(--text)',fontFamily:'sans-serif'}}>Large pack</div>
                <div style={{fontSize:'12px',color:'var(--text3)',fontFamily:'sans-serif',marginTop:'2px'}}>25 extra job matches</div>
              </div>
              <button className="topup-price-btn" onClick={() => window.open('https://xautoapplyai.lemonsqueezy.com/checkout/buy/8e9b9d72-bc63-4a2a-bef3-0061f81bb4c8','_blank')}>$6</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}