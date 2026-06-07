import useTopics from '../../../hooks/useTopics'
import type { Topic, TopicCategory } from '../kanban/kanban.types'

const categories: TopicCategory[] = ['React', 'Node.js', 'DSA', 'System Design', 'MongoDB', 'DevOps', 'TypeScript', 'Behavioral']

const isCovered = (topic: Topic) => ['revised', 'confident'].includes(topic.status)

const PrepProgressPanel = () => {
  const { data: topics = [], isLoading } = useTopics()
  const topicsLeft = topics.filter((topic) => !isCovered(topic)).length
  const weakestTopics = topics
    .filter((topic) => ['not_started', 'needs_revision'].includes(topic.status))
    .slice(0, 4)
  const studyToday = weakestTopics[0] || topics.find((topic) => topic.status === 'in_progress') || topics[0]

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Prep Progress</h2>
          <p className="text-xs text-slate-500">{isLoading ? 'Loading topics...' : `${topicsLeft} topics left to cover`}</p>
        </div>
        {studyToday && (
          <span className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            Study: {studyToday.name}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {categories.map((category) => {
          const categoryTopics = topics.filter((topic) => topic.category === category)
          const covered = categoryTopics.filter(isCovered).length
          const percent = categoryTopics.length ? Math.round((covered / categoryTopics.length) * 100) : 0

          return (
            <div key={category} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-700">{category}</p>
                <span className="text-xs font-bold text-indigo-600">{percent}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${percent}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      {weakestTopics.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Weakest Topics</p>
          <div className="flex flex-wrap gap-2">
            {weakestTopics.map((topic) => (
              <span key={topic.id} className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                {topic.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default PrepProgressPanel
