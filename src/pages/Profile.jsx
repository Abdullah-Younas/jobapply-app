import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    name: '',
    skills: '',
    experience: '',
    job_title_preference: '',
    job_type: 'any',
    country: '',
    city: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single()

      if (data) {
        setForm({
          name: data.name ?? session.user.user_metadata?.full_name ?? '',
          skills: data.skills ? data.skills.join(', ') : '',
          experience: data.experience ?? '',
          job_title_preference: data.job_title_preference ?? '',
          job_type: data.job_type ?? 'any',
          country: data.country ?? '',
          city: data.city ?? ''
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    setSuccess(false)

    const { data: { session } } = await supabase.auth.getSession()

    const skillsArray = form.skills.split(',').map(s => s.trim()).filter(Boolean)

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (existing) {
      await supabase
        .from('users')
        .update({
          name: form.name,
          skills: skillsArray,
          experience: form.experience,
          job_title_preference: form.job_title_preference,
          job_type: form.job_type,
          country: form.country,
          city: form.city
        })
        .eq('email', session.user.email)
    } else {
      await supabase
        .from('users')
        .insert({
          name: form.name,
          email: session.user.email,
          skills: skillsArray,
          experience: form.experience,
          job_title_preference: form.job_title_preference,
          plan: 'free',
          monthly_quota: 5,
          topup_credits: 0
        })
    }

    setSaving(false)
    setSuccess(true)
    setTimeout(() => navigate('/dashboard'), 1500)
  }

  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <div className="text-xl font-semibold text-violet-600">JobApply AI</div>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 hover:text-gray-800">← Back to dashboard</button>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Your profile</h1>
        <p className="text-gray-500 text-sm mb-8">This info is used to match and apply to jobs automatically.</p>

        <div className="bg-white border rounded-xl p-6 flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Full name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400"
              placeholder="Abdullah Khan"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Job title preference</label>
            <input
              type="text"
              value={form.job_title_preference}
              onChange={e => setForm({ ...form, job_title_preference: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400"
              placeholder="Software Developer, Frontend Engineer..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Your skills</label>
            <input
              type="text"
              value={form.skills}
              onChange={e => setForm({ ...form, skills: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400"
              placeholder="React, Node.js, Python, SQL..."
            />
            <p className="text-xs text-gray-400 mt-1">Separate skills with commas</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Experience summary</label>
            <textarea
              value={form.experience}
              onChange={e => setForm({ ...form, experience: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400 resize-none"
              rows={4}
              placeholder="2 years of experience in web development, worked on e-commerce projects..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Job type preference</label>
            <select
              value={form.job_type}
              onChange={e => setForm({ ...form, job_type: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400"
            >
              <option value="any">Any</option>
              <option value="remote">Remote only</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Country</label>
            <input
              type="text"
              value={form.country}
              onChange={e => setForm({ ...form, country: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400"
              placeholder="Pakistan, United States, United Kingdom..."
            />
            <p className="text-xs text-gray-400 mt-1">Leave empty for worldwide search</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">City</label>
            <input
              type="text"
              value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400"
              placeholder="Karachi, Lahore, New York..."
            />
            <p className="text-xs text-gray-400 mt-1">Only used for hybrid and on-site jobs</p>
          </div>

          {success && <p className="text-green-600 text-sm">Profile saved! Redirecting...</p>}

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-violet-600 text-white py-3 rounded-xl font-medium hover:bg-violet-700 transition"
          >
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </div>
      </div>
    </div>
  )
}