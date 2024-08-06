//this is /api/admin/user/userForm/read/fetchUserForm.ts
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { data, error } = await supabase.from('Form_EditProfile').select('*)').order('id', { ascending: true })

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  res.status(200).json({ data: data })
}

export default handler
