// api/reservation/checkStatusRoom.ts
import { NextApiRequest, NextApiResponse } from 'next'
import supabase from 'src/libs/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { dorm_id } = req.query

  if (!dorm_id) {
    return res.status(400).json({ error: 'Missing dorm_id in request query.' })
  }

  try {
    // Fetch Dormitory_Room data from Supabase for the given dorm_id
    const { data, error } = await supabase
      .from('Dormitory_Room')
      .select('room_id, bed_available, status')
      .eq('dorm_id', dorm_id)

    if (error) {
      throw error
    }

    if (data) {
      // Loop through and update data
      for (const room of data) {
        const { room_id, bed_available } = room
        let newStatus: boolean

        // Check bed_available to set new status
        if (bed_available === 4) {
          newStatus = true
        } else {
          newStatus = false
        }

        const { error: updateError } = await supabase
          .from('Dormitory_Room')
          .update({ status: newStatus })
          .eq('room_id', room_id)

        if (updateError) {
          throw updateError
        }
      }

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
