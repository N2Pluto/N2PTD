import supabase from 'src/libs/supabase'
import middleware from '../middleware'

async function updateUserInfo(
  user_id: string,
  role: string
) {
  try {
    const { data, error } = await supabase
      .from('Users')
      .update({
        role
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
      role
    } = req.body
    console.log('user_id', user_id)

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' })
    }

    try {
      await updateUserInfo(
        user_id,
        role
      )

      res
        .status(200)
        .json({
          data: {
            role
          }
        })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
}

export default handler
