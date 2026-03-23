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

  async function updateStatus(id, status) {
    await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <div className="text-xl font-semibold text-violet-600">JobApply AI</div>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 hover:text-gray-800">Back to dashboard</button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Applications</h1>
        <p className="text-gray-500 text-sm mb-8">Track and manage all your job applications.</p>

        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total', value: applications.length, color: 'text-gray-900' },
            { label: 'Sent', value: applications.filter(a => a.status === 'sent').length, color: 'text-blue-600' },
            { label: 'Replied', value: applications.filter(a => a.status === 'replied').length, color: 'text-green-600' },
            { label: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, color: 'text-red-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-white border rounded-xl p-4 text-center">
              <div className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {applications.length === 0 ? (
          <div className="bg-white border rounded-xl p-10 text-center">
            <p className="text-gray-400 text-sm">No applications sent yet.</p>
            <p className="text-gray-400 text-xs mt-1">Your automation will log applications here automatically.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {applications.map(app => (
              <div key={app.id} className="bg-white border rounded-xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium text-gray-900">{app.job_title}</div>
                    <div className="text-sm text-gray-500 mt-1">{app.company}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(app.sent_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      app.status === 'sent' ? 'bg-blue-50 text-blue-600' :
                      app.status === 'replied' ? 'bg-green-50 text-green-600' :
                      app.status === 'rejected' ? 'bg-red-50 text-red-600' :
                      'bg-gray-50 text-gray-600'
                    }`}>{app.status}</span>
                    <span className="text-xs text-gray-400">Match: {app.match_score}%</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t">
                  {app.job_url && (
                    <a
                      href={app.job_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center text-xs bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 transition"
                    >
                      View and Apply
                    </a>
                  )}
                  <button
                    onClick={() => updateStatus(app.id, 'replied')}
                    className="text-xs border px-3 py-2 rounded-lg text-green-600 hover:bg-green-50 transition"
                  >
                    Got reply
                  </button>
                  <button
                    onClick={() => updateStatus(app.id, 'rejected')}
                    className="text-xs border px-3 py-2 rounded-lg text-red-400 hover:bg-red-50 transition"
                  >
                    Rejected
                  </button>
                </div>

                {app.cover_letter && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs text-gray-400 mb-2">Cover letter:</div>
                    <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">{app.cover_letter}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}