// /api/userForm/read/[id].ts

import supabase from 'src/libs/supabase'

const handler = async (req : any, res : any) => {
  const { id: user_id } = req.query
  console.log(user_id)

  // Adjusted select query to include related data
  const { data: changeRoomData, error: changeRoomError } = await supabase
    .from('Form_ChangeRoom')
    .select(
      `
      *,
      Dormitory_Building (name),
      Dormitory_Room (room_number),
      Dormitory_Bed (bed_number)
    `
    )
    .eq('user_id', user_id)

  if (changeRoomError) {
    console.error(changeRoomError.message)
    return res.status(500).json({ error: changeRoomError.message })
  }

  // Fetch name and lastname from Users_Info
  const { data: userInfoData, error: userInfoError } = await supabase
    .from('Users_Info')
    .select('name, lastname')
    .eq('user_id', user_id)

  if (userInfoError) {
    console.error(userInfoError.message)
    return res.status(500).json({ error: userInfoError.message })
  }

  // Combine data from both queries
  const combinedData = changeRoomData.map(item => ({
    ...item,
    userInfo: userInfoData.length > 0 ? userInfoData[0] : null
  }))

  return res.status(200).json(combinedData)
}

export default handler
