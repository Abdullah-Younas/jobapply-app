import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dark, setDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [notification, setNotification] = useState(null)
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

      // Show notifications based on profile state
      if (data) {
        if (data.monthly_quota === 0 && data.topup_credits === 0) {
          setNotification({ type: 'error', msg: 'You have no credits left this month. Buy top-up credits or upgrade your plan.' })
        } else if (data.monthly_quota <= 3 && data.plan === 'free') {
          setNotification({ type: 'warn', msg: `Only ${data.monthly_quota} credits left this month. Consider upgrading or buying top-up credits.` })
        } else if (!data.skills || data.skills.length === 0) {
          setNotification({ type: 'info', msg: 'Your profile is incomplete. Add your skills or upload your CV to start getting job matches.' })
        } else if (data.plan === 'free') {
          setNotification({ type: 'info', msg: 'You are on the free plan — upgrade to Standard for 5x more job matches daily.' })
        }
      }
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

  const notifStyles = {
    error: { bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)', color: '#f87171', icon: '⚠️' },
    warn: { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)', color: '#fbbf24', icon: '⚡' },
    info: { bg: 'var(--violet-bg)', border: 'rgba(108,71,255,0.2)', color: 'var(--violet-text)', icon: '💡' },
  }

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
        .notif-bar{display:flex;align-items:flex-start;gap:10px;border-radius:12px;padding:14px 16px;margin-bottom:20px;font-size:13px;font-family:sans-serif;line-height:1.6;}
        .notif-close{margin-left:auto;background:none;border:none;cursor:pointer;font-size:16px;color:inherit;opacity:0.6;padding:0 0 0 8px;flex-shrink:0;}
        .notif-close:hover{opacity:1;}
        .plan-row{display:flex;align-items:center;gap:8px;margin-bottom:20px;}
        .plan-badge{background:var(--violet-bg);color:var(--violet-text);font-size:12px;font-weight:700;padding:4px 12px;border-radius:100px;font-family:sans-serif;text-transform:capitalize;}
        .upgrade-link{font-size:12px;color:var(--violet);text-decoration:underline;cursor:pointer;font-family:sans-serif;background:none;border:none;}
        .card{background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:24px;margin-bottom:14px;}
        .dark-card{background:var(--card-dark);border:1px solid rgba(108,71,255,0.15);border-radius:16px;padding:24px;margin-bottom:14px;}
        .quota-label{display:flex;justify-content:space-between;font-size:13px;margin-bottom:10px;font-family:sans-serif;}
        .quota-bar{height:6px;background:var(--border);border-radius:100px;overflow:hidden;}
        .quota-fill{height:6px;background:var(--violet);border-radius:100px;transition:width 0.5s;}
        .credits-breakdown{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:16px;}
        .credit-box{background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center;}
        .credit-num{font-size:20px;font-weight:700;color:var(--violet);font-family:Georgia,serif;}
        .credit-label{font-size:11px;color:var(--text3);font-family:sans-serif;margin-top:3px;}
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
        .how-it-works{background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:24px;margin-bottom:14px;}
        .how-title{font-size:15px;font-weight:700;color:var(--text);margin:0 0 16px;font-family:sans-serif;}
        .how-row{display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;}
        .how-num{width:24px;height:24px;border-radius:50%;background:var(--violet-bg);color:var(--violet-text);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:sans-serif;}
        .how-text{font-size:13px;color:var(--text2);font-family:sans-serif;line-height:1.6;}
        .how-text strong{color:var(--text);}
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

        {/* Notification bar */}
        {notification && (
          <div className="notif-bar" style={{
            background: notifStyles[notification.type].bg,
            border: `1px solid ${notifStyles[notification.type].border}`,
            color: notifStyles[notification.type].color
          }}>
            <span>{notifStyles[notification.type].icon}</span>
            <span>{notification.msg}</span>
            <button className="notif-close" onClick={() => setNotification(null)}>✕</button>
          </div>
        )}

        <div className="plan-row">
          <span style={{fontSize:'13px',color:'var(--text2)',fontFamily:'sans-serif'}}>Current plan:</span>
          <span className="plan-badge">{profile?.plan ?? 'free'}</span>
          {profile?.plan !== 'premium' && (
            <button className="upgrade-link" onClick={() => navigate('/pricing')}>Upgrade</button>
          )}
        </div>

        {/* Credits card */}
        <div className="card">
          <div className="quota-label">
            <span style={{color:'var(--text2)'}}>Credits used this month</span>
            <span style={{fontWeight:'600',color:'var(--text)'}}>{used} / {total}</span>
          </div>
          <div className="quota-bar">
            <div className="quota-fill" style={{width:`${pct}%`}} />
          </div>

          <div className="credits-breakdown">
            <div className="credit-box">
              <div className="credit-num">{profile?.monthly_quota ?? 0}</div>
              <div className="credit-label">Plan credits left</div>
            </div>
            <div className="credit-box">
              <div className="credit-num">{profile?.topup_credits ?? 0}</div>
              <div className="credit-label">Top-up credits</div>
            </div>
            <div className="credit-box">
              <div className="credit-num">{(profile?.monthly_quota ?? 0) + (profile?.topup_credits ?? 0)}</div>
              <div className="credit-label">Total available</div>
            </div>
          </div>
          <p style={{fontSize:'12px',color:'var(--text3)',marginTop:'12px',fontFamily:'sans-serif'}}>
            Each job match uses 1 credit. Credits reset monthly. Top-up credits never expire.
          </p>
        </div>

        {/* How it works */}
        <div className="how-it-works">
          <div className="how-title">How Nuxply works</div>
          <div className="how-row">
            <div className="how-num">1</div>
            <div className="how-text"><strong>Every day at 9 AM</strong> — our AI scans thousands of job listings for roles that match your skills</div>
          </div>
          <div className="how-row">
            <div className="how-num">2</div>
            <div className="how-text"><strong>Only 70%+ matches</strong> — jobs where you don't meet most requirements are filtered out automatically</div>
          </div>
          <div className="how-row">
            <div className="how-num">3</div>
            <div className="how-text"><strong>Cover letter ready</strong> — each match comes with a personalized cover letter written for that exact role</div>
          </div>
          <div className="how-row">
            <div className="how-num">4</div>
            <div className="how-text"><strong>You apply</strong> — open the job, copy your cover letter, and apply. <strong>1 credit per match.</strong></div>
          </div>
        </div>

        <div className="dark-card">
          <div style={{fontSize:'15px',fontWeight:'700',color:'#e0e0e0',marginBottom:'4px',fontFamily:'sans-serif'}}>Need more credits?</div>
          <div style={{fontSize:'13px',color:'#888',fontFamily:'sans-serif'}}>Top-up credits never expire and work on any plan.</div>
          <div className="topup-row">
            <button className="topup-btn" onClick={() => window.open('https://nuxply.lemonsqueezy.com/checkout/buy/20f383cf-285d-4b88-b7bb-fbae4c1f4d92','_blank')}>
              10 credits — $3
            </button>
            <button className="topup-btn topup-primary" onClick={() => window.open('https://nuxply.lemonsqueezy.com/checkout/buy/710d730d-f886-41bb-8158-19189655f18f','_blank')}>
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