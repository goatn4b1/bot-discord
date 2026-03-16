module.exports = {
    name: "unban",

    async execute(message, args) {

        if (!message.member.permissions.has("BanMembers")) {
            return message.reply("❌ Bạn không có quyền unban.");
        }

        const userId = args[0];

        if (!userId) {
            return message.reply("❌ Vui lòng nhập ID người cần unban.");
        }

        try {

            await message.guild.members.unban(userId);

            message.reply(`✅ Đã unban user có ID: **${userId}**`);

        } catch (error) {

            message.reply("❌ Không tìm thấy user hoặc không thể unban.");

        }

    }
};