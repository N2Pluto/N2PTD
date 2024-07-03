// this is /api/loginforget/reset

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { email, studentId, newPassword } = req.body
  console.log(req.body)

  const { data, error } = await supabase
    .from('Users')
    .update({ password: newPassword })
    .eq('email', email)
    .eq('student_id', studentId)

  res.status(200).json({ message: 'Password reset successfully' })
}

export default handler
