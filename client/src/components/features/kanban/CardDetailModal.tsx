import React, { useState } from 'react'
import Modal from '../../common/Modal'
import Badge from '../../common/Badge'
import type { JobCard, InterviewRound, Question, RoundType, QuestionDifficulty, AnswerQuality } from './kanban.types'
import { useJobs } from '../../../hooks/useJobs'
import Button from '../../common/Button'

interface Props {
  open: boolean
  onClose: () => void
  card?: JobCard
}

type TabId = 'info' | 'timeline' | 'questions' | 'offer'

const tabs: { id: TabId; label: string }[] = [
  { id: 'info', label: 'Company Info' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'questions', label: 'Questions' },
  { id: 'offer', label: 'Offer' },
]

const formatDate = (iso?: string) => {
  if (!iso) return 'Not set'
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

const InfoRow: React.FC<{ label: string; children?: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
    <span className="text-sm text-slate-700">{children || <span className="text-slate-400">Not set</span>}</span>
  </div>
)

const CardDetailModal: React.FC<Props> = ({ open, onClose, card }) => {
  const [activeTab, setActiveTab] = useState<TabId>('info')
  const [showRoundForm, setShowRoundForm] = useState(false)
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [newRound, setNewRound] = useState({ name: '', type: 'React' as RoundType, date: '', duration: '', interviewers: '' })
  const [newQuestion, setNewQuestion] = useState({ text: '', difficulty: 'Medium' as QuestionDifficulty, myAnswerQuality: 'Good' as AnswerQuality, topicTags: '' })
  
  const jobsQuery = useJobs()
  if (!card) return null

  const companyInfo = card.companyInfo ?? {}
  const recruiter = card.recruiter ?? {}
  const rounds = card.interviewRounds ?? []
  const askedToMe = card.questionsAskedToMe ?? []
  const myQuestions = card.questionsIAsked ?? []
  const offer = card.offer

  return (
    <Modal title={`${card.company} - ${card.title}`} open={open} onClose={onClose}>
      <div className="max-h-[72vh] overflow-y-auto pr-1">
        <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
            {card.company.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900">{card.company}</p>
            <p className="text-sm text-slate-500">{card.title}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{card.status}</span>
              <Badge label={card.priority} priority={card.priority} />
            </div>
          </div>
        </div>

        <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors focus-ring ${
                activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'info' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow label="Company">{card.company}</InfoRow>
            <InfoRow label="Role">{card.title}</InfoRow>
            <InfoRow label="Website">{card.website || companyInfo.website}</InfoRow>
            <InfoRow label="LinkedIn">{companyInfo.linkedIn}</InfoRow>
            <InfoRow label="Industry">{companyInfo.industry}</InfoRow>
            <InfoRow label="Company Size">{companyInfo.companySize}</InfoRow>
            <InfoRow label="HQ Location">{companyInfo.hqLocation}</InfoRow>
            <InfoRow label="Applied Date">{formatDate(card.appliedDate)}</InfoRow>
            <InfoRow label="Next Action">{formatDate(card.nextActionDate)}</InfoRow>
            <InfoRow label="Recruiter">{recruiter.name}</InfoRow>
            <InfoRow label="Recruiter Email">{recruiter.email}</InfoRow>
            <InfoRow label="Recruiter LinkedIn">{recruiter.linkedIn}</InfoRow>
            <InfoRow label="CTC Offered">{companyInfo.ctcOffered}</InfoRow>
            <InfoRow label="Notice Period">{companyInfo.noticePeriod}</InfoRow>
            <InfoRow label="Work Mode">{companyInfo.workMode}</InfoRow>
            <InfoRow label="Role Type">{companyInfo.roleType}</InfoRow>
            <InfoRow label="Job URL">
              {card.jobUrl ? (
                <a className="text-indigo-600 hover:underline" href={card.jobUrl} target="_blank" rel="noreferrer">
                  Open posting
                </a>
              ) : undefined}
            </InfoRow>
            <div className="sm:col-span-2">
              <InfoRow label="Job Description">{companyInfo.jobDescription}</InfoRow>
            </div>
            <div className="sm:col-span-2">
              <InfoRow label="Notes">{card.notes}</InfoRow>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-semibold text-slate-800">Interview History</h4>
              <Button size="sm" variant="secondary" onClick={() => setShowRoundForm(!showRoundForm)}>
                {showRoundForm ? 'Cancel' : '+ Add Round'}
              </Button>
            </div>

            {showRoundForm && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 mb-4 space-y-3">
                <input className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none" placeholder="Round Name (e.g. Technical 1)" value={newRound.name} onChange={e => setNewRound(prev => ({...prev, name: e.target.value}))} />
                <div className="flex gap-2">
                  <input type="date" className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none" value={newRound.date} onChange={e => setNewRound(prev => ({...prev, date: e.target.value}))} />
                  <input className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none" placeholder="Duration (e.g. 45m)" value={newRound.duration} onChange={e => setNewRound(prev => ({...prev, duration: e.target.value}))} />
                </div>
                <Button size="sm" variant="primary" onClick={async () => {
                  if (!newRound.name) return
                  const rounds = [...(card.interviewRounds || []), { ...newRound, id: Date.now().toString(), status: 'Scheduled' as const }]
                  await jobsQuery.update.mutateAsync({ id: card.id, payload: { interviewRounds: rounds } })
                  setShowRoundForm(false)
                  setNewRound({ name: '', type: 'React', date: '', duration: '', interviewers: '' })
                }}>Save Round</Button>
              </div>
            )}

            {rounds.length === 0 && !showRoundForm && <p className="text-sm text-slate-400">No interview rounds logged yet.</p>}
            {rounds.map((round) => (
              <div key={round.id} className="border-l-2 border-indigo-200 pl-4">
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-slate-800">{round.name}</p>
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">{round.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{formatDate(round.date)} · {round.type} · {round.duration || 'Duration not set'}</p>
                  <p className="mt-1 text-xs text-slate-500">Interviewers: {round.interviewers || 'Not set'}</p>
                  {round.rating && <p className="mt-1 text-xs text-slate-500">Self rating: {round.rating}/5</p>}
                  {round.notes && <p className="mt-2 whitespace-pre-line text-sm text-slate-600">{round.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-5">
            <section>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold text-slate-800">Questions Asked to Me</h4>
                <Button size="sm" variant="secondary" onClick={() => setShowQuestionForm(!showQuestionForm)}>
                  {showQuestionForm ? 'Cancel' : '+ Add Question'}
                </Button>
              </div>

              {showQuestionForm && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 mb-4 space-y-3">
                  <textarea className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none" placeholder="What was the question?" rows={2} value={newQuestion.text} onChange={e => setNewQuestion(prev => ({...prev, text: e.target.value}))} />
                  <div className="flex gap-2">
                    <select className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none" value={newQuestion.difficulty} onChange={e => setNewQuestion(prev => ({...prev, difficulty: e.target.value as QuestionDifficulty}))}>
                      <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
                    </select>
                    <select className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none" value={newQuestion.myAnswerQuality} onChange={e => setNewQuestion(prev => ({...prev, myAnswerQuality: e.target.value as AnswerQuality}))}>
                      <option value="Good">Good</option><option value="Partial">Partial</option><option value="Missed">Missed</option>
                    </select>
                  </div>
                  <input className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none" placeholder="Topics (comma separated e.g. React, Event Loop)" value={newQuestion.topicTags} onChange={e => setNewQuestion(prev => ({...prev, topicTags: e.target.value}))} />
                  
                  <Button size="sm" variant="primary" onClick={async () => {
                    if (!newQuestion.text) return
                    const tags = newQuestion.topicTags.split(',').map(s => s.trim()).filter(Boolean)
                    const q: Question = { ...newQuestion, id: Date.now().toString(), topicTags: tags, addedToRevision: newQuestion.myAnswerQuality === 'Missed' }
                    await jobsQuery.update.mutateAsync({ id: card.id, payload: { questionsAskedToMe: [...(card.questionsAskedToMe || []), q] } })
                    setShowQuestionForm(false)
                    setNewQuestion({ text: '', difficulty: 'Medium', myAnswerQuality: 'Good', topicTags: '' })
                  }}>Save Question</Button>
                </div>
              )}

              <div className="space-y-2">
                {askedToMe.length === 0 && !showQuestionForm && <p className="text-sm text-slate-400">No questions logged yet.</p>}
                {askedToMe.map((question) => (
                  <div key={question.id} className="rounded-lg border border-slate-200 p-3">
                    <p className="text-sm font-medium text-slate-800">{question.text}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {question.topicTags.join(', ') || 'No topic'} · {question.difficulty} · {question.myAnswerQuality}
                    </p>
                    {question.notes && <p className="mt-2 text-sm text-slate-600">{question.notes}</p>}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h4 className="mb-2 text-sm font-semibold text-slate-800">Questions I Asked Them</h4>
              <div className="space-y-2">
                {myQuestions.length === 0 && <p className="text-sm text-slate-400">No interviewer questions logged yet.</p>}
                {myQuestions.map((question) => (
                  <div key={question.id} className="rounded-lg border border-slate-200 p-3">
                    <p className="text-sm font-medium text-slate-800">{question.text}</p>
                    {question.responseNotes && <p className="mt-2 text-sm text-slate-600">{question.responseNotes}</p>}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'offer' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow label="Fixed">{offer?.fixed}</InfoRow>
            <InfoRow label="Variable">{offer?.variable}</InfoRow>
            <InfoRow label="Joining Date">{formatDate(offer?.expectedJoiningDate)}</InfoRow>
            <InfoRow label="Decision">{offer?.decisionStatus}</InfoRow>
            <InfoRow label="Expiry">{formatDate(offer?.expiryDate)}</InfoRow>
            <InfoRow label="Offer Letter">{offer?.offerLetterUrl}</InfoRow>
            <div className="sm:col-span-2">
              <InfoRow label="Decision Notes">{offer?.notes}</InfoRow>
            </div>
            <div className="sm:col-span-2">
              <h4 className="mb-2 text-sm font-semibold text-slate-800">Competing Offers</h4>
              {(offer?.competingOffers?.length ?? 0) === 0 && <p className="text-sm text-slate-400">No competing offers logged.</p>}
              {offer?.competingOffers?.map((item) => (
                <div key={`${item.company}-${item.ctc}`} className="mb-2 rounded-lg border border-slate-200 p-3 text-sm">
                  <span className="font-semibold text-slate-800">{item.company}</span>
                  <span className="text-slate-500"> · {item.ctc}</span>
                  {item.notes && <p className="mt-1 text-slate-600">{item.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default CardDetailModal
