import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'

// Route imports (you will implement these)
import authRoutes from './routes/auth.routes.js'
import jobRoutes  from './routes/job.routes.js'
import topicRoutes from './routes/topic.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import calendarRoutes from './routes/calendar.routes.js'

// DB connection (you will implement this)
import connectDB from './config/db.js'

dotenv.config()

const app  = express()
const http = createServer(app)
const io   = new Server(http, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true },
})

// ── Middleware ─────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())

// ── Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/topics', topicRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/calendar', calendarRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'HireFlow API is running' })
})

// ── Socket.io ──────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })

  // Example: broadcast card move to all clients
  socket.on('card:move', (data) => {
    socket.broadcast.emit('card:moved', data)
  })
})

// ── Start ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000

connectDB().then(() => {
  http.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
})
