import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as jobService from '../services/job.service'
import type { JobCard } from '../components/features/kanban/kanban.types'
import useAuthStore from '../store/authStore'

export const QUERY_KEY = {
  JOBS: ['jobs'] as const,
}

export function useJobs() {
  const qc = useQueryClient()
  const token = useAuthStore((state) => state.token)

  const q = useQuery<JobCard[]>({
    queryKey: QUERY_KEY.JOBS,
    queryFn: jobService.fetchJobs,
    enabled: Boolean(token),
    staleTime: 1000 * 60,
  })

  const create = useMutation({
    mutationFn: (payload: Omit<JobCard, 'id'>) => jobService.createJob(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.JOBS }),
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<JobCard> }) => jobService.updateJob(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.JOBS }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => jobService.deleteJob(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.JOBS }),
  })

  return { ...q, create, update, remove }
}

export default useJobs
