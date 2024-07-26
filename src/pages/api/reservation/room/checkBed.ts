// /api/reservation/room/checkBed.ts
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  try {
    // Step 1: Fetch all bed_id from the Reservation table
    const { data: reservations, error: reservationError } = await supabase.from('Reservation').select('bed_id, room_id')

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

    // Step 3: Update the bed_status field in the Dormitory_Bed table
    const bedIds = reservations.map(reservation => reservation.bed_id)
    const { error: bedUpdateError } = await supabase
      .from('Dormitory_Bed')
      .update({ bed_status: false })
      .in('bed_id', bedIds)

    if (bedUpdateError) {
      return res.status(500).json({ error: bedUpdateError.message })
    }

    return res.status(200).json({ message: 'Bed availability and status updated successfully' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export default handler
