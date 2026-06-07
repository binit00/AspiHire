import api from './api'
import type { ApiResponse } from '../types/api.types'

export interface LoginPayload { email: string; password: string }
export interface RegisterPayload extends LoginPayload { name: string }

export const login = async (payload: LoginPayload) => {
  const res = await api.post<ApiResponse<{ token: string, user: any }>>('/auth/login', payload)
  return res.data
}

export const register = async (payload: RegisterPayload) => {
  const res = await api.post<ApiResponse<{ token: string, user: any }>>('/auth/register', payload)
  return res.data
}

export const getMe = async () => {
  const res = await api.get<ApiResponse<{ user: any }>>('/auth/me')
  return res.data
}

export default { login, register, getMe }
