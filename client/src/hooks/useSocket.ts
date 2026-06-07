import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function useSocket(url = '') {
  useEffect(() => {
    if (!url) return
    socket = io(url)
    return () => {
      socket?.disconnect()
      socket = null
    }
  }, [url])

  return socket
}

export default useSocket
