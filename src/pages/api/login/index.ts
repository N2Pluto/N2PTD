import supabase from 'src/libs/supabase'
import jwt from 'jsonwebtoken'

const handler = async (req: any, res: any) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' })
    }

    const { email, password } = req.body

    const user = await supabase.from('Users').select('*').eq('email', email).limit(1).single()

    // Check password
    if (user?.data?.password !== password) {
      return res.status(401).json({ message: 'Not found identity' })
    }

    // Sign JWT token
    const accessToken = jwt.sign(
      {
        student_id: user?.data?.student_id,
        email: user?.data?.email,
        user_id: user?.data?.user_id,
        name: user?.data?.name,
        lastname: user?.data?.lastname,
        school: user?.data?.school,
        course: user?.data?.course,
        religion: user?.data?.religion,
        region: user?.data?.region,
        student_year: user?.data?.student_year,
        user_status: user?.data?.user_status,
        gender : user?.data?.gender

      },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    )

    const userData = {
      student_id: user?.data?.student_id,
      email: user?.data?.email,
      user_id: user?.data?.user_id,
      name: user?.data?.name,
      lastname: user?.data?.lastname,
      school: user?.data?.school,
      course: user?.data?.course,
      religion: user?.data?.religion,
      region: user?.data?.region,
      student_year: user?.data?.student_year,
      user_status: user?.data?.user_status,
      gender : user?.data?.gender
    }

    res.status(200).json({ accessToken, user: userData })
  } catch (error) {
    console.log('error', error)
  }
}

export default handler
