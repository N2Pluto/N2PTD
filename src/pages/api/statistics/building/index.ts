import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { data, error } = await supabase
    .from('Dormitory_Building')
    .select('dorm_id , type_gender')
    .order('dorm_id', { ascending: true })

  res?.status(200).json(data)
}

export default handler
