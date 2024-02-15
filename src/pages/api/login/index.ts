import supabase from 'src/libs/supabase'
import jwt from 'jsonwebtoken'

const handler = async (req: any, res: any) => {
  console.log('wowao')
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' })
    }

    const { email, password } = req.body

    const user = await supabase
      .from('Users')
      .select('student_id,email,password,user_id')
      .eq('email', email)
      .limit(1)
      .single()

    // Check password
    if (user?.data?.password !== password) {
      return res.status(401).json({ message: 'Not found identity' })
    }

    // Sign JWT token
    const accessToken = jwt.sign(
      { student_id: user?.data?.student_id, email: user?.data?.email, user_id: user?.data?.user_id },
      process.env.JWT_SECRET,
      { expiresIn: '100h' }
    )

    const userData = {
      student_id: user?.data?.student_id,
      email: user?.data?.email,
      user_id: user?.data?.user_id
    }
    console.log('user?.data', user?.data)

    res.status(200).json({ accessToken, user: userData })
  } catch (error) {
    console.log('error', error)
  }
}

export default handler

// const handler = async (req: any, res: any) => {
//   const { email_student_id, password } = req.body

//   // First, try to find a user with matching student_id
//   let { data, error } = await supabase
//     .from('Users')
//     .select('student_id,email,password')
//     .eq('student_id', email_student_id)
//     .eq('password', password)

//   console.log('data', data)

//   // If no user found, try to find a user with matching email
//   if (!data || data.length === 0) {
//     ;({ data, error } = await supabase
//       .from('Users')
//       .select('student_id,email,password')
//       .eq('email', email_student_id)
//       .eq('password', password))
//   }

//   if (error) {
//     console.error('Error:', error)
//     res.status(400).json({ error: 'Failed to login' })
//     return
//   }

//   if (data && data.length > 0) {
//     console.log('Login successful:', data)
//     res.status(200).json({ data })
//   } else {
//     console.log('No matching user found')
//     res.status(404).json({ error: 'No matching user found' })
//   }
// }

// export default handler
