// this is /api/admin/googleForm/read/index.ts

import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  const { data, error } = await supabase.from('Google_Form').select('*').order('id', { ascending: true })

  if (error) {
    res.status(500).json({ error })
    console.error(error)

    return
  }

  // Get current date
  const currentDate = new Date()

  // Check if current date is within the range of start_date and end_date
  // and update status accordingly
  for (const item of data) {
    const startDate = new Date(item.start_date)
    const endDate = new Date(item.end_date)

    const status = startDate <= currentDate && currentDate <= endDate

    const { error: updateError } = await supabase.from('Google_Form').update({ status }).eq('id', item.id)

    if (updateError) {
      console.error(updateError)
      res.status(500).json({ error: updateError })

      return
    }
  }

  res.status(200).json({ data })
}

export default handler
