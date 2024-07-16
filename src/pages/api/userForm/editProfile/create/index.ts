// /api/userForm/editProfile/create/index.ts

import { NextApiRequest, NextApiResponse } from 'next'
import supabase from 'src/libs/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { formData, user_id } = req.body

  try {
    const { data, error } = await supabase.from('Form_EditProfile').insert([{ ...formData, user_id }])

    if (error) {
      throw error
    }

    res.status(200).json(data)
  } catch (error) {
    console.error('Error inserting data:', error)
    res.status(500).json({ error: error.message })
  }
}

export default handler
