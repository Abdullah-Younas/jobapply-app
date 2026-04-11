import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo.png'

const testimonials = [
  { text: "I applied to 47 jobs in my first month without spending hours on cover letters. Got 3 interviews in week two.", name: "James Okafor", role: "Software Engineer" },
  { text: "The skill matching is scary accurate. Every job it found me was actually relevant, not the usual random spam.", name: "Priya Sharma", role: "Data Analyst" },
  { text: "I was applying manually for 2 months with zero responses. Nuxply got me an interview in 11 days.", name: "Carlos Mendez", role: "Frontend Developer" },
  { text: "The cover letters don't sound AI at all. My recruiter actually complimented my application email.", name: "Emily Nguyen", role: "UX Designer" },
  { text: "Set it up in 20 minutes, uploaded my CV and forgot about it. Woke up to 8 matched jobs with cover letters ready.", name: "Daniel Kowalski", role: "Full Stack Developer" },
]

export default function Landing() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  return (
    <div className="landing">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── BRAND TOKENS ── */
        :root {
          --sage: #6a9e78;
          --sage-hover: #7ab088;
          --mist: #c9dcc8;
          --mist-dim: #b8ccb7;
          --bg: #0a0a0a;
          --bg2: #080808;
          --card: #0d160f;
          --border: #1a2e1e;
          --border-dim: #122018;
          --text: #e8e8e8;
          --text2: #c9dcc8;
          --text3: #6a9e78;
          --text4: #4a6e54;
          --text5: #2e4e38;
        }

        .landing {
          background: var(--bg);
          color: var(--text);
          font-family: 'Georgia', serif;
          min-height: 100vh;
        }

        /* ── NAV ── */
        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px clamp(24px, 5vw, 56px);
          border-bottom: 1px solid var(--border-dim);
          background: rgba(10,10,10,0.88);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(14px);
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 9px;
          cursor: pointer;
          text-decoration: none;
        }
        .logo-img {
          height: 28px;
          width: 28px;
          object-fit: contain;
        }
        .logo-text {
          font-size: 17px;
          font-weight: 700;
          color: var(--sage);
          letter-spacing: 0.05em;
          font-family: 'DM Mono', monospace;
        }
        .nav-links { display: flex; gap: 8px; align-items: center; }
        .nav-ghost {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text4);
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.02em;
        }
        .nav-ghost:hover { color: var(--mist); border-color: var(--sage); background: rgba(106,158,120,0.06); }
        .nav-primary {
          padding: 8px 18px;
          background: var(--sage);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.02em;
        }
        .nav-primary:hover { background: var(--sage-hover); transform: translateY(-1px); }

        /* ── HERO ── */
        .hero {
          max-width: 1080px;
          margin: 0 auto;
          padding: clamp(60px, 10vw, 110px) clamp(24px, 5vw, 56px) clamp(60px, 8vw, 90px);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(40px, 6vw, 80px);
          align-items: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(106,158,120,0.08);
          border: 1px solid var(--border);
          color: var(--text3);
          font-size: 11px;
          font-weight: 500;
          padding: 5px 13px;
          border-radius: 6px;
          margin-bottom: 28px;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .hero-badge span { color: var(--mist); }
        .hero-title {
          font-size: clamp(36px, 5vw, 58px);
          line-height: 1.08;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text);
          margin-bottom: 22px;
        }
        .hero-title em {
          font-style: italic;
          color: var(--mist);
        }
        .hero-sub {
          font-size: clamp(14px, 1.4vw, 16px);
          line-height: 1.75;
          color: var(--text4);
          margin-bottom: 40px;
          font-family: 'DM Mono', monospace;
          font-weight: 400;
        }
        .hero-cta { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .btn-primary {
          padding: 12px 24px;
          background: var(--sage);
          color: #fff;
          border: none;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.01em;
        }
        .btn-primary:hover { background: var(--sage-hover); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(106,158,120,0.25); }
        .btn-ghost-hero {
          padding: 12px 20px;
          background: transparent;
          color: var(--text4);
          border: 1px solid var(--border);
          border-radius: 9px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.01em;
        }
        .btn-ghost-hero:hover { color: var(--mist); border-color: var(--sage); }

        /* Hero visual */
        .hero-visual {
          background: var(--card);
          border-radius: 18px;
          padding: clamp(22px, 3vw, 32px);
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }
        .hero-visual::before {
          content: '';
          position: absolute;
          top: -50px; right: -50px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(106,158,120,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .visual-label {
          font-size: 10px;
          color: var(--text5);
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }
        .job-card {
          background: #0a0a0a;
          border: 1px solid var(--border-dim);
          border-radius: 11px;
          padding: 14px 16px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: fadeUp 0.5s ease forwards;
          opacity: 0;
        }
        .job-card:nth-child(2) { animation-delay: 0.1s; }
        .job-card:nth-child(3) { animation-delay: 0.25s; }
        .job-card:nth-child(4) { animation-delay: 0.4s; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .job-title-text { font-size: 13px; font-weight: 600; color: var(--mist); font-family: 'DM Mono', monospace; margin-bottom: 3px; }
        .job-company { font-size: 11px; color: var(--text5); font-family: 'DM Mono', monospace; }
        .match-pill {
          background: rgba(106,158,120,0.1);
          border: 1px solid rgba(106,158,120,0.2);
          color: var(--text4);
          font-size: 11px;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 6px;
          font-family: 'DM Mono', monospace;
          white-space: nowrap;
        }
        .match-pill.high {
          background: rgba(201,220,200,0.08);
          border-color: rgba(201,220,200,0.18);
          color: var(--text3);
        }
        .visual-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid var(--border-dim);
        }
        .visual-stat-num { font-size: 19px; font-weight: 700; color: var(--sage); font-family: 'DM Mono', monospace; }
        .visual-stat-label { font-size: 10px; color: var(--text5); font-family: 'DM Mono', monospace; margin-top: 2px; letter-spacing: 0.04em; }
        .ai-badge {
          background: rgba(106,158,120,0.08);
          border: 1px solid var(--border);
          color: var(--text4);
          font-size: 10px;
          padding: 5px 11px;
          border-radius: 6px;
          font-family: 'DM Mono', monospace;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        /* ── STATS ── */
        .stats-row {
          border-top: 1px solid var(--border-dim);
          border-bottom: 1px solid var(--border-dim);
          background: var(--bg2);
        }
        .stats-inner {
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 clamp(24px, 5vw, 56px);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .stat-item {
          text-align: center;
          padding: 36px 20px;
          border-right: 1px solid var(--border-dim);
        }
        .stat-item:last-child { border-right: none; }
        .stat-num { font-size: 30px; font-weight: 700; color: var(--mist); letter-spacing: -0.04em; font-family: 'DM Mono', monospace; }
        .stat-label { font-size: 11px; color: var(--text4); font-family: 'DM Mono', monospace; margin-top: 6px; letter-spacing: 0.04em; text-transform: uppercase; }

        /* ── SECTIONS ── */
        .section-wrap { max-width: 1080px; margin: 0 auto; padding: clamp(60px, 8vw, 90px) clamp(24px, 5vw, 56px); }
        .section-eyebrow {
          font-size: 10px;
          font-weight: 700;
          color: var(--text3);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-family: 'DM Mono', monospace;
          margin-bottom: 14px;
        }
        .section-title {
          font-size: clamp(30px, 3.8vw, 46px);
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text);
          margin-bottom: clamp(36px, 5vw, 56px);
          line-height: 1.1;
        }

        /* ── FEATURES ── */
        .features-grid {
          display: grid;
          grid-template-columns: 1.35fr 1fr 1fr;
          gap: 12px;
        }
        .feat-card {
          background: var(--card);
          border-radius: 16px;
          padding: clamp(24px, 3vw, 36px);
          border: 1px solid var(--border-dim);
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .feat-card:hover { border-color: var(--border); }
        .feat-icon { font-size: 28px; margin-bottom: 22px; display: block; }
        .feat-num {
          font-size: 10px;
          font-weight: 700;
          color: var(--text5);
          letter-spacing: 0.08em;
          font-family: 'DM Mono', monospace;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .feat-title { font-size: clamp(17px, 1.7vw, 21px); font-weight: 700; color: var(--mist); margin-bottom: 14px; line-height: 1.25; }
        .feat-desc { font-size: 13.5px; color: var(--text4); line-height: 1.8; font-family: 'DM Mono', monospace; }

        /* ── HOW IT WORKS ── */
        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: clamp(36px, 5vw, 56px);
        }
        .step {
          background: var(--card);
          border: 1px solid var(--border-dim);
          padding: clamp(28px, 3.5vw, 40px) clamp(24px, 3vw, 36px);
          transition: border-color 0.2s;
        }
        .step:first-child { border-radius: 14px; }
        .step:last-child { border-radius: 14px; }
        .step { border-radius: 14px; }
        .step:hover { border-color: var(--border); }
        .step-num {
          font-size: 44px;
          font-weight: 700;
          color: rgba(106,158,120,0.15);
          font-family: 'DM Mono', monospace;
          line-height: 1;
          margin-bottom: 20px;
        }
        .step-title { font-size: 17px; font-weight: 700; color: var(--mist); margin-bottom: 12px; font-family: 'DM Mono', monospace; }
        .step-desc { font-size: 13.5px; color: var(--text4); line-height: 1.8; font-family: 'DM Mono', monospace; }

        /* ── TESTIMONIALS ── */
        .testimonials-section {
          background: var(--bg2);
          border-top: 1px solid var(--border-dim);
          border-bottom: 1px solid var(--border-dim);
        }
        .testi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: clamp(36px, 5vw, 56px);
        }
        .testi-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 12px;
        }
        .testi-card {
          background: var(--card);
          border-radius: 14px;
          padding: clamp(22px, 2.5vw, 30px);
          border: 1px solid var(--border-dim);
          transition: border-color 0.2s;
        }
        .testi-card:hover { border-color: var(--border); }
        .testi-text {
          font-size: clamp(13px, 1.2vw, 15px);
          line-height: 1.72;
          color: var(--text4);
          margin-bottom: 22px;
          font-style: italic;
        }
        .testi-author { display: flex; align-items: center; gap: 12px; }
        .testi-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: rgba(106,158,120,0.1);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: var(--sage);
          font-family: 'DM Mono', monospace;
          flex-shrink: 0;
        }
        .testi-name { font-size: 12px; font-weight: 700; color: var(--text3); font-family: 'DM Mono', monospace; }
        .testi-role { font-size: 11px; color: var(--text5); font-family: 'DM Mono', monospace; margin-top: 2px; }

        /* ── CTA ── */
        .cta-section { max-width: 1080px; margin: 0 auto; padding: clamp(60px, 8vw, 90px) clamp(24px, 5vw, 56px); }
        .cta-box {
          background: var(--card);
          border-radius: 20px;
          padding: clamp(48px, 7vw, 72px) clamp(32px, 5vw, 60px);
          border: 1px solid var(--border);
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cta-box::before {
          content: '';
          position: absolute;
          top: -80px; left: 50%; transform: translateX(-50%);
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(106,158,120,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-title {
          font-size: clamp(26px, 3.5vw, 44px);
          font-weight: 700;
          color: var(--text);
          margin-bottom: 14px;
          letter-spacing: -0.03em;
          position: relative;
        }
        .cta-sub {
          font-size: 13px;
          color: var(--text4);
          margin-bottom: 36px;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.02em;
          position: relative;
        }
        .cta-btns { display: flex; gap: 12px; justify-content: center; position: relative; flex-wrap: wrap; }

        /* ── FOOTER ── */
        .footer-bar { border-top: 1px solid var(--border-dim); }
        .footer-inner {
          max-width: 1080px;
          margin: 0 auto;
          padding: 28px clamp(24px, 5vw, 56px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          color: var(--sage);
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.05em;
        }
        .footer-logo-img { height: 20px; width: 20px; object-fit: contain; }
        .footer-links { display: flex; gap: 24px; align-items: center; flex-wrap: wrap; }
        .footer-link { font-size: 11px; color: var(--text5); font-family: 'DM Mono', monospace; text-decoration: none; transition: color 0.15s; letter-spacing: 0.03em; cursor: pointer; background: none; border: none; }
        .footer-link:hover { color: var(--text3); }
        .footer-copy { font-size: 11px; color: var(--text5); font-family: 'DM Mono', monospace; letter-spacing: 0.02em; }

        /* ── RESPONSIVE ── */
        @media (max-width: 860px) {
          .hero { grid-template-columns: 1fr; }
          .hero-right { display: none; }
          .features-grid { grid-template-columns: 1fr; }
          .steps { grid-template-columns: 1fr; gap: 2px; }
          .step:first-child { border-radius: 14px; }
          .step:last-child { border-radius: 14px; }
          .testi-grid { grid-template-columns: 1fr; }
          .testi-grid-2 { grid-template-columns: 1fr; }
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
          .stat-item:nth-child(2) { border-right: none; }
          .stat-item:nth-child(3) { border-top: 1px solid var(--border-dim); }
          .stat-item:nth-child(4) { border-top: 1px solid var(--border-dim); border-right: none; }
        }
        @media (max-width: 480px) {
          .cta-btns { flex-direction: column; align-items: center; }
          .footer-inner { flex-direction: column; align-items: flex-start; gap: 20px; }
        }
      `}</style>

      {/* NAV */}
      <nav className="top-nav">
        <div className="logo" onClick={() => navigate('/')}>
          <img src={logo} alt="Nuxply" className="logo-img" />
          <span className="logo-text">Nuxply</span>
        </div>
        <div className="nav-links">
          <button className="nav-ghost" onClick={() => navigate('/pricing')}>Pricing</button>
          <button className="nav-primary" onClick={() => navigate(session ? '/dashboard' : '/login')}>
            {session ? 'Dashboard' : 'Get started'}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge"><span>✦</span> AI-powered job matching</div>
          <h1 className="hero-title">Your AI finds the <em>right jobs</em> for you</h1>
          <p className="hero-sub">Upload your CV once. Our AI scans thousands of jobs daily, matches ones where you qualify 75%+, and writes personalized cover letters — ready to apply in one click.</p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => navigate(session ? '/dashboard' : '/login')}>
              {session ? 'Go to dashboard' : 'Start for free'}
            </button>
            <button className="btn-ghost-hero" onClick={() => navigate('/pricing')}>See pricing →</button>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-visual">
            <div className="visual-label">Today's matches for you</div>
            <div className="job-card">
              <div><div className="job-title-text">Senior React Developer</div><div className="job-company">Stripe · Remote</div></div>
              <div className="match-pill high">92% match</div>
            </div>
            <div className="job-card">
              <div><div className="job-title-text">Full Stack Engineer</div><div className="job-company">Vercel · Remote</div></div>
              <div className="match-pill high">85% match</div>
            </div>
            <div className="job-card">
              <div><div className="job-title-text">Frontend Developer</div><div className="job-company">Linear · Hybrid</div></div>
              <div className="match-pill">78% match</div>
            </div>
            <div className="visual-footer">
              <div><div className="visual-stat-num">3</div><div className="visual-stat-label">Found today</div></div>
              <div><div className="visual-stat-num">3</div><div className="visual-stat-label">Letters ready</div></div>
              <div className="ai-badge">✦ AI powered</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-row">
        <div className="stats-inner">
          {[
            { num: '75%+', label: 'Skill match threshold' },
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

      {/* FEATURES */}
      <section className="section-wrap">
        <div className="section-eyebrow">Why Nuxply</div>
        <div className="section-title">Built different</div>
        <div className="features-grid">
          <div className="feat-card">
            <span className="feat-icon">🎯</span>
            <div className="feat-num">01 — Smart matching</div>
            <div className="feat-title">Only jobs you actually qualify for</div>
            <div className="feat-desc">Our AI reads job requirements and compares them to your skills. If you don't match 75% or more, we skip it. No more applying to roles you'll never hear back from.</div>
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

      {/* HOW IT WORKS */}
      <section className="section-wrap" style={{paddingTop: 0}}>
        <div className="section-eyebrow">How it works</div>
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

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="section-wrap">
          <div className="section-eyebrow">What people say</div>
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
          <div className="testi-grid-2">
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
            <button className="btn-ghost-hero" onClick={() => navigate('/pricing')}>View pricing →</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div className="footer-bar">
        <div className="footer-inner">
          <div className="footer-logo">
            <img src={logo} alt="Nuxply" className="footer-logo-img" />
            nuxply
          </div>
          <div className="footer-links">
            <a href="/terms" className="footer-link">Terms</a>
            <a href="/privacy" className="footer-link">Privacy</a>
            <a href="/refund" className="footer-link">Refunds</a>
            <button className="footer-link" onClick={() => navigate('/pricing')}>Pricing</button>
          </div>
          <div className="footer-copy">© 2026 Nuxply</div>
        </div>
      </div>
    </div>
  )
}