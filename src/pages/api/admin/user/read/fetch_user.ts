//this is /api/admin/user/read/fetch_user.ts file:

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { id } = req.query // Extract id from request query

  const { data, error } = await supabase
    .from('Users_Info')
    .select('*, Users(student_id, user_id,role,email)')
    .filter('Users.role', 'eq', 'user')
    .order('id', { ascending: true })

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  const filteredData = data.filter(item => item.Users !== null)

  res.status(200).json({ data: filteredData })
}

export default handler
