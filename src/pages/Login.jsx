import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dark, setDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches)
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

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

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <style>{`
        .login-box{background:var(--bg2);border:1px solid var(--border);border-radius:24px;padding:40px;width:100%;max-width:420px;}
        .login-logo{font-size:22px;font-weight:700;color:var(--violet);text-align:center;margin-bottom:32px;font-family:Georgia,serif;cursor:pointer;}
        .login-title{font-size:24px;font-weight:700;color:var(--text);margin:0 0 6px;font-family:Georgia,serif;}
        .login-sub{font-size:14px;color:var(--text2);margin:0 0 28px;font-family:sans-serif;}
        .google-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:12px;border:1px solid var(--border);border-radius:12px;background:var(--bg);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:sans-serif;margin-bottom:20px;}
        .google-btn:hover{border-color:var(--violet);background:var(--violet-bg);}
        .divider{display:flex;align-items:center;gap:12px;margin-bottom:20px;}
        .divider-line{flex:1;height:1px;background:var(--border);}
        .divider-text{font-size:12px;color:var(--text3);font-family:sans-serif;}
        .input-field{width:100%;padding:12px 16px;border:1px solid var(--border);border-radius:12px;background:var(--bg);color:var(--text);font-size:14px;outline:none;transition:border 0.2s;font-family:sans-serif;box-sizing:border-box;margin-bottom:12px;}
        .input-field:focus{border-color:var(--violet);}
        .submit-btn{width:100%;padding:13px;background:var(--violet);color:white;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s;font-family:sans-serif;margin-top:4px;}
        .submit-btn:hover{background:var(--violet2);transform:translateY(-1px);}
        .submit-btn:disabled{opacity:0.6;transform:none;}
        .toggle-text{text-align:center;font-size:13px;color:var(--text2);margin-top:20px;font-family:sans-serif;}
        .toggle-btn{color:var(--violet);font-weight:700;cursor:pointer;background:none;border:none;font-family:sans-serif;font-size:13px;}
        .theme-float{position:fixed;top:20px;right:20px;width:36px;height:36px;border-radius:50%;border:1px solid var(--border);background:var(--bg2);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;}
      `}</style>

      <button className="theme-float" onClick={() => setDark(d => !d)}>{dark ? '☀️' : '🌙'}</button>

      <div className="login-box">
        <div className="login-logo" onClick={() => navigate('/')}>Nuxply</div>
        <h2 className="login-title">{isSignup ? 'Create account' : 'Welcome back'}</h2>
        <p className="login-sub">{isSignup ? 'Start finding better jobs with AI' : 'Sign in to your account'}</p>

        <button className="google-btn" onClick={handleGoogle}>
          <img src="https://www.google.com/favicon.ico" style={{width:'16px',height:'16px'}} alt="G" />
          Continue with Google
        </button>

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">or</span>
          <div className="divider-line" />
        </div>

        <form onSubmit={handleSubmit}>
          <input className="input-field" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="input-field" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <div style={{fontSize:'13px',color:'#f87171',marginBottom:'12px',fontFamily:'sans-serif'}}>{error}</div>}
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div className="toggle-text">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button className="toggle-btn" onClick={() => setIsSignup(s => !s)}>
            {isSignup ? ' Sign in' : ' Sign up'}
          </button>
        </div>
      </div>
    </div>
  )
}