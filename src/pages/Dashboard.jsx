import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      setUser(session.user)

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single()

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

  const total = profile?.plan === 'premium' ? 100 : profile?.plan === 'standard' ? 50 : 10
  const used = total - (profile?.monthly_quota ?? total)
  const pct = Math.round((used / total) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <div className="text-xl font-semibold text-violet-600">Nuxply</div>
        <div className="flex gap-4 items-center">
          <button onClick={() => navigate('/profile')} className="text-sm text-gray-500 hover:text-gray-800">Profile</button>
          <button onClick={() => navigate('/applications')} className="text-sm text-gray-500 hover:text-gray-800">Applications</button>
          <button onClick={() => navigate('/settings')} className="text-sm text-gray-500 hover:text-gray-800">Settings</button>
          <button onClick={handleSignOut} className="text-sm text-red-400 hover:text-red-600">Sign out</button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}!</h1>
        <p className="text-gray-500 text-sm mb-8">Here's your application activity this month.</p>

        {/* Plan badge */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-500">Current plan:</span>
          <span className="bg-violet-100 text-violet-700 text-xs font-medium px-3 py-1 rounded-full capitalize">{profile?.plan ?? 'free'}</span>
          {profile?.plan !== 'premium' && (
            <button onClick={() => navigate('/pricing')} className="text-xs text-violet-600 underline ml-2">Upgrade</button>
          )}
        </div>

        {/* Quota bar */}
        <div className="bg-white border rounded-xl p-6 mb-4">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-500">Applications this month</span>
            <span className="font-medium text-gray-900">{used} / {total}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full">
            <div
              className="h-2 bg-violet-500 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          {profile?.topup_credits > 0 && (
            <p className="text-xs text-gray-400 mt-2">+ {profile.topup_credits} top-up credits remaining</p>
          )}
        </div>

        {/* Upgrade nudge when > 80% used */}
          {pct >= 80 && profile?.plan !== 'premium' && (
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-sm text-violet-800 mb-4">
              You're running low on applications.
              <button onClick={() => navigate('/pricing')} className="font-medium underline ml-1">Upgrade or buy top-up credits →</button>
            </div>
          )}

        {/* Top-up credits for ALL tiers including free */}
          <div className="bg-white border rounded-xl p-5 mt-4">
            <div className="font-medium text-gray-900 mb-1">Need more applications?</div>
            <p className="text-sm text-gray-500 mb-4">Buy top-up credits — they never expire and work on any plan.</p>
            <div className="flex gap-3">
              <button
                onClick={() => window.open('https://xautoapplyai.lemonsqueezy.com/checkout/buy/6a62072c-9f2b-4cbb-b37f-0d634828d72a', '_blank')}
                className="flex-1 border rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition text-center"
              >
                10 credits — $3
              </button>
              <button
                onClick={() => window.open('https://xautoapplyai.lemonsqueezy.com/checkout/buy/8e9b9d72-bc63-4a2a-bef3-0061f81bb4c8', '_blank')}
                className="flex-1 bg-violet-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-violet-700 transition text-center"
              >
                25 credits — $6
              </button>
            </div>
          </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button onClick={() => navigate('/profile')} className="bg-white border rounded-xl p-5 text-left hover:border-violet-300 transition">
            <div className="font-medium text-gray-900 mb-1">Update profile</div>
            <div className="text-sm text-gray-500">Edit your skills and preferences</div>
          </button>
          <button onClick={() => navigate('/applications')} className="bg-white border rounded-xl p-5 text-left hover:border-violet-300 transition">
            <div className="font-medium text-gray-900 mb-1">View applications</div>
            <div className="text-sm text-gray-500">Track your sent applications</div>
          </button>
        </div>
      </div>
    </div>
  )
}