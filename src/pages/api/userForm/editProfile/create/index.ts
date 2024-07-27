// /api/userForm/editProfile/create/index.ts


import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { formData, user_id } = req.body

  try {
    const { data, error } = await supabase.from('Form_EditProfile').insert([{ ...formData, user_id }])

    if (error) {
      throw error
    }

    res.status(200).json(data)
  } catch (error) {
    console.error('Error inserting data:', error)
    res.status(500).json({ error: error.message })
  }
}

export default handler
