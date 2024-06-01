// this is /api/admin/googleForm/delete/[id].ts

import { NextApiRequest, NextApiResponse } from 'next'
import supabase from 'src/libs/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const { data, error } = await supabase.from('Google_Form').delete().eq('id', id)

    if (error) {
      throw error
    }

    res.status(200).json({ message: 'Form deleted successfully', data })
  } catch (error) {
    console.error('Error deleting form:', error)
    res.status(500).json({ error: 'Failed to delete form' })
  }
}

export default handler
