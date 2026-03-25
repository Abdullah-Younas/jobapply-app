import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

export default function Landing() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-3xl mx-auto text-center px-6 py-24">
        <div className="inline-block bg-violet-50 text-violet-600 text-sm px-4 py-1 rounded-full mb-6">AI-Powered Job Matching</div>
        <h1 className="text-5xl font-semibold text-gray-900 mb-6 leading-tight">Find matching jobs while you sleep</h1>
        <p className="text-xl text-gray-500 mb-10">Our AI finds jobs that match your skills and writes personalized cover letters — ready for you to apply with one click. Only surfaces jobs where you match 70% or more of requirements.</p>
        <button
          onClick={() => navigate(session ? '/dashboard' : '/login')}
          className="bg-violet-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-violet-700 transition"
        >
          {session ? 'Go to dashboard' : 'Start for free'}
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">How it works</h2>
        <div className="grid grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Set up your profile', desc: 'Add your skills, experience and job preferences once.' },
            { step: '2', title: 'AI matches jobs', desc: 'Our AI scans job boards and finds roles matching 70% or more of your skills.' },
            { step: '3', title: 'Apply with one click', desc: 'Review your personalized cover letter and apply directly to each job.' },
          ].map(item => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xl font-semibold mx-auto mb-4">{item.step}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-8 text-gray-400 text-sm border-t">
        © 2026 Nuxply. All rights reserved.
      </div>
    </div>
  )
}