import middleware from '../middleware'
import supabase from 'src/libs/supabase'

function handler(req: any, res: any) {
  middleware(req, res, async () => {
    console.log('user', req.user)

    const { data, error } = await supabase.from('Users').select('*').eq('user_id', req.user.user_id).limit(1).single()
    const result = await supabase.from('Users').select('student_id , email , user_id').eq('user_id', req.user.user_id).limit(1).single()
    console.log('result', result)
    res.status(200).json({ data : result.data})

  })
}

export default handler
