const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "kiss",

    async execute(message, args) {

        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("❌ Bạn phải tag người muốn kiss.");
        }

        if (
            message.author.id === "1368902440794980433"
        ) {
            const embed = new EmbedBuilder()
                .setColor("#d1853d")
                .setDescription(`Chạy đi **${message.author}** kìa`)
                .setImage("attachment://chaydi.jpg")
                .setFooter({ text: "Ấm dâu hiếu78" });

            return message.channel.send({
                embeds: [embed],
                files: [
                    {
                        attachment: "./public/images/chaydi.jpg",
                        name: "chaydi.jpg"
                    }
                ]
            });
        }

         // nếu tát người cấm tát
        if (member.id === "763409750947135498") {

            const embed = new EmbedBuilder()
                .setColor("#ff0000")
                .setDescription(`**${message.author}** phải đi tù!`)
                .setImage("attachment://baove.jpg")
                .setFooter({ text: "Không được đâu bé ơi" });

            return message.channel.send({
                embeds: [embed],
                files: [
                    {
                        attachment: "./public/images/baove.jpg",
                        name: "baove.jpg"
                    }
                ]
            });
        }

        let image = "kiss.jpg";
        let text = `**${message.author}** đã kiss **${member}**`;
        let footer = "Trao nhau nụ hôn nồng cháy";

        const embed = new EmbedBuilder()
            .setColor("#ff4d6d")
            .setDescription(text)
            .setImage(`attachment://${image}`)
            .setFooter({ text: footer });

        await message.channel.send({
            embeds: [embed],
            files: [
                {
                    attachment: `./public/images/${image}`,
                    name: image
                }
            ]
        });

    }
};