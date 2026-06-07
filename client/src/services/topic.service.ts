import api from './api'
import type { ApiResponse } from '../types/api.types'
import type { Topic } from '../components/features/kanban/kanban.types'

export const fetchTopics = async (): Promise<Topic[]> => {
  const res = await api.get<ApiResponse<Topic[]>>('/topics')
  return res.data.data
}

export const updateTopic = async (id: string, payload: Partial<Topic>) => {
  const res = await api.put<ApiResponse<Topic>>(`/topics/${id}`, payload)
  return res.data.data
}

export const createTopic = async (payload: { name: string; category: string; practiceQuestions?: string[] }) => {
  const res = await api.post<ApiResponse<Topic>>('/topics', payload)
  return res.data.data
}

export const bulkImportTopics = async (topics: { name: string; category: string; questions?: string[] }[]) => {
  const res = await api.post<ApiResponse<Topic[]>>('/topics/bulk', { topics })
  return res.data.data
}

export default { fetchTopics, updateTopic }
