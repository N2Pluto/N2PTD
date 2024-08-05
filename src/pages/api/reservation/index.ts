//api/reservation/index.ts
import middleware from '../middleware'
import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  middleware(req, res, async () => {
    const { user_id, bed_id, round_id, student_id, email } = req.body

    const client = supabase.client // Get the client to use raw SQL for locking

    try {
      await client.transaction(async trx => {
        // Lock the specific bed row to ensure no other transaction can modify it simultaneously
        const lockQuery = `SELECT * FROM Dormitory_Bed WHERE bed_id = $1 FOR UPDATE`
        const { data: bedData, error: bedError } = await trx.raw(lockQuery, [bed_id])
        if (bedError || bedData.length === 0) throw new Error('Bed not found or error locking the bed row')

        const room_id = bedData[0].room_id

        // Fetch dorm_id from Dormitory_Room table
        const { data: roomData, error: roomError } = await trx
          .from('Dormitory_Room')
          .select('dorm_id')
          .eq('room_id', room_id)
        if (roomError || roomData.length === 0) throw new Error('Room not found or error fetching room data')
        const dorm_id = roomData[0].dorm_id

        // Insert reservation
        const { data, error } = await trx.from('Reservation').insert([
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
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
}

export default handler
