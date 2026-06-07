import React, { useState } from 'react'
import Modal from '../../common/Modal'
import Input from '../../common/Input'
import Button from '../../common/Button'
import { Priority, KanbanStatus, type JobCard } from './kanban.types'

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (card: Omit<JobCard, 'id'>) => void
}

const AddCardModal: React.FC<Props> = ({ open, onClose, onAdd }) => {
  const [company, setCompany] = useState('')
  const [title, setTitle] = useState('')
  const [website, setWebsite] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [nextActionDate, setNextActionDate] = useState('')
  const [recruiterName, setRecruiterName] = useState('')
  const [recruiterEmail, setRecruiterEmail] = useState('')
  const [workMode, setWorkMode] = useState('')
  const [roleType, setRoleType] = useState('')
  const [notes, setNotes] = useState('')
  const [priority, setPriority] = useState<Priority>(Priority.Medium)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const reset = () => {
    setCompany('')
    setTitle('')
    setWebsite('')
    setJobUrl('')
    setNextActionDate('')
    setRecruiterName('')
    setRecruiterEmail('')
    setWorkMode('')
    setRoleType('')
    setNotes('')
    setPriority(Priority.Medium)
    setError('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const submit = async () => {
    if (!company.trim() || !title.trim()) {
      setError('Company and role are required.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await onAdd({
        company: company.trim(),
        title: title.trim(),
        website: website.trim() || undefined,
        jobUrl: jobUrl.trim() || undefined,
        nextActionDate: nextActionDate ? new Date(nextActionDate).toISOString() : undefined,
        recruiter: {
          name: recruiterName.trim() || undefined,
          email: recruiterEmail.trim() || undefined,
        },
        companyInfo: {
          website: website.trim() || undefined,
          workMode: workMode ? workMode as 'Remote' | 'Hybrid' | 'Onsite' : undefined,
          roleType: roleType ? roleType as 'Full-time' | 'Contract' : undefined,
        },
        notes: notes.trim() || undefined,
        appliedDate: new Date().toISOString(),
        priority,
        status: KanbanStatus.Wishlist,
      })
      reset()
      onClose()
    } catch {
      setError('Failed to add job. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Add Job Application" open={open} onClose={handleClose}>
      <div className="max-h-[72vh] space-y-4 overflow-y-auto pr-1">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input id="add-company" label="Company *" value={company} onChange={setCompany} placeholder="e.g. Google" />
          <Input id="add-role" label="Role *" value={title} onChange={setTitle} placeholder="e.g. Frontend Engineer" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input id="add-website" label="Company Website" value={website} onChange={setWebsite} placeholder="https://company.com" type="url" />
          <Input id="add-url" label="Job URL" value={jobUrl} onChange={setJobUrl} placeholder="https://careers.company.com/..." type="url" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input id="add-next-action" label="Next Action Date" value={nextActionDate} onChange={setNextActionDate} type="date" />
          <div className="flex flex-col gap-1">
            <label htmlFor="add-priority" className="text-xs font-medium text-slate-600">Priority</label>
            <select
              id="add-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={Priority.High}>High</option>
              <option value={Priority.Medium}>Medium</option>
              <option value={Priority.Low}>Low</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="add-work-mode" className="text-xs font-medium text-slate-600">Work Mode</label>
            <select
              id="add-work-mode"
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Not set</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="add-role-type" className="text-xs font-medium text-slate-600">Role Type</label>
            <select
              id="add-role-type"
              value={roleType}
              onChange={(e) => setRoleType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Not set</option>
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <Input id="add-recruiter" label="Recruiter" value={recruiterName} onChange={setRecruiterName} placeholder="Recruiter name" />
          <Input id="add-recruiter-email" label="Recruiter Email" value={recruiterEmail} onChange={setRecruiterEmail} placeholder="name@company.com" type="email" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="add-notes" className="text-xs font-medium text-slate-600">Notes</label>
          <textarea
            id="add-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any notes about this role..."
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="secondary" onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button variant="primary" onClick={submit} disabled={loading}>
            {loading ? 'Adding...' : 'Add Job'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default AddCardModal
