import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { page = 1, limit = 10 } = req.query;
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const { data, error, count } = await supabase
    .from('log-admin-create')
    .select('*', { count: 'exact' })
    .order('log_id', { ascending: true })
    .range(start, end);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ data, count });
}

export default handler;
