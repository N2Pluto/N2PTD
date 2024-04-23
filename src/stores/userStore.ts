import { create } from 'zustand'

export interface IUser {
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
  role: string
  activity: string
  personality_pros: string
  personality_cons: string
  sleep: string
  filter_school: string
  filter_major: string
  filter_religion: string
  filter_redflag: string
  image : string
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
