export interface ButtonProps {
  children:  React.ReactNode
  onClick?:  () => void
  disabled?: boolean
  className?: string
  type?:     'button' | 'submit' | 'reset'
  variant?:  'primary' | 'secondary' | 'danger' | 'ghost'
  size?:     'sm' | 'md' | 'lg'
}
