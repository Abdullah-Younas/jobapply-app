import { useNavigate } from 'react-router-dom'

export default function Pricing() {
  const navigate = useNavigate()

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      apps: '10 applications/month',
      features: ['AI skill matching', 'AI cover letter', 'Manual review required', 'Application log'],
      notIncluded: ['Auto-send', 'Analytics', 'Priority support', 'Top-up credits'],
      cta: 'Get started free',
      action: () => navigate('/login'),
      highlight: false
    },
    {
      name: 'Standard',
      price: '$9',
      period: 'per month',
      apps: '50 applications/month',
      features: ['AI skill matching', 'AI cover letter', 'Auto-send enabled', 'Application log', 'Top-up credits available'],
      notIncluded: ['Analytics dashboard', 'Priority support'],
      cta: 'Get Standard',
      action: () => window.open('https://xautoapplyai.lemonsqueezy.com/checkout/buy/347cdda1-5173-4863-983a-c9b0ea673931', '_blank'),
      highlight: true
    },
    {
      name: 'Premium',
      price: '$25',
      period: 'per month',
      apps: '100 applications/month',
      features: ['AI skill matching', 'AI cover letter', 'Auto-send enabled', 'Application log', 'Top-up credits available', 'Analytics dashboard', 'Priority support'],
      notIncluded: [],
      cta: 'Get Premium',
      action: () => window.open('https://xautoapplyai.lemonsqueezy.com/checkout/buy/62955451-5397-41d6-966b-f7c1ea364655', '_blank'),
      highlight: false
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex justify-between items-center px-8 py-4 border-b">
        <div className="text-xl font-semibold text-violet-600">Nuxply</div>
        <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-gray-800">← Back</button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">Simple pricing</h1>
          <p className="text-gray-500">Start free, upgrade when you need more applications.</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.name} className={`border rounded-2xl p-6 flex flex-col ${plan.highlight ? 'border-violet-400 shadow-sm' : ''}`}>
              {plan.highlight && (
                <div className="bg-violet-600 text-white text-xs font-medium text-center py-1 px-3 rounded-full self-start mb-4">Most popular</div>
              )}
              <div className="text-lg font-semibold text-gray-900 mb-1">{plan.name}</div>
              <div className="mb-1">
                <span className="text-3xl font-semibold text-gray-900">{plan.price}</span>
                <span className="text-gray-400 text-sm ml-1">{plan.period}</span>
              </div>
              <div className="text-violet-600 text-sm font-medium mb-6">{plan.apps}</div>

              <div className="flex flex-col gap-2 mb-6 flex-1">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span>{f}
                  </div>
                ))}
                {plan.notIncluded.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <span>✗</span>{f}
                  </div>
                ))}
              </div>

              <button
                onClick={plan.action}
                className={`w-full py-3 rounded-xl font-medium text-sm transition ${
                  plan.highlight
                    ? 'bg-violet-600 text-white hover:bg-violet-700'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Top up credits */}
        <div className="mt-12 border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Need more applications?</h2>
          <p className="text-gray-500 text-sm mb-4">Buy top-up credits anytime — they never expire.</p>
          <div className="flex gap-4">
            <div className="border rounded-xl p-4 flex justify-between items-center flex-1">
              <div>
                <div className="font-medium text-gray-900 text-sm">Small pack</div>
                <div className="text-xs text-gray-400">10 extra applications</div>
              </div>
              <button onClick={() => window.open('https://xautoapplyai.lemonsqueezy.com/checkout/buy/6a62072c-9f2b-4cbb-b37f-0d634828d72a', '_blank')} className="bg-violet-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-violet-700 transition">$3</button>
            </div>
            <div className="border rounded-xl p-4 flex justify-between items-center flex-1">
              <div>
                <div className="font-medium text-gray-900 text-sm">Large pack</div>
                <div className="text-xs text-gray-400">25 extra applications</div>
              </div>
              <button onClick={() => window.open('https://xautoapplyai.lemonsqueezy.com/checkout/buy/8e9b9d72-bc63-4a2a-bef3-0061f81bb4c8', '_blank')} className="bg-violet-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-violet-700 transition">$6</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}