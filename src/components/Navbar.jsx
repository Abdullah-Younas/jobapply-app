import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Navbar({ dark, setDark }) {
  const [session, setSession] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    supabase.auth.onAuthStateChange((_event, session) => setSession(session))
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav style={{
      display:'flex', justifyContent:'space-between', alignItems:'center',
      padding:'16px 48px', borderBottom:'1px solid var(--border)',
      background:'var(--bg2)', position:'sticky', top:0, zIndex:100
    }}>
      <div
        onClick={() => navigate('/')}
        style={{fontSize:'20px',fontWeight:'700',color:'var(--violet)',cursor:'pointer',fontFamily:'Georgia,serif'}}
      >
        Nuxply
      </div>
      <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
        {session ? (
          <>
            <button onClick={() => navigate('/dashboard')} style={ghostBtn}>Dashboard</button>
            <button onClick={() => navigate('/applications')} style={ghostBtn}>Applications</button>
            <button onClick={() => navigate('/profile')} style={ghostBtn}>Profile</button>
            <button onClick={() => navigate('/settings')} style={ghostBtn}>Settings</button>
            <button onClick={handleSignOut} style={{...ghostBtn,color:'#f87171'}}>Sign out</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/pricing')} style={ghostBtn}>Pricing</button>
            <button onClick={() => navigate('/login')} style={primaryBtn}>Get started</button>
          </>
        )}
        {setDark && (
          <button onClick={() => setDark(d => !d)} style={{
            width:'36px',height:'36px',borderRadius:'50%',border:'1px solid var(--border)',
            background:'var(--bg2)',cursor:'pointer',display:'flex',alignItems:'center',
            justifyContent:'center',fontSize:'16px',transition:'all 0.2s'
          }}>{dark ? '☀️' : '🌙'}</button>
        )}
      </div>
    </nav>
  )
}

const ghostBtn = {
  padding:'8px 14px', borderRadius:'100px', fontSize:'13px',
  border:'none', cursor:'pointer', background:'transparent',
  color:'var(--text2)', fontFamily:'sans-serif', transition:'all 0.2s'
}

const primaryBtn = {
  padding:'8px 18px', borderRadius:'100px', fontSize:'13px',
  border:'none', cursor:'pointer', background:'var(--violet)',
  color:'white', fontWeight:'600', fontFamily:'sans-serif'
}