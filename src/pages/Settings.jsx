import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo.png'

export default function Settings() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0a', color: '#4a6e54', fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
      Loading...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e8e8e8', fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .s-nav {
          display: flex; justify-content: space-between; align-items: center;
          padding: 18px clamp(24px, 5vw, 48px);
          border-bottom: 1px solid #122018;
          background: rgba(10,10,10,0.9);
          position: sticky; top: 0; z-index: 100;
          backdrop-filter: blur(14px);
        }
        .s-logo { display: flex; align-items: center; gap: 9px; cursor: pointer; }
        .s-logo-img { height: 26px; width: 26px; object-fit: contain; }
        .s-logo-text { font-size: 17px; font-weight: 700; color: #6a9e78; letter-spacing: 0.05em; font-family: 'DM Mono', monospace; }
        .s-back { font-size: 12px; color: #4a6e54; background: none; border: 1px solid #1a2e1e; border-radius: 8px; cursor: pointer; font-family: 'DM Mono', monospace; padding: 8px 16px; transition: all 0.18s; }
        .s-back:hover { color: #c9dcc8; border-color: #6a9e78; }

        .s-body { max-width: 560px; margin: 0 auto; padding: clamp(32px, 5vw, 56px) clamp(20px, 4vw, 40px); }
        .s-title { font-size: clamp(22px, 3vw, 30px); font-weight: 700; letter-spacing: -0.02em; margin-bottom: 6px; color: #e8e8e8; }
        .s-sub { font-size: 13px; color: #4a6e54; margin-bottom: 32px; font-family: 'DM Mono', monospace; }

        .s-card {
          background: #0d160f; border: 1px solid #1a2e1e; border-radius: 14px;
          padding: 22px 24px; margin-bottom: 12px;
        }
        .s-card-title {
          font-size: 10px; font-weight: 700; color: #2e4e38;
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 16px; font-family: 'DM Mono', monospace;
        }
        .s-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 11px 0; border-bottom: 1px solid #122018;
          font-size: 13px; font-family: 'DM Mono', monospace;
        }
        .s-row:last-child { border-bottom: none; }
        .s-row-label { color: #4a6e54; }
        .s-row-value { font-weight: 600; color: #c9dcc8; }
        .plan-pill {
          background: rgba(106,158,120,0.1); color: #6a9e78;
          border: 1px solid #1a2e1e;
          font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 6px;
          text-transform: capitalize; font-family: 'DM Mono', monospace; letter-spacing: 0.05em;
        }

        .s-desc { font-size: 13px; color: #4a6e54; font-family: 'DM Mono', monospace; line-height: 1.65; margin-bottom: 0; }
        .s-desc strong { color: #c9dcc8; }

        .action-btn {
          width: 100%; padding: 13px; border-radius: 10px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: all 0.18s; font-family: 'DM Mono', monospace;
          margin-top: 14px; letter-spacing: 0.02em;
        }
        .sage-btn { background: #6a9e78; color: #fff; border: none; }
        .sage-btn:hover { background: #7ab088; box-shadow: 0 4px 16px rgba(106,158,120,0.2); }
        .outline-btn { background: transparent; color: #4a6e54; border: 1px solid #1a2e1e; }
        .outline-btn:hover { border-color: #6a9e78; color: #c9dcc8; }

        .danger-card {
          background: #0d160f;
          border: 1px solid rgba(248,113,113,0.1);
          border-radius: 14px; padding: 22px 24px;
        }
        .danger-title {
          font-size: 10px; font-weight: 700; color: rgba(248,113,113,0.4);
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 14px; font-family: 'DM Mono', monospace;
        }
        .danger-btn {
          width: 100%; padding: 13px; border-radius: 10px; font-size: 13px; font-weight: 600;
          cursor: pointer; background: transparent; color: rgba(248,113,113,0.5);
          border: 1px solid rgba(248,113,113,0.1); transition: all 0.18s;
          font-family: 'DM Mono', monospace; letter-spacing: 0.02em;
        }
        .danger-btn:hover { background: rgba(248,113,113,0.05); color: #f87171; border-color: rgba(248,113,113,0.25); }
      `}</style>

      <nav className="s-nav">
        <div className="s-logo" onClick={() => navigate('/')}>
          <img src={logo} alt="Nuxply" className="s-logo-img" />
          <span className="s-logo-text">nuxply</span>
        </div>
        <button className="s-back" onClick={() => navigate('/dashboard')}>← Dashboard</button>
      </nav>

      <div className="s-body">
        <h1 className="s-title">Settings</h1>
        <p className="s-sub">Manage your account and subscription.</p>

        <div className="s-card">
          <div className="s-card-title">Account</div>
          <div className="s-row"><span className="s-row-label">Name</span><span className="s-row-value">{profile?.name ?? '—'}</span></div>
          <div className="s-row"><span className="s-row-label">Email</span><span className="s-row-value">{profile?.email ?? '—'}</span></div>
          <div className="s-row"><span className="s-row-label">Plan</span><span className="plan-pill">{profile?.plan ?? 'free'}</span></div>
          <div className="s-row"><span className="s-row-label">Credits remaining</span><span className="s-row-value">{profile?.monthly_quota ?? 0}</span></div>
          <div className="s-row"><span className="s-row-label">Top-up credits</span><span className="s-row-value">{profile?.topup_credits ?? 0}</span></div>
        </div>

        <div className="s-card">
          <div className="s-card-title">Subscription</div>
          {profile?.plan === 'free' ? (
            <>
              <p className="s-desc">You are on the free plan — 10 credits/month.</p>
              <button className="action-btn sage-btn" onClick={() => navigate('/pricing')}>Upgrade plan</button>
            </>
          ) : (
            <>
              <p className="s-desc">
                You are on the <strong style={{ textTransform: 'capitalize' }}>{profile?.plan}</strong> plan.
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