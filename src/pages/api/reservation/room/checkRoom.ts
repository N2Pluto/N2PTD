// /api/reservation/room/checkRoom.ts
import { NextApiRequest, NextApiResponse } from 'next'
import supabase from 'src/libs/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Step 1: Fetch all room_ids from the Dormitory_Room table
    const { data: allRooms, error: roomsError } = await supabase.from('Dormitory_Room').select('room_id')

    if (roomsError) {
      throw new Error(roomsError.message)
    }

    // Step 2: Fetch all room_ids and bed_ids from the Reservation table
    const { data: reservations, error: reservationError } = await supabase.from('Reservation').select('room_id, bed_id')

    if (reservationError) {
      throw new Error(reservationError.message)
    }

    // Group by room_id and count
    const roomCounts = reservations.reduce((acc, reservation) => {
      acc[reservation.room_id] = (acc[reservation.room_id] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Step 3: Update the bed_available field in the Dormitory_Room table
    const roomUpdates = allRooms.map(async room => {
      const count = roomCounts[room.room_id] || 0 // Default to 0 if the room_id is not in reservations

      const { error: updateError } = await supabase
        .from('Dormitory_Room')
        .update({ bed_available: count })
        .eq('room_id', room.room_id)

      if (updateError) {
        throw new Error(updateError.message)
      }
    })

    // Wait for all room updates to complete
    await Promise.all(roomUpdates)

    // Step 4: Fetch all bed_ids from the Dormitory_Bed table
    const { data: allBeds, error: bedsError } = await supabase.from('Dormitory_Bed').select('bed_id')

    if (bedsError) {
      throw new Error(bedsError.message)
    }

    // Step 5: Update the bed_status field in the Dormitory_Bed table
    const bedUpdates = allBeds.map(async bed => {
      const isReserved = reservations.some(reservation => reservation.bed_id === bed.bed_id)
      const bedStatus = isReserved ? false : true

      const { error: updateError } = await supabase
        .from('Dormitory_Bed')
        .update({ bed_status: bedStatus })
        .eq('bed_id', bed.bed_id)

      if (updateError) {
        throw new Error(updateError.message)
      }
    })

    // Wait for all bed updates to complete
    await Promise.all(bedUpdates)

    res.status(200).json({ message: 'Bed availability and status updated successfully' })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export default handler
