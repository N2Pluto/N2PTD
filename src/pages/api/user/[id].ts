import supabase from 'src/libs/supabase'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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
