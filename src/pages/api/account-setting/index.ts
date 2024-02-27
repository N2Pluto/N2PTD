// import supabase from 'src/libs/supabase'
// import middleware from '../middleware'

// const handler = async (req: any, res: any) => {
//   // ตรวจสอบว่ามีข้อมูล user_id และ formData ที่ส่งมาหรือไม่
//   const user_id = req.query.user_id // Extract user_id from the request query
//   console.log('user_id:', user_id)
//   const { formData } = req.body
//   console.log('formData:', formData)

//   if (!user_id || !formData) {
//     return res.status(400).json({ message: 'Missing user_id or formData' })
//   }

//   try {
//     // อัปเดตข้อมูลในฐานข้อมูล Supabase
//     const { data, error } = await supabase.from('Users').update(formData).eq('user_id', user_id)

//     if (error) {
//       throw error
//     }

//     res.status(200).json({ message: 'User data updated successfully', data })
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating user data', error: error.message })
//   }
// }

// export default handler
