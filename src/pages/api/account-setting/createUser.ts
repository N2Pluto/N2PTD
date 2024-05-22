// this is api/account-setting/createUser
import supabase from 'src/libs/supabase'
import middleware from '../middleware'

async function insertUserInfo(
  user_id: string,
  name: string,
  lastname: string,
  student_year: string,
  school: string,
  department: string,
  religion: string,
  major: string,
  gender: string,
  facebook: string,
  instagram: string,
  phone: string,
  image: string
) {
  try {
    const { data: data1, error: error1 } = await supabase.from('Users_Info').insert({
      user_id,
      name,
      lastname,
      student_year,
      school,
      department,
      religion,
      major,
      gender,
      facebook,
      instagram,
      phone,
      image
    })

    if (error1) {
      console.error(error1.message)
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

const handler = async (req: any, res: any) => {
  middleware(req, res, async () => {
    const {
      user_id,
      name,
      lastname,
      student_year,
      school,
      department,
      religion,
      major,
      gender,
      facebook,
      instagram,
      phone,
      image
    } = req.body


    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' })
    }

    try {
      await insertUserInfo(
        user_id,
        name,
        lastname,
        student_year,
        school,
        department,
        religion,
        major,
        gender,
        facebook,
        instagram,
        phone,
        image
      )

      res.status(200).json({
        data: {
          user_id,
          name,
          lastname,
          student_year,
          school,
          department,
          religion,
          major,
          gender,
          facebook,
          instagram,
          phone,
          image
        }
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
}

export default handler
