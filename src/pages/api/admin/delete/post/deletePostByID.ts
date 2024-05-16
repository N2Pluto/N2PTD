// this is /api/admin/delete/building/deleteBuildingByID.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { id } = req.body

  try {
    const { error } = await supabase.from('post').delete().eq('id', id)

    if (error) {
      throw error
    }

    res.status(200).json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    res.status(500).json({ error: error.message })
  }
}

export default handler
