const COOKIE_NAME = 'miros_auth'

module.exports = (req, res) => {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
  )
  res.writeHead(302, { Location: '/login.html' })
  res.end()
}
