const { EmbedBuilder } = require("discord.js");

const HIEU_78_ID = "1368902440794980433";
const QUANG_SON_ID = "1449721259712577699";

module.exports = async (message) => {
    const content = message.content.toLowerCase();

    const herinaKeywords = ["herina", "hìn", "hiền"];
    const hieuKeywords = ["hiếu78", "hieu78", "hiếu 78", "hieu 78"];
    const quangSonKeywords = ["quang sơn", "quang son", "quangsơn", "quangson"];
    const camKeywords = ["cam"];

    const foundHerina = herinaKeywords.some(word => content.includes(word));

    if (foundHerina) {
        const msg = await message.reply({
            content: `
💖 Bạn đang tìm **Herina** phải không?

🎮 Thuê Herina chơi game tại:
https://playerduo.net/Herina
            `,
            allowedMentions: { repliedUser: false }
        });

        setTimeout(() => {
            msg.delete().catch(() => {});
        }, 5000);

        return;
    }

    const foundHieu = hieuKeywords.some(word => content.includes(word));

    if (foundHieu) {
        await message.reply({
            content: `Hiếu loli múp rụp ơi <@${HIEU_78_ID}>`,
            allowedMentions: { repliedUser: false }
        });
    }

    const foundQuangSon = quangSonKeywords.some(word => content.includes(word));

    if (foundQuangSon) {
        await message.reply({
            content: `Quang Sơn ơi có người gọi kìa <@${QUANG_SON_ID}>`,
            allowedMentions: { repliedUser: false }
        });
    }

    const foundCam = camKeywords.some(word => content.includes(word));

    if (foundCam) {
        const embed = new EmbedBuilder()
            .setColor("#e962d7")
            .setDescription("<@1436686609071345755>")
            .setImage("attachment://cam.png")
            .setFooter({ text: "Cam" });

        return message.channel.send({
            embeds: [embed],
            files: [
                {
                    attachment: "./public/images/cam.png",
                    name: "cam.png"
                }
            ]
        });
    }
};
