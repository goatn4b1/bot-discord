module.exports = {
    name: "unlimit",

    async execute(message, args) {

        if (!message.member.permissions.has("ModerateMembers")) {
            return message.reply("❌ Bạn không có quyền bỏ hạn chế.");
        }

        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("❌ Vui lòng mention người cần bỏ hạn chế.");
        }

        try {

            await member.timeout(null);

            message.reply(`✅ **${member.user.tag}** đã được bỏ hạn chế.`);

        } catch (error) {

            message.reply("❌ Không thể bỏ hạn chế người dùng này.");

        }

    }
};