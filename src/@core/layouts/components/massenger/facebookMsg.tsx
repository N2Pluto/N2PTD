import { FacebookProvider, CustomChat } from 'react-facebook'

const FacebookMsg = () => {
    return (
      <FacebookProvider appId='1143378406839555' chatSupport>
        <CustomChat pageId='292012753991282' minimized={false} />
      </FacebookProvider>
    )
  }

export default FacebookMsg
