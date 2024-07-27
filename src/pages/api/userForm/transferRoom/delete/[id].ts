// /api/userForm/transferRoom/delete/[id].ts
import supabase from 'src/libs/supabase'

const handler = async (req : any, res : any) => {
  const { id } = req.query
  console.log(`Request to delete form with ID: ${id}`)

  try {
    const { data, error } = await supabase.from('Form_TransferRoom').delete().eq('id', id)

    if (error) {
      console.error('Error deleting form:', error)
      // Send a generic error message to the client
      return res.status(500).json({ error: 'An error occurred while processing your request.' })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('Unexpected error:', err)
    // Handle unexpected errors gracefully
    return res.status(500).json({ error: 'An unexpected error occurred.' })
  }
}

export default handler
