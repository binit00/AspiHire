import React, { useMemo } from 'react'
import { useJobs } from '../hooks/useJobs'
import { KanbanStatus } from '../components/features/kanban/kanban.types'

const AnalyticsPage = () => {
  const { data: jobs = [] } = useJobs()

  const funnelMetrics = useMemo(() => {
    let applied = 0
    let screened = 0
    let interviewed = 0
    let offered = 0

    jobs.forEach(job => {
      // Anything that is not Wishlist implies it was applied to at some point.
      if (job.status !== 'Wishlist') applied++
      
      // Screened implies Phone Screen or any later stage
      if (['Phone Screen', 'Technical Round 1', 'Technical Round 2', 'HR Round', 'Offer'].includes(job.status)) {
        screened++
      } else if (job.stageHistory?.some(h => ['Phone Screen', 'Technical Round 1', 'Technical Round 2', 'HR Round', 'Offer'].includes(h.stage))) {
        screened++
      }

      // Interviewed implies Technical rounds or later
      if (['Technical Round 1', 'Technical Round 2', 'HR Round', 'Offer'].includes(job.status)) {
        interviewed++
      } else if (job.stageHistory?.some(h => ['Technical Round 1', 'Technical Round 2', 'HR Round', 'Offer'].includes(h.stage))) {
        interviewed++
      }

      // Offered
      if (job.status === 'Offer' || job.stageHistory?.some(h => h.stage === 'Offer')) {
        offered++
      }
    })

    return { applied, screened, interviewed, offered }
  }, [jobs])

  const bottleneck = useMemo(() => {
    const { applied, screened, interviewed, offered } = funnelMetrics
    if (applied === 0) return { stage: 'Resume / Initial Application', drop: 0 }
    
    const dropToScreen = applied > 0 ? ((applied - screened) / applied) * 100 : 0
    const dropToInterview = screened > 0 ? ((screened - interviewed) / screened) * 100 : 0
    const dropToOffer = interviewed > 0 ? ((interviewed - offered) / interviewed) * 100 : 0

    const maxDrop = Math.max(dropToScreen, dropToInterview, dropToOffer)

    if (maxDrop === 0) return { stage: 'None yet', drop: 0 }
    if (maxDrop === dropToScreen) return { stage: 'Resume / Initial Screening', drop: Math.round(maxDrop) }
    if (maxDrop === dropToInterview) return { stage: 'Phone Screen to Tech Rounds', drop: Math.round(maxDrop) }
    return { stage: 'Technical & HR Rounds', drop: Math.round(maxDrop) }
  }, [funnelMetrics])

  return (
    <div className="pb-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1">
          Insights & Analytics
        </p>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Job Search Funnel
        </h1>
        <p className="mt-1 text-sm text-slate-500 max-w-xl">
          Visualize your drop-off rates to identify where your interview pipeline is failing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Funnel Widget */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">Application Pipeline</h3>
          
          <div className="flex-1 flex flex-col justify-center space-y-4 max-w-md mx-auto w-full">
            <FunnelLayer label="Applications" count={funnelMetrics.applied} total={funnelMetrics.applied} color="bg-slate-800" />
            <FunnelLayer label="Phone Screens" count={funnelMetrics.screened} total={funnelMetrics.applied} color="bg-indigo-600" />
            <FunnelLayer label="Tech Interviews" count={funnelMetrics.interviewed} total={funnelMetrics.applied} color="bg-violet-500" />
            <FunnelLayer label="Offers" count={funnelMetrics.offered} total={funnelMetrics.applied} color="bg-emerald-500" />
          </div>
        </section>

        {/* Bottleneck Analysis Widget */}
        <section className="flex flex-col gap-6">
          <div className="rounded-xl border border-red-100 bg-red-50 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Critical Bottleneck
            </h3>
            <p className="text-sm text-red-700 leading-relaxed">
              You are experiencing a <strong>{bottleneck.drop}% drop-off</strong> at the <strong>{bottleneck.stage}</strong> stage. 
              {bottleneck.stage.includes('Resume') && ' Consider revamping your resume formatting or writing tailored cover letters.'}
              {bottleneck.stage.includes('Phone Screen') && ' Focus on behavioral questions and high-level system architecture explanations.'}
              {bottleneck.stage.includes('Technical') && ' You should spend more time in the Prep Tracker practicing real interview questions.'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex-1">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Stage Distribution (Active Jobs)</h3>
            <div className="space-y-3">
              {Object.values(KanbanStatus).filter(s => s !== 'Wishlist' && s !== 'Rejected' && s !== 'Withdrawn').map(status => {
                const count = jobs.filter(j => j.status === status).length
                const totalActive = jobs.filter(j => !['Wishlist', 'Rejected', 'Withdrawn'].includes(j.status)).length
                const pct = totalActive > 0 ? (count / totalActive) * 100 : 0
                return (
                  <div key={status}>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>{status}</span>
                      <span>{count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

const FunnelLayer = ({ label, count, total, color }: { label: string, count: number, total: number, color: string }) => {
  const pct = total > 0 ? (count / total) * 100 : 0
  const widthStr = total === 0 ? '100%' : `${Math.max(pct, 15)}%`

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`flex items-center justify-between px-4 py-3 rounded-lg text-white transition-all duration-700 ${color}`}
        style={{ width: widthStr }}
      >
        <span className="text-xs font-semibold tracking-wider uppercase truncate">{label}</span>
        <span className="text-lg font-bold">{count}</span>
      </div>
      {pct > 0 && pct < 100 && (
        <span className="text-[10px] text-slate-400 mt-1 font-semibold">{Math.round(pct)}% conversion</span>
      )}
    </div>
  )
}

export default AnalyticsPage
