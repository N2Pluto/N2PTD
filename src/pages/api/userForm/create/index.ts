// /api/userForm/create/index.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { user_id, newBuilding, newRoom, newBed } = req.body
  console.log(req.body)

  const { data, error } = await supabase
    .from('Form_ChangeRoom')
    .insert([{ user_id: user_id, newBuilding: newBuilding, newRoom: newRoom, newBed: newBed }])

  if (error) {
    return res.status(500).json({ error: error.message })
    console.error(error.message)
  }

  return res.status(200).json(data)
}

export default handler
