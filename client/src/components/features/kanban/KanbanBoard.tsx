import React, { useMemo, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import type { DropResult } from '@hello-pangea/dnd'
import { KanbanStatus, type JobCard } from './kanban.types'
import KanbanCard from './KanbanCard'
import CardDetailModal from './CardDetailModal'
import { useKanban } from '../../../hooks/useKanban'

// Column display config
const COLUMNS: { status: KanbanStatus; label: string; color: string; bg: string; headerBg: string }[] = [
  { status: KanbanStatus.Wishlist,        label: 'Wishlist',      color: '#6366f1', bg: '#eef2ff', headerBg: 'bg-indigo-50'  },
  { status: KanbanStatus.Applied,         label: 'Applied',       color: '#0ea5e9', bg: '#f0f9ff', headerBg: 'bg-sky-50'     },
  { status: KanbanStatus.OAAssignment,    label: 'OA / Assignment', color: '#14b8a6', bg: '#f0fdfa', headerBg: 'bg-teal-50'  },
  { status: KanbanStatus.PhoneScreen,     label: 'Phone Screen',  color: '#f59e0b', bg: '#fffbeb', headerBg: 'bg-amber-50'   },
  { status: KanbanStatus.TechnicalRound1, label: 'Tech Round 1',  color: '#8b5cf6', bg: '#f5f3ff', headerBg: 'bg-violet-50'  },
  { status: KanbanStatus.TechnicalRound2, label: 'Tech Round 2',  color: '#7c3aed', bg: '#f5f3ff', headerBg: 'bg-violet-50'  },
  { status: KanbanStatus.HRRound,         label: 'HR Round',      color: '#ec4899', bg: '#fdf2f8', headerBg: 'bg-pink-50'    },
  { status: KanbanStatus.Offer,           label: 'Offer',         color: '#10b981', bg: '#ecfdf5', headerBg: 'bg-emerald-50' },
  { status: KanbanStatus.Rejected,        label: 'Rejected',      color: '#ef4444', bg: '#fef2f2', headerBg: 'bg-red-50'     },
  { status: KanbanStatus.Withdrawn,       label: 'Withdrawn',     color: '#64748b', bg: '#f8fafc', headerBg: 'bg-slate-50'   },
]

interface KanbanColumnsProps {
  cards:   JobCard[]
  onMove?: (id: string, status: KanbanStatus) => void
  onDelete?: (id: string) => void
}

const KanbanColumns: React.FC<KanbanColumnsProps> = ({ cards, onMove, onDelete }) => {
  const [selectedCard, setSelectedCard] = useState<JobCard | null>(null)

  const grouped = useMemo(() => {
    const map: Record<string, JobCard[]> = {}
    COLUMNS.forEach(({ status }) => (map[status] = []))
    cards.forEach((c) => { if (map[c.status]) map[c.status].push(c) })
    return map
  }, [cards])

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination || !onMove) return
    const srcStatus  = source.droppableId as KanbanStatus
    const destStatus = destination.droppableId as KanbanStatus
    if (srcStatus === destStatus && source.index === destination.index) return
    onMove(draggableId, destStatus)
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4 kanban-scroll">
          {COLUMNS.map(({ status, label, color, bg }) => {
            const count = grouped[status]?.length ?? 0
            return (
              <Droppable droppableId={status} key={status}>
                {(provided, snapshot) => (
                  <section
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col w-64 shrink-0 rounded-xl border border-slate-200 overflow-hidden transition-shadow"
                    style={{
                      background: snapshot.isDraggingOver ? bg : '#f8fafc',
                      boxShadow: snapshot.isDraggingOver ? `0 0 0 2px ${color}40` : undefined,
                    }}
                  >
                    {/* Column header */}
                    <div
                      className="flex items-center justify-between px-3 py-2.5 border-b border-slate-200"
                      style={{ borderTop: `3px solid ${color}` }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ background: color }}
                        />
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                          {label}
                        </h4>
                      </div>
                      <span
                        className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold text-white"
                        style={{ background: color }}
                      >
                        {count}
                      </span>
                    </div>

                    {/* Cards */}
                    <div className="flex flex-col gap-2 p-2 min-h-[8rem] flex-1">
                      {grouped[status]?.map((card, idx) => (
                        <Draggable key={card.id} draggableId={card.id} index={idx}>
                          {(prov, snap) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              style={{
                                ...prov.draggableProps.style,
                                opacity: snap.isDragging ? 0.85 : 1,
                                transform: snap.isDragging
                                  ? `${prov.draggableProps.style?.transform} rotate(2deg)`
                                  : prov.draggableProps.style?.transform,
                              }}
                            >
                              <KanbanCard
                                card={card}
                                onClick={setSelectedCard}
                                onEdit={(id) => setSelectedCard(cards.find(c => c.id === id) ?? null)}
                                onDelete={onDelete}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {/* Empty state */}
                      {count === 0 && !snapshot.isDraggingOver && (
                        <div className="flex flex-col items-center justify-center flex-1 py-6 text-slate-300">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="3"/>
                            <path d="M9 9h6M9 12h6M9 15h4"/>
                          </svg>
                          <p className="mt-2 text-[11px]">Drop cards here</p>
                        </div>
                      )}
                    </div>
                  </section>
                )}
              </Droppable>
            )
          })}
        </div>
      </DragDropContext>

      {/* Card detail modal */}
      <CardDetailModal
        open={!!selectedCard}
        card={selectedCard ?? undefined}
        onClose={() => setSelectedCard(null)}
      />
    </>
  )
}

// Data-connected variant (uses hooks)
const KanbanBoardWithData: React.FC = () => {
  const { cards, moveCard } = useKanban()
  return <KanbanColumns cards={cards} onMove={moveCard} />
}

// Public API — accepts local cards prop or fetches from API
const KanbanBoard: React.FC<{
  cards?:    JobCard[]
  onMove?:   (id: string, status: KanbanStatus) => void
  onDelete?: (id: string) => void
}> = ({ cards, onMove, onDelete }) => {
  if (cards) {
    return <KanbanColumns cards={cards} onMove={onMove} onDelete={onDelete} />
  }
  return <KanbanBoardWithData />
}

export default KanbanBoard
