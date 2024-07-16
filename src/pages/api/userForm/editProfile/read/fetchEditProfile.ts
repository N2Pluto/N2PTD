// /api/userForm/editProfile/read/fetchEditProfile.ts

import supabase from 'src/libs/supabase'

const handler = async (req, res) => {
  // Fetch data from Form_EditProfile including user_id
  const { data: editProfileData, error: editProfileError } = await supabase.from('Form_EditProfile').select(`*`)

  if (editProfileError) {
    console.error(editProfileError.message)
    return res.status(500).json({ error: editProfileError.message })
  }

  let combinedData = []

  for (const item of editProfileData) {
    const { data: userInfoData, error: userInfoError } = await supabase
      .from('Users_Info')
      .select('name, lastname')
      .eq('user_id', item.user_id)
      .single()

    if (userInfoError) {
      console.error(userInfoError.message)
      continue // Skip this iteration if there's an error fetching user info
    }

    combinedData.push({
      ...item,
      userInfo: userInfoData ? userInfoData : null
    })
  }

  // Return the combined data after processing all items
  return res.status(200).json(combinedData)
}

export default handler
