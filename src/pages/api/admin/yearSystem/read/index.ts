
// /api/admin/yearSystem/read/index.ts
import { NextApiRequest, NextApiResponse } from 'next'
import supabase from 'src/libs/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase.from('Year').select('year, student_id')

      if (error) {
        throw error
      }

      res.status(200).json(data)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' })
  }
}

export default handler
