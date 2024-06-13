import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  try {
    const { data: students, error } = await supabase.from('Student').select('student_id')

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    // Extract unique prefixes (first two digits)
    const prefixes = Array.from(new Set(students.map(student => student.student_id.slice(0, 2))))

    // Get only the first two unique prefixes
    const firstTwoPrefixes = prefixes.slice(0, 2)

    res.status(200).json(firstTwoPrefixes)
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default handler
