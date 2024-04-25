// this is /api/admin/create/createBed.ts

import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  const { room_id, bed_capacity } = req.body

  // Create an array of bed objects to insert into the database
  const beds = Array.from({ length: bed_capacity }, (_, i) => ({
    room_id,
    bed_number: i + 1
  }))

  const { error } = await supabase.from('Dormitory_Bed').insert(beds)

  if (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  } else {
    res.status(200).json({ data: { message: 'Beds created successfully' } })
  }
}

export default handler
