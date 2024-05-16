// This is /api/admin/user/userForm/update/updateUserForm
import supabase from 'src/libs/supabase'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { filteredUsers } = req.body
  console.log('filteredUsers', filteredUsers)
  const { id } = req.body
  console.log('id', id)

  if (!Array.isArray(filteredUsers)) {
    // Check if filteredUsers is an array
    return res.status(400).json({ error: 'filteredUsers must be an array' })
  }

  for (const user of filteredUsers) {
    // Find the user_id in the Users table that matches the StudentID
    const { data: userData, error: userError } = await supabase
      .from('Users')
      .select('user_id')
      .eq('student_id', user.StudentID)
      .single()

    if (userError) {
      console.error('Error finding user:', userError)

      return res.status(500).json({ error: 'Error finding user' })
    }

    // Update the Users table
    const { error: updateUserError } = await supabase
      .from('Users')
      .update({ student_id: user.StudentID })
      .eq('user_id', userData.user_id)

    if (updateUserError) {
      console.error('Error updating Users:', updateUserError)

      return res.status(500).json({ error: 'Error updating Users' })
    }

    // Update the Users_Info table
    const { error: updateUserInfoError } = await supabase
      .from('Users_Info')
      .update({
        name: user.name,
        lastname: user.lastname,
        school: user.school,
        department: user.department,
        major: user.major,
        gender: user.gender,
        phone: user.phone,
        religion: user.religion
      })
      .eq('user_id', userData.user_id)

    if (updateUserInfoError) {
      console.error('Error updating Users_Info:', updateUserInfoError)

      return res.status(500).json({ error: 'Error updating Users_Info' })
    }
  }

  return res.status(200).json({ message: 'Update successful' })
}

export default handler
