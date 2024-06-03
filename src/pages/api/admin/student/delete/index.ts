// /api/admin/student/delete/index.ts
import { NextApiRequest, NextApiResponse } from 'next'
import supabase from 'src/libs/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    const { ids } = req.body

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid request, no IDs provided' })
    }

    const { data, error } = await supabase.from('Student').delete().in('student_id', ids)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ data })
  } else {
    res.setHeader('Allow', ['DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default handler
