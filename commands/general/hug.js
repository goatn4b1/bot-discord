const { EmbedBuilder } = require("discord.js");

const HIEU_78_ID = "1368902440794980433";
const QUANG_SON_ID = "1449721259712577699";

module.exports = {
    name: "hug",

    async execute(message) {
        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("❌ Bạn phải tag người muốn ôm.");
        }

        if (message.author.id === HIEU_78_ID) {
            const embed = new EmbedBuilder()
                .setColor("#d1853d")
                .setDescription("Hiếu 78 đã ôm bạn")
                .setImage("attachment://omhieu78.webp")
                .setFooter({ text: "Ôm nhau như 2 người đàn ông" });

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

        if (message.author.id === QUANG_SON_ID) {
            const embed = new EmbedBuilder()
                .setColor("#3d8fd1")
                .setDescription("Quang Sơn đã ôm bạn")
                .setImage("attachment://hug.jpg")
                .setFooter({ text: "Quang Sơn ôm là dính luôn" });

            return message.channel.send({
                embeds: [embed],
                files: [
                    {
                        attachment: "./public/images/hug.jpg",
                        name: "hug.jpg"
                    }
                ]
            });
        }

        const embed = new EmbedBuilder()
            .setColor("#ff4d6d")
            .setDescription(`**${message.author}** đã ôm **${member}**`)
            .setImage("attachment://hug.jpg")
            .setFooter({ text: "Một chút ấm áp tình người" });

        return message.channel.send({
            embeds: [embed],
            files: [
                {
                    attachment: "./public/images/hug.jpg",
                    name: "hug.jpg"
                }
            ]
        });
    }
};
