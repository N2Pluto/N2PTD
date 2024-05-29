// /api/reservation/room/checkRoom.ts
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  try {
    // Step 1: Fetch all room_id from the Reservation table
    const { data: reservations, error: reservationError } = await supabase.from('Reservation').select('room_id')

    if (reservationError) {
      return res.status(500).json({ error: reservationError.message })
    }

    // Group by room_id and count
    const counts = reservations.reduce((acc, reservation) => {
      acc[reservation.room_id] = (acc[reservation.room_id] || 0) + 1

      return acc
    }, {})

    // Step 2: Update the bed_available field in the Dormitory_Room table
    for (const room_id in counts) {
      const count = counts[room_id]

      const { error: updateError } = await supabase
        .from('Dormitory_Room')
        .update({ bed_available: count })
        .eq('room_id', room_id)

      if (updateError) {
        return res.status(500).json({ error: updateError.message })
      }
    }

    return res.status(200).json({ message: 'Bed availability updated successfully' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export default handler
