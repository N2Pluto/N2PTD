import supabase from 'src/libs/supabase'

async function handler(req : any, res : any) {
  const { user_id } = req.body

  const { data: residentData, error: residentError } = await supabase
    .from('Dormitory_Resident')
    .select('*')
    .eq('user_id', user_id)



  const { data, error } = await supabase
    .from('Renewal_System')
    .select('*')
    .eq('status', true)
    .order('id', { ascending: true })

  

  res.status(200).json({ data, residentData })
}

export default handler
