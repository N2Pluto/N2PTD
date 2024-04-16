import { sendDiscordMessage } from "../api/discord"


const test = async () => {
  await sendDiscordMessage("Hello World!")

  return null
}

export default test
