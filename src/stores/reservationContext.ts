import { create } from 'zustand'

export interface IReservation {
    reservation_id: string
    dorm_id: number
    room_id: number
    bed_id: number
    
}

type StoreType = {
    reservation: IReservation | null
    setReservation: (data: IReservation | null) => void
    clearStore: () => void
}

const initialState = {
    reservation: null as IReservation
}

export const reservationStore = create<StoreType>(set => ({
    ...initialState,
    setReservation: data => set({ reservation: data }),
    clearStore: () => set({ ...initialState })
}))
