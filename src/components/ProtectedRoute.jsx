import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession()
      const session = data.session

      if (session) {
        // Auto-create profile if doesn't exist
        const { data: existing } = await supabase
          .from('users')
          .select('id')
          .eq('email', session.user.email)
          .maybeSingle()

        if (!existing) {
          await supabase.from('users').insert({
            name: session.user.user_metadata?.full_name ?? '',
            email: session.user.email,
            plan: 'free',
            monthly_quota: 10,
            topup_credits: 0,
            daily_sent: 0
          })
        }
      }

      setSession(session)
    }
    init()
  }, [])

  if (session === undefined) return <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>
  if (!session) return <Navigate to="/login" />
  return children
}