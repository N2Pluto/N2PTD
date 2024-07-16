// /api/userForm/editProfile/update/[id].ts

import { NextApiRequest, NextApiResponse } from 'next'
import supabase from 'src/libs/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { user_id, id, ...updateFields } = req.body
    console.log(req.body)
    console.log('filteredRequest.user_id', user_id)

    // Check if user_id and id exist
    if (!user_id || !id) {
      return res.status(400).json({ error: 'user_id and id are required' })
    }

    // Extract individual fields for easy access
    const { department, school, major, gender, lastname, name, phone, religion } = updateFields

    // Create an object to hold the fields to be updated
    const updatedData = {
      ...(department && { department }),
      ...(school && { school }),
      ...(major && { major }),
      ...(gender && { gender }),
      ...(lastname && { lastname }),
      ...(name && { name }),
      ...(phone && { phone }),
      ...(religion && { religion })
    }

    // Update the user's information
    const { data: userInfoData, error: userInfoError } = await supabase
      .from('Users_Info')
      .update(updatedData)
      .eq('user_id', user_id)

    if (userInfoError) {
      throw userInfoError
    }

    // Update Form_EditProfile status
    const { data: formEditProfileData, error: formEditProfileError } = await supabase
      .from('Form_EditProfile')
      .update({ status: 'Approve' })
      .eq('id', id)

    if (formEditProfileError) {
      throw formEditProfileError
    }

    // Collect the names of the fields that were updated
    const updatedFields = Object.keys(updatedData)

    res.status(200).json({
      message: 'Profile updated successfully and Form_EditProfile status set to Approve',
      updatedFields,
      userInfoData,
      formEditProfileData
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred while updating the profile' })
  }
}

export default handler
