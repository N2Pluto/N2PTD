import supabase from 'src/libs/supabase';
import axios from 'axios';

async function getIpAddress(): Promise<string> {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');

    return response.data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);

    return 'unknown';
  }
}

async function sendLogsadmincreate(admin_id: string, content: string, type: string) {
  const ip = await getIpAddress();

  const { data, error } = await supabase
    .from('log-admin-create')
    .insert([{ content, admin_id, type, ip }])
    .select();

  if (error) {
    console.error('Error inserting log:', error);
  } else {
    console.log('Log inserted:', data);
  }
}

export default sendLogsadmincreate;
