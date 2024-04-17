import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { sendDiscordMessage } from 'src/pages/api/discord/admin'
import { userStore } from 'src/stores/userStore'

const Discords = () => {
  const { user } = userStore()

  const testhandleClick = async () => {
    await sendDiscordMessage(`ID : ${user?.student_id} \nEmail : ${user?.email} \nUser_id : ${user?.user_id}`)
  }

  return (
    <Card>
      <Button
        onClick={testhandleClick}
        variant='contained'
        sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
      >
        test
      </Button>
    </Card>
  )
}

export default Discords
