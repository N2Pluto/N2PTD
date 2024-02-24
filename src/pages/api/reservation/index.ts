import middleware from '../middleware'
import supabase from 'src/libs/supabase'
import { v4 as uuidv4 } from 'uuid'

function handler(req: any, res: any) {
  middleware(req, res, async () => {
    const { user_id, dorm_id, room_id, bed_id } = req.body

    try {
      const { data, error } = await supabase.from('Reservation').insert([
        {
          user_id,
          dorm_id,
          room_id,
          bed_id
        }
      ])

      if (error) {
        throw new Error('Error inserting data into Reservation table')
      } else {
        // Fetch the current bed_available for the room
        const { data: roomData, error: roomError } = await supabase
          .from('Dormitory_Room')
          .select('bed_available')
          .eq('room_id', room_id)

        if (roomError) {
          throw new Error('Error fetching data from Dormitory_Room table')
        }

        // Decrement the bed_available by 1
        const newBedAvailable = roomData[0].bed_available + 1

        // Update the bed_available in the Dormitory_Room table
        const { error: updateError } = await supabase
          .from('Dormitory_Room')
          .update({ bed_available: newBedAvailable })
          .eq('room_id', room_id)

        if (updateError) {
          throw new Error('Error updating data in Dormitory_Room table')
        }

        res.status(200).json({ data })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
}

export default handler
