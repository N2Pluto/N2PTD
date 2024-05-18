import supabase from 'src/libs/supabase'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { data, error } = await supabase
        .from('Dormitory_Room')
        .select('*')
        .eq('dorm_id', req.query.dorm_id)
        .order('room_id', { ascending: true });
    // console.log('data:', data)
    res?.status(200).json({ data })

}

export default handler;
