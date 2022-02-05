// Author: Ryan Mullen
// Description: A discord bot programmed for personal use in
// friends' discord server

// import API
const { Client, Intents } = require("discord.js");
const Discord = require('discord.js');

// instantiate client
const client = new Client({
  intents: new Discord.Intents(32767) // all permissions granted
});

// load api key from config
const config = require("./config.json");

// !time: print time of day
client.on("messageCreate", (message) => {
  if (message.content.startsWith("!time")) {
    message.channel.send(getDateTime());
  }
})

// !textchannel: create text channel
client.on("messageCreate", message => {
    if (message.content.includes("!textchannel")) {
        const channelName = message.content.replace('!textchannel','');
        message.guild.channels.create(channelName, {
            type: "GUILD_TEXT", // syntax has changed a bit
            permissionOverwrites: [{ // same as before
                id: message.guild.id,
                allow: ["VIEW_CHANNEL"],
            }]
        });
        message.channel.send("Text Channel Created!");
    }
})

// !nickname: change server nicknames
client.on("messageCreate", (message) => {
  if (message.content.includes('!nickname')) {

    // change another member's nickname
    if (message.mentions.members.first()) {
      let mentionedMember = message.mentions.members.first();
      var newName = message.content.replace('!nickname','');
      var tempName = '';

      // (first two indices are an empty space and the member-id)
      for (var i=2; i<newName.length;i++) {
        if (newName.split(' ')[i]) {
          tempName += newName.split(' ')[i];
          tempName += ' ';
        }
      }
      newName = tempName;
      mentionedMember.setNickname(newName);

  // change user's own nickname if no other member is specified
  } else {
      message.member.setNickname(message.content.replace('!nickname ', ''));
    }
  }
})


// on startup: register guild and member list on the backend
client.on("ready", () => {
    // main guild: brokeside
    let guild = client.guilds.cache.get(config.serverId);
    if (!guild)
      return console.log(`Can't find any guild with the ID`);

    // print guild occupancy and member log
    const Guilds = client.guilds.cache.map(guild => guild.id);
    console.log(Guilds);
    const Members = guild.members.cache.map(member => member.user.username);
    console.log(Members);

});

// datetime function
function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return month + "/" + day + "/" + year + " | " + hour + ":" + min + ":" + sec;

}

// login using token
client.login(config.token);
