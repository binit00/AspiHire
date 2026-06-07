import { io, Socket } from 'socket.io-client'

export const createSocket = (url: string) => {
  const socket: Socket = io(url)
  return socket
}

export default { createSocket }
