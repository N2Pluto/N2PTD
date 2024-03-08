import supabase from 'src/libs/supabase'

const handler = async (req : any,res : any) => {
const { data, error } = await supabase.from('Users').select('id,email,student_id').order('id', { ascending: true });

res?.status(200).json({ data })

}

export default handler;
