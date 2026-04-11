import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Pricing() {
  const navigate = useNavigate()

  const plans = [
    {
      name: 'Free', price: '$0', period: 'forever',
      daily: '1 match/day', total: '10 matches/month',
      desc: 'Try it free — see real matched jobs before committing',
      features: ['1 new match every morning', 'AI cover letter per match', 'Application log', 'Daily auto-matching'],
      notIncluded: ['CV upload', 'Top-up credits', 'Priority support'],
      cta: 'Get started free', action: () => navigate('/login'), highlight: false
    },
    {
      name: 'Standard', price: '$9', period: '/month',
      daily: '5 matches/day', total: '50 matches/month',
      desc: 'The sweet spot — enough daily matches to land interviews fast',
      features: ['5 new matches every morning', 'AI cover letter per match', 'CV upload & auto-fill', 'Application log', 'Daily auto-matching', 'Top-up credits available'],
      notIncluded: ['Priority support'],
      cta: 'Get Standard', action: () => window.open('https://nuxply.lemonsqueezy.com/checkout/buy/34ce71c3-0a5d-4927-8f13-28cea2619018', '_blank'), highlight: true
    },
    {
      name: 'Premium', price: '$25', period: '/month',
      daily: '5 matches/day', total: '100 matches/month',
      desc: 'Maximum reach — 20 days of daily matches every month',
      features: ['5 new matches every morning', 'AI cover letter per match', 'CV upload & auto-fill', 'Application log', 'Daily auto-matching', 'Top-up credits available', 'Priority support'],
      notIncluded: [],
      cta: 'Get Premium', action: () => window.open('https://nuxply.lemonsqueezy.com/checkout/buy/0387d0e3-4c0c-43bf-a599-bcb12b32ebbe', '_blank'), highlight: false
    }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e8e8e8', fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .p-nav { display:flex;justify-content:space-between;align-items:center;padding:18px clamp(24px,5vw,56px);border-bottom:1px solid #122018;background:rgba(10,10,10,0.9);position:sticky;top:0;z-index:100;backdrop-filter:blur(14px); }
        .p-logo { display:flex;align-items:center;gap:9px;cursor:pointer; }
        .p-logo-img { height:26px;width:26px;object-fit:contain; }
        .p-logo-text { font-size:17px;font-weight:700;color:#6a9e78;letter-spacing:0.05em;font-family:'DM Mono',monospace; }
        .p-back { font-size:12px;color:#4a6e54;background:none;border:1px solid #1a2e1e;border-radius:8px;cursor:pointer;font-family:'DM Mono',monospace;padding:8px 16px;transition:all 0.18s; }
        .p-back:hover { color:#c9dcc8;border-color:#6a9e78; }
        .p-body { max-width:1000px;margin:0 auto;padding:clamp(48px,8vw,80px) clamp(24px,5vw,48px); }
        .p-eyebrow { font-size:10px;font-weight:700;color:#6a9e78;letter-spacing:0.12em;text-transform:uppercase;font-family:'DM Mono',monospace;text-align:center;margin-bottom:14px; }
        .p-title { font-size:clamp(30px,4vw,44px);font-weight:700;letter-spacing:-0.03em;color:#e8e8e8;margin-bottom:12px;text-align:center;line-height:1.1; }
        .p-sub { font-size:14px;color:#4a6e54;font-family:'DM Mono',monospace;text-align:center;margin-bottom:16px; }
        .how-box { background:rgba(106,158,120,0.05);border:1px solid #1a2e1e;border-radius:12px;padding:18px 24px;margin-bottom:clamp(32px,5vw,52px);max-width:620px;margin-left:auto;margin-right:auto; }
        .how-box-title { font-size:10px;font-weight:700;color:#2e4e38;text-transform:uppercase;letter-spacing:0.08em;font-family:'DM Mono',monospace;margin-bottom:12px; }
        .how-box-row { display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:12px;color:#4a6e54;font-family:'DM Mono',monospace;line-height:1.6; }
        .how-box-row:last-child { margin-bottom:0; }
        .how-box-dot { width:18px;height:18px;border-radius:50%;background:rgba(106,158,120,0.1);border:1px solid #1a2e1e;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#6a9e78;flex-shrink:0; }
        .how-box-row strong { color:#c9dcc8; }
        .plans-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:40px; }
        .plan-card { background:#0d160f;border:1px solid #1a2e1e;border-radius:18px;padding:28px;display:flex;flex-direction:column;transition:border-color 0.2s,transform 0.2s; }
        .plan-card:hover { transform:translateY(-3px);border-color:#2e4e38; }
        .plan-card.pop { border-color:#6a9e78;background:#0e1f12; }
        .plan-card.pop:hover { border-color:#7ab088; }
        .pop-badge { background:#6a9e78;color:#fff;font-size:10px;font-weight:700;padding:4px 12px;border-radius:6px;display:inline-block;margin-bottom:18px;font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:0.06em;width:fit-content; }
        .plan-name { font-size:16px;font-weight:700;color:#c9dcc8;margin-bottom:4px;font-family:'DM Mono',monospace; }
        .plan-desc { font-size:12px;color:#2e4e38;margin-bottom:18px;font-family:'DM Mono',monospace;line-height:1.5; }
        .plan-price { font-size:38px;font-weight:700;color:#e8e8e8;letter-spacing:-0.04em; }
        .plan-period { font-size:12px;color:#4a6e54;font-family:'DM Mono',monospace; }
        .plan-rhythm { display:flex;gap:8px;margin:14px 0 20px;flex-wrap:wrap; }
        .plan-daily { background:rgba(106,158,120,0.1);border:1px solid rgba(106,158,120,0.2);color:#6a9e78;font-size:11px;font-weight:700;padding:4px 10px;border-radius:6px;font-family:'DM Mono',monospace; }
        .plan-total { background:rgba(106,158,120,0.05);border:1px solid #1a2e1e;color:#4a6e54;font-size:11px;padding:4px 10px;border-radius:6px;font-family:'DM Mono',monospace; }
        .plan-features { flex:1;display:flex;flex-direction:column;gap:9px;margin-bottom:24px; }
        .feat-on { display:flex;align-items:center;gap:8px;font-size:12.5px;color:#778877;font-family:'DM Mono',monospace; }
        .feat-on-check { color:#6a9e78;font-size:12px;flex-shrink:0; }
        .feat-off { display:flex;align-items:center;gap:8px;font-size:12.5px;color:#1e3a28;font-family:'DM Mono',monospace; }
        .plan-btn { padding:13px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.18s;font-family:'DM Mono',monospace;border:1px solid #1a2e1e;background:transparent;color:#4a6e54;letter-spacing:0.02em; }
        .plan-btn:hover { border-color:#6a9e78;color:#c9dcc8; }
        .plan-btn.primary { background:#6a9e78;color:#fff;border-color:#6a9e78; }
        .plan-btn.primary:hover { background:#7ab088;box-shadow:0 4px 16px rgba(106,158,120,0.25); }
        .topup-section { background:#0d160f;border:1px solid #1a2e1e;border-radius:18px;padding:32px; }
        .topup-title { font-size:20px;font-weight:700;color:#e8e8e8;margin-bottom:6px; }
        .topup-sub { font-size:13px;color:#4a6e54;font-family:'DM Mono',monospace; }
        .topup-cards { display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px; }
        .topup-card { border:1px solid #1a2e1e;border-radius:12px;padding:18px 20px;display:flex;justify-content:space-between;align-items:center;transition:border-color 0.2s; }
        .topup-card:hover { border-color:#2e4e38; }
        .topup-pack-name { font-size:13px;font-weight:700;color:#c9dcc8;font-family:'DM Mono',monospace; }
        .topup-pack-sub { font-size:11px;color:#2e4e38;font-family:'DM Mono',monospace;margin-top:3px; }
        .topup-btn { background:#6a9e78;color:#fff;border:none;padding:9px 18px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:'DM Mono',monospace;transition:all 0.18s; }
        .topup-btn:hover { background:#7ab088; }
        @media (max-width:768px) { .plans-grid{grid-template-columns:1fr;} .topup-cards{grid-template-columns:1fr;} }
      `}</style>

      <nav className="p-nav">
        <div className="p-logo" onClick={() => navigate('/')}>
          <img src={logo} alt="Nuxply" className="p-logo-img" />
          <span className="p-logo-text">nuxply</span>
        </div>
        <button className="p-back" onClick={() => navigate('/')}>← Back</button>
      </nav>

      <div className="p-body">
        <div className="p-eyebrow">Pricing</div>
        <h1 className="p-title">Simple, honest pricing</h1>
        <p className="p-sub">Fresh job matches delivered every morning. Pick how many you want per day.</p>

        <div className="how-box" style={{marginBottom:'clamp(32px,5vw,52px)'}}>
          <div className="how-box-title">How credits work</div>
          <div className="how-box-row"><div className="how-box-dot">1</div><span>Every morning our AI finds <strong>new job listings</strong> matching your skills</span></div>
          <div className="how-box-row"><div className="how-box-dot">2</div><span>Each match uses <strong>1 credit</strong> and comes with a personalized cover letter</span></div>
          <div className="how-box-row"><div className="how-box-dot">3</div><span>Credits <strong>reset monthly</strong> — top-up credits never expire</span></div>
          <div className="how-box-row"><div className="how-box-dot">4</div><span>Only jobs where you match <strong>70% or more</strong> of requirements make it through</span></div>
        </div>

        <div className="plans-grid">
          {plans.map(plan => (
            <div key={plan.name} className={`plan-card ${plan.highlight ? 'pop' : ''}`}>
              {plan.highlight && <div className="pop-badge">Most popular</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-desc">{plan.desc}</div>
              <div style={{marginBottom:2}}>
                <span className="plan-price">{plan.price}</span>
                <span className="plan-period"> {plan.period}</span>
              </div>
              <div className="plan-rhythm">
                <span className="plan-daily">{plan.daily}</span>
                <span className="plan-total">{plan.total}</span>
              </div>
              <div className="plan-features">
                {plan.features.map(f => (
                  <div key={f} className="feat-on"><span className="feat-on-check">✓</span>{f}</div>
                ))}
                {plan.notIncluded.map(f => (
                  <div key={f} className="feat-off"><span style={{fontSize:11}}>✗</span>{f}</div>
                ))}
              </div>
              <button className={`plan-btn ${plan.highlight ? 'primary' : ''}`} onClick={plan.action}>{plan.cta}</button>
            </div>
          ))}
        </div>

        <div className="topup-section">
          <div className="topup-title">Need more matches?</div>
          <div className="topup-sub">Buy top-up credits anytime — they never expire and work on any plan.</div>
          <div className="topup-cards">
            <div className="topup-card">
              <div>
                <div className="topup-pack-name">Small pack</div>
                <div className="topup-pack-sub">10 extra job matches</div>
              </div>
              <button className="topup-btn" onClick={() => window.open('https://nuxply.lemonsqueezy.com/checkout/buy/06a413af-17bc-4276-8cbe-4c29d2da02aa', '_blank')}>$3</button>
            </div>
            <div className="topup-card">
              <div>
                <div className="topup-pack-name">Large pack</div>
                <div className="topup-pack-sub">25 extra job matches</div>
              </div>
              <button className="topup-btn" onClick={() => window.open('https://nuxply.lemonsqueezy.com/checkout/buy/5a7a4cbc-8947-4346-b39c-786021b8a9d9', '_blank')}>$6</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}