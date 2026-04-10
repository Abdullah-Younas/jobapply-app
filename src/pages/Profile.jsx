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

export default function Profile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [cvSuccess, setCvSuccess] = useState(false)
  const [form, setForm] = useState({ name:'', skills:'', experience:'', job_title_preference:'', job_type:'any', country:'', city:'' })
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data } = await supabase.from('users').select('*').eq('email', session.user.email).maybeSingle()
      if (data) {
        setForm({
          name: data.name ?? session.user.user_metadata?.full_name ?? '',
          skills: data.skills ? data.skills.join(', ') : '',
          experience: data.experience ?? '',
          job_title_preference: data.job_title_preference ?? '',
          job_type: data.job_type ?? 'any',
          country: data.country ?? '',
          city: data.city ?? ''
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleCVUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') { alert('Please upload a PDF file'); return }
    setUploading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      await supabase.storage.from('cvs').upload(`${session.user.id}/cv.pdf`, file, { upsert: true })
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      const response = await fetch('/api/parse-cv', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ base64 }) })
      const data = await response.json()
      const text = data.content[0].text
      const skillsMatch = text.match(/SKILLS:\s*(.+)/i)
      const experienceMatch = text.match(/EXPERIENCE:\s*(.+)/i)
      const jobTitleMatch = text.match(/JOB_TITLE:\s*(.+)/i)
      if (skillsMatch) setForm(prev => ({ ...prev, skills: skillsMatch[1].trim() }))
      if (experienceMatch) setForm(prev => ({ ...prev, experience: experienceMatch[1].trim() }))
      if (jobTitleMatch) setForm(prev => ({ ...prev, job_title_preference: jobTitleMatch[1].trim() }))
      setCvSuccess(true)
      setTimeout(() => setCvSuccess(false), 3000)
    } catch (err) {
      console.error(err)
      alert('Failed to process CV. Please try again.')
    }
    setUploading(false)
  }

  async function handleSave() {
    setSaving(true)
    setSuccess(false)
    const { data: { session } } = await supabase.auth.getSession()
    const skillsArray = form.skills.split(',').map(s => s.trim()).filter(Boolean)
    const { data: existing } = await supabase.from('users').select('id').eq('email', session.user.email).maybeSingle()
    if (existing) {
      await supabase.from('users').update({ name:form.name, skills:skillsArray, experience:form.experience, job_title_preference:form.job_title_preference, job_type:form.job_type, country:form.country, city:form.city }).eq('email', session.user.email)
    } else {
      await supabase.from('users').insert({ name:form.name, email:session.user.email, skills:skillsArray, experience:form.experience, job_title_preference:form.job_title_preference, job_type:form.job_type, country:form.country, city:form.city, plan:'free', monthly_quota:10, topup_credits:0 })
    }
    setSaving(false)
    setSuccess(true)
    setTimeout(() => navigate('/dashboard'), 1500)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  const dockItems = [
    { icon: <IconDashboard />, label: 'Dashboard',    onClick: () => navigate('/dashboard'),    active: false },
    { icon: <IconApps />,      label: 'Applications', onClick: () => navigate('/applications'), active: false },
    { icon: <IconProfile />,   label: 'Profile',      onClick: () => navigate('/profile'),      active: true  },
    { icon: <IconSettings />,  label: 'Settings',     onClick: () => navigate('/settings'),     active: false },
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
        .pr-nav { display:flex; align-items:center; padding:18px clamp(24px,5vw,48px); border-bottom:1px solid #122018; background:rgba(10,10,10,0.9); position:sticky; top:0; z-index:100; backdrop-filter:blur(14px); }
        .pr-logo { display:flex; align-items:center; gap:9px; cursor:pointer; }
        .pr-logo-img { height:26px; width:26px; object-fit:contain; }
        .pr-logo-text { font-size:17px; font-weight:700; color:#6a9e78; letter-spacing:0.05em; font-family:'DM Mono',monospace; }
        .pr-body { max-width:580px; margin:0 auto; padding:clamp(28px,4vw,48px) clamp(20px,4vw,40px); }
        .pr-title { font-size:clamp(22px,3vw,30px); font-weight:700; letter-spacing:-0.02em; margin-bottom:6px; }
        .pr-sub { font-size:13px; color:#4a6e54; margin-bottom:24px; font-family:'DM Mono',monospace; line-height:1.6; }
        .cv-box { background:#0d160f; border:1px dashed #1a2e1e; border-radius:14px; padding:28px 24px; text-align:center; margin-bottom:12px; transition:border-color 0.18s; }
        .cv-box:hover { border-color:#2e4e38; }
        .cv-title { font-size:13px; font-weight:700; color:#c9dcc8; font-family:'DM Mono',monospace; margin-bottom:5px; }
        .cv-sub { font-size:11px; color:#2e4e38; font-family:'DM Mono',monospace; margin-bottom:18px; line-height:1.5; }
        .cv-upload-btn { display:inline-block; padding:10px 22px; border-radius:9px; font-size:12px; font-weight:600; cursor:pointer; font-family:'DM Mono',monospace; letter-spacing:0.02em; transition:all 0.18s; border:none; }
        .cv-upload-btn.idle { background:#6a9e78; color:#fff; }
        .cv-upload-btn.idle:hover { background:#7ab088; }
        .cv-upload-btn.busy { background:#122018; color:#2e4e38; cursor:default; }
        .cv-success { font-size:12px; color:#6a9e78; font-family:'DM Mono',monospace; margin-top:12px; }
        .pr-card { background:#0d160f; border:1px solid #1a2e1e; border-radius:14px; padding:24px; display:flex; flex-direction:column; gap:18px; }
        .field-wrap { display:flex; flex-direction:column; gap:6px; }
        .field-label { font-size:10px; font-weight:700; color:#4a6e54; font-family:'DM Mono',monospace; text-transform:uppercase; letter-spacing:0.08em; }
        .field-hint { font-size:11px; color:#2e4e38; font-family:'DM Mono',monospace; margin-top:2px; line-height:1.5; }
        .pr-input { width:100%; padding:11px 14px; background:#080808; border:1px solid #1a2e1e; border-radius:9px; color:#c9dcc8; font-size:13px; outline:none; transition:border-color 0.18s; font-family:'DM Mono',monospace; }
        .pr-input::placeholder { color:#1e3a28; }
        .pr-input:focus { border-color:#6a9e78; }
        .pr-textarea { width:100%; padding:11px 14px; background:#080808; border:1px solid #1a2e1e; border-radius:9px; color:#c9dcc8; font-size:13px; outline:none; resize:none; transition:border-color 0.18s; font-family:'DM Mono',monospace; line-height:1.7; }
        .pr-textarea::placeholder { color:#1e3a28; }
        .pr-textarea:focus { border-color:#6a9e78; }
        .pr-select { width:100%; padding:11px 14px; background:#080808; border:1px solid #1a2e1e; border-radius:9px; color:#c9dcc8; font-size:13px; outline:none; transition:border-color 0.18s; font-family:'DM Mono',monospace; appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234a6e54' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; cursor:pointer; }
        .pr-select:focus { border-color:#6a9e78; }
        .pr-select option { background:#0d160f; color:#c9dcc8; }
        .divider { height:1px; background:#122018; }
        .success-msg { font-size:12px; color:#6a9e78; font-family:'DM Mono',monospace; text-align:center; padding:6px 0; }
        .save-btn { width:100%; padding:14px; background:#6a9e78; color:#fff; border:none; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.18s; font-family:'DM Mono',monospace; letter-spacing:0.02em; }
        .save-btn:hover:not(:disabled) { background:#7ab088; box-shadow:0 4px 16px rgba(106,158,120,0.25); transform:translateY(-1px); }
        .save-btn:disabled { opacity:0.5; cursor:default; }
      `}</style>

      <nav className="pr-nav">
        <div className="pr-logo" onClick={() => navigate('/')}>
          <img src={logo} alt="Nuxply" className="pr-logo-img" />
          <span className="pr-logo-text">nuxply</span>
        </div>
      </nav>

      <div className="pr-body">
        <h1 className="pr-title">Your profile</h1>
        <p className="pr-sub">This info is used to find and match jobs for you automatically.</p>

        <div className="cv-box">
          <div className="cv-title">Upload your CV</div>
          <div className="cv-sub">We'll automatically extract your skills and experience — PDF only</div>
          <label>
            <input type="file" accept=".pdf" onChange={handleCVUpload} style={{display:'none'}} disabled={uploading} />
            <span className={`cv-upload-btn ${uploading ? 'busy' : 'idle'}`}>{uploading ? 'Reading your CV...' : '↑ Upload PDF'}</span>
          </label>
          {cvSuccess && <div className="cv-success">✓ CV processed — skills and experience filled below</div>}
        </div>

        <div className="pr-card">
          <div className="field-wrap">
            <label className="field-label">Full name</label>
            <input className="pr-input" type="text" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="Abdullah Khan" />
          </div>
          <div className="field-wrap">
            <label className="field-label">Job title preference</label>
            <input className="pr-input" type="text" value={form.job_title_preference} onChange={e => setForm({...form, job_title_preference:e.target.value})} placeholder="e.g. Frontend Developer" />
            <span className="field-hint">Enter one job title only — e.g. "Frontend Developer" not "Developer, Designer"</span>
          </div>
          <div className="field-wrap">
            <label className="field-label">Your skills</label>
            <input className="pr-input" type="text" value={form.skills} onChange={e => setForm({...form, skills:e.target.value})} placeholder="React, Node.js, Python, SQL..." />
            <span className="field-hint">Separate with commas — or upload your CV above to auto-fill</span>
          </div>
          <div className="field-wrap">
            <label className="field-label">Experience summary</label>
            <textarea className="pr-textarea" value={form.experience} onChange={e => setForm({...form, experience:e.target.value})} rows={4} placeholder="2 years of experience in web development..." />
          </div>
          <div className="divider" />
          <div className="field-wrap">
            <label className="field-label">Job type preference</label>
            <select className="pr-select" value={form.job_type} onChange={e => setForm({...form, job_type:e.target.value})}>
              <option value="any">Any</option>
              <option value="remote">Remote only</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>
          <div className="field-wrap">
            <label className="field-label">Country</label>
            <select className="pr-select" value={form.country} onChange={e => setForm({...form, country:e.target.value})}>
              <option value="">Worldwide (no preference)</option>
              <option value="Pakistan">Pakistan</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="Netherlands">Netherlands</option>
              <option value="UAE">UAE</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="India">India</option>
              <option value="Singapore">Singapore</option>
              <option value="Ireland">Ireland</option>
              <option value="Poland">Poland</option>
              <option value="Portugal">Portugal</option>
              <option value="Spain">Spain</option>
              <option value="France">France</option>
              <option value="Sweden">Sweden</option>
              <option value="Denmark">Denmark</option>
              <option value="Norway">Norway</option>
              <option value="Finland">Finland</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Brazil">Brazil</option>
              <option value="Mexico">Mexico</option>
              <option value="Argentina">Argentina</option>
              <option value="Philippines">Philippines</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Kenya">Kenya</option>
              <option value="South Africa">South Africa</option>
            </select>
            <span className="field-hint">Select your country for location-based job matching</span>
          </div>
          <div className="field-wrap">
            <label className="field-label">City</label>
            <input className="pr-input" type="text" value={form.city} onChange={e => setForm({...form, city:e.target.value})} placeholder="Karachi, Lahore, New York..." />
            <span className="field-hint">Only used for hybrid and on-site jobs</span>
          </div>
          <div className="divider" />
          {success && <div className="success-msg">✓ Profile saved — redirecting to dashboard...</div>}
          <button className="save-btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</button>
        </div>
      </div>

      <Dock items={dockItems} panelHeight={68} baseItemSize={52} magnification={72} />
    </div>
  )
}