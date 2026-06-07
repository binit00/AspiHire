import React from 'react'
import type { InputProps } from './Input.types'

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder = '',
  className = '',
  label,
  id,
  type = 'text',
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-slate-600">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm bg-white text-slate-800 placeholder-slate-400
          border border-slate-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          transition-colors
          ${className}`}
      />
    </div>
  )
}

export default Input
