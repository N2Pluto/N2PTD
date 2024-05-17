import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { data, error } = await supabase
    .from('Dormitory_Room')
    .select('room_id , status')
    .order('room_id', { ascending: true })

  res?.status(200).json(data)
}

export default handler
