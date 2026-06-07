import React from 'react'
import type { BadgeProps } from './Badge.types'

const priorityStyles: Record<string, string> = {
  High:   'bg-red-50 text-red-700 border border-red-200',
  Medium: 'bg-amber-50 text-amber-700 border border-amber-200',
  Low:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
}

const Badge: React.FC<BadgeProps> = ({ label, priority, className = '' }) => {
  const style = priority ? (priorityStyles[priority] ?? 'bg-slate-100 text-slate-600 border border-slate-200') : 'bg-slate-100 text-slate-600 border border-slate-200'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide ${style} ${className}`}>
      {priority === 'High'   && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 shrink-0" />}
      {priority === 'Medium' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 shrink-0" />}
      {priority === 'Low'    && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 shrink-0" />}
      {label}
    </span>
  )
}

export default Badge
