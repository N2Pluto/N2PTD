//this is /api/admin/user/read/readByID/[id]

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { student_id } = req.body
  console.log('Received student_id:', student_id)

  // First, fetch the user from the Users table
  const { data: userData, error: userError } = await supabase
    .from('Users')
    .select('student_id, user_id, role, email')
    .eq('student_id', student_id)

  if (userError || userData.length === 0) {
    return res.status(400).json({ error: userError ? userError.message : 'No user found with the provided student_id' })
  }

  const user_id = userData[0].user_id

  // Then, fetch the user info from the Users_Info table
  const { data: userInfoData, error: userInfoError } = await supabase
    .from('Users_Info')
    .select('*, Users(student_id, user_id,role,email)')
    .eq('user_id', user_id)
    .filter('Users.role', 'eq', 'user')
    .order('id', { ascending: true }) // Assuming user_id is the foreign key

  if (userInfoError) {
    return res.status(400).json({ error: userInfoError.message })
  }

  const filteredData = userInfoData.filter(item => item.Users !== null)

  res.status(200).json({ data: filteredData })
}

export default handler
