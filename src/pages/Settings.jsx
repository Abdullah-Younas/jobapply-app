import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Settings() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data } = await supabase.from('users').select('*').eq('email', session.user.email).single()
      setProfile(data)
      setLoading(false)
    }
    load()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <div className="text-xl font-semibold text-violet-600">Nuxply</div>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 hover:text-gray-800">← Back to dashboard</button>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-500 text-sm mb-8">Manage your account and subscription.</p>

        <div className="bg-white border rounded-xl p-6 mb-4">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Account</h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Name</span>
              <span className="text-gray-900 font-medium">{profile?.name ?? '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Email</span>
              <span className="text-gray-900 font-medium">{profile?.email ?? '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Plan</span>
              <span className="bg-violet-100 text-violet-700 text-xs font-medium px-3 py-1 rounded-full capitalize">{profile?.plan ?? 'free'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Credits remaining</span>
              <span className="text-gray-900 font-medium">{profile?.monthly_quota ?? 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Top-up credits</span>
              <span className="text-gray-900 font-medium">{profile?.topup_credits ?? 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6 mb-4">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Subscription</h2>
          {profile?.plan === 'free' ? (
            <div>
              <p className="text-sm text-gray-500 mb-4">You are on the free plan — 10 credits/month.</p>
              <button onClick={() => navigate('/pricing')} className="w-full bg-violet-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-violet-700 transition">Upgrade plan</button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-4">You are on the <span className="font-medium capitalize text-gray-900">{profile?.plan}</span> plan.</p>
              <button onClick={() => navigate('/pricing')} className="w-full border py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition">Manage subscription</button>
            </div>
          )}
        </div>

        <div className="bg-white border border-red-100 rounded-xl p-6">
          <h2 className="text-sm font-medium text-red-500 mb-4">Danger zone</h2>
          <button onClick={handleSignOut} className="w-full border border-red-200 text-red-500 py-3 rounded-xl text-sm font-medium hover:bg-red-50 transition">Sign out</button>
        </div>
      </div>
    </div>
  )
}