import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const event = req.body
    const eventType = event.event_type
    const data = event.data

    if (eventType === 'subscription.created' || eventType === 'subscription.updated') {
      const email = data.customer?.email
      const priceId = data.items?.[0]?.price?.id

      let plan = 'standard'
      let quota = 50

      if (priceId === 'pri_01kmjs00hgnzqbchrqgzky9cq1') {
        plan = 'premium'
        quota = 100
      }

      await supabase
        .from('users')
        .update({ plan, monthly_quota: quota })
        .eq('email', email)
    }

    if (eventType === 'transaction.completed') {
      const email = data.customer?.email
      const priceId = data.items?.[0]?.price?.id

      if (priceId === 'pri_01kmjs1naq2j27v8fsc10t3knx') {
        await supabase.rpc('add_topup_credits', { user_email: email, amount: 10 })
      }
      if (priceId === 'pri_01kmjs2ffjfvtq1rms69t7cznb') {
        await supabase.rpc('add_topup_credits', { user_email: email, amount: 25 })
      }
    }

    res.status(200).json({ received: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}