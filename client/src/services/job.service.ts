import api from './api'
import type { ApiResponse } from '../types/api.types'
import type { JobCard } from '../components/features/kanban/kanban.types'

export const fetchJobs = async (): Promise<JobCard[]> => {
  const res = await api.get<ApiResponse<JobCard[]>>('/jobs')
  return res.data.data
}

export const fetchJobStats = async () => {
  const res = await api.get<ApiResponse<{
    total: number
    active: number
    offers: number
    rejected: number
    byStatus: Record<string, number>
    byPriority: Record<string, number>
  }>>('/jobs/stats')
  return res.data.data
}

export const createJob = async (payload: Omit<JobCard, 'id'>): Promise<JobCard> => {
  const res = await api.post<ApiResponse<JobCard>>('/jobs', payload)
  return res.data.data
}

export const updateJob = async (id: string, payload: Partial<JobCard>): Promise<JobCard> => {
  const res = await api.put<ApiResponse<JobCard>>(`/jobs/${id}`, payload)
  return res.data.data
}

export const deleteJob = async (id: string): Promise<{ id: string }> => {
  const res = await api.delete<ApiResponse<{ id: string }>>(`/jobs/${id}`)
  return res.data.data
}

export default { fetchJobs, fetchJobStats, createJob, updateJob, deleteJob }
