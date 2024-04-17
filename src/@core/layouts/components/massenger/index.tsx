
import { styled } from '@mui/material/styles'
import FacebookMsg from './facebookMsg'


interface ChatBotProps {
  className?: string
  children: React.ReactNode
}

//Applications
const ChatBotStyled = styled('div')(({  }) => ({
  zIndex: 11,
  position: 'fixed',
  right: 0,
  top: '92%',
  transform: 'translateY(-50%)'
}))



const ChatBot = (props: ChatBotProps) => {
  // ** Props
  const { children, className } = props

  const handleClick = () => {
    const anchor = document.querySelector('body')
    if (anchor) {
    }
  }

  return (
    <>
      <ChatBotStyled className={className} onClick={handleClick}>
        {children}
       <FacebookMsg/>
      </ChatBotStyled>
    </>
  )
}
export default ChatBot
