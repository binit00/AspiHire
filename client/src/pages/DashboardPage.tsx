import { useState } from 'react'
import KanbanBoard from '../components/features/kanban/KanbanBoard'
import AddCardModal from '../components/features/kanban/AddCardModal'
import PrepProgressPanel from '../components/features/prep/PrepProgressPanel'
import NotificationCenter from '../components/features/notifications/NotificationCenter'
import Button from '../components/common/Button'
import ErrorBoundary from '../components/common/ErrorBoundary/ErrorBoundary'
import { KanbanStatus, type JobCard } from '../components/features/kanban/kanban.types'
import { useJobs } from '../hooks/useJobs'

const DashboardPage = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const jobsQuery = useJobs()
  const visibleCards = jobsQuery.data || []

  const handleMove = async (id: string, status: KanbanStatus) => {
    try {
      await jobsQuery.update.mutateAsync({ id, payload: { status } })
    } catch {
      // Reverting is handled by react-query if configured, or just refetch
      jobsQuery.refetch()
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await jobsQuery.remove.mutateAsync(id)
    } catch {
      jobsQuery.refetch()
    }
  }

  const handleAdd = async (payload: Omit<JobCard, 'id'>) => {
    await jobsQuery.create.mutateAsync(payload)
  }

  const total      = visibleCards.length
  const interviews = visibleCards.filter((c) => [
    KanbanStatus.OAAssignment,
    KanbanStatus.PhoneScreen,
    KanbanStatus.TechnicalRound1,
    KanbanStatus.TechnicalRound2,
    KanbanStatus.HRRound,
  ].includes(c.status)).length
  const offers     = visibleCards.filter((c) => c.status === KanbanStatus.Offer).length

  return (
    <>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1">
            AI-powered job tracker
          </p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            HireFlow Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 max-w-xl">
            Drag cards between stages to track every opportunity in one view.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setModalOpen(true)}
          className="self-start sm:self-auto shrink-0"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Job
        </Button>
      </div>

      {/* Quick stats bar */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {[
          { label: 'Total Applications', value: total,      color: 'text-slate-700',   bg: 'bg-white' },
          { label: 'In Interview',       value: interviews, color: 'text-violet-700',  bg: 'bg-violet-50' },
          { label: 'Offers',             value: offers,     color: 'text-emerald-700', bg: 'bg-emerald-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 ${bg}`}>
            <span className={`text-xl font-bold ${color}`}>{value}</span>
            <span className="text-xs text-slate-500 font-medium">{label}</span>
          </div>
        ))}
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <PrepProgressPanel />
        <NotificationCenter />
      </div>

      {/* Kanban board */}
      <ErrorBoundary>
        <KanbanBoard
          cards={visibleCards}
          onMove={handleMove}
          onDelete={handleDelete}
        />
      </ErrorBoundary>

      <AddCardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />
    </>
  )
}

export default DashboardPage
