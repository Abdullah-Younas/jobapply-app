import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b">
        <div className="text-xl font-semibold text-violet-600">Nuxply</div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/pricing')} className="text-gray-500 hover:text-gray-800 text-sm">Pricing</button>
          <button onClick={() => navigate('/login')} className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm">Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center px-6 py-24">
        <div className="inline-block bg-violet-50 text-violet-600 text-sm px-4 py-1 rounded-full mb-6">AI-Powered Job Applications</div>
        <h1 className="text-5xl font-semibold text-gray-900 mb-6 leading-tight">Apply to jobs while you sleep</h1>
        <p className="text-xl text-gray-500 mb-10">Our AI finds jobs that match your skills, writes personalized cover letters and sends applications automatically. Only applies to jobs where you match 70%+ of requirements.</p>
        <button onClick={() => navigate('/login')} className="bg-violet-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-violet-700 transition">Start for free</button>
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">How it works</h2>
        <div className="grid grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Set up your profile', desc: 'Add your skills, experience and job preferences once.' },
            { step: '2', title: 'AI matches jobs', desc: 'Our AI scans job boards and finds roles matching 70%+ of your skills.' },
            { step: '3', title: 'Applications sent', desc: 'Personalized cover letters are written and sent automatically.' },
          ].map(item => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xl font-semibold mx-auto mb-4">{item.step}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-gray-400 text-sm border-t">
        © 2026 Nuxply. Built by Abdullah.
      </div>
    </div>
  )
}