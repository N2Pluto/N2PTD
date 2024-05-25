import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
 const { data: postData } = await supabase
   .from('post')
   .select('*')
   .eq('id', req.query.id)
   .limit(1)
   .single()

 res.status(200).json({postData})
}

export default handler
