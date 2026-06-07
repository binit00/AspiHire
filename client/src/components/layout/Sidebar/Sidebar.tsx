import React from 'react'
import { NavLink } from 'react-router-dom'

interface NavItem {
  id:    string
  label: string
  to:    string
  icon:  React.ReactNode
}

const navItems: NavItem[] = [
  {
    id: 'kanban',
    label: 'Kanban Board',
    to: '/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="6" height="18" rx="1.5"/>
        <rect x="9" y="3" width="6" height="12" rx="1.5"/>
        <rect x="17" y="3" width="6" height="15" rx="1.5"/>
      </svg>
    ),
  },
  {
    id: 'prep',
    label: 'Prep Tracker',
    to: '/prep',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    id: 'offers',
    label: 'Offers',
    to: '/offers',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    to: '/analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
  },
  {
    id: 'reminders',
    label: 'Reminders',
    to: '/reminders',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    to: '/settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
]

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white border-r border-slate-200 py-4">
      {/* Nav section */}
      <nav className="flex-1 px-3">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Menu
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.to}
                id={`sidebar-${item.id}`}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-ring ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    {item.label}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer — stats summary */}
      <div className="mx-3 mt-4 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
        <p className="text-xs font-semibold text-indigo-700 mb-1">This week</p>
        <p className="text-[11px] text-indigo-500 leading-relaxed">
          3 applications sent<br />2 interviews scheduled
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
