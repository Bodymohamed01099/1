const express = require('express');
const app = express();
const moment = require('moment');
const Discord = require('discord.js');

// Express
app.use('/ping', (req, res) => {
    res.send(new Date());
});
app.listen(3000, () => {
    console.log('Support Ra3d Studio.');
});

const db = require("nqr.db");

// Main v13 source
const { Client, Intents, MessageEmbed, User, MessageActionRow, MessageButton, Collection } = require('discord.js');
const client = new Client({
    intents: 98045,
    allowedMentions: { repliedUser: true },
});

// Variables
var prefix = ""; // Prefix
const roomcategory = "1234073190071009280"; // Room category ID

// Bot info
client.on('ready', () => {
    console.log(`Name Bot: ${client.user.username}`);
    console.log(`Prefix Bot: ${prefix}`);
    console.log(`Tag: ${client.user.tag}`);
    console.log(`${client.guilds.cache.size} Servers`);
    console.log(`${client.users.cache.size} Users`);
    console.log(`${client.channels.cache.size} Channels`);
}).setMaxListeners(0);

// Status bot
client.on('ready', async () => {
    client.user.setStatus(`dnd`);
    let status = [` Servers : ${client.guilds.cache.size}`, `Users : ${client.users.cache.size}`, `/help`];
    setInterval(() => {
        client.user.setActivity(status[Math.floor(Math.random() * status.length)]);
    }, 5000);
});

// Error fixer
process.on("unhandledRejection", error => {
    return;
});

// Prefix
client.on("messageCreate", message => {
    if (message.content.startsWith(prefix + "room")) {
        if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.reply("You Dont Have Permessions");
        if (message.channel.type === 'dm') return;
        let args = message.content.split(" ");
        let user = message.mentions.users.first() || message.guild.members.cache.find(me => me.id === args[1]);
        if (!args[1]) return message.reply(`Example : $room ${message.author}`);
        if (!user) return message.reply('Cannot Find User !');
        let everyone = message.guild.roles.cache.find(jj => jj.name === '@everyone');
        let category = message.guild.channels.cache.find(ca => ca.id === roomcategory);
        let chname = `〢ะ・${user.username}`;

        message.guild.channels.create(chname, { type: "text" }).then(ch => {
            ch.setParent(category);
            ch.permissionOverwrites.edit(everyone, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: false
            });
            ch.permissionOverwrites.edit(user.id, {
                SEND_MESSAGES: true
            });

            let embed1 = new Discord.MessageEmbed()
                .setTitle('PRIVATE ROOM HAS BEEN CREATED')
                .setColor("EBAD42")
                .addField(`Room Name :`, `<#${ch.id}>`, false)
                .addField(`Created By :`, `<@${message.author.id}>`, false)
                .addField(`Room Owner :`, `<@${user.id}>`, false)
                .addField(`EDITING COMMANDS :`, `\`${prefix}delroom\` : __For Deleting Room__\n\`${prefix}renameroom\` : __For Edit Room Name__ `, false)
                .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }))
                .setTimestamp();
            ch.send({ embeds: [embed1] });
            message.reply({ embeds: [embed1] });
        });
    }

    if (message.content.startsWith(prefix + 'renameroom')) {
        if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.reply("You Dont Have Permessions");
        if (message.channel.type === 'dm') return;
        let args = message.content.split(" ").slice(1).join(" ");
        if (!message.channel.name.startsWith('〢ะ・')) return message.reply('It Not A Priavte Room !');
        if (!args) return message.reply('Enter A New Room Name !');

        message.channel.setName(`〢ะ・${args}`);
        message.channel.send(`Changed Private Room Name To \`${args}\``);
        message.react('✅');
    }

    if (message.content.startsWith(prefix + 'delroom')) {
        if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.reply("You Dont Have Permessions");
        if (!message.channel.name.startsWith('〢ะ・')) return message.reply('**❌ | Its Not A Private Room**');
        let embed = new Discord.MessageEmbed()
            .setTitle('ARE YOU SURE ?')
            .setDescription(`Are You Sure To Delete : <#${message.channel.id}>`)
            .addField(`YES OR NO`, `✅ | Yes\n\n❎ | No`, false)
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }))
            .setTimestamp();
        message.delete();
        message.channel.send({ embeds: [embed] }).then(async msg => {
            const emojis = ["✅", "❎"];

            for (let i = 0; i < emojis.length; i++) {
                await msg.react(emojis[i]);
            }

            const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id;

            const collector = msg.createReactionCollector(filter, { time: 15000 });

            collector.on("collect", ({ emoji, users }) => {
                const index = emojis.indexOf(emoji.name);

                if (index === 0) {
                    message.channel.delete();
                } else if (index === 1) {
                    msg.delete();
                    message.reply('**❌ | Cancelled**').then(m => {
                        m.delete({ timeout: 5000 });
                    });
                }
            });
        });
    }
});

// Help command
client.on('messageCreate', message => {
    if (message.content.startsWith(prefix + "help")) {
        const helpmainembed = new MessageEmbed()
            .setDescription(`
Dev by Nqr.#1992

------[Public Commands]------

> ${prefix}help = to view help list
> ${prefix}ping = to view bot ping

------[Owner Commands]------

> ${prefix}room = to create room for member
> ${prefix}renameroom = to rename the room
> ${prefix}delroom = to delete the room

------[Support]------

Dev by Nqr.#1992
Ra3d's Studio : https://discord.gg/HBtFU9APg7

---------------------
`);

        message.reply({ embeds: [helpmainembed] });
    }
    if (message.content.startsWith(prefix + "ping")) {
        message.reply(`
\`\`\`js
Bot Ping Is ${client.ws.ping}
\`\`\`
`);
    }
});

client.login(process.env.token);
