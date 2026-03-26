import { useState, useEffect } from 'react'
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

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tIndex, setTIndex] = useState(0)
  const [fading, setFading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setTIndex(i => (i + 1) % testimonials.length)
        setFading(false)
      }, 500)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else navigate('/profile')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else navigate('/dashboard')
    }
    setLoading(false)
  }

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://nuxply.com/dashboard' }
    })
    if (error) setError(error.message)
  }

  const t = testimonials[tIndex]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(16px, 4vw, 32px)',
      fontFamily: "'Georgia', serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }

        .outer-card {
          display: flex;
          width: 100%;
          max-width: 1020px;
          min-height: 620px;
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid #1e2e22;
        }

        /* LEFT PANEL */
        .left-panel {
          flex: 1.1;
          background: linear-gradient(150deg, #0e1f12 0%, #122318 55%, #0a1a0e 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(32px, 5vw, 56px);
          position: relative;
          min-width: 0;
          overflow: hidden;
        }
        .left-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 25% 35%, rgba(106,158,120,0.08) 0%, transparent 65%);
          pointer-events: none;
        }
        .left-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 17px;
          font-weight: 700;
          color: #6a9e78;
          letter-spacing: 0.05em;
          font-family: 'DM Mono', monospace;
        }
        .left-logo-img { height: 26px; width: 26px; object-fit: contain; }
        .testimonial-block {
          transition: opacity 0.5s ease;
        }
        .testimonial-block.fading { opacity: 0; }
        .testimonial-block.visible { opacity: 1; }
        .quote-text {
          font-size: clamp(17px, 2vw, 22px);
          font-weight: 400;
          color: #c9dcc8;
          line-height: 1.65;
          margin: 0 0 20px;
          font-style: italic;
          letter-spacing: -0.01em;
        }
        .quote-author {
          font-size: 13px;
          color: #6a9e78;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.03em;
        }
        .quote-role {
          font-size: 11.5px;
          color: #2e4e38;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.03em;
          margin-top: 4px;
        }
        .dots {
          display: flex;
          gap: 7px;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #1e3a28;
          transition: background 0.4s;
          cursor: pointer;
        }
        .dot.active { background: #6a9e78; }

        /* RIGHT PANEL */
        .right-panel {
          width: clamp(320px, 42%, 460px);
          flex-shrink: 0;
          background: #080808;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(32px, 5vw, 60px) clamp(28px, 5vw, 52px);
        }
        .right-title {
          font-size: clamp(19px, 2.4vw, 26px);
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px;
          letter-spacing: -0.02em;
          text-align: center;
        }
        .right-sub {
          font-size: 12.5px;
          color: #4a6e54;
          margin: 0 0 36px;
          text-align: center;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.01em;
        }
        .google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px 16px;
          background: #c9dcc8;
          color: #111;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s, transform 0.15s;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.01em;
          margin-bottom: 22px;
        }
        .google-btn:hover { background: #b8ccb7; transform: translateY(-1px); }
        .divider {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          margin-bottom: 20px;
        }
        .divider-line { flex: 1; height: 1px; background: #1a2e1e; }
        .divider-text {
          font-size: 11px;
          color: #2e4e38;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .input-field {
          width: 100%;
          padding: 12px 14px;
          background: #0d160f;
          border: 1px solid #1a2e1e;
          border-radius: 10px;
          color: #c9dcc8;
          font-size: 13px;
          outline: none;
          transition: border-color 0.18s;
          font-family: 'DM Mono', monospace;
          margin-bottom: 10px;
        }
        .input-field::placeholder { color: #1e3a28; }
        .input-field:focus { border-color: #6a9e78; }
        .submit-btn {
          width: 100%;
          padding: 13px;
          background: #6a9e78;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.02em;
          margin-top: 4px;
        }
        .submit-btn:hover:not(:disabled) {
          background: #7ab088;
          transform: translateY(-1px);
        }
        .submit-btn:disabled { opacity: 0.45; cursor: default; }
        .error-msg {
          font-size: 12px;
          color: #f87171;
          margin-bottom: 10px;
          font-family: 'DM Mono', monospace;
        }
        .toggle-text {
          text-align: center;
          font-size: 12px;
          color: #2e4e38;
          margin-top: 24px;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.01em;
        }
        .toggle-btn {
          color: #6a9e78;
          font-weight: 700;
          cursor: pointer;
          background: none;
          border: none;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          padding: 0;
          margin-left: 5px;
        }
        .toggle-btn:hover { color: #c9dcc8; text-decoration: underline; }

        @media (max-width: 680px) {
          .outer-card {
            flex-direction: column;
            min-height: unset;
            border-radius: 18px;
          }
          .left-panel {
            flex: none;
            padding: 28px 24px 24px;
            min-height: 190px;
          }
          .left-logo { display: none; }
          .dots { display: none; }
          .right-panel {
            width: 100%;
            padding: 36px 28px 40px;
          }
        }
      `}</style>

      <div className="outer-card">
        <div className="left-panel">
          <div className="left-logo">
            <img src={logo} alt="Nuxply" className="left-logo-img" />
            Nuxply
          </div>

          <div className={`testimonial-block ${fading ? 'fading' : 'visible'}`}>
            <p className="quote-text">"{t.text}"</p>
            <div className="quote-author">{t.name}</div>
            <div className="quote-role">{t.role}</div>
          </div>

          <div className="dots">
            {testimonials.map((_, i) => (
              <div
                key={i}
                className={`dot ${i === tIndex ? 'active' : ''}`}
                onClick={() => {
                  setFading(true)
                  setTimeout(() => { setTIndex(i); setFading(false) }, 500)
                }}
              />
            ))}
          </div>
        </div>

        <div className="right-panel">
          <h1 className="right-title">
            {isSignup ? 'Create account' : 'Welcome to Nuxply'}
          </h1>
          <p className="right-sub">
            {isSignup ? 'Start finding better jobs with AI' : 'Sign in to your account to continue'}
          </p>

          <button className="google-btn" onClick={handleGoogle}>
            <img src="https://www.google.com/favicon.ico" width="15" height="15" alt="" />
            Continue with Google
          </button>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">or</span>
            <div className="divider-line" />
          </div>

          <div style={{ width: '100%' }}>
            <input className="input-field" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="input-field" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            {error && <div className="error-msg">{error}</div>}
            <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
            </button>
          </div>

          <div className="toggle-text">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button className="toggle-btn" onClick={() => { setIsSignup(s => !s); setError('') }}>
              {isSignup ? 'Sign in' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}