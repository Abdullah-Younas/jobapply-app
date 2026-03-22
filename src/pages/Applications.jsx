import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: profile } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single()

      if (!profile) return

      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', profile.id)
        .order('sent_at', { ascending: false })

      setApplications(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <div className="text-xl font-semibold text-violet-600">JobApply AI</div>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 hover:text-gray-800">← Back to dashboard</button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Applications</h1>
        <p className="text-gray-500 text-sm mb-8">All jobs your AI has applied to on your behalf.</p>

        {applications.length === 0 ? (
          <div className="bg-white border rounded-xl p-10 text-center">
            <p className="text-gray-400 text-sm">No applications sent yet.</p>
            <p className="text-gray-400 text-xs mt-1">Your automation will log applications here automatically.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {applications.map(app => (
              <div key={app.id} className="bg-white border rounded-xl p-5 flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-900">{app.job_title}</div>
                  <div className="text-sm text-gray-500 mt-1">{app.company}</div>
                  <div className="text-xs text-gray-400 mt-2">{new Date(app.sent_at).toLocaleDateString()}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    app.status === 'sent' ? 'bg-blue-50 text-blue-600' :
                    app.status === 'replied' ? 'bg-green-50 text-green-600' :
                    app.status === 'rejected' ? 'bg-red-50 text-red-600' :
                    'bg-gray-50 text-gray-600'
                  }`}>{app.status}</span>
                  <span className="text-xs text-gray-400">Match: {app.match_score}%</span>
                  {app.job_url && (
                    <a href={app.job_url} target="_blank" rel="noreferrer" className="text-xs text-violet-600 underline">View job</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}