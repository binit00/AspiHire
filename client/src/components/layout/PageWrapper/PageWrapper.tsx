import React from 'react'

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main className="flex-1 min-w-0 p-4 md:p-6 overflow-hidden">
      {children}
    </main>
  )
}

export default PageWrapper
