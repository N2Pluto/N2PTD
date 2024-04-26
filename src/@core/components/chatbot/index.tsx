import React from 'react'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Popper, { PopperPlacementType } from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import { FaLine } from 'react-icons/fa6'
import QRCode from 'qrcode.react'
import { createTheme } from '@mui/material/styles'
interface ChatBotProps {
  className?: string
  children: React.ReactNode
}

const ChatBotStyled = styled('div')(({ theme }) => ({
  zIndex: 11,
  position: 'fixed',
  right: 15,
  top: '85%',
  transform: 'translateY(-50%)',
  backgroundColor: theme.palette.primary.main,
  borderRadius: 10,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  borderRadius: '75%'
}))

const ChatBotButton = styled(Button)(({ theme }) => ({
  borderRadius: '75%',
  padding: '12px'
}))

const ChatBotPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: 10,
  border: '2px solid #ddd',
  padding: 20,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
}))

const ChatBot = (props: ChatBotProps) => {
  const { children, className } = props
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [open, setOpen] = React.useState(false)
  const [placement, setPlacement] = React.useState<PopperPlacementType>()
  const theme = createTheme({
    palette: {
      primary: {
        main: '#000000'
      },
      secondary: {
        main: '#ffffff'
      }
    }
  })

  const handleClick = (newPlacement: PopperPlacementType) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen(prev => placement !== newPlacement || !prev)
    setPlacement(newPlacement)
  }

  return (
    <>
      <ChatBotStyled className={className}>
        {children}
        <ChatBotButton variant='contained' onClick={handleClick('bottom-end')}>
          <FaLine size={32} />
        </ChatBotButton>
        <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <ChatBotPaper>
                <Typography variant='h6' sx={{ p: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
                  WU DORMITORY CHATBOT
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                  <QRCode value='https://liff.line.me/1645278921-kWRPP32q/?accountId=837kpnvf' size={180} />
                </div>
                <Typography variant='body1' sx={{ p: 2, textAlign: 'center', color: theme.palette.primary.main }}>
                  Scan to Chat with WU Dormitory Chatbot
                </Typography>
              </ChatBotPaper>
            </Fade>
          )}
        </Popper>
      </ChatBotStyled>
    </>
  )
}

export default ChatBot
