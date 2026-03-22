import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const event = req.body

  try {
    const email = event.data?.attributes?.user_email
    const eventName = event.meta?.event_name
    const variantName = event.data?.attributes?.variant_name ?? ''
    const productName = event.data?.attributes?.first_order_item?.product_name ?? ''

    if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
      const plan = productName.toLowerCase().includes('premium') ? 'premium' : 'standard'
      const quota = plan === 'premium' ? 50 : 25

      await supabase
        .from('users')
        .update({ plan, monthly_quota: quota })
        .eq('email', email)
    }

    if (eventName === 'order_created') {
      const credits = productName.toLowerCase().includes('large') ? 25 : 10

      await supabase.rpc('add_topup_credits', {
        user_email: email,
        amount: credits
      })
    }

    res.status(200).json({ received: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}