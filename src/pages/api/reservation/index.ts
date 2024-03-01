//api/reservation/index.ts
import middleware from '../middleware'
import supabase from 'src/libs/supabase'


async function updateBedStatus(bed_id: string) {
  try {
    // อัปเดต bed_status เป็น false สำหรับเตียงที่ถูกจอง
    const { error: updateError } = await supabase
      .from('Dormitory_Bed')
      .update({ bed_status: false })
      .eq('bed_id', bed_id)

    if (updateError) {
      throw new Error('Error updating bed_status in Dormitory_Bed table')
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

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

     
      await updateBedAvailable(room_id)
      await updateBedStatus(bed_id)

      res.status(200).json({ message: 'Insert successful' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
}

export default handler
