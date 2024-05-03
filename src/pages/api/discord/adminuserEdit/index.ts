import fetch from 'node-fetch'


export const sendDiscordMessageUseredit = async (messageID: number,messageEmail: string,message: string) => {
  try {
    const webhookBody = {
      embeds: [{
        title: 'Contact Form Submitted',
        fields: [
          { name: 'ID', value: messageID },
          { name: 'Email', value: messageEmail },
          { name: 'Change information', value: message }
        ]
      }],
    };
    await fetch(process.env.NEXT_PUBLIC_DISCORD_WEBHOOKUSEREDIT_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookBody)
    })
  } catch (err: any) {
    console.log(err.message)
  }
}
