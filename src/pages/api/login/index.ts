import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { email_student_id, password } = req.body

  // First, try to find a user with matching student_id
  let { data, error } = await supabase
    .from('Users')
    .select('student_id,email,password')
    .eq('student_id', email_student_id)
    .eq('password', password)

  // If no user found, try to find a user with matching email
  if (!data || data.length === 0) {
    ;({ data, error } = await supabase
      .from('Users')
      .select('student_id,email,password')
      .eq('email', email_student_id)
      .eq('password', password))
  }

  if (error) {
    console.error('Error:', error)
    res.status(400).json({ error: 'Failed to login' })
    return
  }

  if (data && data.length > 0) {
    console.log('Login successful:', data)
    res.status(200).json({ data })
  } else {
    console.log('No matching user found')
    res.status(404).json({ error: 'No matching user found' })
  }
}

export default handler
