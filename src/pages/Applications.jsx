import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState(null)
  const [copied, setCopied] = useState(false)
  const [dark, setDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches)
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

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

  const statusStyle = (s) => ({
    sent: { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa' },
    replied: { bg: 'rgba(34,197,94,0.1)', color: '#4ade80' },
    rejected: { bg: 'rgba(248,113,113,0.1)', color: '#f87171' },
  }[s] || { bg: 'var(--border)', color: 'var(--text3)' })

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'var(--bg)',color:'var(--text2)',fontFamily:'sans-serif'}}>Loading...</div>
  )

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text)'}}>
      <style>{`
        .app-nav{display:flex;justify-content:space-between;align-items:center;padding:16px 48px;border-bottom:1px solid var(--border);background:var(--bg2);}
        .app-logo{font-size:20px;font-weight:700;color:var(--violet);cursor:pointer;font-family:Georgia,serif;}
        .back-link{font-size:13px;color:var(--text2);background:none;border:none;cursor:pointer;font-family:sans-serif;}
        .theme-btn{width:36px;height:36px;border-radius:50%;border:1px solid var(--border);background:var(--bg2);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;}
        .app-body{max-width:760px;margin:0 auto;padding:48px 24px;}
        .page-title{font-size:28px;font-weight:700;letter-spacing:-0.5px;margin:0 0 4px;font-family:Georgia,serif;}
        .page-sub{font-size:14px;color:var(--text2);margin:0 0 28px;font-family:sans-serif;}
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:28px;}
        .stat-box{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:16px;text-align:center;}
        .stat-n{font-size:24px;font-weight:700;font-family:Georgia,serif;}
        .stat-l{font-size:12px;color:var(--text3);font-family:sans-serif;margin-top:2px;}
        .empty-box{background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:64px;text-align:center;}
        .app-card{background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:20px;margin-bottom:10px;cursor:pointer;transition:all 0.2s;}
        .app-card:hover{border-color:var(--violet);transform:translateY(-1px);}
        .app-card-top{display:flex;justify-content:space-between;align-items:flex-start;}
        .app-title{font-size:15px;font-weight:700;color:var(--text);font-family:sans-serif;margin:0 0 4px;}
        .app-company{font-size:13px;color:var(--text2);font-family:sans-serif;}
        .app-date{font-size:12px;color:var(--text3);font-family:sans-serif;margin-top:4px;}
        .app-right{display:flex;flex-direction:column;align-items:flex-end;gap:6px;}
        .status-pill{font-size:11px;font-weight:700;padding:4px 10px;border-radius:100px;font-family:sans-serif;text-transform:capitalize;}
        .match-text{font-size:12px;color:var(--text3);font-family:sans-serif;}
        .card-actions{display:flex;gap:8px;margin-top:16px;padding-top:14px;border-top:1px solid var(--border);}
        .view-btn{flex:1;text-align:center;font-size:13px;font-weight:700;background:var(--violet);color:white;border:none;padding:9px;border-radius:10px;cursor:pointer;transition:all 0.2s;font-family:sans-serif;}
        .view-btn:hover{background:var(--violet2);}
        .action-sm{font-size:12px;padding:9px 12px;border:1px solid var(--border);border-radius:10px;cursor:pointer;background:transparent;font-family:sans-serif;transition:all 0.2s;}
        .reply-btn{color:#4ade80;}.reply-btn:hover{background:rgba(74,222,128,0.08);border-color:#4ade80;}
        .reject-btn{color:#f87171;}.reject-btn:hover{background:rgba(248,113,113,0.08);border-color:#f87171;}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;padding:16px;z-index:100;backdrop-filter:blur(4px);}
        .modal-box{background:var(--bg2);border:1px solid var(--border);border-radius:24px;padding:28px;max-width:600px;width:100%;overflow-y:auto;max-height:90vh;}
        .modal-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;}
        .modal-title{font-size:18px;font-weight:700;color:var(--text);font-family:sans-serif;margin:0 0 4px;}
        .modal-company{font-size:14px;color:var(--text2);font-family:sans-serif;}
        .modal-meta{display:flex;align-items:center;gap:8px;margin-top:8px;}
        .close-btn{background:none;border:none;font-size:20px;color:var(--text3);cursor:pointer;padding:4px;line-height:1;}
        .apply-link{display:block;width:100%;text-align:center;background:var(--violet);color:white;padding:13px;border-radius:14px;font-size:14px;font-weight:700;text-decoration:none;transition:all 0.2s;margin-bottom:20px;box-sizing:border-box;}
        .apply-link:hover{background:var(--violet2);}
        .letter-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
        .letter-label{font-size:14px;font-weight:700;color:var(--text);font-family:sans-serif;}
        .copy-btn{font-size:12px;padding:6px 12px;border-radius:8px;border:1px solid var(--border);background:transparent;cursor:pointer;font-family:sans-serif;transition:all 0.2s;}
        .copy-btn.copied{background:rgba(74,222,128,0.1);color:#4ade80;border-color:#4ade80;}
        .copy-btn:not(.copied){color:var(--text2);}
        .letter-box{background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:16px;font-size:14px;color:var(--text2);white-space:pre-wrap;line-height:1.7;font-family:sans-serif;}
        .modal-actions{display:flex;gap:10px;margin-top:20px;padding-top:16px;border-top:1px solid var(--border);}
        .modal-action-btn{flex:1;padding:11px;border-radius:12px;font-size:13px;font-weight:700;cursor:pointer;font-family:sans-serif;border:1px solid var(--border);background:transparent;transition:all 0.2s;}
        .modal-reply{color:#4ade80;}.modal-reply:hover{background:rgba(74,222,128,0.08);border-color:#4ade80;}
        .modal-reject{color:#f87171;}.modal-reject:hover{background:rgba(248,113,113,0.08);border-color:#f87171;}
      `}</style>

      <nav className="app-nav">
        <div className="app-logo" onClick={() => navigate('/')}>Nuxply</div>
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <button className="back-link" onClick={() => navigate('/dashboard')}>Back to dashboard</button>
          <button className="theme-btn" onClick={() => setDark(d => !d)}>{dark ? '☀️' : '🌙'}</button>
        </div>
      </nav>

      <div className="app-body">
        <h1 className="page-title">Your matches</h1>
        <p className="page-sub">Review your AI-matched jobs and apply with your personalized cover letter.</p>

        <div className="stats-grid">
          {[
            { label: 'Total', value: applications.length, color: 'var(--text)' },
            { label: 'Found', value: applications.filter(a => a.status === 'sent').length, color: '#60a5fa' },
            { label: 'Replied', value: applications.filter(a => a.status === 'replied').length, color: '#4ade80' },
            { label: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, color: '#f87171' },
          ].map(s => (
            <div className="stat-box" key={s.label}>
              <div className="stat-n" style={{color:s.color}}>{s.value}</div>
              <div className="stat-l">{s.label}</div>
            </div>
          ))}
        </div>

        {applications.length === 0 ? (
          <div className="empty-box">
            <div style={{fontSize:'16px',color:'var(--text2)',fontFamily:'sans-serif',marginBottom:'6px'}}>No matches yet</div>
            <div style={{fontSize:'13px',color:'var(--text3)',fontFamily:'sans-serif'}}>Your AI will find matching jobs and show them here daily.</div>
          </div>
        ) : (
          applications.map(app => {
            const s = statusStyle(app.status)
            return (
              <div className="app-card" key={app.id} onClick={() => setSelectedApp(app)}>
                <div className="app-card-top">
                  <div>
                    <div className="app-title">{app.job_title}</div>
                    <div className="app-company">{app.company}</div>
                    <div className="app-date">{new Date(app.sent_at).toLocaleDateString()}</div>
                  </div>
                  <div className="app-right">
                    <span className="status-pill" style={{background:s.bg,color:s.color}}>
                      {app.status === 'sent' ? 'found' : app.status}
                    </span>
                    <span className="match-text">{app.match_score}% match</span>
                  </div>
                </div>
                <div className="card-actions">
                  <button className="view-btn" onClick={e => { e.stopPropagation(); setSelectedApp(app) }}>View and Apply</button>
                  <button className="action-sm reply-btn" onClick={e => { e.stopPropagation(); updateStatus(app.id, 'replied') }}>Got reply</button>
                  <button className="action-sm reject-btn" onClick={e => { e.stopPropagation(); updateStatus(app.id, 'rejected') }}>Rejected</button>
                </div>
              </div>
            )
          })
        )}
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
                    <span className="status-pill" style={{background:s.bg,color:s.color,fontSize:'11px',padding:'3px 10px'}}>
                      {selectedApp.status === 'sent' ? 'found' : selectedApp.status}
                    </span>
                    <span style={{fontSize:'12px',color:'var(--text3)',fontFamily:'sans-serif'}}>{selectedApp.match_score}% match</span>
                  </div>
                </div>
                <button className="close-btn" onClick={() => setSelectedApp(null)}>x</button>
              </div>
              {selectedApp.job_url && (
                <a href={selectedApp.job_url} target="_blank" rel="noreferrer" className="apply-link">Open job listing and apply</a>
              )}
              <div>
                <div className="letter-header">
                  <div className="letter-label">Your cover letter</div>
                  <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={() => copyToClipboard(selectedApp.cover_letter)}>
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="letter-box">{selectedApp.cover_letter ?? 'Cover letter not available.'}</div>
              </div>
              <div className="modal-actions">
                <button className="modal-action-btn modal-reply" onClick={() => updateStatus(selectedApp.id, 'replied')}>Got a reply</button>
                <button className="modal-action-btn modal-reject" onClick={() => updateStatus(selectedApp.id, 'rejected')}>Mark rejected</button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}