import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  const { error } = await supabase.from('post').insert([
    {
      header: req.body.header,
      title: req.body.title,
      image: req.body.image
    }
  ])

  if (error) {
    console.error(error);
    
    return res.status(500).json({ error: 'Error inserting data' });
  }

  return res.status(200).json({ message: 'Data inserted successfully' });
}

export default handler
