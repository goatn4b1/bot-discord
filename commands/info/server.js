const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "server",

    async execute(message) {

        const guild = message.guild;

        const owner = await guild.fetchOwner();

        const members = await guild.members.fetch();

        const bots = members.filter(m => m.user.bot).size;
        const humans = members.filter(m => !m.user.bot).size;

        const channels = guild.channels.cache.size;
        const roles = guild.roles.cache.size;

        const boostLevel = guild.premiumTier;
        const boostCount = guild.premiumSubscriptionCount;

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle(`Thông tin server: ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                {
                    name: "Chủ server",
                    value: `${owner.user.tag}`,
                    inline: true
                },
                {
                    name: "Tổng thành viên",
                    value: `${guild.memberCount}`,
                    inline: true
                },
                {
                    name: "Thành Viên",
                    value: `${humans}`,
                    inline: true
                },
                {
                    name: "Bot",
                    value: `${bots}`,
                    inline: true
                },
                {
                    name: "Kênh",
                    value: `${channels}`,
                    inline: true
                },
                {
                    name: "Role",
                    value: `${roles}`,
                    inline: true
                },
                {
                    name: "Boost Level",
                    value: `${boostLevel}`,
                    inline: true
                },
                {
                    name: "Số Boost",
                    value: `${boostCount}`,
                    inline: true
                },
                {
                    name: "Ngày tạo server",
                    value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
                    inline: false
                },
                {
                    name: "Server ID",
                    value: guild.id,
                    inline: false
                }
            )
            .setFooter({
                text: `Server Herina`
            });

        message.reply({
            embeds: [embed]
        });

    }
};