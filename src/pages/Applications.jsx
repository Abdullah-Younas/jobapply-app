import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState(null)
  const [copied, setCopied] = useState(false)
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
    if (selectedApp?.id === id) setSelectedApp(prev => ({ ...prev, status }))
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <div className="text-xl font-semibold text-violet-600">Nuxply</div>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 hover:text-gray-800">Back to dashboard</button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Applications</h1>
        <p className="text-gray-500 text-sm mb-8">Click any job to view your cover letter and apply.</p>

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
            <p className="text-gray-400 text-sm">No applications yet.</p>
            <p className="text-gray-400 text-xs mt-1">Your AI will find matching jobs and log them here automatically.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {applications.map(app => (
              <div key={app.id} className="bg-white border rounded-xl p-5 hover:border-violet-300 transition cursor-pointer" onClick={() => setSelectedApp(app)}>
                <div className="flex justify-between items-start">
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
                <div className="mt-3 pt-3 border-t flex gap-2">
                  <button
                    onClick={e => { e.stopPropagation(); setSelectedApp(app) }}
                    className="flex-1 text-center text-xs bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 transition"
                  >
                    View and Apply
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); updateStatus(app.id, 'replied') }}
                    className="text-xs border px-3 py-2 rounded-lg text-green-600 hover:bg-green-50 transition"
                  >
                    Got reply
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); updateStatus(app.id, 'rejected') }}
                    className="text-xs border px-3 py-2 rounded-lg text-red-400 hover:bg-red-50 transition"
                  >
                    Rejected
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedApp && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedApp(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-2xl w-full overflow-y-auto"
            style={{ maxHeight: '90vh' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{selectedApp.job_title}</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedApp.company}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    selectedApp.status === 'sent' ? 'bg-blue-50 text-blue-600' :
                    selectedApp.status === 'replied' ? 'bg-green-50 text-green-600' :
                    selectedApp.status === 'rejected' ? 'bg-red-50 text-red-600' :
                    'bg-gray-50 text-gray-600'
                  }`}>{selectedApp.status}</span>
                  <span className="text-xs text-gray-400">Match: {selectedApp.match_score}%</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-light ml-4"
              >
                x
              </button>
            </div>

            {selectedApp.job_url && (
              <a
                href={selectedApp.job_url}
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center bg-violet-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-violet-700 transition mb-5"
              >
                Open job listing and apply
              </a>
            )}

            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium text-gray-700">Your cover letter</div>
                <button
                  onClick={() => copyToClipboard(selectedApp.cover_letter)}
                  className={`text-xs px-3 py-1 rounded-lg transition ${copied ? 'bg-green-100 text-green-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedApp.cover_letter ?? 'Cover letter not available for this application.'}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => updateStatus(selectedApp.id, 'replied')}
                className="flex-1 border py-2 rounded-xl text-sm text-green-600 hover:bg-green-50 transition"
              >
                Got a reply
              </button>
              <button
                onClick={() => updateStatus(selectedApp.id, 'rejected')}
                className="flex-1 border py-2 rounded-xl text-sm text-red-400 hover:bg-red-50 transition"
              >
                Mark rejected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}