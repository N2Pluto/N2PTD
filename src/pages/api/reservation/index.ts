//api/reservation/index.ts
import middleware from '../middleware'
import supabase from 'src/libs/supabase'

function handler(req: any, res: any) {
  middleware(req, res, async () => {
    const { user_id, bed_id, round_id ,student_id , email} = req.body

    try {
      // Fetch room_id from Dormitory_Bed table
      const { data: bedData, error: bedError } = await supabase
        .from('Dormitory_Bed')
        .select('room_id')
        .eq('bed_id', bed_id)
      if (bedError) throw bedError
      const room_id = bedData[0].room_id

      // Fetch dorm_id from Dormitory_Room table
      const { data: roomData, error: roomError } = await supabase
        .from('Dormitory_Room')
        .select('dorm_id')
        .eq('room_id', room_id)
      if (roomError) throw roomError
      const dorm_id = roomData[0].dorm_id

      const { data, error } = await supabase.from('Reservation').insert([
        {
          user_id,
          bed_id,
          room_id,
          dorm_id,
          round_id
        }
      ])

      if (error) {
        throw new Error('Error inserting data into Reservation table')
      }

      await updateBedAvailable(room_id)
      await updateBedStatus(bed_id)

      res.status(200).json({ message: 'Insert successful' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
}






export default handler
