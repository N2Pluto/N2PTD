import supabase from 'src/libs/supabase'

async function handler(req : any, res : any) {
  const { user_id } = req.body

  const { data: residentData, error: residentError } = await supabase
    .from('Dormitory_Resident')
    .select('*')
    .eq('user_id', user_id)

  if (residentError || !residentData || residentData.length === 0) {
    res.status(404).json({ error: 'User not found in Dormitory_Resident' })

    return
  }

  const { data, error } = await supabase
    .from('Renewal_System')
    .select('*')
    .eq('status', true)
    .order('id', { ascending: true })

  if (error || !data || data.length === 0) {
    res.status(500).json({ error: 'No data found or error occurred' })

    return
  }

  res.status(200).json({ data, residentData })
}

export default handler
