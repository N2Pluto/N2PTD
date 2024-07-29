import supabase from 'src/libs/supabase';


async function sendLogsuser(id: string, email: string, content: string, type: string) {
  const { data, error } = await supabase
    .from('log-user-reservation')
    .insert([{ content, actor: email, type, s_id: id }])
    .select();

  if (error) {
    console.error('Error inserting log:', error);
  } else {
    console.log('Log inserted:', data);
  }
}

export default sendLogsuser;
