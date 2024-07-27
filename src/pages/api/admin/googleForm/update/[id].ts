// this is /api/admin/googleForm/update/[id].ts

import { NextApiRequest, NextApiResponse } from 'next'
import supabase from 'src/libs/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  const { status } = req.body

  try {
    const { data, error } = await supabase
      .from('Google_Form')
      .update({
        status
      })
      .eq('id', id)

    if (error) {
      throw error
    }

    res.status(200).json({ message: 'Form updated successfully', data })
  } catch (error) {
    console.error('Error updating form:', error)
    res.status(500).json({ error: 'Failed to update form' })
  }
}

export default handler
