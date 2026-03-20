const { EmbedBuilder } = require("discord.js");

const HIEU_78_ID = "1368902440794980433";
const QUANG_SON_ID = "1449721259712577699";

module.exports = {
    name: "kiss",

    async execute(message) {
        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("❌ Bạn phải tag người muốn kiss.");
        }

        if (message.author.id === HIEU_78_ID) {
            const embed = new EmbedBuilder()
                .setColor("#d1853d")
                .setDescription(`Chạy đi **${message.author}** kìa`)
                .setImage("attachment://chaydi.jpg")
                .setFooter({ text: "Ấm dâu Hiếu 78" });

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

        if (message.author.id === QUANG_SON_ID) {
            const embed = new EmbedBuilder()
                .setColor("#3d8fd1")
                .setDescription(`Chạy đi **${message.author}** kìa`)
                .setImage("attachment://chaydi.jpg")
                .setFooter({ text: "Ấm dâu Quang Sơn" });

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

        const embed = new EmbedBuilder()
            .setColor("#ff4d6d")
            .setDescription(`**${message.author}** đã kiss **${member}**`)
            .setImage("attachment://kiss.jpg")
            .setFooter({ text: "Trao nhau nụ hôn nồng cháy" });

        return message.channel.send({
            embeds: [embed],
            files: [
                {
                    attachment: "./public/images/kiss.jpg",
                    name: "kiss.jpg"
                }
            ]
        });
    }
};
