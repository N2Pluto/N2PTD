
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { dorm_id } = req.query

  if (!dorm_id) {
    return res.status(400).json({ error: 'Missing dorm_id in request query.' })
  }

  try {
    // Fetch Dormitory_Room data from Supabase for the given dorm_id
    const { data, error } = await supabase
      .from('Dormitory_Room')
      .select('room_id, bed_available, bed_capacity, status ,room_rehearse')
      .eq('dorm_id', dorm_id)

    if (error) {
      throw error
    }

    if (data) {
      // Create an array to store promises for update requests
      const updatePromises = data.map(async (room: any) => {
        const { room_id, bed_available, bed_capacity } = room
        let newStatus: boolean

        // Check bed_available to set new status
        if (bed_available === bed_capacity) {
          newStatus = false
        }else{
          newStatus = true
        }

        // Update the status of the room
        const { error: updateError } = await supabase
          .from('Dormitory_Room')
          .update({ status: newStatus })
          .eq('room_id', room_id)

        if (updateError) {
          throw updateError
        }
      })

      await Promise.all(updatePromises)

      res.status(200).json({ message: 'Room status updated successfully.' })
    } else {
      res.status(404).json({ message: 'No rooms found.' })
    }
  } catch (error) {
    console.error('Error updating room status:', error.message)
    res.status(500).json({ error: 'Internal server error.' })
  }
}

export default handler
