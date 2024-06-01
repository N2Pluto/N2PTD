import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  const { error } = await supabase.from('Dormitory_Building').insert([
    {
      name: req.body.name,
      room_total: req.body.room_total,
      images_url: req.body.images_url,
      type_gender: req.body.type_gender,
      price: req.body.price,
      type_building: req.body.type_building,
      type_bathroom: req.body.type_bathroom,
      type_bedtype: req.body.type_bedtype,
      type_bedcapacity: req.body.type_bedcapacity,
      type_roommate: req.body.type_roommate,
      type_furniture: req.body.type_furniture,
      type_facilities: req.body.type_facilities
    }
  ])

  if (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  } else {
    const { data, error } = await supabase.from('Dormitory_Building').select('*').eq('name', req.body.name).single()

    if (error) {
      console.error(error)
      res.status(500).json({ error: error.message })
    } else {
      res.status(200).json({ data })
    }
  }
}

export default handler
