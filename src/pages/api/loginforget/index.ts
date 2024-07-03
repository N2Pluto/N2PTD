// api/loginforget/index.ts
import { NextApiRequest, NextApiResponse } from 'next'
import supabase from 'src/libs/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, studentId } = req.body

  const { data, error } = await supabase.from('Users').select('id').eq('email', email).eq('student_id', studentId)

  if (error || !data || data.length === 0) {
    return res.status(400).json({ message: 'Email or student ID is incorrect' })
  }

  res.status(200).json({ valid: true })
}

export default handler
