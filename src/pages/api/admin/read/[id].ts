import supabase from 'src/libs/supabase'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
 const { data: buildingData } = await supabase
   .from('Dormitory_Building')
   .select('*')
   .eq('dorm_id', req.query.id)
   .limit(1)
   .single()

 res.status(200).json({ buildingData: buildingData || [] })
}

export default handler
