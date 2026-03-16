const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "avatar",

    async execute(message, args) {

        const user = message.mentions.users.first() || message.author;

        const avatar = user.displayAvatarURL({
            size: 1024,
            dynamic: true
        });

        const embed = new EmbedBuilder()
            .setColor("#ff66cc")
            .setTitle(`${user.username}'s avatar`)
            .setImage(avatar);

        message.reply({
            embeds: [embed]
        });

    }
}