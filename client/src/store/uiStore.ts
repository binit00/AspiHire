import { create } from 'zustand'

interface UIState {
  isModalOpen: boolean
  setModalOpen: (v: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  setModalOpen: (v: boolean) => set({ isModalOpen: v }),
}))

export default useUIStore
