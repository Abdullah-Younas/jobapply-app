import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo.png'
import Dock from './Dock'

const IconDashboard = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
const IconApps = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
const IconProfile = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
const IconSettings = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
const IconSignOut = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>

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

  const dockItems = [
    { icon: <IconDashboard />, label: 'Dashboard',    onClick: () => navigate('/dashboard'),    active: false },
    { icon: <IconApps />,      label: 'Applications', onClick: () => navigate('/applications'), active: false },
    { icon: <IconProfile />,   label: 'Profile',      onClick: () => navigate('/profile'),      active: false },
    { icon: <IconSettings />,  label: 'Settings',     onClick: () => navigate('/settings'),     active: true  },
    { icon: <IconSignOut />,   label: 'Sign out',     onClick: handleSignOut,                   active: false },
  ]

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0a0a0a', color:'#4a6e54', fontFamily:"'DM Mono',monospace", fontSize:13 }}>Loading...</div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', color:'#e8e8e8', fontFamily:"'Georgia',serif", paddingBottom:100 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        .s-nav { display:flex; justify-content:space-between; align-items:center; padding:18px clamp(24px,5vw,48px); border-bottom:1px solid #122018; background:rgba(10,10,10,0.9); position:sticky; top:0; z-index:100; backdrop-filter:blur(14px); }
        .s-logo { display:flex; align-items:center; gap:9px; cursor:pointer; }
        .s-logo-img { height:26px; width:26px; object-fit:contain; }
        .s-logo-text { font-size:17px; font-weight:700; color:#6a9e78; letter-spacing:0.05em; font-family:'DM Mono',monospace; }
        .s-body { max-width:560px; margin:0 auto; padding:clamp(28px,4vw,48px) clamp(20px,4vw,40px); }
        .s-title { font-size:clamp(22px,3vw,30px); font-weight:700; letter-spacing:-0.02em; margin-bottom:6px; }
        .s-sub { font-size:13px; color:#4a6e54; margin-bottom:28px; font-family:'DM Mono',monospace; }
        .s-card { background:#0d160f; border:1px solid #1a2e1e; border-radius:14px; padding:22px 24px; margin-bottom:12px; }
        .s-card-title { font-size:10px; font-weight:700; color:#2e4e38; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:16px; font-family:'DM Mono',monospace; }
        .s-row { display:flex; justify-content:space-between; align-items:center; padding:11px 0; border-bottom:1px solid #122018; font-size:13px; font-family:'DM Mono',monospace; }
        .s-row:last-child { border-bottom:none; }
        .s-row-label { color:#4a6e54; }
        .s-row-value { font-weight:600; color:#c9dcc8; }
        .plan-pill { background:rgba(106,158,120,0.1); color:#6a9e78; border:1px solid #1a2e1e; font-size:10px; font-weight:700; padding:3px 10px; border-radius:6px; text-transform:capitalize; font-family:'DM Mono',monospace; letter-spacing:0.05em; }
        .s-desc { font-size:13px; color:#4a6e54; font-family:'DM Mono',monospace; line-height:1.65; }
        .s-desc strong { color:#c9dcc8; }
        .action-btn { width:100%; padding:13px; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.18s; font-family:'DM Mono',monospace; margin-top:14px; letter-spacing:0.02em; }
        .sage-btn { background:#6a9e78; color:#fff; border:none; }
        .sage-btn:hover { background:#7ab088; box-shadow:0 4px 16px rgba(106,158,120,0.2); }
        .outline-btn { background:transparent; color:#4a6e54; border:1px solid #1a2e1e; }
        .outline-btn:hover { border-color:#6a9e78; color:#c9dcc8; }
        .danger-card { background:#0d160f; border:1px solid rgba(248,113,113,0.1); border-radius:14px; padding:22px 24px; }
        .danger-title { font-size:10px; font-weight:700; color:rgba(248,113,113,0.4); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:14px; font-family:'DM Mono',monospace; }
        .danger-btn { width:100%; padding:13px; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; background:transparent; color:rgba(248,113,113,0.5); border:1px solid rgba(248,113,113,0.1); transition:all 0.18s; font-family:'DM Mono',monospace; letter-spacing:0.02em; }
        .danger-btn:hover { background:rgba(248,113,113,0.05); color:#f87171; border-color:rgba(248,113,113,0.25); }
      `}</style>

      <nav className="s-nav">
        <div className="s-logo" onClick={() => navigate('/')}>
          <img src={logo} alt="Nuxply" className="s-logo-img" />
          <span className="s-logo-text">nuxply</span>
        </div>
      </nav>

      <div className="s-body">
        <h1 className="s-title">Settings</h1>
        <p className="s-sub">Manage your account and subscription.</p>

        <div className="s-card">
          <div className="s-card-title">Account</div>
          <div className="s-row"><span className="s-row-label">Name</span><span className="s-row-value">{profile?.name ?? '—'}</span></div>
          <div className="s-row"><span className="s-row-label">Email</span><span className="s-row-value">{profile?.email ?? '—'}</span></div>
          <div className="s-row"><span className="s-row-label">Plan</span><span className="plan-pill">{profile?.plan ?? 'free'}</span></div>
          <div className="s-row"><span className="s-row-label">Credits remaining</span><span className="s-row-value">{profile?.monthly_quota ?? 0} <span style={{color:'#2e4e38',fontWeight:400}}>({Math.floor((profile?.monthly_quota ?? 0) / 2)} apps)</span></span></div>
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
              <p className="s-desc">You are on the <strong style={{textTransform:'capitalize'}}>{profile?.plan}</strong> plan.</p>
              <button className="action-btn outline-btn" onClick={() => navigate('/pricing')}>Manage subscription</button>
            </>
          )}
        </div>

        <div className="danger-card">
          <div className="danger-title">Danger zone</div>
          <button className="danger-btn" onClick={handleSignOut}>Sign out</button>
        </div>
      </div>

      <Dock items={dockItems} panelHeight={68} baseItemSize={52} magnification={72} />
    </div>
  )
}