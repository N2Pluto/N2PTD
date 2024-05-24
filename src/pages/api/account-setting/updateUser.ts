//this is api/account-setting/updateUser
import supabase from 'src/libs/supabase'
import middleware from '../middleware'

async function updateUserInfo(
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
  image: string,
  activity: string,
  sleep: string,
  filter_school: string,
  filter_major: string,
  filter_religion: string,
  filter_redflag: string
) {
  try {
    const { data: data1, error: error1 } = await supabase
      .from('Users_Info')
      .update({
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
      .eq('user_id', user_id)

    if (error1) {
      console.error(error1.message)
    }

    const { data: data2, error: error2 } = await supabase
      .from('Users_Req')
      .update({
        activity,
        sleep,
        filter_school,
        filter_major,
        filter_religion,
        filter_redflag
      })
      .eq('user_id', user_id)

    if (error2) {
      console.error(error2.message)
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
      image,
      activity,
      sleep,
      filter_school,
      filter_major,
      filter_religion,
      filter_redflag
    } = req.body

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' })
    }

    try {
      await updateUserInfo(
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
        image,
        activity,
        sleep,
        filter_school,
        filter_major,
        filter_religion,
        filter_redflag
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
          image,
          activity,
          sleep,
          filter_school,
          filter_major,
          filter_religion,
          filter_redflag
        }
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
}

export default handler
