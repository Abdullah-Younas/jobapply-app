import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo.png'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0a', color: '#4a6e54', fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
      Loading...
    </div>
  )

  const total = profile?.plan === 'premium' ? 100 : profile?.plan === 'standard' ? 50 : 10
  const used = total - (profile?.monthly_quota ?? total)
  const pct = Math.round((used / total) * 100)

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '⬡' },
    { label: 'Applications', path: '/applications', icon: '◈' },
    { label: 'Profile', path: '/profile', icon: '◎' },
    { label: 'Settings', path: '/settings', icon: '◇' },
    { label: 'Pricing', path: '/pricing', icon: '◆' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e8e8e8', fontFamily: "'Georgia', serif", display: 'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── SIDEBAR ── */
        .sidebar {
          position: fixed; top: 0; left: 0; height: 100vh;
          width: 240px;
          background: #080808;
          border-right: 1px solid #122018;
          display: flex; flex-direction: column;
          padding: 24px 0;
          z-index: 200;
          transform: translateX(-100%);
          transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        .sidebar.open { transform: translateX(0); }

        .sidebar-logo {
          display: flex; align-items: center; gap: 9px;
          padding: 0 20px 24px;
          border-bottom: 1px solid #122018;
          margin-bottom: 16px;
          cursor: pointer;
        }
        .sidebar-logo-img { height: 26px; width: 26px; object-fit: contain; }
        .sidebar-logo-text { font-size: 16px; font-weight: 700; color: #6a9e78; letter-spacing: 0.05em; font-family: 'DM Mono', monospace; }

        .sidebar-close {
          position: absolute; top: 18px; right: 16px;
          background: none; border: none; color: #2e4e38;
          font-size: 18px; cursor: pointer; line-height: 1;
          font-family: 'DM Mono', monospace;
          transition: color 0.15s;
        }
        .sidebar-close:hover { color: #6a9e78; }

        .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 2px; padding: 0 12px; }
        .sidebar-item {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 12px; border-radius: 9px;
          font-size: 13px; font-family: 'DM Mono', monospace;
          color: #4a6e54; cursor: pointer;
          transition: all 0.15s; border: none; background: none;
          text-align: left; width: 100%;
          letter-spacing: 0.02em;
        }
        .sidebar-item:hover { background: rgba(106,158,120,0.06); color: #c9dcc8; }
        .sidebar-item.active { background: rgba(106,158,120,0.1); color: #6a9e78; }
        .sidebar-item-icon { font-size: 14px; width: 18px; text-align: center; flex-shrink: 0; }

        .sidebar-footer { padding: 16px 12px 0; border-top: 1px solid #122018; margin-top: 8px; }
        .sidebar-user { padding: 10px 12px; margin-bottom: 6px; }
        .sidebar-user-name { font-size: 12px; font-weight: 700; color: #c9dcc8; font-family: 'DM Mono', monospace; }
        .sidebar-user-plan { font-size: 10px; color: #2e4e38; font-family: 'DM Mono', monospace; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }
        .sidebar-signout {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 12px; border-radius: 9px;
          font-size: 13px; font-family: 'DM Mono', monospace;
          color: #3a2222; cursor: pointer;
          transition: all 0.15s; border: none; background: none;
          text-align: left; width: 100%;
        }
        .sidebar-signout:hover { background: rgba(248,113,113,0.06); color: #f87171; }

        /* Overlay */
        .sidebar-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          z-index: 199; backdrop-filter: blur(2px);
          opacity: 0; pointer-events: none;
          transition: opacity 0.28s;
        }
        .sidebar-overlay.open { opacity: 1; pointer-events: all; }

        /* ── TOP NAR ── */
        .dash-topbar {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px clamp(20px, 4vw, 40px);
          background: rgba(10,10,10,0.9);
          border-bottom: 1px solid #122018;
          backdrop-filter: blur(14px);
        }
        .topbar-left { display: flex; align-items: center; gap: 14px; }
        .menu-btn {
          width: 36px; height: 36px; border-radius: 8px;
          border: 1px solid #1a2e1e; background: transparent;
          cursor: pointer; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 5px;
          transition: all 0.18s;
        }
        .menu-btn:hover { border-color: #6a9e78; background: rgba(106,158,120,0.06); }
        .menu-line { width: 14px; height: 1.5px; background: #4a6e54; border-radius: 2px; transition: background 0.15s; }
        .menu-btn:hover .menu-line { background: #6a9e78; }
        .topbar-title { font-size: 15px; font-weight: 700; color: #c9dcc8; font-family: 'DM Mono', monospace; letter-spacing: 0.02em; }
        .topbar-plan-pill {
          font-size: 10px; font-weight: 700;
          background: rgba(106,158,120,0.1); color: #6a9e78;
          border: 1px solid #1a2e1e; padding: 3px 10px; border-radius: 6px;
          font-family: 'DM Mono', monospace; text-transform: uppercase; letter-spacing: 0.06em;
        }

        /* ── BODY ── */
        .dash-body { max-width: 700px; margin: 0 auto; padding: clamp(32px, 5vw, 56px) clamp(20px, 4vw, 40px); }
        .dash-title { font-size: clamp(22px, 3vw, 30px); font-weight: 700; letter-spacing: -0.02em; margin-bottom: 6px; color: #e8e8e8; }
        .dash-sub { font-size: 13px; color: #4a6e54; margin-bottom: 32px; font-family: 'DM Mono', monospace; }

        .d-card {
          background: #0d160f; border: 1px solid #1a2e1e; border-radius: 14px;
          padding: 22px 24px; margin-bottom: 12px;
        }
        .d-card-title { font-size: 11px; font-weight: 700; color: #2e4e38; text-transform: uppercase; letter-spacing: 0.1em; font-family: 'DM Mono', monospace; margin-bottom: 14px; }

        /* Quota */
        .quota-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .quota-label-text { font-size: 13px; color: #4a6e54; font-family: 'DM Mono', monospace; }
        .quota-count { font-size: 13px; font-weight: 700; color: #c9dcc8; font-family: 'DM Mono', monospace; }
        .quota-bar { height: 5px; background: #122018; border-radius: 100px; overflow: hidden; }
        .quota-fill { height: 5px; background: #6a9e78; border-radius: 100px; transition: width 0.6s ease; }
        .quota-topup { font-size: 11px; color: #2e4e38; font-family: 'DM Mono', monospace; margin-top: 8px; }

        /* Info / warn boxes */
        .info-box {
          background: rgba(106,158,120,0.06); border: 1px solid #1a2e1e;
          border-radius: 10px; padding: 14px 16px;
          font-size: 13px; color: #4a6e54; font-family: 'DM Mono', monospace;
          margin-bottom: 12px; line-height: 1.6;
        }
        .info-box strong { color: #6a9e78; }
        .warn-box {
          background: rgba(251,191,36,0.05); border: 1px solid rgba(251,191,36,0.12);
          border-radius: 10px; padding: 14px 16px;
          font-size: 13px; color: #a07030; font-family: 'DM Mono', monospace;
          margin-bottom: 12px; line-height: 1.6;
        }
        .warn-link { font-weight: 700; text-decoration: underline; cursor: pointer; background: none; border: none; color: inherit; font-family: 'DM Mono', monospace; font-size: 13px; }

        /* Topup card */
        .topup-row { display: flex; gap: 10px; margin-top: 14px; }
        .topup-btn-ghost {
          flex: 1; padding: 11px; border-radius: 9px; font-size: 12px; font-weight: 600;
          cursor: pointer; font-family: 'DM Mono', monospace;
          border: 1px solid #1a2e1e; background: transparent; color: #4a6e54;
          transition: all 0.18s; letter-spacing: 0.01em;
        }
        .topup-btn-ghost:hover { border-color: #6a9e78; color: #c9dcc8; }
        .topup-btn-fill {
          flex: 1; padding: 11px; border-radius: 9px; font-size: 12px; font-weight: 600;
          cursor: pointer; font-family: 'DM Mono', monospace;
          background: #6a9e78; color: #fff; border: none;
          transition: all 0.18s; letter-spacing: 0.01em;
        }
        .topup-btn-fill:hover { background: #7ab088; }

        /* Quick grid */
        .quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 4px; }
        .quick-card {
          background: #0d160f; border: 1px solid #1a2e1e; border-radius: 12px;
          padding: 20px; cursor: pointer; transition: all 0.18s;
          text-align: left; border: none; width: 100%;
          border: 1px solid #1a2e1e;
        }
        .quick-card:hover { border-color: #6a9e78; transform: translateY(-2px); background: #0e1f12; }
        .quick-title { font-size: 14px; font-weight: 700; color: #c9dcc8; margin-bottom: 5px; font-family: 'DM Mono', monospace; }
        .quick-sub { font-size: 12px; color: #2e4e38; font-family: 'DM Mono', monospace; }

        @media (max-width: 480px) {
          .quick-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Sidebar overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        <div className="sidebar-logo" onClick={() => { navigate('/'); setSidebarOpen(false) }}>
          <img src={logo} alt="Nuxply" className="sidebar-logo-img" />
          <span className="sidebar-logo-text">nuxply</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.path}
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => { navigate(item.path); setSidebarOpen(false) }}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-name">
              {user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Account'}
            </div>
            <div className="sidebar-user-plan">{profile?.plan ?? 'free'} plan</div>
          </div>
          <button className="sidebar-signout" onClick={handleSignOut}>
            <span className="sidebar-item-icon">→</span>Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <header className="dash-topbar">
          <div className="topbar-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
              <div className="menu-line" />
              <div className="menu-line" />
              <div className="menu-line" />
            </button>
            <span className="topbar-title">Dashboard</span>
          </div>
          <span className="topbar-plan-pill">{profile?.plan ?? 'free'}</span>
        </header>

        {/* Body */}
        <main className="dash-body">
          <h1 className="dash-title">
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}
          </h1>
          <p className="dash-sub">Here's your activity this month.</p>

          {/* Quota card */}
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
          </div>

          <div className="info-box">
            Your AI finds <strong>{profile?.plan === 'premium' ? '10' : profile?.plan === 'standard' ? '5' : '2'} new matching jobs every day</strong>. Check your applications tab daily for new matches and cover letters.
          </div>

          {pct >= 80 && profile?.plan !== 'premium' && (
            <div className="warn-box">
              Running low on credits.{' '}
              <button className="warn-link" onClick={() => navigate('/pricing')}>Upgrade or buy top-up credits</button>
            </div>
          )}

          {/* Top-up card */}
          <div className="d-card">
            <div className="d-card-title">Top-up credits</div>
            <p style={{ fontSize: 13, color: '#2e4e38', fontFamily: "'DM Mono', monospace", marginBottom: 0, lineHeight: 1.6 }}>
              Credits never expire and work on any plan.
            </p>
            <div className="topup-row">
              <button className="topup-btn-ghost" onClick={() => window.open('https://xautoapplyai.lemonsqueezy.com/checkout/buy/6a62072c-9f2b-4cbb-b37f-0d634828d72a', '_blank')}>
                10 credits — $3
              </button>
              <button className="topup-btn-fill" onClick={() => window.open('https://xautoapplyai.lemonsqueezy.com/checkout/buy/8e9b9d72-bc63-4a2a-bef3-0061f81bb4c8', '_blank')}>
                25 credits — $6
              </button>
            </div>
          </div>

          {/* Quick actions */}
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
      </div>
    </div>
  )
}