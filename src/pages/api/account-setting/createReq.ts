//this is api/account-setting/createUser
import supabase from 'src/libs/supabase'
import middleware from '../middleware'

async function insertUserInfo(
  user_id: string,
  activity: string,
  sleep: string,
  filter_school: string,
  filter_major: string,
  filter_religion: string,
  filter_redflag: string
) {
  try {
   
    const { data: data2, error: error2 } = await supabase.from('Users_Req').insert({
      user_id,
      activity,
      sleep,
      filter_school,
      filter_major,
      filter_religion,
      filter_redflag
    })

    if (error2) {
      console.error(error2.message)
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

const handler = async (req: any, res: any) => {
  middleware(req, res, async () => {
    const { user_id, activity, sleep, filter_school, filter_major, filter_religion, filter_redflag } = req.body
    console.log('user_id', user_id)

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' })
    }

    try {
      await insertUserInfo(user_id, activity, sleep, filter_school, filter_major, filter_religion, filter_redflag)

      res.status(200).json({
        data: {
          user_id,
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
