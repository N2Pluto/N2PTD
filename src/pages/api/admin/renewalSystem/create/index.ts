// this is /api/admin/renewalSystem/create/index.ts

import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  const { userRenewal, residentData } = req.body

  if (!userRenewal || !residentData) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const { user_id } = residentData
  console.log('user_id:', user_id)

  try {
    const { data, error } = await supabase.from('Renewal_Dormitory').update({ status: userRenewal }).match({ user_id })

    if (error) {
      throw error
    }

    res.status(200).json({ data })
  } catch (error) {
    console.error('Error updating data:', error)
    res.status(500).json({ error: 'Failed to update data', details: error.message })
  }
}

export default handler
