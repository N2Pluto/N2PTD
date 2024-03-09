//this is api/account-setting/updateUser
import supabase from 'src/libs/supabase'
import middleware from '../middleware'

async function updateUserInfo(
  user_id: string,
  name: string,
  lastname: string,
  student_year: string,
  school: string,
  course: string,
  religion: string,
  region: string,
  major: string,
  gender: string,
  facebook: string,
  instagram: string,
  phone: string,
  activity: string,
  sleep: string,
  filter_school: string,
  filter_major: string,
  filter_religion: string,
  filter_redflag: string,
  image: string
) {
  try {
    const { data, error } = await supabase
      .from('Users')
      .update({
        name,
        lastname,
        student_year,
        school,
        course,
        religion,
        region,
        major,
        gender,
        facebook,
        instagram,
        phone,
        activity,
        sleep,
        filter_school,
        filter_major,
        filter_religion,
        filter_redflag,
        image
      })
      .eq('user_id', user_id)

    if (error) {
      console.error(error.message)
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
      course,
      religion,
      region,
      major,
      gender,
      facebook,
      instagram,
      phone,
      activity,
      sleep,
      filter_school,
      filter_major,
      filter_religion,
      filter_redflag,
      image
    } = req.body
    console.log('user_id', user_id)

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
        course,
        religion,
        region,
        major,
        gender,
        facebook,
        instagram,
        phone,
        activity,
        sleep,
        filter_school,
        filter_major,
        filter_religion,
        filter_redflag,
        image
      )

      res.status(200).json({
        data: {
          name,
          lastname,
          student_year,
          school,
          course,
          religion,
          region,
          major,
          gender,
          facebook,
          instagram,
          phone,
          activity,
          sleep,
          filter_school,
          filter_major,
          filter_religion,
          filter_redflag,
          image
        }
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
}

export default handler
