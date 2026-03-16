const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildMemberRemove",

    async execute(member) {

        const channelId = process.env.CHANNEL_GOODBYE_ID;
        const channel = member.guild.channels.cache.get(channelId);

        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor("#ff4d6d")
            .setTitle("Một thành viên đã rời khỏi server")
            .setDescription(`
**${member.user.username}** đã rời khỏi server của Herina.

Cảm ơn bạn đã từng ghé qua cộng đồng của chúng tôi 💖  
Hy vọng một ngày nào đó bạn sẽ quay lại.

✨ Server Herina luôn chào đón bạn!
`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({
                text: `Server hiện còn ${member.guild.memberCount} thành viên`
            });

        channel.send({
            content: `${member}`, // tag người rời server
            embeds: [embed]
        });

    }
};