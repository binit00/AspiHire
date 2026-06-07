import React from 'react'
import type { JobCard } from './kanban.types'
import Badge from '../../common/Badge'

interface Props {
  card:      JobCard
  onEdit?:   (id: string) => void
  onDelete?: (id: string) => void
  onClick?:  (card: JobCard) => void
}

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return iso
  }
}

const isOverdue = (iso?: string) => {
  if (!iso) return false
  const target = new Date(iso)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return target < today
}

// Company initials avatar
const CompanyAvatar: React.FC<{ company: string; logoUrl?: string; website?: string }> = ({ company, logoUrl, website }) => {
  const initials = company.slice(0, 2).toUpperCase()
  const hue = [...company].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  const faviconUrl = website ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(website)}&sz=64` : undefined
  const imageUrl = logoUrl || faviconUrl

  if (imageUrl) {
    return (
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0">
        <img src={imageUrl} alt="" className="h-6 w-6 object-contain" />
      </div>
    )
  }

  return (
    <div
      className="flex items-center justify-center w-9 h-9 rounded-lg text-white text-xs font-bold shrink-0 select-none"
      style={{ background: `hsl(${hue},60%,45%)` }}
    >
      {initials}
    </div>
  )
}

const KanbanCard: React.FC<Props> = ({ card, onEdit, onDelete, onClick }) => {
  const hasCalendar = card.interviewRounds?.some((round) => round.calendarLinked)
  const hasOffer = Boolean(card.offer || card.status === 'Offer')
  const overdue = isOverdue(card.nextActionDate)

  return (
    <div
      className="kanban-card bg-white rounded-xl border border-slate-200 shadow-sm p-3 cursor-pointer animate-fadeIn"
      onClick={() => onClick?.(card)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(card) }}
    >
      {/* Top row: avatar + company/title */}
      <div className="flex items-start gap-3">
        <CompanyAvatar company={card.company} logoUrl={card.logoUrl} website={card.website || card.companyInfo?.website} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
            {card.company}
          </p>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            {card.title}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="inline-flex max-w-full items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
          {card.status}
        </span>
        <div className="flex items-center gap-1 text-slate-400">
          {hasCalendar && <span title="Calendar linked">Cal</span>}
          {card.notes && <span title="Notes present">Notes</span>}
          {hasOffer && <span title="Offer received">Offer</span>}
        </div>
      </div>

      {card.nextActionDate && (
        <div className={`mt-2 rounded-lg px-2 py-1 text-[11px] font-medium ${overdue ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-500'}`}>
          Next action: {formatDate(card.nextActionDate)}
        </div>
      )}

      {/* Bottom row: badge + date + actions */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
        <Badge label={card.priority} priority={card.priority} />

        <div className="flex items-center gap-1">
          {/* Applied date */}
          <span className="text-[11px] text-slate-400 mr-1">
            {formatDate(card.appliedDate)}
          </span>

          {/* Edit button */}
          <button
            id={`card-edit-${card.id}`}
            aria-label={`Edit ${card.company}`}
            onClick={(e) => { e.stopPropagation(); onEdit?.(card.id) }}
            className="flex items-center justify-center w-6 h-6 rounded-md text-slate-400
              hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus-ring"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>

          {/* Delete button */}
          <button
            id={`card-delete-${card.id}`}
            aria-label={`Delete ${card.company}`}
            onClick={(e) => { e.stopPropagation(); onDelete?.(card.id) }}
            className="flex items-center justify-center w-6 h-6 rounded-md text-slate-400
              hover:text-red-600 hover:bg-red-50 transition-colors focus-ring"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Notes preview (optional) */}
      {card.notes && (
        <p className="mt-2 text-[11px] text-slate-400 italic truncate border-t border-slate-100 pt-2">
          {card.notes}
        </p>
      )}
    </div>
  )
}

export default React.memo(KanbanCard)
