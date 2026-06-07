import React from 'react'
import type { JobCard, KanbanStatus } from './kanban.types'
import KanbanCard from './KanbanCard'

interface Props {
  status: KanbanStatus
  cards: JobCard[]
}

const KanbanColumn: React.FC<Props> = ({ status, cards }) => {
  return (
    <section className="w-72 p-2">
      <h4 className="font-semibold mb-2">{status}</h4>
      <div>
        {cards.map((c) => (
          <KanbanCard key={c.id} card={c} />
        ))}
      </div>
    </section>
  )
}

export default KanbanColumn
