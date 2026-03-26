import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo.png'
import Dock from './Dock'

// Shared dock SVG icons
const IconDashboard = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
const IconApps = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
const IconProfile = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
const IconSettings = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
const IconSignOut = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState(null)
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data: profile } = await supabase.from('users').select('id').eq('email', session.user.email).maybeSingle()
      if (!profile) { setLoading(false); return }
      const { data } = await supabase.from('applications').select('*').eq('user_id', profile.id).order('sent_at', { ascending: false })
      setApplications(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function updateStatus(id, status) {
    await supabase.from('applications').update({ status }).eq('id', id)
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    if (selectedApp?.id === id) setSelectedApp(prev => ({ ...prev, status }))
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  const statusStyle = (s) => ({
    sent:     { bg: 'rgba(106,158,120,0.08)', color: '#6a9e78',  border: '#1a2e1e' },
    replied:  { bg: 'rgba(201,220,200,0.1)',  color: '#c9dcc8',  border: '#2e4e38' },
    rejected: { bg: 'rgba(248,113,113,0.08)', color: '#f87171',  border: 'rgba(248,113,113,0.2)' },
  }[s] || { bg: '#111', color: '#4a6e54', border: '#1a2e1e' })

  const dockItems = [
    { icon: <IconDashboard />, label: 'Dashboard',   onClick: () => navigate('/dashboard'),   active: false },
    { icon: <IconApps />,      label: 'Applications',onClick: () => navigate('/applications'),active: true  },
    { icon: <IconProfile />,   label: 'Profile',     onClick: () => navigate('/profile'),     active: false },
    { icon: <IconSettings />,  label: 'Settings',    onClick: () => navigate('/settings'),    active: false },
    { icon: <IconSignOut />,   label: 'Sign out',    onClick: handleSignOut,                  active: false },
  ]

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0a0a0a', color:'#4a6e54', fontFamily:"'DM Mono', monospace", fontSize:13 }}>Loading...</div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', color:'#e8e8e8', fontFamily:"'Georgia', serif", paddingBottom: 100 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        .a-nav { display:flex; justify-content:space-between; align-items:center; padding:18px clamp(24px,5vw,48px); border-bottom:1px solid #122018; background:rgba(10,10,10,0.9); position:sticky; top:0; z-index:100; backdrop-filter:blur(14px); }
        .a-logo { display:flex; align-items:center; gap:9px; cursor:pointer; }
        .a-logo-img { height:26px; width:26px; object-fit:contain; }
        .a-logo-text { font-size:17px; font-weight:700; color:#6a9e78; letter-spacing:0.05em; font-family:'DM Mono',monospace; }
        .a-body { max-width:760px; margin:0 auto; padding:clamp(28px,4vw,48px) clamp(20px,4vw,40px); }
        .a-title { font-size:clamp(22px,3vw,30px); font-weight:700; letter-spacing:-0.02em; margin-bottom:6px; }
        .a-sub { font-size:13px; color:#4a6e54; margin-bottom:24px; font-family:'DM Mono',monospace; }
        .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:24px; }
        .stat-box { background:#0d160f; border:1px solid #1a2e1e; border-radius:12px; padding:16px; text-align:center; }
        .stat-n { font-size:24px; font-weight:700; font-family:'DM Mono',monospace; }
        .stat-l { font-size:10px; color:#2e4e38; font-family:'DM Mono',monospace; margin-top:4px; text-transform:uppercase; letter-spacing:0.06em; }
        .empty-box { background:#0d160f; border:1px solid #1a2e1e; border-radius:14px; padding:56px; text-align:center; }
        .app-card { background:#0d160f; border:1px solid #1a2e1e; border-radius:14px; padding:18px 20px; margin-bottom:10px; cursor:pointer; transition:all 0.18s; }
        .app-card:hover { border-color:#2e4e38; transform:translateY(-1px); }
        .app-card-top { display:flex; justify-content:space-between; align-items:flex-start; }
        .app-title-text { font-size:15px; font-weight:700; color:#c9dcc8; font-family:'DM Mono',monospace; margin-bottom:4px; }
        .app-company { font-size:12px; color:#4a6e54; font-family:'DM Mono',monospace; }
        .app-date { font-size:11px; color:#2e4e38; font-family:'DM Mono',monospace; margin-top:4px; }
        .app-right { display:flex; flex-direction:column; align-items:flex-end; gap:6px; flex-shrink:0; margin-left:12px; }
        .status-pill { font-size:10px; font-weight:700; padding:3px 10px; border-radius:6px; font-family:'DM Mono',monospace; text-transform:uppercase; letter-spacing:0.05em; border:1px solid; }
        .match-text { font-size:11px; color:#2e4e38; font-family:'DM Mono',monospace; }
        .card-actions { display:flex; gap:8px; margin-top:14px; padding-top:12px; border-top:1px solid #122018; }
        .view-btn { flex:1; text-align:center; font-size:12px; font-weight:700; background:#6a9e78; color:#fff; border:none; padding:9px; border-radius:8px; cursor:pointer; transition:all 0.18s; font-family:'DM Mono',monospace; }
        .view-btn:hover { background:#7ab088; }
        .action-sm { font-size:12px; padding:9px 12px; border:1px solid #1a2e1e; border-radius:8px; cursor:pointer; background:transparent; font-family:'DM Mono',monospace; transition:all 0.18s; }
        .reply-btn { color:#4a6e54; } .reply-btn:hover { background:rgba(106,158,120,0.08); border-color:#6a9e78; color:#c9dcc8; }
        .reject-btn { color:#4a2e2e; } .reject-btn:hover { background:rgba(248,113,113,0.06); border-color:rgba(248,113,113,0.3); color:#f87171; }
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; padding:16px; z-index:200; backdrop-filter:blur(6px); }
        .modal-box { background:#0d160f; border:1px solid #1a2e1e; border-radius:20px; padding:28px; max-width:600px; width:100%; overflow-y:auto; max-height:90vh; }
        .modal-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; }
        .modal-title { font-size:17px; font-weight:700; color:#c9dcc8; font-family:'DM Mono',monospace; margin-bottom:4px; }
        .modal-company { font-size:13px; color:#4a6e54; font-family:'DM Mono',monospace; }
        .modal-meta { display:flex; align-items:center; gap:10px; margin-top:8px; }
        .close-btn { background:none; border:none; font-size:18px; color:#2e4e38; cursor:pointer; padding:4px; line-height:1; transition:color 0.15s; }
        .close-btn:hover { color:#6a9e78; }
        .apply-link { display:block; width:100%; text-align:center; background:#6a9e78; color:#fff; padding:13px; border-radius:12px; font-size:13px; font-weight:700; text-decoration:none; transition:all 0.18s; margin-bottom:20px; font-family:'DM Mono',monospace; letter-spacing:0.02em; }
        .apply-link:hover { background:#7ab088; }
        .letter-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
        .letter-label { font-size:13px; font-weight:700; color:#c9dcc8; font-family:'DM Mono',monospace; }
        .copy-btn { font-size:11px; padding:5px 12px; border-radius:7px; border:1px solid #1a2e1e; background:transparent; cursor:pointer; font-family:'DM Mono',monospace; transition:all 0.18s; color:#4a6e54; }
        .copy-btn:hover { border-color:#6a9e78; color:#c9dcc8; }
        .copy-btn.copied { background:rgba(106,158,120,0.1); color:#6a9e78; border-color:#6a9e78; }
        .letter-box { background:#080808; border:1px solid #122018; border-radius:10px; padding:16px; font-size:13px; color:#4a6e54; white-space:pre-wrap; line-height:1.75; font-family:'DM Mono',monospace; }
        .modal-actions { display:flex; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #122018; }
        .modal-action-btn { flex:1; padding:11px; border-radius:10px; font-size:12px; font-weight:700; cursor:pointer; font-family:'DM Mono',monospace; border:1px solid #1a2e1e; background:transparent; transition:all 0.18s; }
        .modal-reply { color:#4a6e54; } .modal-reply:hover { background:rgba(106,158,120,0.08); border-color:#6a9e78; color:#c9dcc8; }
        .modal-reject { color:#4a2e2e; } .modal-reject:hover { background:rgba(248,113,113,0.06); border-color:rgba(248,113,113,0.3); color:#f87171; }
        @media(max-width:560px) { .stats-grid { grid-template-columns:repeat(2,1fr); } }
      `}</style>

      <nav className="a-nav">
        <div className="a-logo" onClick={() => navigate('/')}>
          <img src={logo} alt="Nuxply" className="a-logo-img" />
          <span className="a-logo-text">nuxply</span>
        </div>
      </nav>

      <div className="a-body">
        <h1 className="a-title">Your matches</h1>
        <p className="a-sub">Review AI-matched jobs and apply with your personalized cover letter.</p>

        <div className="stats-grid">
          {[
            { label:'Total',    value:applications.length,                                     color:'#c9dcc8' },
            { label:'Found',    value:applications.filter(a=>a.status==='sent').length,         color:'#6a9e78' },
            { label:'Replied',  value:applications.filter(a=>a.status==='replied').length,      color:'#c9dcc8' },
            { label:'Rejected', value:applications.filter(a=>a.status==='rejected').length,     color:'#f87171' },
          ].map(s => (
            <div className="stat-box" key={s.label}>
              <div className="stat-n" style={{color:s.color}}>{s.value}</div>
              <div className="stat-l">{s.label}</div>
            </div>
          ))}
        </div>

        {applications.length === 0 ? (
          <div className="empty-box">
            <div style={{fontSize:15,color:'#4a6e54',fontFamily:"'DM Mono',monospace",marginBottom:6}}>No matches yet</div>
            <div style={{fontSize:12,color:'#2e4e38',fontFamily:"'DM Mono',monospace"}}>Your AI will find matching jobs and show them here daily.</div>
          </div>
        ) : applications.map(app => {
          const s = statusStyle(app.status)
          return (
            <div className="app-card" key={app.id} onClick={() => setSelectedApp(app)}>
              <div className="app-card-top">
                <div>
                  <div className="app-title-text">{app.job_title}</div>
                  <div className="app-company">{app.company}</div>
                  <div className="app-date">{new Date(app.sent_at).toLocaleDateString()}</div>
                </div>
                <div className="app-right">
                  <span className="status-pill" style={{background:s.bg,color:s.color,borderColor:s.border}}>
                    {app.status === 'sent' ? 'found' : app.status}
                  </span>
                  <span className="match-text">{app.match_score}% match</span>
                </div>
              </div>
              <div className="card-actions">
                <button className="view-btn" onClick={e=>{e.stopPropagation();setSelectedApp(app)}}>View & Apply</button>
                <button className="action-sm reply-btn" onClick={e=>{e.stopPropagation();updateStatus(app.id,'replied')}}>Got reply</button>
                <button className="action-sm reject-btn" onClick={e=>{e.stopPropagation();updateStatus(app.id,'rejected')}}>Rejected</button>
              </div>
            </div>
          )
        })}
      </div>

      {selectedApp && (() => {
        const s = statusStyle(selectedApp.status)
        return (
          <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <div className="modal-title">{selectedApp.job_title}</div>
                  <div className="modal-company">{selectedApp.company}</div>
                  <div className="modal-meta">
                    <span className="status-pill" style={{background:s.bg,color:s.color,borderColor:s.border}}>{selectedApp.status==='sent'?'found':selectedApp.status}</span>
                    <span style={{fontSize:11,color:'#2e4e38',fontFamily:"'DM Mono',monospace"}}>{selectedApp.match_score}% match</span>
                  </div>
                </div>
                <button className="close-btn" onClick={() => setSelectedApp(null)}>✕</button>
              </div>
              {selectedApp.job_url && <a href={selectedApp.job_url} target="_blank" rel="noreferrer" className="apply-link">Open job listing and apply →</a>}
              <div>
                <div className="letter-header">
                  <div className="letter-label">Your cover letter</div>
                  <button className={`copy-btn ${copied?'copied':''}`} onClick={() => copyToClipboard(selectedApp.cover_letter)}>{copied?'Copied!':'Copy'}</button>
                </div>
                <div className="letter-box">{selectedApp.cover_letter ?? 'Cover letter not available.'}</div>
              </div>
              <div className="modal-actions">
                <button className="modal-action-btn modal-reply" onClick={() => updateStatus(selectedApp.id,'replied')}>Got a reply</button>
                <button className="modal-action-btn modal-reject" onClick={() => updateStatus(selectedApp.id,'rejected')}>Mark rejected</button>
              </div>
            </div>
          </div>
        )
      })()}

      <Dock items={dockItems} panelHeight={68} baseItemSize={52} magnification={72} />
    </div>
  )
}