// /api/userForm/read/checkDuplicateBed.ts

import supabase from 'src/libs/supabase'

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { newBed } = req.body
  console.log(newBed)

  if (!newBed) {
    return res.status(400).json({ error: 'newBed is required' })
  }

  try {
    const { data, error } = await supabase.from('Dormitory_Bed').select('bed_status').eq('bed_id', newBed).single()
    if (error) {
      throw error
    }

    if (data.bed_status === false) {
      return res.status(200).json({ status: false, message: 'The bed is already booked' })
    }
    console.log(data)

    return res.status(200).json({ status: true, message: 'The bed is available' })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error.message })
  }
}

export default handler
