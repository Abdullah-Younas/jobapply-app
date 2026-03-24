export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { base64 } = req.body

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: base64
              }
            },
            {
              type: 'text',
              text: 'Extract from this CV: 1) A comma separated list of technical skills 2) A 2 sentence experience summary 3) The most recent job title. Reply in this exact format:\nSKILLS: skill1, skill2, skill3\nEXPERIENCE: summary here\nJOB_TITLE: job title here'
            }
          ]
        }]
      })
    })

    const data = await response.json()
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}