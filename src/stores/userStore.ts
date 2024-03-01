import { create } from 'zustand'

export interface IUser {
  religion: any
  region: any
  student_year: any
  room_id: any
  dorm_id: any
  user_id: string
  student_id: number
  email: string
  name: string
  lastname: string
  school: string
  course: string
  bed_id: string
  major: string
  gender: string
  facebook: string
  instagram: string
  phone: string
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
