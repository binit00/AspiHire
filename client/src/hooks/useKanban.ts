import { useCallback } from 'react'
import type { KanbanStatus } from '../components/features/kanban/kanban.types'
import useJobStore from '../store/jobStore'
import { useJobs } from './useJobs'

export const useKanban = () => {
  const jobsQuery = useJobs()
  const jobs = jobsQuery.data ?? []
  const { updateJob: updateLocal } = useJobStore()
  const { update: updateRemote } = jobsQuery

  const moveCard = useCallback(async (id: string, status: KanbanStatus) => {
    const previous = jobs.find((job) => job.id === id)
    updateLocal(id, { status })
    try {
      await updateRemote.mutateAsync({ id, payload: { status } })
    } catch (e) {
      if (previous) updateLocal(id, { status: previous.status })
      console.error(e)
    }
  }, [jobs, updateLocal, updateRemote])

  return { cards: jobs, moveCard }
}

export default useKanban
