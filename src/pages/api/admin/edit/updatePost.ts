import supabase from 'src/libs/supabase'
import middleware from '../../middleware'

const handler = async (req: any, res: any) => {
    if (req.method === 'PUT') {
      const { id, ...data } = req.body

      try {
        const { error } = await supabase.from('post').update(data).eq('id', id)

        if (error) {

          return res.status(400).json({ error: error.message })
        }

        return res.status(200).json({ message: 'Building updated successfully' })
      } catch (error) {
        console.error('Error updating building data:', error)

        return res.status(500).json({ error: 'Internal Server Error' })
      }
    } else {
      res.setHeader('Allow', ['PUT'])

      return res.status(405).json({ error: `Method ${req.method} not allowed` })
    }
}

export default handler
