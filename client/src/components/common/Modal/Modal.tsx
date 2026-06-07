import React, { useEffect } from 'react'
import type { ModalProps } from './Modal.types'

const Modal: React.FC<ModalProps> = ({ title, open, onClose, children }) => {
  // Lock body scroll while modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-backdropIn"
      style={{ backgroundColor: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(2px)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 id="modal-title" className="text-base font-semibold text-slate-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400
              hover:text-slate-600 hover:bg-slate-100 transition-colors focus-ring"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
