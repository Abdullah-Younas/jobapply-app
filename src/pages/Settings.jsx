import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Settings() {
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

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text)'}}>
      <style>{`
        .settings-nav{display:flex;justify-content:space-between;align-items:center;padding:16px 48px;border-bottom:1px solid var(--border);background:var(--bg2);}
        .settings-logo{font-size:20px;font-weight:700;color:var(--violet);cursor:pointer;font-family:Georgia,serif;}
        .back-link{font-size:13px;color:var(--text2);background:none;border:none;cursor:pointer;font-family:sans-serif;}
        .theme-btn{width:36px;height:36px;border-radius:50%;border:1px solid var(--border);background:var(--bg2);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;}
        .settings-body{max-width:560px;margin:0 auto;padding:48px 24px;}
        .settings-title{font-size:28px;font-weight:700;letter-spacing:-0.5px;margin:0 0 4px;font-family:Georgia,serif;}
        .settings-sub{font-size:14px;color:var(--text2);margin:0 0 32px;font-family:sans-serif;}
        .scard{background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:24px;margin-bottom:16px;}
        .scard-title{font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;font-family:sans-serif;}
        .srow{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);font-size:14px;font-family:sans-serif;}
        .srow:last-child{border-bottom:none;}
        .srow-label{color:var(--text2);}
        .srow-value{font-weight:600;color:var(--text);}
        .plan-pill{background:var(--violet-bg);color:var(--violet-text);font-size:12px;font-weight:700;padding:4px 12px;border-radius:100px;text-transform:capitalize;font-family:sans-serif;}
        .action-btn{width:100%;padding:13px;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s;font-family:sans-serif;margin-top:8px;}
        .violet-btn{background:var(--violet);color:white;border:none;}
        .violet-btn:hover{background:var(--violet2);}
        .outline-btn{background:transparent;color:var(--text);border:1px solid var(--border);}
        .outline-btn:hover{border-color:var(--violet);color:var(--violet);}
        .danger-card{background:var(--bg2);border:1px solid rgba(248,113,113,0.15);border-radius:16px;padding:24px;}
        .danger-title{font-size:12px;font-weight:700;color:#f87171;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;font-family:sans-serif;}
        .danger-btn{width:100%;padding:13px;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;background:transparent;color:#f87171;border:1px solid rgba(248,113,113,0.2);transition:all 0.2s;font-family:sans-serif;}
        .danger-btn:hover{background:rgba(248,113,113,0.05);}
      `}</style>

      <nav className="settings-nav">
        <div className="settings-logo" onClick={() => navigate('/')}>Nuxply</div>
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <button className="back-link" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="theme-btn" onClick={() => setDark(d => !d)}>{dark ? '☀️' : '🌙'}</button>
        </div>
      </nav>

      <div className="settings-body">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-sub">Manage your account and subscription.</p>

        <div className="scard">
          <div className="scard-title">Account</div>
          <div className="srow"><span className="srow-label">Name</span><span className="srow-value">{profile?.name ?? '—'}</span></div>
          <div className="srow"><span className="srow-label">Email</span><span className="srow-value">{profile?.email ?? '—'}</span></div>
          <div className="srow"><span className="srow-label">Plan</span><span className="plan-pill">{profile?.plan ?? 'free'}</span></div>
          <div className="srow"><span className="srow-label">Credits remaining</span><span className="srow-value">{profile?.monthly_quota ?? 0}</span></div>
          <div className="srow"><span className="srow-label">Top-up credits</span><span className="srow-value">{profile?.topup_credits ?? 0}</span></div>
        </div>

        <div className="scard">
          <div className="scard-title">Subscription</div>
          {profile?.plan === 'free' ? (
            <>
              <p style={{fontSize:'14px',color:'var(--text2)',margin:'0',fontFamily:'sans-serif'}}>You are on the free plan — 10 credits/month.</p>
              <button className="action-btn violet-btn" onClick={() => navigate('/pricing')}>Upgrade plan</button>
            </>
          ) : (
            <>
              <p style={{fontSize:'14px',color:'var(--text2)',margin:'0',fontFamily:'sans-serif'}}>
                You are on the <strong style={{color:'var(--text)',textTransform:'capitalize'}}>{profile?.plan}</strong> plan.
              </p>
              <button className="action-btn outline-btn" onClick={() => navigate('/pricing')}>Manage subscription</button>
            </>
          )}
        </div>

        <div className="danger-card">
          <div className="danger-title">Danger zone</div>
          <button className="danger-btn" onClick={handleSignOut}>Sign out</button>
        </div>
      </div>
    </div>
  )
}