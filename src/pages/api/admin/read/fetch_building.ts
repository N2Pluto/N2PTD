import supabase from 'src/libs/supabase'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { data, error } = await supabase.from('Dormitory_Building').select('*').order('dorm_id', { ascending: true })

  res?.status(200).json({ data })
}

export default handler
