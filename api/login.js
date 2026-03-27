const COOKIE_NAME = 'miros_auth'
const THIRTY_DAYS = 60 * 60 * 24 * 30

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }

  const { username, password } = req.body || {}

  if (
    username === process.env.AUTH_USERNAME &&
    password === process.env.AUTH_PASSWORD
  ) {
    res.setHeader(
      'Set-Cookie',
      `${COOKIE_NAME}=${process.env.AUTH_SECRET}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${THIRTY_DAYS}`
    )
    res.status(200).json({ success: true })
    return
  }

  res.status(401).json({ error: 'Invalid credentials' })
}
