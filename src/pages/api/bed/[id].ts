import supabase from 'src/libs/supabase'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { data, error } = await supabase.from('Dormitory_Bed').select('*').eq('bed_id', req.query.bed_id)
    console.log('data:', data)
    res?.status(200).json({ data })
    
}

export default handler;