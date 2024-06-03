// /api/admin/yearSystem/update/index.ts
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { body } = req
  console.log('Received request body:', body)
  try {
    // Loop through each item in the body array and perform an update operation
    for (const item of body) {
      console.log('Updating Year for student_id:', item.student_id)
      const { data, error } = await supabase
        .from('Year')
        .update({ student_id: item.student_id })
        .match({ year: item.year })

      if (error) {
        console.log('Error updating Year:', error)
        throw error
      }

      console.log('Successfully updated Year for student_id:', item.student_id)

      // Fetch users whose student_id starts with the updated student_id
      console.log('Fetching users with student_id starting with:', item.student_id)
      const { data: users, error: usersError } = await supabase
        .from('Users')
        .select('user_id')
        .ilike('student_id', item.student_id + '%')

      if (usersError) {
        console.log('Error fetching users:', usersError)
        throw usersError
      }

      console.log('Fetched users:', users)

      // Update student_year in Users_Info for each user
      for (const user of users) {
        console.log('Updating student_year for user_id:', user.user_id)
        const { error: updateError } = await supabase
          .from('Users_Info')
          .update({ student_year: item.year })
          .eq('user_id', user.user_id)

        if (updateError) {
          console.log('Error updating student_year:', updateError)
          throw updateError
        }

        console.log('Successfully updated student_year for user_id:', user.user_id)
      }
    }

    console.log('Successfully processed all items in request body')
    res.status(200).json({ success: true })
  } catch (error) {
    console.log('Error processing request:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

export default handler
