const { EmbedBuilder } = require("discord.js");

const HIEU_78_ID = "1368902440794980433";
const QUANG_SON_ID = "1449721259712577699";
const SPECIAL_REDIRECT_TARGET_ID = "1276528152679809116";

module.exports = {
    name: "tat",

    async execute(message) {
        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("❌ Bạn phải tag người muốn tát.");
        }

        if (
            message.author.id === "763409750947135498" &&
            member.id === message.client.user.id
        ) {
            const embed = new EmbedBuilder()
                .setColor("#ffd700")
                .setDescription(`Quý phi nương nương **${message.author}** tha mạng`)
                .setImage("attachment://trungthanh.webp")
                .setFooter({ text: "Thề trung thành với Herina" });

            return message.channel.send({
                embeds: [embed],
                files: [
                    {
                        attachment: "./public/images/trungthanh.webp",
                        name: "trungthanh.webp"
                    }
                ]
            });
        }

        if (member.id === "763409750947135498") {
            const embed = new EmbedBuilder()
                .setColor("#ff0000")
                .setDescription(`**${message.author}** phải đi tù!`)
                .setImage("attachment://tat.jpg")
                .setFooter({ text: "Định tát Herina à? Ngươi sẽ phải trả giá" });

            return message.channel.send({
                embeds: [embed],
                files: [
                    {
                        attachment: "./public/images/tat.jpg",
                        name: "tat.jpg"
                    }
                ]
            });
        }

        let image = "tat.jpg";
        let text = `👋 **${message.author}** đã tát **${member}**`;
        let footer = "Đưa con mẹ mày tiền đây";

        if (member.id === SPECIAL_REDIRECT_TARGET_ID) {
            image = "tathieu78.jpg";
            text = `**${message.author}** vừa định tát **${member}**!`;
            footer = "Không được đâu Herina ơi";
        }

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

        if (member.id === SPECIAL_REDIRECT_TARGET_ID) {
            const hieuEmbed = new EmbedBuilder()
                .setColor("#ff0000")
                .setDescription(`💥 <@${HIEU_78_ID}> đã bị tát`)
                .setImage("attachment://tat.jpg")
                .setFooter({ text: "Hiếu 78 ơi, mày phải bị ăn tát!" });

            await message.channel.send({
                embeds: [hieuEmbed],
                files: [
                    {
                        attachment: "./public/images/tat.jpg",
                        name: "tat.jpg"
                    }
                ]
            });

            const quangSonEmbed = new EmbedBuilder()
                .setColor("#3d8fd1")
                .setDescription(`💥 <@${QUANG_SON_ID}> đã bị tát`)
                .setImage("attachment://tat.jpg")
                .setFooter({ text: "Quang Sơn ơi, mày cũng dính rồi!" });

            await message.channel.send({
                embeds: [quangSonEmbed],
                files: [
                    {
                        attachment: "./public/images/tat.jpg",
                        name: "tat.jpg"
                    }
                ]
            });
        }
    }
};
