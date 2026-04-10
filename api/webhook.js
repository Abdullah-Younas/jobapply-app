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
    const productName = (event.data?.attributes?.first_order_item?.product_name ?? '').toLowerCase()

    console.log('Webhook received:', eventName, productName, email)

    if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
      const plan = productName.includes('premium') ? 'premium' : 'standard'
      const quota = plan === 'premium' ? 100 : 50

      await supabase
        .from('users')
        .update({ plan, monthly_quota: quota })
        .eq('email', email)
    }

    if (eventName === 'order_created') {
      let credits = 0
      if (productName.includes('large')) credits = 25
      else if (productName.includes('small')) credits = 10
      else if (productName.includes('top-up') || productName.includes('topup')) credits = 10

      if (credits > 0) {
        await supabase.rpc('add_topup_credits', {
          user_email: email,
          amount: credits
        })
      }
    }

    res.status(200).json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    res.status(500).json({ error: err.message })
  }
}