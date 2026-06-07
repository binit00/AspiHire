import React from 'react'
import type { ButtonProps } from './Button.types'

const variantStyles: Record<string, string> = {
  primary:   'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 active:bg-slate-100 shadow-sm',
  danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
  ghost:     'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200',
}

const sizeStyles: Record<string, string> = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  variant = 'primary',
  size = 'md',
}) => {
  const vStyle = variantStyles[variant] ?? variantStyles.primary
  const sStyle = sizeStyles[size] ?? sizeStyles.md
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-colors duration-150 focus-ring
        disabled:opacity-50 disabled:cursor-not-allowed
        ${vStyle} ${sStyle} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
