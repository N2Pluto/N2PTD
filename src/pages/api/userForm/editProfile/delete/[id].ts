// /api/userForm/editProfile/delete/[id].ts
import supabase from 'src/libs/supabase'

const handler = async (req, res) => {
  const { id } = req.query
  console.log(`Request to delete form with ID: ${id}`)

  try {
    const { data, error } = await supabase.from('Form_EditProfile').delete().eq('id', id)

    if (error) {
      console.error('Error deleting form:', error)

      return res.status(500).json({ error: 'An error occurred while processing your request.' })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('Unexpected error:', err)

    return res.status(500).json({ error: 'An unexpected error occurred.' })
  }
}

export default handler
