import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const [session, setSession] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b px-8 py-4 flex justify-between items-center">
      <div 
        onClick={() => navigate('/')} 
        className="text-xl font-semibold text-violet-600 cursor-pointer"
      >
        Nuxply
      </div>
      <div className="flex gap-4 items-center">
        {session ? (
          <>
            <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 hover:text-gray-800">Dashboard</button>
            <button onClick={() => navigate('/applications')} className="text-sm text-gray-500 hover:text-gray-800">Applications</button>
            <button onClick={() => navigate('/profile')} className="text-sm text-gray-500 hover:text-gray-800">Profile</button>
            <button onClick={() => navigate('/settings')} className="text-sm text-gray-500 hover:text-gray-800">Settings</button>
            <button onClick={handleSignOut} className="text-sm text-red-400 hover:text-red-600">Sign out</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/pricing')} className="text-sm text-gray-500 hover:text-gray-800">Pricing</button>
            <button onClick={() => navigate('/login')} className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-violet-700 transition">Get Started</button>
          </>
        )}
      </div>
    </nav>
  )
}