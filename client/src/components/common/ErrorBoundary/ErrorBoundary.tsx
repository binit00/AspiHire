import React from 'react'

interface State {
  hasError: boolean
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h2 className="text-xl font-semibold">Something went wrong.</h2>
          <p>Please refresh the page or contact support.</p>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
