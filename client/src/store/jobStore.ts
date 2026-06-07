import { create } from 'zustand'
import type { JobCard } from '../components/features/kanban/kanban.types'

type JobSlice = {
  jobs: JobCard[]
  setJobs: (j: JobCard[]) => void
  addJob: (j: JobCard) => void
  updateJob: (id: string, patch: Partial<JobCard>) => void
  removeJob: (id: string) => void
}

export const useJobStore = create<JobSlice>((set) => ({
  jobs: [],
  setJobs: (j: JobCard[]) => set({ jobs: j }),
  addJob: (j: JobCard) => set((s) => ({ jobs: [j, ...s.jobs] })),
  updateJob: (id: string, patch: Partial<JobCard>) =>
    set((s) => ({ jobs: s.jobs.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
  removeJob: (id: string) => set((s) => ({ jobs: s.jobs.filter((x) => x.id !== id) })),
}))

export default useJobStore
