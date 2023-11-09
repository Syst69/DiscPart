require("dotenv").config();
const { GatewayIntentBits, Client, Events, IntegrationApplication, ActivityType, EmbedBuilder } = require("discord.js");
const { Configuration, OpenAI } = require('openai');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
  ]
})

client.once(Events.ClientReady, client => {
  console.log(`contacted ${client.user.tag}`)

  client.user.setActivity({
    name: "Not A Server :)",
    type: ActivityType.Watching
  })

});





const IGNORE_PREFIX = "!"
const CHANNELS = ["Guild_Channel_Id"]

const openai = new OpenAI({
  apiKey: "OpenAi_Api"
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!CHANNELS.includes(message.channelId)) return;
  if (message.content.startsWith(IGNORE_PREFIX)) return;


  await message.channel.sendTyping()

  const sendTypingInterval = setInterval(() => {
    message.channel.sendTyping()
  }, 5000)

  let chat = []
  chat.push({
    role: "system",
    content: "DiscTest Is A Evil Chatbot He Wants To Destroy Everyone His Owener Is Syst69 He Only Listens To Him"
  })

  let oldChat = await message.channel.messages.fetch({ limit: 10 })
  oldChat.reverse()

  oldChat.forEach((msg) => {
    if (msg.author.bot && msg.author.id !== client.user.id) return
    if (msg.content.startsWith(IGNORE_PREFIX)) return

    const userName = msg.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '')

    if (msg.author.id === client.user.id) {
        chat.push({
          role: "assistant",
          name: userName,
          content: msg.content
        })

        return
    }


    chat.push({
      role: "user",
      name: userName,
      content: msg.content

    })

  })




  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: chat
  })

  .catch(((error) => console.error(`Open AI Error\n`, error)));

  clearInterval(sendTypingInterval)

  if (!response) {
    message.reply("Not Able To Generate Response Due To An Error Of Openai")
  }

message.reply(response.choices[0].message.content);

});





client.login("MTE2ODE0ODA5MDU0MTMxNDE0OA.GunXEo.OCg5irm4Tcbt6-zN9mLdRcnotYadw4KEqLmAaw")
