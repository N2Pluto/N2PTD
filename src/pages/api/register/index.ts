import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { student_id, email, password, gender } = req.body

  const { data, error } = await supabase.from('Users').insert([{ student_id, email, password, gender ,role: 'user'}])

  if (error) {
    console.error('Error inserting data:', error)
    res.status(500).json({ error: error.message })
  } else {
    console.log('Data:', data)
    res.status(200).json({ data })
  }
}

export default handler
