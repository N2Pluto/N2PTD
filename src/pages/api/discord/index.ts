
import fetch from 'node-fetch'

export const sendDiscordMessage = async (message: string) => {
  try {
    await fetch(process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: message
      })
    })
  } catch (err: any) {
    console.log(err.message)
  }
}
