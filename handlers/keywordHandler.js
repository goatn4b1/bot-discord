const cooldown = require("./cooldownHandler");
const { EmbedBuilder } = require("discord.js");

module.exports = async (message) => {

    const content = message.content.toLowerCase();

    // keyword Herina
    const herinaKeywords = ["herina", "hìn", "hiền"];

    // keyword Hiếu78
    const hieuKeywords = ["hiếu78", "hieu78", "hiếu 78", "hieu 78"];

    const camKeywords = ["cam"];

    // ========================
    // HERINA
    // ========================

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

    // ========================
    // HIẾU 78
    // ========================

    const foundHieu = hieuKeywords.some(word => content.includes(word));

    if (foundHieu) {

        const msg = await message.reply({
            content: `Hiếu loli múp rụp ơi <@1368902440794980433>`,
            allowedMentions: { repliedUser: false }
        });
    }

     const foundCam = camKeywords.some(word => content.includes(word));

    if (foundCam) {
        const embed = new EmbedBuilder()
            .setColor("#e962d7")
            .setDescription(`<@1436686609071345755>`)
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