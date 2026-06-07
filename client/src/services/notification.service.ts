import api from './api'
import type { ApiResponse } from '../types/api.types'
import type { AppNotification } from '../components/features/kanban/kanban.types'

export const fetchNotifications = async (): Promise<AppNotification[]> => {
  const res = await api.get<ApiResponse<AppNotification[]>>('/notifications')
  return res.data.data
}

export const markNotificationRead = async (id: string): Promise<AppNotification> => {
  const res = await api.put<ApiResponse<AppNotification>>(`/notifications/${id}/read`)
  return res.data.data
}

export const markAllNotificationsRead = async (): Promise<{ updated: boolean }> => {
  const res = await api.put<ApiResponse<{ updated: boolean }>>('/notifications/read-all')
  return res.data.data
}

export default { fetchNotifications, markNotificationRead, markAllNotificationsRead }
