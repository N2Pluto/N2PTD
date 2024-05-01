// this is /api/admin/user/update/updateUser.ts

import { NextApiRequest, NextApiResponse } from 'next'
import supabase from 'src/libs/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { id, name, lastname, student_id, gender, religion, school, department, major, user_id } = req.body
    console.log(req.body)

    // Update Users_Info table
    const { data: dataInfo, error: errorInfo } = await supabase
      .from('Users_Info')
      .update({ name, lastname, gender, religion, school, department, major })
      .eq('id', id)

    if (errorInfo) return res.status(500).json({ error: errorInfo.message })

    // Update Users table
    const { data: dataUser, error: errorUser } = await supabase
      .from('Users')
      .update({ student_id })
      .eq('user_id', user_id) 

    if (errorUser) return res.status(500).json({ error: errorUser.message })

    return res.status(200).json({ data: { ...dataInfo, ...dataUser } })
  }
}

export default handler
