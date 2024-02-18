import supabase from 'src/libs/supabase'
import jwt from 'jsonwebtoken'

const handler = async (req: any, res: any) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' })
    }

    const { email, password } = req.body

    const admid = await supabase
      .from('Admin')
      .select('email,password,admin_id')
      .eq('email', email)
      .limit(1)
      .single()

    // Check password
    if (admid?.data?.password !== password) {
      return res.status(401).json({ message: 'Not found identity' })
    }

    // Sign JWT token
    const accessToken = jwt.sign(
      { student_id: admid?.data? email: admid?.data?.email, user_id: admid?.data?.admin_id },
      process.env.JWT_SECRET,
      { expiresIn: '100h' }
    )

    const userData = {
      admin_id: admid?.data?.admin_id,
      email: admid?.data?.email,
    }
    console.log('user?.data', admid?.data)

    res.status(200).json({ accessToken, user: userData })
  } catch (error) {
    console.log('error', error)
  }
}

export default handler

