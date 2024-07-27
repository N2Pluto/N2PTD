import supabase from 'src/libs/supabase'


const handler = async (req: any, res: any) => {
    const { data, error } = await supabase
        .from('Dormitory_Room')
        .select('*')
        .eq('dorm_id', req.query.dorm_id)
        .order('room_id', { ascending: true });
    // console.log('data:', data)
    res?.status(200).json({ data })

}

export default handler;
