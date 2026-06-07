import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as notificationService from '../services/notification.service'
import type { AppNotification } from '../components/features/kanban/kanban.types'

const QUERY_KEY = ['notifications'] as const

export const useNotifications = () => {
  const qc = useQueryClient()
  const query = useQuery<AppNotification[]>({
    queryKey: QUERY_KEY,
    queryFn: notificationService.fetchNotifications,
    staleTime: 1000 * 30,
  })

  const markRead = useMutation({
    mutationFn: notificationService.markNotificationRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  const markAllRead = useMutation({
    mutationFn: notificationService.markAllNotificationsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  return { ...query, markRead, markAllRead }
}

export default useNotifications
