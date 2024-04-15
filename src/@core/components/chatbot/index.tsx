import React, { useEffect } from 'react'
import { styled } from '@mui/material/styles'

interface ChatBotProps {
  className?: string
  children: React.ReactNode
}

const ChatBotStyled = styled('div')(({ theme }) => ({
  zIndex: 11,
  position: 'fixed',
  right: 0,
  top: '90%',
  transform: 'translateY(-50%)'
}))

const ChatBot = (props: ChatBotProps) => {
  // ** Props
  const { children, className } = props

  const handleClick = () => {
    const anchor = document.querySelector('body')
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <ChatBotStyled className={className} onClick={handleClick}>
        {children}
        <script async src='https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1'></script>
        <df-messenger
          chat-icon='https://play-lh.googleusercontent.com/74iMObG1vsR3Kfm82RjERFhf99QFMNIY211oMvN636_gULghbRBMjpVFTjOK36oxCbs=w240-h480-rw'
          chat-title='Dormitory'
          agent-id='ad149d2f-4edf-4292-ba63-35ce5ce9eb7e'
          language-code='th'
          wait-open='true'
          intent='WELCOME'
        ></df-messenger>
      </ChatBotStyled>
    </>
  )
}

export default ChatBot
