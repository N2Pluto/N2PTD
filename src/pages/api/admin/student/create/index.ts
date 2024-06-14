// /api/admin/student/create/index.ts
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const students = req.body
  console.log(students)

  // Extract student_ids from the request body
  const studentIds = students.map((student: any) => student.student_id)

  try {
    // Check for existing student_ids in the Student table
    const { data: existingStudents, error: selectError } = await supabase
      .from('Student')
      .select('student_id')
      .in('student_id', studentIds)

    if (selectError) {
      throw selectError
    }

    // If there are any existing student_ids, return an error
    if (existingStudents.length > 0) {
      const existingIds = existingStudents.map((student: any) => student.student_id)
      console.log(`Duplicate student_id found: ${existingIds.join(', ')}`)

      return res.status(400).json({ error: `Duplicate student_id found: ${existingIds.join(', ')}` })
    }

    // Proceed with insertion if no duplicates are found
    const { data, error } = await supabase.from('Student').insert(students)

    if (error) {
      throw error
    }

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.error(error)
  }
}

export default handler
