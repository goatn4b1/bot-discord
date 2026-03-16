module.exports = {
    name: "ban",

    async execute(message, args) {

        if (!message.member.permissions.has("BanMembers")) {
            return message.reply("❌ Bạn không có quyền ban thành viên.");
        }

        const member = message.mentions.members.first();
        const minutes = parseInt(args[1]);

        if (!member) {
            return message.reply("❌ Vui lòng mention người cần ban.");
        }

        if (!minutes || minutes <= 0) {
            return message.reply("❌ Vui lòng nhập số phút hợp lệ.");
        }

        const user = member.user;

        try {

            await member.ban({ reason: `Ban ${minutes} phút bởi ${message.author.tag}` });

            message.reply(`🔨 Đã ban **${user.tag}** trong **${minutes} phút**.`);

            setTimeout(async () => {

                try {
                    await message.guild.members.unban(user.id);
                    message.channel.send(`✅ **${user.tag}** đã được unban sau ${minutes} phút.`);
                } catch (err) {}

            }, minutes * 60 * 1000);

        } catch (error) {

            message.reply("❌ Không thể ban người dùng này.");

        }

    }
};