// /api/reservation/checkBedAvailable.ts
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { room_id } = req.query

  try {
    const { data: reservations, error: reservationsError } = await supabase
      .from('Reservation')
      .select('bed_id')
      .eq('room_id', room_id)

    if (reservationsError) {
      throw reservationsError
    }

    const { data: room, error: roomError } = await supabase
      .from('Dormitory_Room')
      .select('bed_capacity')
      .eq('room_id', room_id)

    if (roomError) {
      throw roomError
    }

    const bedAvailability = room[0].bed_capacity - reservations.length

    // Update the bed availability in the Dormitory_Room table
    const { error: updateError } = await supabase
      .from('Dormitory_Room')
      .update({ bed_available: bedAvailability })
      .eq('room_id', room_id)

    if (updateError) {
      throw updateError
    }

    res.status(200).json({ bedAvailability })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error checking bed availability: ' + error.message })
  }
}

export default handler
