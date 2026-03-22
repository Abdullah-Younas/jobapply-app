import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })
  }, [])

  if (session === undefined) return <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>
  if (!session) return <Navigate to="/login" />
  return children
}