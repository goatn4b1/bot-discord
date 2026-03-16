const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "hug",

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
                .setDescription(`Hiếu 78 đã ôm bạn`)
                .setImage("attachment://omhieu78.webp")
                .setFooter({ text: "Ôm nhau như 2 ng đàn ông" });

            return message.channel.send({
                embeds: [embed],
                files: [
                    {
                        attachment: "./public/images/omhieu78.webp",
                        name: "omhieu78.webp"
                    }
                ]
            });
        }


        let image = "hug.jpg";
        let text = `**${message.author}** đã ôm **${member}**`;
        let footer = "1 chút ấm áp tình người";

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