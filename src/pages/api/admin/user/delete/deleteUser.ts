// this is /api/admin/user/delete/deleteUser.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { id: ids } = req.body // ids is now an array of ids
  console.log(req.body)

  try {
    for (const id of ids) {
      // Fetch user_id from Users_Info
      const { data, error } = await supabase.from('Users_Info').select('user_id').eq('id', id)
      if (error) throw error
      if (!data || data.length === 0) throw new Error('User not found')

      const user_id = data[0].user_id
      console.log('user_id:', user_id)

      // Delete from Users_Info
      try {
        await supabase.from('Users_Info').delete().match({ id: id })
      } catch (error) {
        console.error('Error deleting from Users_Info:', error)
      }

      // Delete from Users_Req
      try {
        await supabase.from('Users_Req').delete().match({ user_id: user_id })
      } catch (error) {
        console.error('Error deleting from Users_Req:', error)
      }

      // Delete from Reservation
      try {
        await supabase.from('Reservation').delete().match({ user_id: user_id })
      } catch (error) {
        console.error('Error deleting from Reservation:', error)
      }

      // Delete from Users
      try {
        await supabase.from('Users').delete().match({ user_id: user_id })
      } catch (error) {
        console.error('Error deleting from Users:', error)
      }
    }

    return res.status(200).json({ message: 'Users deleted successfully' })
  } catch (error) {
    console.error('Error deleting users:', error)

    return res.status(500).json({ error: 'Error deleting users' })
  }
}

export default handler
