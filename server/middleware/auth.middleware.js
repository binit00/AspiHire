import jwt from 'jsonwebtoken'

/**
 * Middleware: verify JWT token from Authorization header.
 * Attaches decoded user payload to req.user.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token — authorisation denied' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded   // { id, email, iat, exp }
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired' })
  }
}

export default protect
