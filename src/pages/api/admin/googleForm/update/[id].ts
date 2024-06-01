// this is /api/admin/googleForm/update/[id].ts

import { NextApiRequest, NextApiResponse } from 'next'
import supabase from 'src/libs/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  const { formName, formUrl, startDate, endDate } = req.body

  if (!id || !formName || !formUrl || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const { data, error } = await supabase
      .from('Google_Form')
      .update({
        form_name: formName,
        form_url: formUrl,
        start_date: startDate,
        end_date: endDate
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
