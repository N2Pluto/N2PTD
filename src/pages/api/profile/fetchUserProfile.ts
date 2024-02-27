// this is api/profile/fetchUserProfile.ts
import { NextApiRequest, NextApiResponse } from 'next'
import supabase from 'src/libs/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { user_id } = req.body // รับ user_id จากข้อมูลที่ส่งมา
    const { data, error } = await supabase.from('Users').select('*').eq('user_id', user_id).single() // เลือกข้อมูลเฉพาะของ user_id ที่กำหนด

    if (error) {
      throw new Error(error.message)
    }

    res.status(200).json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
