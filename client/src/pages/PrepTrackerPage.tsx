import React, { useState, useRef } from 'react'
import useTopics from '../hooks/useTopics'
import { useJobs } from '../hooks/useJobs'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import type { TopicCategory, TopicStatus, Topic } from '../components/features/kanban/kanban.types'

const STATUS_LABELS: Record<TopicStatus, { label: string; bg: string; text: string }> = {
  not_started: { label: 'Not Started', bg: 'bg-slate-100', text: 'text-slate-600' },
  in_progress: { label: 'In Progress', bg: 'bg-amber-100', text: 'text-amber-700' },
  revised: { label: 'Revised', bg: 'bg-indigo-100', text: 'text-indigo-700' },
  confident: { label: 'Confident', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  needs_revision: { label: 'Needs Revision', bg: 'bg-red-100', text: 'text-red-700' },
}

const PrepTrackerPage = () => {
  const { data: topics = [], update, create, bulkImport } = useTopics()
  const { data: jobs = [] } = useJobs()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState('')
  
  // Expand topic state
  const [expandedTopic, setExpandedTopic] = useState<Topic | null>(null)

  // Group topics by category
  const groupedTopics = topics.reduce((acc, topic) => {
    if (!acc[topic.category]) acc[topic.category] = []
    acc[topic.category].push(topic)
    return acc
  }, {} as Record<string, typeof topics>)

  const handleStatusChange = (id: string, status: TopicStatus) => {
    update.mutate({ id, payload: { status } })
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newCategory) return
    await create.mutateAsync({ name: newName, category: newCategory })
    setIsAddOpen(false)
    setNewName('')
    setNewCategory('')
  }

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        await bulkImport.mutateAsync(json)
        alert('Successfully imported topics/questions!')
      } catch (err) {
        alert('Invalid JSON file format. Ensure it is an array of { name, category, questions }')
      }
    }
    reader.readAsText(file)
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Find all real interview questions linked to a topic across all jobs
  const getLinkedQuestions = (topicSlug: string, topicName: string) => {
    const questions: { text: string; company: string; quality: string }[] = []
    jobs.forEach(job => {
      job.questionsAskedToMe?.forEach(q => {
        // Tag could match exact slug or exact name (case insensitive)
        const tagsLower = q.topicTags.map(t => t.toLowerCase())
        if (tagsLower.includes(topicSlug.toLowerCase()) || tagsLower.includes(topicName.toLowerCase())) {
          questions.push({ text: q.text, company: job.company, quality: q.myAnswerQuality })
        }
      })
    })
    return questions
  }

  return (
    <div className="pb-10">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1">
            Topic & Technology Tracker
          </p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Prep Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 max-w-xl">
            Track your interview preparation across different technologies. Click a topic to see practice questions and real questions asked by companies.
          </p>
        </div>
        
        <div className="flex gap-2 self-start sm:self-auto shrink-0">
          <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleFileImport} />
          <Button variant="secondary" size="md" onClick={() => fileInputRef.current?.click()}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Import JSON
          </Button>
          <Button variant="primary" size="md" onClick={() => setIsAddOpen(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Topic
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {Object.entries(groupedTopics).map(([category, items]) => {
          const total = items.length
          const confident = items.filter(t => t.status === 'confident').length
          const progress = total > 0 ? Math.round((confident / total) * 100) : 0

          return (
            <section key={category} className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
              {/* Header */}
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">{category}</h3>
                  <span className="text-sm font-medium text-slate-500">{progress}%</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Topics List */}
              <div className="flex-1 overflow-y-auto p-4 max-h-[400px]">
                <ul className="space-y-3">
                  {items.map(topic => {
                    const realQuestions = getLinkedQuestions(topic.slug, topic.name)
                    const totalQs = (topic.practiceQuestions?.length || 0) + realQuestions.length
                    
                    return (
                      <li key={topic.id} className="flex flex-col gap-2 rounded-lg border border-slate-100 p-2 text-sm hover:border-slate-200 transition-colors">
                        <div className="flex items-center justify-between gap-3">
                          <button 
                            className="min-w-0 flex-1 text-left cursor-pointer group"
                            onClick={() => setExpandedTopic(expandedTopic?.id === topic.id ? null : topic)}
                          >
                            <p className="font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">{topic.name}</p>
                            {totalQs > 0 && (
                              <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                                {totalQs} question{totalQs > 1 ? 's' : ''} inside
                              </p>
                            )}
                          </button>
                          
                          <select
                            value={topic.status || 'not_started'}
                            onChange={(e) => handleStatusChange(topic.id, e.target.value as TopicStatus)}
                            className={`shrink-0 cursor-pointer appearance-none rounded-md px-2.5 py-1 text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${STATUS_LABELS[topic.status || 'not_started'].bg} ${STATUS_LABELS[topic.status || 'not_started'].text}`}
                            style={{ textAlignLast: 'center' }}
                          >
                            {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                              <option key={key} value={key} className="bg-white text-slate-800">
                                {label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Expanded details */}
                        {expandedTopic?.id === topic.id && (
                          <div className="mt-2 border-t border-slate-100 pt-3 space-y-4">
                            
                            {/* Practice Questions */}
                            {(topic.practiceQuestions?.length || 0) > 0 && (
                              <div>
                                <h5 className="text-[10px] uppercase font-bold text-slate-400 mb-1">Practice Questions</h5>
                                <ul className="list-disc pl-4 space-y-1">
                                  {topic.practiceQuestions?.map((pq, i) => (
                                    <li key={i} className="text-xs text-slate-600">{pq}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Real Interview Questions */}
                            {realQuestions.length > 0 && (
                              <div>
                                <h5 className="text-[10px] uppercase font-bold text-slate-400 mb-1">Asked in Interviews</h5>
                                <div className="space-y-2">
                                  {realQuestions.map((rq, i) => (
                                    <div key={i} className="bg-slate-50 p-2 rounded-md border border-slate-100">
                                      <p className="text-xs text-slate-700 font-medium mb-1">"{rq.text}"</p>
                                      <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-semibold text-indigo-600">🏢 {rq.company}</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${rq.quality === 'Missed' ? 'bg-red-100 text-red-600' : rq.quality === 'Good' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                          {rq.quality}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {totalQs === 0 && (
                              <p className="text-xs text-slate-400 italic">No questions found for this topic.</p>
                            )}
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </section>
          )
        })}
      </div>

      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Custom Topic">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input 
            id="topic-name" 
            label="Topic Name" 
            placeholder="e.g. Server Components" 
            value={newName} 
            onChange={setNewName} 
            required 
          />
          <Input 
            id="topic-category" 
            label="Tech Stack / Category" 
            placeholder="e.g. Next.js" 
            value={newCategory} 
            onChange={setNewCategory} 
            required 
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Topic</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default PrepTrackerPage
