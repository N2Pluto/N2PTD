// /api/reservation/room/checkRoomSize.ts
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  try {
    const { dorm_id, room_id } = req.body

    // Fetch the reservations for the given dorm_id and room_id
    const { data: reservations, error: fetchError } = await supabase
      .from('Reservation')
      .select('bed_id')
      .eq('dorm_id', dorm_id)
      .eq('room_id', room_id)

    if (fetchError) {
      console.error('Error fetching reservations:', fetchError)
      return res.status(500).json({ error: 'Failed to fetch reservations' })
    }

    // Fetch all the beds for the given room_id
    const { data: beds, error: bedsError } = await supabase
      .from('Dormitory_Bed')
      .select('bed_id')
      .eq('room_id', room_id)

    if (bedsError) {
      console.error('Error fetching beds:', bedsError)
      return res.status(500).json({ error: 'Failed to fetch beds' })
    }

    // Update the bed_status in Dormitory_Bed for each bed
    for (const bed of beds) {
      const isReserved = reservations.some(reservation => reservation.bed_id === bed.bed_id)
      const { error: updateError } = await supabase
        .from('Dormitory_Bed')
        .update({ bed_status: !isReserved })
        .eq('bed_id', bed.bed_id)

      if (updateError) {
        console.error('Error updating bed_status:', updateError)
        return res.status(500).json({ error: 'Failed to update bed_status' })
      }
    }

    // Fetch the beds for the given room_id where bed_status is false
    const { data: unavailableBeds, error: unavailableBedsError } = await supabase
      .from('Dormitory_Bed')
      .select('*')
      .eq('room_id', room_id)
      .eq('bed_status', false)

    if (unavailableBedsError) {
      console.error('Error fetching beds:', unavailableBedsError)
      return res.status(500).json({ error: 'Failed to fetch beds' })
    }

    // Update the bed_available in Dormitory_Room with the count of beds where bed_status is false
    const { error: updateError } = await supabase
      .from('Dormitory_Room')
      .update({ bed_available: unavailableBeds.length })
      .eq('dorm_id', dorm_id)
      .eq('room_id', room_id)

    if (updateError) {
      console.error('Error updating bed_available:', updateError)
      return res.status(500).json({ error: 'Failed to update bed_available' })
    }

    return res.status(200).json({ message: 'Updated successfully' })
  } catch (error) {
    console.error('Error checking room size:', error)
    return res.status(500).json({ error: 'Failed to check room size' })
  }
}

export default handler
