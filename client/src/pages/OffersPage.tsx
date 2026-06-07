import React, { useState } from 'react'
import { useJobs } from '../hooks/useJobs'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import type { JobCard, JobOffer } from '../components/features/kanban/kanban.types'

const OffersPage = () => {
  const { data: jobs = [], update } = useJobs()
  const jobsWithOffers = jobs.filter((j) => j.offer?.baseSalary) // Basic check if offer exists

  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([])
  
  // Modal State
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingJobId, setEditingJobId] = useState<string>('')
  const [offerForm, setOfferForm] = useState<JobOffer>({
    baseSalary: 0,
    signOnBonus: 0,
    targetBonus: 0,
    equityGrant: 0,
    equityVestingYears: 4,
    vestingSchedule: '25% yearly',
    decisionStatus: 'Evaluating'
  })

  const toggleSelection = (id: string) => {
    if (selectedJobIds.includes(id)) {
      setSelectedJobIds(selectedJobIds.filter((sid) => sid !== id))
    } else {
      if (selectedJobIds.length >= 3) {
        alert("You can only compare up to 3 offers at a time.")
        return
      }
      setSelectedJobIds([...selectedJobIds, id])
    }
  }

  const handleEditClick = (job: JobCard) => {
    setEditingJobId(job.id)
    if (job.offer) {
      setOfferForm(job.offer)
    } else {
      setOfferForm({
        baseSalary: 0,
        signOnBonus: 0,
        targetBonus: 0,
        equityGrant: 0,
        equityVestingYears: 4,
        vestingSchedule: '25% yearly',
        decisionStatus: 'Evaluating'
      })
    }
    setIsEditOpen(true)
  }

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingJobId) return
    await update.mutateAsync({ id: editingJobId, payload: { offer: offerForm, status: 'Offer' } })
    setIsEditOpen(false)
  }

  // Calculate year 1 compensation
  const getYear1Comp = (offer: JobOffer) => {
    const base = offer.baseSalary || 0
    const signOn = offer.signOnBonus || 0
    const target = offer.targetBonus || 0
    
    let equityYearly = 0
    if (offer.equityGrant && offer.equityVestingYears) {
      equityYearly = offer.equityGrant / offer.equityVestingYears
    }
    
    return base + signOn + target + equityYearly
  }

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
  }

  return (
    <div className="pb-10">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1">
            Total Compensation
          </p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Offers & Negotiation
          </h1>
          <p className="mt-1 text-sm text-slate-500 max-w-xl">
            Compare offers side-by-side, analyze 4-year vesting schedules, and maximize your leverage.
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Your Jobs (Select up to 3 to compare)</h3>
        <div className="flex flex-wrap gap-2">
          {jobs.filter(j => j.status === 'Offer' || j.offer?.baseSalary).map((job) => {
            const isSelected = selectedJobIds.includes(job.id)
            const hasOffer = !!job.offer?.baseSalary
            return (
              <div 
                key={job.id} 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
                onClick={() => toggleSelection(job.id)}
              >
                <div className={`w-3 h-3 rounded-full border ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`} />
                <span className="text-sm font-medium text-slate-700">{job.company}</span>
                {!hasOffer && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">No details</span>}
              </div>
            )
          })}
          {jobs.filter(j => j.status === 'Offer' || j.offer?.baseSalary).length === 0 && (
            <p className="text-sm text-slate-400">Move a job to the "Offer" column to see it here.</p>
          )}
        </div>

        {/* Quick way to edit offers that are selected but have no details */}
        {selectedJobIds.map(id => jobs.find(j => j.id === id)).map(job => (
          job && !job.offer?.baseSalary && (
            <div key={`edit-${job.id}`} className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between">
              <span className="text-xs text-amber-800">Please add offer details for <strong>{job.company}</strong> to compare it.</span>
              <Button size="sm" variant="secondary" onClick={() => handleEditClick(job)}>Add Details</Button>
            </div>
          )
        ))}
      </div>

      {/* Comparison Matrix */}
      {selectedJobIds.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {selectedJobIds.map(id => {
            const job = jobs.find(j => j.id === id)
            if (!job) return null
            const offer = job.offer
            if (!offer || !offer.baseSalary) return null

            const y1 = getYear1Comp(offer)
            const y2 = (offer.baseSalary || 0) + (offer.targetBonus || 0) + ((offer.equityGrant || 0) / (offer.equityVestingYears || 4))

            return (
              <div key={job.id} className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-900">{job.company}</h3>
                    <Button size="sm" variant="secondary" onClick={() => handleEditClick(job)}>Edit</Button>
                  </div>
                  <p className="text-sm text-slate-500 font-medium">{job.title}</p>
                </div>

                <div className="p-5 flex-1">
                  <div className="mb-6 rounded-lg bg-emerald-50 p-4 border border-emerald-100 text-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Year 1 Total</p>
                    <p className="text-3xl font-extrabold text-emerald-700">{formatMoney(y1)}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Base Salary</span>
                      <span className="text-sm font-semibold text-slate-800">{formatMoney(offer.baseSalary || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Target Bonus</span>
                      <span className="text-sm font-semibold text-slate-800">{formatMoney(offer.targetBonus || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Sign-on Bonus</span>
                      <span className="text-sm font-semibold text-slate-800">{formatMoney(offer.signOnBonus || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Total Equity</span>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-800">{formatMoney(offer.equityGrant || 0)}</p>
                        <p className="text-[10px] text-slate-400">{offer.equityVestingYears} yr · {offer.vestingSchedule}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-slate-500">Year 2+ Projected</span>
                      <span className="text-sm font-semibold text-slate-800">{formatMoney(y2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Offer Details">
        <form onSubmit={handleSaveOffer} className="space-y-4">
          <Input 
            id="baseSalary" 
            label="Base Salary ($)" 
            type="number"
            value={offerForm.baseSalary?.toString() || ''} 
            onChange={(v) => setOfferForm({ ...offerForm, baseSalary: Number(v) })} 
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              id="signOnBonus" 
              label="Sign-on Bonus ($)" 
              type="number"
              value={offerForm.signOnBonus?.toString() || ''} 
              onChange={(v) => setOfferForm({ ...offerForm, signOnBonus: Number(v) })} 
            />
            <Input 
              id="targetBonus" 
              label="Target Bonus ($)" 
              type="number"
              value={offerForm.targetBonus?.toString() || ''} 
              onChange={(v) => setOfferForm({ ...offerForm, targetBonus: Number(v) })} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              id="equityGrant" 
              label="Total Equity Grant ($)" 
              type="number"
              value={offerForm.equityGrant?.toString() || ''} 
              onChange={(v) => setOfferForm({ ...offerForm, equityGrant: Number(v) })} 
            />
            <Input 
              id="equityVestingYears" 
              label="Vesting Years" 
              type="number"
              value={offerForm.equityVestingYears?.toString() || '4'} 
              onChange={(v) => setOfferForm({ ...offerForm, equityVestingYears: Number(v) })} 
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Vesting Schedule</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={offerForm.vestingSchedule}
              onChange={(e) => setOfferForm({ ...offerForm, vestingSchedule: e.target.value as any })}
            >
              <option value="25% yearly">25% yearly</option>
              <option value="5/15/40/40">5/15/40/40 (e.g. Amazon)</option>
              <option value="1-yr cliff then monthly">1-yr cliff then monthly</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Offer</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default OffersPage