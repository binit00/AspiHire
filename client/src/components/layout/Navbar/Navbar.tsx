import React from 'react'
import useAuthStore from '../../../store/authStore'

const Navbar: React.FC = () => {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const initials = user?.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U'

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between h-14 px-4 md:px-6">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          {/* Logo icon */}
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="5" height="14" rx="1.5" fill="white" fillOpacity="0.9"/>
              <rect x="8" y="1" width="5" height="9" rx="1.5" fill="white" fillOpacity="0.6"/>
            </svg>
          </div>
          <span className="text-base font-semibold text-slate-900 tracking-tight">HireFlow</span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            Beta
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications bell */}
          <button
            id="nav-notifications"
            aria-label="Notifications"
            className="relative flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-ring"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {/* Unread dot */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-slate-200" />

          <button
            type="button"
            onClick={logout}
            className="hidden sm:inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus-ring"
          >
            Logout
          </button>

          {/* User avatar */}
          <button
            id="nav-profile"
            aria-label="User profile"
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors focus-ring"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-semibold select-none">
              {initials}
            </div>
            <span className="hidden md:block text-sm font-medium text-slate-700">{user?.name || 'User'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
