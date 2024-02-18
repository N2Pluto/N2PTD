// userStore.ts
import { create } from 'zustand'

export interface IUser {
  user_id: string
  student_id: number
  email: string
  dorm_id: string
  room_id: string
  bed_id: string
}

type StoreType = {
  user: IUser | null
  setUser: (data: IUser | null) => void
  clearStore: () => void
}

const initialState = {
  user: null as IUser
}

export const userStore = create<StoreType>(set => ({
  ...initialState,
  setUser: data => set({ user: data }),
  clearStore: () => set({ ...initialState })
}))
