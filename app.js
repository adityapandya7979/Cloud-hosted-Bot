//This was my first discor bot code which is now not required as I have other bots

const Discord = require("discord.js");
const fetch = require('node-fetch');

const bot = new Discord.Client();
const token = 'NzYwODM4MDgzNTAyNDA3Njkw.X3R3rg.JLUlDaw-rvKetaRuxIP3uHusoMg';

bot.on('ready', () => {
  console.log('bot is ready');
})

bot.login(token);

const prefix = '!'

bot.on('message', async (msg) => {
  //if our message doesnt start with our defined prefix, dont go any further into function
  if(!msg.content.startsWith(prefix)) {
    console.log('no prefix')
    return
  }
  
  //slices off prefix from our message, then trims extra whitespace, then returns our array of words from the message
  const args = msg.content.slice(prefix.length).trim().split(' ')
  
  //splits off the first word from the array, which will be our command
  const command = args.shift().toLowerCase()
  //log the command
  console.log('command: ', command)
  //log any arguments passed with a command
  console.log(args)

  if(command === 'ego') {
    msg.react("😀")
    msg.reply('wow, what a great post')
  }

  if (command === "clear") {
    //verify that user has moderation role
    if(!msg.member.roles.cache.has('756222046970839140')) {
      msg.reply('you dont have permission to delete messages');
      // if user doesnt have the role, we return without kicking the user
      return
    }

    //default deletes message itself plus previous
    let num = 2;
    
    //if argument is provided, we need to convert it from string to number
    if (args[0]) {
      //add 1 to delete clear command itself
      num = parseInt(args[0]) + 1;
    }
    //bulk delete the messages
    msg.channel.bulkDelete(num);
    //notify channel of deleted messages
    msg.channel.send(`deleted  ${args[0]} posts for you`);
  } 

  
  if(command === 'joke') {
    //async API call using async/await syntax
    let getJoke = async () => {
      //make API call
      let result = await fetch('https://official-joke-api.appspot.com/random_joke')
      //convert to object we can work with
      let json = await result.json()
      return json
    }
    //call function defined above
    let joke = await getJoke()
    
    //have our bot reply using the data returned from our API call
    msg.reply(`
    Here's your joke
    ${joke.setup}
    ${joke.punchline}
    `)
  }

  
  if(command === 'kick') {
    //verify that user has moderation role
    if(!msg.member.roles.cache.has('756222046970839140')) {
      msg.reply('you dont have permission to kick users')
      // if user doesnt have the role, we return without kicking the user
      return
    }
    //check to make sure a user was actually mentioned, if not we return because bot doesnt know who to kick
    const user = msg.mentions.users.first()
    if(!user) {
      msg.reply('no user mentioned')
      return
    }
    //if user was mentioned, grab their guild member information
    const member = msg.guild.member(user)
    //if they are a member of the server, kick them
    if(member) {
      member.kick('this is a message for the server logs').then(() => {
        msg.reply(`${user.tag} was kicked from the server`)
      })
    }
  }

  if(command === 'commands'){
    msg.reply('The commands for this bot are: !ego, !joke, !commands. !clear and !kick are mod commands')
  }
  
})


//set is outside our event listener to prevent wasted processing re-creating it on every message
let set = new Set(['fuck', 'madarchod' , 'chodina', 'bullshit' , 'motherfucker', 'nigga' , 'bhosdina'])
bot.on('message', (msg) => {
  //if author of message is a bot, return. This prevents potential infinite loops
  if(msg.author.bot) {
    return
  }
  //split message into array of individual words
  let wordArray = msg.content.split(' ')
  console.log(wordArray)
  
  //loop through every word and check if it is in our set of banned words
  for(var i = 0; i < wordArray.length; i++) {
    //if the message contains a word in our set, we delete it and send a message telling them why
    if(set.has(wordArray[i])) {
      msg.delete()
      msg.channel.send(`sorry ${msg.author.username}, this is a friendly server, no bad words allowed`)
      break
    }
    
  }
})
