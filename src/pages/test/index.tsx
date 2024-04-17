import { sendDiscordMessage } from "../api/discord/admin"


const test = async () => {
  await sendDiscordMessage("Hello World!")

  return null
}

export default test
