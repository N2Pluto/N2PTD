import supabase from 'src/libs/supabase'
import jwt from 'jsonwebtoken'

const handler = async (req: any, res: any) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' })
    }

    const { email, password } = req.body

    const admin = await supabase
      .from('Admin')
      .select('email,password,admin_id')
      .eq('email', email)
      .limit(1)
      .single()

    // Check password
    if (admin?.data?.password !== password) {
      return res.status(401).json({ message: 'Not found identity' })
    }

    // Sign JWT token
    const accessToken = jwt.sign(
      { student_id: admin?.data? email: admin?.data?.email, admin_id: admin?.data?.admin_id },
      process.env.JWT_SECRET,
      { expiresIn: '100h' }
    )

    const adminData = {
      admin_id: admin?.data?.admin_id,
      email: admin?.data?.email,
    }
    console.log('admin?.data', admin?.data)

    res.status(200).json({ accessToken, user: adminData })
  } catch (error) {
    console.log('error', error)
  }
}

export default handler

