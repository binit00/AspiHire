import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const toPublicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
})

const signToken = (userId, email) =>
  jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

// ── POST /api/auth/register ───────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const normalizedEmail = email?.trim().toLowerCase()

    if (!name?.trim() || !normalizedEmail || !password) {
      return res.status(400).json({ success: false, message: 'name, email and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
    }

    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    })
    const token = signToken(user._id, user.email)

    res.status(201).json({ success: true, data: { token, user: toPublicUser(user) } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ── POST /api/auth/login ──────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const normalizedEmail = email?.trim().toLowerCase()

    if (!normalizedEmail || !password) {
      return res.status(400).json({ success: false, message: 'email and password are required' })
    }

    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const token = signToken(user._id, user.email)
    res.status(200).json({ success: true, data: { token, user: toPublicUser(user) } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ── GET /api/auth/me ──────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.status(200).json({ success: true, data: { user: toPublicUser(user) } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
