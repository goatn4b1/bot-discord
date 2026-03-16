module.exports = {
    name: "limit",

    async execute(message, args) {

        if (!message.member.permissions.has("ModerateMembers")) {
            return message.reply("❌ Bạn không có quyền hạn chế thành viên.");
        }

        const member = message.mentions.members.first();
        const minutes = parseInt(args[1]);

        if (!member) {
            return message.reply("❌ Vui lòng mention người cần hạn chế.");
        }

        if (!minutes || minutes <= 0) {
            return message.reply("❌ Vui lòng nhập số phút hợp lệ.");
        }

        try {

            await member.timeout(minutes * 60 * 1000, `Bị hạn chế bởi ${message.author.tag}`);

            message.reply(`⛔ **${member.user.tag}** đã bị hạn chế trong **${minutes} phút**.`);

        } catch (error) {

            message.reply("❌ Không thể hạn chế người dùng này.");

        }

    }
};