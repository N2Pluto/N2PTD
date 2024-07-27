import supabase from 'src/libs/supabase'


const handler = async (req: any, res: any) => {
  const { data, error } = await supabase
    .from('Users')
    .select('*')
    .eq('user_id', req.query.id)
    .limit(1)
    .single()
  console.log('data:', data)
  res?.status(200).json({ data })
}

export default handler
