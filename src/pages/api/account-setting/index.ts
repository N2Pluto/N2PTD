import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  console.log(req.body)
  const { user_id, course, lastname, name, password, region, religion, school, student_id, student_year, user_status } = req.body;
  console.log(user_id, course, lastname, name, password, region, religion, school, student_id, student_year, user_status)

  const { data, error } = await supabase
    .from('Users')
    .update({ course, lastname, name, password, region, religion, school, student_id, student_year, user_status })
    .eq('user_id', user_id)
    .single()

  if (error) {
    console.error('Error updating data:', error)
    res.status(500).json({ error: error.message })
  } else {
    console.log('Data:', data)
    res.status(200).json({ data })
  }
}

export default handler
