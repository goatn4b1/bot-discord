const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",

    async execute(member) {

        const channelId = process.env.CHANNEL_WELCOME_ID;
        const rulesChannelId = process.env.CHANNEL_RULES_ID;

        const channel = member.guild.channels.cache.get(channelId);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor("#ff66cc")
            .setDescription(`
Herina rất vui khi bạn đã gia nhập cộng đồng của chúng tôi 💖

📜 Trước khi bắt đầu, hãy đọc <#${rulesChannelId}> để nắm rõ quy định của server.

**Tại server này bạn có thể:**
🎮 Chơi game cùng Herina  
💬 Trò chuyện và giao lưu với mọi người  
🎁 Tham gia các hoạt động và sự kiện trong server  

💖 **Thuê Herina chơi game:**  
https://playerduo.net/Herina

✨ Chúc bạn có những giây phút thật vui tại đây!
`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setImage("attachment://herina.webp")
            .setFooter({
                text: `Thành viên thứ ${member.guild.memberCount}`
            });

        channel.send({
            content: `🎉 Chào mừng ${member} đến với server!`, // <-- tag user
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