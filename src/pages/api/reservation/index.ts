import middleware from '../middleware'
import supabase from 'src/libs/supabase'

async function updateBedAvailable(room_id) {
  try {
    // ดึงข้อมูลของห้องพักที่เกี่ยวข้อง
    const { data: roomData, error: roomError } = await supabase
      .from('Dormitory_Room')
      .select('bed_available')
      .eq('room_id', room_id)

    if (roomError) {
      throw new Error('Error fetching data from Dormitory_Room table')
    }

    const currentBedAvailable = roomData[0].bed_available
    const newBedAvailable = currentBedAvailable + 1

    // อัปเดตค่าของ bed_available
    const { error: updateError } = await supabase
      .from('Dormitory_Room')
      .update({ bed_available: newBedAvailable })
      .eq('room_id', room_id)

    if (updateError) {
      throw new Error('Error updating bed_available in Dormitory_Room table')
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

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
      }

      // เมื่อ Insert สำเร็จให้ทำการอัปเดตค่า bed_available
      await updateBedAvailable(room_id)

      res.status(200).json({ message: 'Insert successful' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
}

export default handler
