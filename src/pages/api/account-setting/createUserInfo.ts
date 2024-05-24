//this is api/account-setting/createUserInfo
import supabase from 'src/libs/supabase'
import middleware from '../middleware'

const handler = async (req: any, res: any) => {
  middleware(req, res, async () => {
    const { user_id } = req.body

    // Fetch user data
    const { data: userData } = await supabase.from('Users').select('student_id').eq('user_id', user_id)
    const user = userData[0]

    if (!user) {
      console.error('User not found')

      return res.status(404).json({ error: 'User not found' })
    }

    // Fetch student data
    const { data: studentData } = await supabase.from('Student').select('*').eq('student_id', user.student_id)
    const student = studentData[0]


    // Fetch school_name
    const { data: schoolData } = await supabase
      .from('Info_School')
      .select('school_name')
      .eq('school_id', student.school_id)
    const school_name = schoolData[0]?.school_name


    // Fetch department_name
    const { data: departmentData } = await supabase
      .from('Info_Department')
      .select('department_name')
      .eq('department_id', student.department_id)
    const department_name = departmentData[0]?.department_name


    // Fetch major_name
    const { data: majorData } = await supabase.from('Info_Major').select('major_name').eq('major_id', student.major_id)
    const major_name = majorData[0]?.major_name


    // Insert into Users_Info
    const { data, error } = await supabase.from('Users_Info').insert({
      user_id,
      name: student.name,
      lastname: student.lastname,
      school: school_name,
      department: department_name,
      major: major_name,
      religion: student.religion,
      gender: student.gender,
      phone: student.phone,
      student_year: req.body.student_year
    })

    if (error) {
      console.error(error.message)

      return res.status(500).json({ error: error.message })
    }


    res.status(200).json({ data })
  })
}

export default handler
