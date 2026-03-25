import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dark, setDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches)
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      setUser(session.user)
      const { data } = await supabase.from('users').select('*').eq('email', session.user.email).maybeSingle()
      setProfile(data)
      setLoading(false)
    }
    load()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'var(--bg)',color:'var(--text2)',fontFamily:'sans-serif'}}>Loading...</div>
  )

  const total = profile?.plan === 'premium' ? 100 : profile?.plan === 'standard' ? 50 : 10
  const used = total - (profile?.monthly_quota ?? total)
  const pct = Math.round((used / total) * 100)

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text)'}}>
      <style>{`
        .dash-nav{display:flex;justify-content:space-between;align-items:center;padding:16px 48px;border-bottom:1px solid var(--border);background:var(--bg2);position:sticky;top:0;z-index:100;}
        .dash-logo{font-size:20px;font-weight:700;color:var(--violet);cursor:pointer;font-family:Georgia,serif;}
        .nav-link{padding:8px 14px;border-radius:100px;font-size:13px;border:none;cursor:pointer;background:transparent;color:var(--text2);font-family:sans-serif;transition:all 0.2s;}
        .nav-link:hover{color:var(--text);background:var(--border);}
        .nav-danger{color:#f87171;}
        .theme-btn{width:36px;height:36px;border-radius:50%;border:1px solid var(--border);background:var(--bg2);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;}
        .dash-body{max-width:720px;margin:0 auto;padding:48px 24px;}
        .dash-title{font-size:28px;font-weight:700;letter-spacing:-0.5px;margin:0 0 4px;font-family:Georgia,serif;}
        .dash-sub{font-size:14px;color:var(--text2);margin:0 0 28px;font-family:sans-serif;}
        .plan-row{display:flex;align-items:center;gap:8px;margin-bottom:20px;}
        .plan-badge{background:var(--violet-bg);color:var(--violet-text);font-size:12px;font-weight:700;padding:4px 12px;border-radius:100px;font-family:sans-serif;text-transform:capitalize;}
        .upgrade-link{font-size:12px;color:var(--violet);text-decoration:underline;cursor:pointer;font-family:sans-serif;background:none;border:none;}
        .card{background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:24px;margin-bottom:14px;}
        .dark-card{background:var(--card-dark);border:1px solid rgba(108,71,255,0.15);border-radius:16px;padding:24px;margin-bottom:14px;}
        .quota-label{display:flex;justify-content:space-between;font-size:13px;margin-bottom:10px;font-family:sans-serif;}
        .quota-bar{height:6px;background:var(--border);border-radius:100px;overflow:hidden;}
        .quota-fill{height:6px;background:var(--violet);border-radius:100px;transition:width 0.5s;}
        .info-box{background:var(--violet-bg);border-radius:12px;padding:14px 16px;font-size:13px;color:var(--violet-text);font-family:sans-serif;margin-bottom:14px;}
        .warn-box{background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.2);border-radius:12px;padding:14px 16px;font-size:13px;color:#d97706;font-family:sans-serif;margin-bottom:14px;}
        .topup-row{display:flex;gap:12px;margin-top:16px;}
        .topup-btn{flex:1;padding:12px;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:sans-serif;border:1px solid rgba(255,255,255,0.1);background:transparent;color:#ccc;}
        .topup-btn:hover{border-color:var(--violet);color:var(--violet2);}
        .topup-primary{background:var(--violet);color:white;border-color:var(--violet);}
        .topup-primary:hover{background:var(--violet2);}
        .quick-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:4px;}
        .quick-card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:20px;cursor:pointer;transition:all 0.2s;text-align:left;}
        .quick-card:hover{border-color:var(--violet);transform:translateY(-2px);}
        .quick-title{font-size:15px;font-weight:700;color:var(--text);margin:0 0 5px;font-family:sans-serif;}
        .quick-sub{font-size:13px;color:var(--text2);font-family:sans-serif;}
      `}</style>

      <nav className="dash-nav">
        <div className="dash-logo" onClick={() => navigate('/')}>Nuxply</div>
        <div style={{display:'flex',gap:'4px',alignItems:'center'}}>
          <button className="nav-link" onClick={() => navigate('/profile')}>Profile</button>
          <button className="nav-link" onClick={() => navigate('/applications')}>Applications</button>
          <button className="nav-link" onClick={() => navigate('/settings')}>Settings</button>
          <button className="nav-link nav-danger" onClick={handleSignOut}>Sign out</button>
          <button className="theme-btn" onClick={() => setDark(d => !d)}>{dark ? '☀️' : '🌙'}</button>
        </div>
      </nav>

      <div className="dash-body">
        <h1 className="dash-title">Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}!</h1>
        <p className="dash-sub">Here's your activity this month.</p>

        <div className="plan-row">
          <span style={{fontSize:'13px',color:'var(--text2)',fontFamily:'sans-serif'}}>Current plan:</span>
          <span className="plan-badge">{profile?.plan ?? 'free'}</span>
          {profile?.plan !== 'premium' && (
            <button className="upgrade-link" onClick={() => navigate('/pricing')}>Upgrade</button>
          )}
        </div>

        <div className="card">
          <div className="quota-label">
            <span style={{color:'var(--text2)'}}>Credits used this month</span>
            <span style={{fontWeight:'600',color:'var(--text)'}}>{used} / {total}</span>
          </div>
          <div className="quota-bar">
            <div className="quota-fill" style={{width:`${pct}%`}} />
          </div>
          {profile?.topup_credits > 0 && (
            <p style={{fontSize:'12px',color:'var(--text3)',marginTop:'8px',fontFamily:'sans-serif'}}>
              + {profile.topup_credits} top-up credits remaining
            </p>
          )}
        </div>

        <div className="info-box">
          Your AI finds <strong>{profile?.plan === 'premium' ? '10' : profile?.plan === 'standard' ? '5' : '2'} new matching jobs every day</strong>. Check your applications tab daily for new matches and cover letters.
        </div>

        {pct >= 80 && profile?.plan !== 'premium' && (
          <div className="warn-box">
            Running low on credits.{' '}
            <button onClick={() => navigate('/pricing')} style={{fontWeight:'700',textDecoration:'underline',cursor:'pointer',background:'none',border:'none',color:'inherit',fontFamily:'sans-serif'}}>
              Upgrade or buy top-up credits
            </button>
          </div>
        )}

        <div className="dark-card">
          <div style={{fontSize:'15px',fontWeight:'700',color:'#e0e0e0',marginBottom:'4px',fontFamily:'sans-serif'}}>Need more credits?</div>
          <div style={{fontSize:'13px',color:'#888',marginBottom:'0',fontFamily:'sans-serif'}}>Top-up credits never expire and work on any plan.</div>
          <div className="topup-row">
            <button className="topup-btn" onClick={() => window.open('https://xautoapplyai.lemonsqueezy.com/checkout/buy/6a62072c-9f2b-4cbb-b37f-0d634828d72a','_blank')}>
              10 credits — $3
            </button>
            <button className="topup-btn topup-primary" onClick={() => window.open('https://xautoapplyai.lemonsqueezy.com/checkout/buy/8e9b9d72-bc63-4a2a-bef3-0061f81bb4c8','_blank')}>
              25 credits — $6
            </button>
          </div>
        </div>

        <div className="quick-grid">
          <button className="quick-card" onClick={() => navigate('/profile')}>
            <div className="quick-title">Update profile</div>
            <div className="quick-sub">Edit your skills and preferences</div>
          </button>
          <button className="quick-card" onClick={() => navigate('/applications')}>
            <div className="quick-title">View matches</div>
            <div className="quick-sub">Browse your matched jobs and apply</div>
          </button>
        </div>
      </div>
    </div>
  )
}