import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo.png'

export default function Profile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [cvSuccess, setCvSuccess] = useState(false)
  const [form, setForm] = useState({
    name: '',
    skills: '',
    experience: '',
    job_title_preference: '',
    job_type: 'any',
    country: '',
    city: ''
  })
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
      const filePath = `${session.user.id}/cv.pdf`
      const { error: uploadError } = await supabase.storage.from('cvs').upload(filePath, file, { upsert: true })
      if (uploadError) throw uploadError
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      const response = await fetch('/api/parse-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64 })
      })
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
      await supabase.from('users').update({
        name: form.name, skills: skillsArray, experience: form.experience,
        job_title_preference: form.job_title_preference, job_type: form.job_type,
        country: form.country, city: form.city
      }).eq('email', session.user.email)
    } else {
      await supabase.from('users').insert({
        name: form.name, email: session.user.email, skills: skillsArray,
        experience: form.experience, job_title_preference: form.job_title_preference,
        job_type: form.job_type, country: form.country, city: form.city,
        plan: 'free', monthly_quota: 10, topup_credits: 0
      })
    }
    setSaving(false)
    setSuccess(true)
    setTimeout(() => navigate('/dashboard'), 1500)
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

        .pr-nav {
          display: flex; justify-content: space-between; align-items: center;
          padding: 18px clamp(24px, 5vw, 48px);
          border-bottom: 1px solid #122018;
          background: rgba(10,10,10,0.9);
          position: sticky; top: 0; z-index: 100;
          backdrop-filter: blur(14px);
        }
        .pr-logo { display: flex; align-items: center; gap: 9px; cursor: pointer; }
        .pr-logo-img { height: 26px; width: 26px; object-fit: contain; }
        .pr-logo-text { font-size: 17px; font-weight: 700; color: #6a9e78; letter-spacing: 0.05em; font-family: 'DM Mono', monospace; }
        .pr-back { font-size: 12px; color: #4a6e54; background: none; border: 1px solid #1a2e1e; border-radius: 8px; cursor: pointer; font-family: 'DM Mono', monospace; padding: 8px 16px; transition: all 0.18s; }
        .pr-back:hover { color: #c9dcc8; border-color: #6a9e78; }

        .pr-body { max-width: 580px; margin: 0 auto; padding: clamp(32px, 5vw, 56px) clamp(20px, 4vw, 40px); }
        .pr-title { font-size: clamp(22px, 3vw, 30px); font-weight: 700; letter-spacing: -0.02em; margin-bottom: 6px; color: #e8e8e8; }
        .pr-sub { font-size: 13px; color: #4a6e54; margin-bottom: 28px; font-family: 'DM Mono', monospace; line-height: 1.6; }

        /* CV Upload box */
        .cv-box {
          background: #0d160f;
          border: 1px dashed #1a2e1e;
          border-radius: 14px;
          padding: 28px 24px;
          text-align: center;
          margin-bottom: 12px;
          transition: border-color 0.18s;
        }
        .cv-box:hover { border-color: #2e4e38; }
        .cv-title { font-size: 13px; font-weight: 700; color: #c9dcc8; font-family: 'DM Mono', monospace; margin-bottom: 5px; }
        .cv-sub { font-size: 11px; color: #2e4e38; font-family: 'DM Mono', monospace; margin-bottom: 18px; line-height: 1.5; }
        .cv-upload-btn {
          display: inline-block; padding: 10px 22px; border-radius: 9px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          font-family: 'DM Mono', monospace; letter-spacing: 0.02em;
          transition: all 0.18s; border: none;
        }
        .cv-upload-btn.idle { background: #6a9e78; color: #fff; }
        .cv-upload-btn.idle:hover { background: #7ab088; box-shadow: 0 4px 14px rgba(106,158,120,0.2); }
        .cv-upload-btn.busy { background: #122018; color: #2e4e38; cursor: default; }
        .cv-success { font-size: 12px; color: #6a9e78; font-family: 'DM Mono', monospace; margin-top: 12px; }

        /* Form card */
        .pr-card {
          background: #0d160f; border: 1px solid #1a2e1e; border-radius: 14px;
          padding: 24px; display: flex; flex-direction: column; gap: 20px;
        }

        .field-wrap { display: flex; flex-direction: column; gap: 6px; }
        .field-label { font-size: 11px; font-weight: 700; color: #4a6e54; font-family: 'DM Mono', monospace; text-transform: uppercase; letter-spacing: 0.08em; }
        .field-hint { font-size: 11px; color: #2e4e38; font-family: 'DM Mono', monospace; margin-top: 3px; line-height: 1.5; }

        .pr-input {
          width: 100%; padding: 11px 14px;
          background: #080808; border: 1px solid #1a2e1e; border-radius: 9px;
          color: #c9dcc8; font-size: 13px; outline: none;
          transition: border-color 0.18s; font-family: 'DM Mono', monospace;
        }
        .pr-input::placeholder { color: #1e3a28; }
        .pr-input:focus { border-color: #6a9e78; }

        .pr-textarea {
          width: 100%; padding: 11px 14px;
          background: #080808; border: 1px solid #1a2e1e; border-radius: 9px;
          color: #c9dcc8; font-size: 13px; outline: none; resize: none;
          transition: border-color 0.18s; font-family: 'DM Mono', monospace;
          line-height: 1.7;
        }
        .pr-textarea::placeholder { color: #1e3a28; }
        .pr-textarea:focus { border-color: #6a9e78; }

        .pr-select {
          width: 100%; padding: 11px 14px;
          background: #080808; border: 1px solid #1a2e1e; border-radius: 9px;
          color: #c9dcc8; font-size: 13px; outline: none;
          transition: border-color 0.18s; font-family: 'DM Mono', monospace;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234a6e54' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          cursor: pointer;
        }
        .pr-select:focus { border-color: #6a9e78; }
        .pr-select option { background: #0d160f; color: #c9dcc8; }

        .divider { height: 1px; background: #122018; }

        .success-msg { font-size: 12px; color: #6a9e78; font-family: 'DM Mono', monospace; text-align: center; padding: 8px 0; }

        .save-btn {
          width: 100%; padding: 14px; background: #6a9e78; color: #fff; border: none;
          border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer;
          transition: all 0.18s; font-family: 'DM Mono', monospace; letter-spacing: 0.02em;
        }
        .save-btn:hover:not(:disabled) { background: #7ab088; box-shadow: 0 4px 16px rgba(106,158,120,0.25); transform: translateY(-1px); }
        .save-btn:disabled { opacity: 0.5; cursor: default; }
      `}</style>

      <nav className="pr-nav">
        <div className="pr-logo" onClick={() => navigate('/')}>
          <img src={logo} alt="Nuxply" className="pr-logo-img" />
          <span className="pr-logo-text">nuxply</span>
        </div>
        <button className="pr-back" onClick={() => navigate('/dashboard')}>← Dashboard</button>
      </nav>

      <div className="pr-body">
        <h1 className="pr-title">Your profile</h1>
        <p className="pr-sub">This info is used to find and match jobs for you automatically.</p>

        {/* CV Upload */}
        <div className="cv-box">
          <div className="cv-title">Upload your CV</div>
          <div className="cv-sub">We'll automatically extract your skills and experience — PDF only</div>
          <label>
            <input type="file" accept=".pdf" onChange={handleCVUpload} style={{ display: 'none' }} disabled={uploading} />
            <span className={`cv-upload-btn ${uploading ? 'busy' : 'idle'}`}>
              {uploading ? 'Reading your CV...' : '↑ Upload PDF'}
            </span>
          </label>
          {cvSuccess && <div className="cv-success">✓ CV processed — skills and experience filled below</div>}
        </div>

        {/* Form */}
        <div className="pr-card">
          <div className="field-wrap">
            <label className="field-label">Full name</label>
            <input className="pr-input" type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Abdullah Khan" />
          </div>

          <div className="field-wrap">
            <label className="field-label">Job title preference</label>
            <input className="pr-input" type="text" value={form.job_title_preference} onChange={e => setForm({ ...form, job_title_preference: e.target.value })} placeholder="Software Developer, Frontend Engineer..." />
          </div>

          <div className="field-wrap">
            <label className="field-label">Your skills</label>
            <input className="pr-input" type="text" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, Python, SQL..." />
            <span className="field-hint">Separate with commas — or upload your CV above to auto-fill</span>
          </div>

          <div className="field-wrap">
            <label className="field-label">Experience summary</label>
            <textarea className="pr-textarea" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} rows={4} placeholder="2 years of experience in web development..." />
          </div>

          <div className="divider" />

          <div className="field-wrap">
            <label className="field-label">Job type preference</label>
            <select className="pr-select" value={form.job_type} onChange={e => setForm({ ...form, job_type: e.target.value })}>
              <option value="any">Any</option>
              <option value="remote">Remote only</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>

          <div className="field-wrap">
            <label className="field-label">Country</label>
            <input className="pr-input" type="text" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="Pakistan, United States..." />
            <span className="field-hint">Leave empty for worldwide search</span>
          </div>

          <div className="field-wrap">
            <label className="field-label">City</label>
            <input className="pr-input" type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Karachi, Lahore, New York..." />
            <span className="field-hint">Only used for hybrid and on-site jobs</span>
          </div>

          <div className="divider" />

          {success && <div className="success-msg">✓ Profile saved — redirecting to dashboard...</div>}

          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </div>
      </div>
    </div>
  )
}