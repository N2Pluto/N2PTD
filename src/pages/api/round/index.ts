import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { data, error } = await supabase
    .from('Reservation_System')
    .select('*')
    .eq('round_status', true)
    .order('id', { ascending: true })

  res?.status(200).json(data)
}

export default handler
