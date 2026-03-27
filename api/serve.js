const fs = require('fs')
const path = require('path')

const COOKIE_NAME = 'miros_auth'

function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((c) => c.trim().split('='))
      .filter(([k]) => k)
      .map(([k, ...v]) => [k.trim(), v.join('=').trim()])
  )
}

module.exports = (req, res) => {
  const cookies = parseCookies(req.headers.cookie)
  const token = cookies[COOKIE_NAME]

  if (!token || token !== process.env.AUTH_SECRET) {
    res.writeHead(302, { Location: '/login.html' })
    res.end()
    return
  }

  const htmlPath = path.join(__dirname, '..', 'index.html')
  const html = fs.readFileSync(htmlPath, 'utf8')
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).send(html)
}
