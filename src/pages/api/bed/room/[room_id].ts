// this is api/bed/room/[room_id].ts
import supabase from 'src/libs/supabase'


const handler = async (req: any, res: any) => {
    const { data, error } = await supabase.from('Dormitory_Bed').select('*')
    .eq('room_id', req.query.room_id)
    .order('bed_id', { ascending: true });
    res?.status(200).json({ data })

}

export default handler;
