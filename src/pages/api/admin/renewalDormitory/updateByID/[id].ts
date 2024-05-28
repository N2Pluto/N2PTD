// this is /api/admin/renewalDormitory/updateByID/[id].ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { id } = req.query
  const { renewal_name, renewal_phase, start_date, end_date } = req.body
  console.log('api id:', id)
  console.log(req.body)

  try {
    const { data: existingData, error: existingError } = await supabase.from('Renewal_System').select('*').eq('id', id)

    if (existingError) {
      throw existingError
    }

    if (!existingData || existingData.length === 0) {
      res.status(404).json({ error: 'No record found with the provided id.' })
      return
    }

    const { data, error } = await supabase
      .from('Renewal_System')
      .update({
        renewal_name,
        renewal_phase,
        start_date,
        end_date
      })
      .eq('id', id)

    if (error) {
      throw error
    }

    res.status(200).json({ success: true, data })
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.error('Error updating data:', error)
  }
}

export default handler
