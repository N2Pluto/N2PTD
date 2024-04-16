import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { sendDiscordMessage } from 'src/pages/api/discord'


const testhandleClick = async () => {
  await sendDiscordMessage('Hello World!')
}

const Discords = () => {
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
