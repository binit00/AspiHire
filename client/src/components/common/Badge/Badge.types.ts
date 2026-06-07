export type Priority = 'High' | 'Medium' | 'Low'

export interface BadgeProps {
  label: string
  priority?: Priority
  className?: string
}
