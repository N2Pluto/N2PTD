// this is /api/admin/user/update/updateUser.ts

import { NextApiRequest, NextApiResponse } from 'next'
import supabase from 'src/libs/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { id, name, lastname, student_id, gender, religion, school, department, major } = req.body
    console.log(req.body)

    // First, update Users_Info table
    const { data: dataInfo, error: errorInfo } = await supabase
      .from('Users_Info')
      .update({ name, lastname, gender, religion, school, department, major })
      .eq('id', id)

    if (errorInfo) return res.status(500).json({ error: errorInfo.message })

    // Then, retrieve user_id from Users_Info table for the given id
    const { data: userInfo, error: userInfoError } = await supabase
      .from('Users_Info')
      .select('user_id')
      .eq('id', id)
      .single() // Assuming id is unique and only one record is expected

    if (userInfoError || !userInfo) return res.status(500).json({ error: userInfoError?.message || 'User not found' })

    // Finally, update Users table using the retrieved user_id
    const { data: dataUser, error: errorUser } = await supabase
      .from('Users')
      .update({ student_id })
      .eq('user_id', userInfo.user_id)

    if (errorUser) return res.status(500).json({ error: errorUser.message })

    return res.status(200).json({ data: { ...dataInfo, ...dataUser } })
  }
}

export default handler
