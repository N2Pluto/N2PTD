import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
    const { data, error } = await supabase.from('Dormitory_Room').select('name , images_url').eq('room_id', req.query.id).limit(1).single()
    res?.status(200).json({ data })

}

export default handler;
