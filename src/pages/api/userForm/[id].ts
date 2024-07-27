// /api/userForm/[id].ts


import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  // Extract id from the URL path
  const { id } = req.query

  const { data, error } = await supabase
    .from('Dormitory_Resident')
    .select(
      `
      *,
      Dormitory_Building: dorm_id (*),
      Dormitory_Room: room_id (*),
      Dormitory_Bed: bed_id (*) 
    `
    )
    .eq('user_id', id) // Use 'user_id' field to match the id
    .single()

  if (error) return res.status(500).json({ error: error.message })

  return res.status(200).json(data)
}

export default handler
