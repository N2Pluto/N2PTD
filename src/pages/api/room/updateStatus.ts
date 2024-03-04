import supabase from 'src/libs/supabase'
import middleware from '../middleware'

async function updateUserInfo(room_id: string, status: boolean) {
  try {
    const { data, error } = await supabase.from('Dormitory_Room').update({ status }).eq('room_id', room_id)

    if (error) {
      console.error(error.message)
      throw error // throw the error
    }
  } catch (error) {
    throw error // re-throw the error
  }
}

const handler = async (req: any, res: any) => {
  const { room_id, status } = req.body
  console.log('room_id', room_id)

  if (!room_id) {
    return res.status(400).json({ error: 'user_id is required' })
  }

  try {
    await updateUserInfo(room_id, status)

    res.status(200).json({
      data: {
        status
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
