// /api/admin/student/create/checkDuplicate.ts
import supabase from 'src/libs/supabase'

const handler = async (req, res) => {
  const { student_ids } = req.body
  const { data, error } = await supabase.from('Student').select('student_id').in('student_id', student_ids)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  const existingIds = data.map(item => item.student_id)
  const duplicates = student_ids.filter(id => existingIds.includes(id))

  if (duplicates.length > 0) {
    return res.status(400).json({ duplicate: true, duplicates })
  }

  res.status(200).json({ duplicate: false })
}

export default handler