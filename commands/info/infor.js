const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "infor",

    async execute(message, args) {
        const guild = message.guild;
        const embed = new EmbedBuilder()
            .setColor("#ff66cc")
            .setTitle("💖 Thông tin Herina")
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setDescription(`
**Tên:** Herina  
**Ngày sinh:** 08/11/2003  
**Cung hoàng đạo:** Bọ Cạp (Scorpio)  
**Địa chỉ:** Thành phố Hồ Chí Minh

🎮 **Dịch vụ:** Chơi game cùng, trò chuyện, giải trí  

**Mạng xã hội**

**TikTok**
https://www.tiktok.com/@herina0811

**Instagram**
https://www.instagram.com/herina0811

**Facebook**
https://www.facebook.com/herina11

**Thuê Herina chơi game**  
https://playerduo.net/Herina
`)
            .setImage("attachment://herina.webp")
            .setFooter({
                text: "Cảm ơn bạn đã quan tâm đến Herina 💗"
            });

        message.reply({
            embeds: [embed],
            files: [
                {
                    attachment: "./public/images/herina.webp",
                    name: "herina.webp"
                }
            ]
        });
    }
};  