import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo.png'
import Dock from './Dock'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      setUser(session.user)
      const { data } = await supabase.from('users').select('*').eq('email', session.user.email).maybeSingle()
      setProfile(data)
      if (data) {
        if (data.monthly_quota === 0 && data.topup_credits === 0) {
          setNotification({ type: 'error', msg: '⚠️ You have no credits left this month. Buy top-up credits or upgrade your plan.' })
        } else if (data.monthly_quota <= 3 && data.monthly_quota > 0) {
          setNotification({ type: 'warn', msg: `⚡ Only ${data.monthly_quota} credits left this month. Consider upgrading.` })
        } else if (!data.skills || data.skills.length === 0) {
          setNotification({ type: 'info', msg: '💡 Upload your CV or add your skills to start getting job matches.' })
        } else if (!data.job_title_preference) {
          setNotification({ type: 'info', msg: '💡 Add a job title in your profile so our AI knows what roles to find for you.' })
        }
      }
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

  const total = profile?.plan === 'premium' ? 100 : profile?.plan === 'standard' ? 50 : 10
  const used = total - (profile?.monthly_quota ?? total)
  const pct = Math.round((used / total) * 100)
  const appsLeft = profile?.monthly_quota ?? 0
  const dailyLimit = profile?.plan === 'premium' ? 5 : profile?.plan === 'standard' ? 5 : 1
  const daysLeft = Math.ceil(appsLeft / dailyLimit)

  const dockItems = [
    {
      icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
      label: 'Dashboard', onClick: () => navigate('/dashboard'), active: true
    },
    {
      icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
      label: 'Applications', onClick: () => navigate('/applications'), active: false
    },
    {
      icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
      label: 'Profile', onClick: () => navigate('/profile'), active: false
    },
    {
      icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
      label: 'Settings', onClick: () => navigate('/settings'), active: false
    },
    {
      icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
      label: 'Sign out', onClick: handleSignOut, active: false
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e8e8e8', fontFamily: "'Georgia', serif", paddingBottom: 100 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .dash-topbar { display:flex;align-items:center;justify-content:space-between;padding:18px clamp(20px,4vw,40px);background:rgba(10,10,10,0.9);border-bottom:1px solid #122018;position:sticky;top:0;z-index:100;backdrop-filter:blur(14px); }
        .topbar-logo { display:flex;align-items:center;gap:9px;cursor:pointer; }
        .topbar-logo-img { height:26px;width:26px;object-fit:contain; }
        .topbar-logo-text { font-size:17px;font-weight:700;color:#6a9e78;letter-spacing:0.05em;font-family:'DM Mono',monospace; }
        .topbar-plan { font-size:10px;font-weight:700;background:rgba(106,158,120,0.1);color:#6a9e78;border:1px solid #1a2e1e;padding:3px 10px;border-radius:6px;font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:0.06em; }
        .dash-body { max-width:700px;margin:0 auto;padding:clamp(28px,4vw,48px) clamp(20px,4vw,40px); }
        .dash-title { font-size:clamp(22px,3vw,30px);font-weight:700;letter-spacing:-0.02em;margin-bottom:6px;color:#e8e8e8; }
        .dash-sub { font-size:13px;color:#4a6e54;margin-bottom:28px;font-family:'DM Mono',monospace; }
        .d-card { background:#0d160f;border:1px solid #1a2e1e;border-radius:14px;padding:22px 24px;margin-bottom:12px; }
        .d-card-title { font-size:10px;font-weight:700;color:#2e4e38;text-transform:uppercase;letter-spacing:0.1em;font-family:'DM Mono',monospace;margin-bottom:14px; }
        .quota-row { display:flex;justify-content:space-between;align-items:center;margin-bottom:10px; }
        .quota-label-text { font-size:13px;color:#4a6e54;font-family:'DM Mono',monospace; }
        .quota-count { font-size:13px;font-weight:700;color:#c9dcc8;font-family:'DM Mono',monospace; }
        .quota-bar { height:5px;background:#122018;border-radius:100px;overflow:hidden; }
        .quota-fill { height:5px;background:#6a9e78;border-radius:100px;transition:width 0.6s ease; }
        .quota-topup { font-size:11px;color:#2e4e38;font-family:'DM Mono',monospace;margin-top:8px; }
        .stats-mini { display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:16px; }
        .stat-mini-box { background:#080808;border:1px solid #122018;border-radius:10px;padding:12px;text-align:center; }
        .stat-mini-num { font-size:18px;font-weight:700;color:#6a9e78;font-family:'DM Mono',monospace; }
        .stat-mini-label { font-size:10px;color:#2e4e38;font-family:'DM Mono',monospace;margin-top:3px;letter-spacing:0.04em;text-transform:uppercase; }
        .how-card { background:rgba(106,158,120,0.04);border:1px solid #1a2e1e;border-radius:12px;padding:16px 18px;margin-bottom:12px; }
        .how-title { font-size:11px;font-weight:700;color:#2e4e38;text-transform:uppercase;letter-spacing:0.08em;font-family:'DM Mono',monospace;margin-bottom:12px; }
        .how-row { display:flex;align-items:flex-start;gap:10px;margin-bottom:10px; }
        .how-row:last-child { margin-bottom:0; }
        .how-dot { width:20px;height:20px;border-radius:50%;background:rgba(106,158,120,0.1);border:1px solid #1a2e1e;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#6a9e78;font-family:'DM Mono',monospace;flex-shrink:0;margin-top:1px; }
        .how-text { font-size:12px;color:#4a6e54;font-family:'DM Mono',monospace;line-height:1.65; }
        .how-text strong { color:#c9dcc8; }
        .info-box { background:rgba(106,158,120,0.06);border:1px solid #1a2e1e;border-radius:10px;padding:14px 16px;font-size:13px;color:#4a6e54;font-family:'DM Mono',monospace;margin-bottom:12px;line-height:1.65; }
        .info-box strong { color:#6a9e78; }
        .warn-box { background:rgba(251,191,36,0.05);border:1px solid rgba(251,191,36,0.12);border-radius:10px;padding:14px 16px;font-size:13px;color:#a07030;font-family:'DM Mono',monospace;margin-bottom:12px;line-height:1.6; }
        .warn-link { font-weight:700;text-decoration:underline;cursor:pointer;background:none;border:none;color:inherit;font-family:'DM Mono',monospace;font-size:13px;padding:0; }
        .topup-row { display:flex;gap:10px;margin-top:14px; }
        .topup-btn-ghost { flex:1;padding:11px;border-radius:9px;font-size:12px;font-weight:600;cursor:pointer;font-family:'DM Mono',monospace;border:1px solid #1a2e1e;background:transparent;color:#4a6e54;transition:all 0.18s;letter-spacing:0.01em; }
        .topup-btn-ghost:hover { border-color:#6a9e78;color:#c9dcc8; }
        .topup-btn-fill { flex:1;padding:11px;border-radius:9px;font-size:12px;font-weight:600;cursor:pointer;font-family:'DM Mono',monospace;background:#6a9e78;color:#fff;border:none;transition:all 0.18s;letter-spacing:0.01em; }
        .topup-btn-fill:hover { background:#7ab088; }
        .quick-grid { display:grid;grid-template-columns:1fr 1fr;gap:10px; }
        .quick-card { background:#0d160f;border:1px solid #1a2e1e;border-radius:12px;padding:20px;cursor:pointer;transition:all 0.18s;text-align:left;width:100%; }
        .quick-card:hover { border-color:#6a9e78;transform:translateY(-2px);background:#0e1f12; }
        .quick-title { font-size:14px;font-weight:700;color:#c9dcc8;margin-bottom:5px;font-family:'DM Mono',monospace; }
        .quick-sub { font-size:12px;color:#2e4e38;font-family:'DM Mono',monospace; }
        .notif-bar { display:flex;align-items:flex-start;gap:10px;border-radius:10px;padding:14px 16px;margin-bottom:12px;font-size:13px;font-family:'DM Mono',monospace;line-height:1.6; }
        .notif-close { margin-left:auto;background:none;border:none;cursor:pointer;font-size:14px;color:inherit;opacity:0.6;padding:0 0 0 8px;flex-shrink:0; }
        @media (max-width:480px) { .quick-grid { grid-template-columns:1fr; } .stats-mini { grid-template-columns:1fr 1fr; } }
      `}</style>

      <header className="dash-topbar">
        <div className="topbar-logo" onClick={() => navigate('/')}>
          <img src={logo} alt="Nuxply" className="topbar-logo-img" />
          <span className="topbar-logo-text">nuxply</span>
        </div>
        <span className="topbar-plan">{profile?.plan ?? 'free'}</span>
      </header>

      <main className="dash-body">
        <h1 className="dash-title">Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}</h1>
        <p className="dash-sub">Here's your activity this month.</p>

        {notification && (
          <div className="notif-bar" style={{
            background: notification.type === 'error' ? 'rgba(248,113,113,0.08)' : notification.type === 'warn' ? 'rgba(251,191,36,0.06)' : 'rgba(106,158,120,0.06)',
            border: `1px solid ${notification.type === 'error' ? 'rgba(248,113,113,0.2)' : notification.type === 'warn' ? 'rgba(251,191,36,0.12)' : '#1a2e1e'}`,
            color: notification.type === 'error' ? '#f87171' : notification.type === 'warn' ? '#a07030' : '#4a6e54'
          }}>
            <span>{notification.msg}</span>
            <button className="notif-close" onClick={() => setNotification(null)}>✕</button>
          </div>
        )}

        <div className="d-card">
          <div className="d-card-title">Credits this month</div>
          <div className="quota-row">
            <span className="quota-label-text">Used</span>
            <span className="quota-count">{used} / {total}</span>
          </div>
          <div className="quota-bar">
            <div className="quota-fill" style={{ width: `${pct}%` }} />
          </div>
          {profile?.topup_credits > 0 && (
            <div className="quota-topup">+ {profile.topup_credits} top-up credits remaining</div>
          )}
          <div className="stats-mini">
            <div className="stat-mini-box">
              <div className="stat-mini-num">{appsLeft}</div>
              <div className="stat-mini-label">Credits left</div>
            </div>
            <div className="stat-mini-box">
              <div className="stat-mini-num">{dailyLimit}</div>
              <div className="stat-mini-label">Per day</div>
            </div>
            <div className="stat-mini-box">
              <div className="stat-mini-num">{daysLeft}</div>
              <div className="stat-mini-label">Days coverage</div>
            </div>
          </div>
        </div>

        <div className="how-card">
          <div className="how-title">How your plan works</div>
          <div className="how-row">
            <div className="how-dot">1</div>
            <div className="how-text"><strong>Every morning</strong> our AI scans fresh job listings and finds roles matching your skills</div>
          </div>
          <div className="how-row">
            <div className="how-dot">2</div>
            <div className="how-text">You get <strong>{dailyLimit} new match{dailyLimit > 1 ? 'es' : ''} per day</strong> — each with a personalized cover letter ready to send</div>
          </div>
          <div className="how-row">
            <div className="how-dot">3</div>
            <div className="how-text">Only jobs where you qualify <strong>70% or more</strong> make it through — no more applying blind</div>
          </div>
          <div className="how-row">
            <div className="how-dot">4</div>
            <div className="how-text">Each match uses <strong>1 credit</strong>. You have <strong>{appsLeft} credits</strong> left — enough for ~{daysLeft} more days</div>
          </div>
        </div>

        {pct >= 80 && profile?.plan !== 'premium' && (
          <div className="warn-box">
            Running low on credits.{' '}
            <button className="warn-link" onClick={() => navigate('/pricing')}>Upgrade or buy top-up credits</button>
          </div>
        )}

        <div className="d-card">
          <div className="d-card-title">Top-up credits</div>
          <p style={{ fontSize: 13, color: '#2e4e38', fontFamily: "'DM Mono', monospace", lineHeight: 1.6 }}>Credits never expire and work on any plan.</p>
          <div className="topup-row">
            <button className="topup-btn-ghost" onClick={() => window.open('https://nuxply.lemonsqueezy.com/checkout/buy/06a413af-17bc-4276-8cbe-4c29d2da02aa', '_blank')}>10 credits — $3</button>
            <button className="topup-btn-fill" onClick={() => window.open('https://nuxply.lemonsqueezy.com/checkout/buy/5a7a4cbc-8947-4346-b39c-786021b8a9d9', '_blank')}>25 credits — $6</button>
          </div>
        </div>

        <div className="quick-grid">
          <button className="quick-card" onClick={() => navigate('/profile')}>
            <div className="quick-title">Update profile</div>
            <div className="quick-sub">Edit your skills and preferences</div>
          </button>
          <button className="quick-card" onClick={() => navigate('/applications')}>
            <div className="quick-title">View matches</div>
            <div className="quick-sub">Browse matched jobs and apply</div>
          </button>
        </div>
      </main>

      <Dock items={dockItems} panelHeight={68} baseItemSize={52} magnification={72} />
    </div>
  )
}