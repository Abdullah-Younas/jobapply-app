import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

export default function Landing() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  const testimonials = [
    { text: "I applied to 47 jobs in my first month without spending hours on cover letters. Got 3 interviews in week two.", name: "James Okafor", role: "Software Engineer" },
    { text: "The skill matching is scary accurate. Every job it found me was actually relevant, not the usual random spam.", name: "Priya Sharma", role: "Data Analyst" },
    { text: "I was applying manually for 2 months with zero responses. Nuxply got me an interview in 11 days.", name: "Carlos Mendez", role: "Frontend Developer" },
    { text: "The cover letters don't sound AI at all. My recruiter actually complimented my application email.", name: "Emily Nguyen", role: "UX Designer" },
    { text: "Set it up in 20 minutes, uploaded my CV and forgot about it. Woke up to 8 matched jobs with cover letters ready.", name: "Daniel Kowalski", role: "Full Stack Developer" },
  ]

  return (
    <div className="landing" data-theme={dark ? 'dark' : 'light'}>
      <style>{`
        :root { color-scheme: light dark; }
        [data-theme='light'] {
          --bg: #f8f7f4;
          --bg2: #ffffff;
          --card-dark: #1a1a2e;
          --card-dark2: #16213e;
          --text: #111111;
          --text2: #555555;
          --text3: #888888;
          --border: rgba(0,0,0,0.08);
          --violet: #6c47ff;
          --violet2: #8b6dff;
          --violet-bg: #f0ecff;
          --violet-text: #4a2fd4;
        }
        [data-theme='dark'] {
          --bg: #0d0d14;
          --bg2: #13131f;
          --card-dark: #1a1a2e;
          --card-dark2: #0f0f1a;
          --text: #f0f0f0;
          --text2: #aaaaaa;
          --text3: #666666;
          --border: rgba(255,255,255,0.07);
          --violet: #7c5cff;
          --violet2: #9b7dff;
          --violet-bg: #1e1640;
          --violet-text: #b49dff;
        }
        .landing { background: var(--bg); color: var(--text); font-family: 'Georgia', serif; min-height: 100vh; transition: background 0.3s, color 0.3s; }
        .top-nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 48px; border-bottom: 1px solid var(--border); background: var(--bg2); position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px); }
        .logo { font-size: 20px; font-weight: 700; color: var(--violet); letter-spacing: -0.5px; font-family: Georgia, serif; }
        .nav-links { display: flex; gap: 8px; align-items: center; }
        .nav-btn { padding: 8px 16px; border-radius: 100px; font-size: 13px; border: none; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .nav-ghost { background: transparent; color: var(--text2); }
        .nav-ghost:hover { background: var(--border); color: var(--text); }
        .nav-primary { background: var(--violet); color: white; font-weight: 600; }
        .nav-primary:hover { background: var(--violet2); transform: translateY(-1px); }
        .theme-toggle { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border); background: var(--bg2); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: all 0.2s; }
        .theme-toggle:hover { background: var(--violet-bg); }

        /* Hero */
        .hero { max-width: 1100px; margin: 0 auto; padding: 80px 48px 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .hero-left { }
        .hero-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--violet-bg); color: var(--violet-text); font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 100px; margin-bottom: 24px; font-family: sans-serif; letter-spacing: 0.5px; text-transform: uppercase; }
        .hero-title { font-size: 52px; line-height: 1.1; font-weight: 700; margin: 0 0 20px; letter-spacing: -1.5px; color: var(--text); }
        .hero-title span { color: var(--violet); }
        .hero-sub { font-size: 18px; line-height: 1.7; color: var(--text2); margin: 0 0 36px; font-family: sans-serif; font-weight: 400; }
        .hero-cta { display: flex; gap: 12px; align-items: center; }
        .btn-primary { padding: 14px 28px; background: var(--violet); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: sans-serif; }
        .btn-primary:hover { background: var(--violet2); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(108,71,255,0.3); }
        .btn-ghost { padding: 14px 20px; background: transparent; color: var(--text2); border: 1px solid var(--border); border-radius: 12px; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: sans-serif; }
        .btn-ghost:hover { color: var(--text); border-color: var(--violet); }

        /* Illustration */
        .hero-right { position: relative; }
        .hero-visual { background: var(--card-dark); border-radius: 24px; padding: 32px; border: 1px solid rgba(108,71,255,0.2); position: relative; overflow: hidden; }
        .hero-visual::before { content: ''; position: absolute; top: -40px; right: -40px; width: 180px; height: 180px; background: radial-gradient(circle, rgba(108,71,255,0.25) 0%, transparent 70%); border-radius: 50%; }
        .job-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s; animation: slideIn 0.5s ease forwards; opacity: 0; }
        .job-card:nth-child(1) { animation-delay: 0.1s; }
        .job-card:nth-child(2) { animation-delay: 0.3s; }
        .job-card:nth-child(3) { animation-delay: 0.5s; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .job-info { }
        .job-title-text { font-size: 14px; font-weight: 600; color: #e0e0e0; font-family: sans-serif; margin: 0 0 4px; }
        .job-company { font-size: 12px; color: #888; font-family: sans-serif; }
        .match-pill { background: rgba(108,71,255,0.2); color: #b49dff; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 100px; font-family: sans-serif; white-space: nowrap; }
        .match-pill.high { background: rgba(34,197,94,0.15); color: #4ade80; }
        .visual-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); }
        .visual-stat { text-align: center; }
        .visual-stat-num { font-size: 20px; font-weight: 700; color: var(--violet2); font-family: sans-serif; }
        .visual-stat-label { font-size: 11px; color: #666; font-family: sans-serif; margin-top: 2px; }
        .ai-badge { background: rgba(108,71,255,0.15); border: 1px solid rgba(108,71,255,0.3); color: #b49dff; font-size: 11px; padding: 6px 12px; border-radius: 100px; font-family: sans-serif; font-weight: 600; }

        /* Stats row */
        .stats-row { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--bg2); }
        .stats-inner { max-width: 1100px; margin: 0 auto; padding: 32px 48px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
        .stat-item { text-align: center; padding: 0 24px; border-right: 1px solid var(--border); }
        .stat-item:last-child { border-right: none; }
        .stat-num { font-size: 32px; font-weight: 700; color: var(--violet); letter-spacing: -1px; }
        .stat-label { font-size: 13px; color: var(--text2); font-family: sans-serif; margin-top: 4px; }

        /* Features */
        .features { max-width: 1100px; margin: 0 auto; padding: 80px 48px; }
        .section-label { font-size: 12px; font-weight: 700; color: var(--violet); letter-spacing: 2px; text-transform: uppercase; font-family: sans-serif; margin-bottom: 16px; }
        .section-title { font-size: 40px; font-weight: 700; letter-spacing: -1px; color: var(--text); margin: 0 0 48px; }
        .features-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 16px; }
        .feat-card { background: var(--card-dark); border-radius: 20px; padding: 32px; border: 1px solid rgba(108,71,255,0.1); position: relative; overflow: hidden; }
        .feat-card.light-card { background: var(--bg2); border-color: var(--border); }
        .feat-card::after { content: ''; position: absolute; bottom: -30px; right: -30px; width: 100px; height: 100px; background: radial-gradient(circle, rgba(108,71,255,0.15) 0%, transparent 70%); }
        .feat-num { font-size: 11px; font-weight: 700; color: var(--violet); letter-spacing: 1px; font-family: sans-serif; text-transform: uppercase; margin-bottom: 20px; }
        .feat-title { font-size: 22px; font-weight: 700; color: #e0e0e0; margin: 0 0 12px; line-height: 1.2; }
        .feat-card.light-card .feat-title { color: var(--text); }
        .feat-desc { font-size: 14px; color: #888; line-height: 1.7; font-family: sans-serif; }
        .feat-card.light-card .feat-desc { color: var(--text2); }
        .feat-icon { font-size: 32px; margin-bottom: 20px; display: block; }

        /* How it works */
        .how { max-width: 1100px; margin: 0 auto; padding: 0 48px 80px; }
        .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 48px; }
        .step { background: var(--bg2); border: 1px solid var(--border); padding: 36px 32px; position: relative; }
        .step:first-child { border-radius: 20px 0 0 20px; }
        .step:last-child { border-radius: 0 20px 20px 0; }
        .step-num { font-size: 48px; font-weight: 700; color: var(--violet); opacity: 0.15; font-family: Georgia; line-height: 1; margin-bottom: 16px; }
        .step-title { font-size: 18px; font-weight: 700; color: var(--text); margin: 0 0 10px; font-family: sans-serif; }
        .step-desc { font-size: 14px; color: var(--text2); line-height: 1.7; font-family: sans-serif; }

        /* Testimonials */
        .testimonials { background: var(--bg2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 80px 0; }
        .testimonials-inner { max-width: 1100px; margin: 0 auto; padding: 0 48px; }
        .testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 48px; }
        .testi-card { background: var(--card-dark); border-radius: 16px; padding: 28px; border: 1px solid rgba(255,255,255,0.05); }
        .testi-text { font-size: 15px; line-height: 1.7; color: #ccc; margin: 0 0 20px; font-style: italic; }
        .testi-author { display: flex; align-items: center; gap: 12px; }
        .testi-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--violet); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: white; font-family: sans-serif; flex-shrink: 0; }
        .testi-name { font-size: 13px; font-weight: 700; color: #e0e0e0; font-family: sans-serif; }
        .testi-role { font-size: 12px; color: #666; font-family: sans-serif; }

        /* CTA */
        .cta-section { max-width: 1100px; margin: 0 auto; padding: 80px 48px; text-align: center; }
        .cta-box { background: var(--card-dark); border-radius: 28px; padding: 64px 48px; border: 1px solid rgba(108,71,255,0.2); position: relative; overflow: hidden; }
        .cta-box::before { content: ''; position: absolute; top: -60px; left: 50%; transform: translateX(-50%); width: 300px; height: 300px; background: radial-gradient(circle, rgba(108,71,255,0.2) 0%, transparent 70%); }
        .cta-title { font-size: 44px; font-weight: 700; color: #f0f0f0; margin: 0 0 16px; letter-spacing: -1px; position: relative; }
        .cta-sub { font-size: 17px; color: #888; margin: 0 0 36px; font-family: sans-serif; position: relative; }
        .cta-btns { display: flex; gap: 12px; justify-content: center; position: relative; }

        /* Footer */
        .footer { border-top: 1px solid var(--border); padding: 32px 48px; display: flex; justify-content: space-between; align-items: center; max-width: 1100px; margin: 0 auto; }
        .footer-logo { font-size: 16px; font-weight: 700; color: var(--violet); font-family: Georgia; }
        .footer-text { font-size: 13px; color: var(--text3); font-family: sans-serif; }

        @media (max-width: 768px) {
          .hero { grid-template-columns: 1fr; padding: 40px 24px; }
          .hero-right { display: none; }
          .hero-title { font-size: 36px; }
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
          .features-grid { grid-template-columns: 1fr; }
          .steps { grid-template-columns: 1fr; }
          .testi-grid { grid-template-columns: 1fr; }
          .top-nav { padding: 16px 24px; }
          .features, .how, .cta-section { padding-left: 24px; padding-right: 24px; }
        }
      `}</style>

      {/* Navbar */}
      <nav className="top-nav">
        <div className="logo">Nuxply</div>
        <div className="nav-links">
          <button className="nav-btn nav-ghost" onClick={() => navigate('/pricing')}>Pricing</button>
          <button className="theme-toggle" onClick={() => setDark(d => !d)}>{dark ? '☀️' : '🌙'}</button>
          <button className="nav-btn nav-primary" onClick={() => navigate(session ? '/dashboard' : '/login')}>
            {session ? 'Dashboard' : 'Get started'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge">✦ AI-Powered Job Matching</div>
          <h1 className="hero-title">Your AI finds the <span>right jobs</span> for you</h1>
          <p className="hero-sub">Upload your CV once. Our AI scans thousands of jobs daily, matches ones where you qualify 70%+, and writes personalized cover letters — ready to apply in one click.</p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => navigate(session ? '/dashboard' : '/login')}>
              {session ? 'Go to dashboard' : 'Start for free'}
            </button>
            <button className="btn-ghost" onClick={() => navigate('/pricing')}>See pricing →</button>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-visual">
            <div style={{fontSize:'11px',color:'#666',fontFamily:'sans-serif',marginBottom:'16px',textTransform:'uppercase',letterSpacing:'1px',fontWeight:'700'}}>Today's matches for you</div>
            <div className="job-card">
              <div className="job-info">
                <div className="job-title-text">Senior React Developer</div>
                <div className="job-company">Stripe · Remote</div>
              </div>
              <div className="match-pill high">92% match</div>
            </div>
            <div className="job-card">
              <div className="job-info">
                <div className="job-title-text">Full Stack Engineer</div>
                <div className="job-company">Vercel · Remote</div>
              </div>
              <div className="match-pill high">85% match</div>
            </div>
            <div className="job-card">
              <div className="job-info">
                <div className="job-title-text">Frontend Developer</div>
                <div className="job-company">Linear · Hybrid</div>
              </div>
              <div className="match-pill">78% match</div>
            </div>
            <div className="visual-footer">
              <div className="visual-stat">
                <div className="visual-stat-num">3</div>
                <div className="visual-stat-label">Found today</div>
              </div>
              <div className="visual-stat">
                <div className="visual-stat-num">3</div>
                <div className="visual-stat-label">Letters ready</div>
              </div>
              <div className="ai-badge">✦ AI powered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-row">
        <div className="stats-inner">
          {[
            { num: '70%+', label: 'Skill match threshold' },
            { num: '5 min', label: 'Setup time' },
            { num: 'Daily', label: 'New job matches' },
            { num: '100%', label: 'Personalized letters' },
          ].map(s => (
            <div className="stat-item" key={s.label}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="features">
        <div className="section-label">Why Nuxply</div>
        <div className="section-title">Built different</div>
        <div className="features-grid">
          <div className="feat-card">
            <span className="feat-icon">🎯</span>
            <div className="feat-num">01 — Smart matching</div>
            <div className="feat-title">Only jobs you actually qualify for</div>
            <div className="feat-desc">Our AI reads job requirements and compares them to your skills. If you don't match 70% or more, we skip it. No more applying to roles you'll never hear back from.</div>
          </div>
          <div className="feat-card">
            <span className="feat-icon">✍️</span>
            <div className="feat-num">02 — Cover letters</div>
            <div className="feat-title">Human-sounding, job-specific</div>
            <div className="feat-desc">Each letter is written specifically for that role. Recruiters notice the difference.</div>
          </div>
          <div className="feat-card">
            <span className="feat-icon">📄</span>
            <div className="feat-num">03 — CV upload</div>
            <div className="feat-title">Setup in under 5 minutes</div>
            <div className="feat-desc">Upload your PDF CV and we extract everything automatically. No manual typing.</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how">
        <div className="section-label">How it works</div>
        <div className="section-title">Three steps, then relax</div>
        <div className="steps">
          {[
            { n: '01', title: 'Upload your CV', desc: 'We read your CV and extract your skills, experience and job title automatically.' },
            { n: '02', title: 'AI finds matches', desc: 'Every day our AI scans thousands of jobs and surfaces the ones you qualify for.' },
            { n: '03', title: 'Apply in one click', desc: 'Review your personalized cover letter and apply directly from your dashboard.' },
          ].map(s => (
            <div className="step" key={s.n}>
              <div className="step-num">{s.n}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="testimonials-inner">
          <div className="section-label">What people say</div>
          <div className="section-title">Real results</div>
          <div className="testi-grid">
            {testimonials.slice(0, 3).map((t, i) => (
              <div className="testi-card" key={i}>
                <div className="testi-text">"{t.text}"</div>
                <div className="testi-author">
                  <div className="testi-avatar">{t.name[0]}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="testi-grid" style={{marginTop:'16px', gridTemplateColumns:'repeat(2,1fr)'}}>
            {testimonials.slice(3).map((t, i) => (
              <div className="testi-card" key={i}>
                <div className="testi-text">"{t.text}"</div>
                <div className="testi-author">
                  <div className="testi-avatar">{t.name[0]}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box">
          <h2 className="cta-title">Start finding better jobs today</h2>
          <p className="cta-sub">Free to start. No credit card required.</p>
          <div className="cta-btns">
            <button className="btn-primary" onClick={() => navigate(session ? '/dashboard' : '/login')}>
              {session ? 'Go to dashboard' : 'Get started free'}
            </button>
            <button className="btn-ghost" style={{color:'#aaa',borderColor:'rgba(255,255,255,0.1)'}} onClick={() => navigate('/pricing')}>View pricing</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div style={{borderTop:'1px solid var(--border)'}}>
        <div className="footer">
          <div className="footer-logo">Nuxply</div>
          <div className="footer-text">© 2026 Nuxply. All rights reserved.</div>
          <button className="nav-btn nav-ghost" style={{fontSize:'13px'}} onClick={() => navigate('/pricing')}>Pricing</button>
        </div>
      </div>
    </div>
  )
}