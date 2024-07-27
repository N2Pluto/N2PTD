//this is /api/admin/user/read/[id].ts


import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { id } = req.query

  const { data, error } = await supabase.from('Users_Info').select('*, Users(student_id, role)').eq('id', id)

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  res.status(200).json({ data: data[0] })
}

export default handler
