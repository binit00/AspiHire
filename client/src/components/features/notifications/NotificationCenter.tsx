import { useState } from 'react'
import Button from '../../common/Button'
import useNotifications from '../../../hooks/useNotifications'

const filters = ['all', 'interview', 'reminder', 'offer'] as const

const NotificationCenter = () => {
  const [filter, setFilter] = useState<(typeof filters)[number]>('all')
  const { data: notifications = [], markRead, markAllRead } = useNotifications()
  const unreadCount = notifications.filter((notification) => !notification.read).length
  const visible = notifications
    .filter((notification) => filter === 'all' || notification.type === filter)
    .slice(0, 5)

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
          <p className="text-xs text-slate-500">{unreadCount} unread alerts</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => markAllRead.mutate()} disabled={unreadCount === 0}>
          Mark all read
        </Button>
      </div>

      <div className="mb-3 flex flex-wrap gap-1">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-md px-2 py-1 text-xs font-semibold capitalize transition-colors focus-ring ${
              filter === item ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {visible.length === 0 && <p className="text-sm text-slate-400">No notifications yet.</p>}
        {visible.map((notification) => (
          <button
            key={notification.id}
            type="button"
            onClick={() => markRead.mutate(notification.id)}
            className={`w-full rounded-lg border p-3 text-left transition-colors focus-ring ${
              notification.read ? 'border-slate-200 bg-white' : 'border-indigo-200 bg-indigo-50'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-800">{notification.title}</p>
              <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500">{notification.type}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{notification.body}</p>
          </button>
        ))}
      </div>
    </section>
  )
}

export default NotificationCenter
