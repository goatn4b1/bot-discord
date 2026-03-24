const ROLE_ID = "1482756722618798324";

module.exports = {
    name: "untungay",
    aliases: ["botungay"],

    async execute(message) {
        if (!message.guild) {
            return message.reply("Lệnh này chỉ dùng được trong server.");
        }

        if (!message.member.permissions.has("ManageRoles")) {
            return message.reply("Bạn không có quyền quản lý role.");
        }

        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("Vui lòng mention người cần gỡ role.");
        }

        const role = message.guild.roles.cache.get(ROLE_ID);

        if (!role) {
            return message.reply("Không tìm thấy role cần gỡ.");
        }

        if (!member.roles.cache.has(ROLE_ID)) {
            return message.reply(`**${member.user.tag}** hiện không có role này.`);
        }

        if (!member.manageable) {
            return message.reply("Mình không thể chỉnh sửa role của người dùng này.");
        }

        try {
            await member.roles.remove(role, `Gỡ role tungay bởi ${message.author.tag}`);

            return message.reply(`Đã gỡ role **${role.name}** khỏi **${member.user.tag}**.`);
        } catch (error) {
            return message.reply("Không thể gỡ role. Kiểm tra thứ tự role và quyền của bot.");
        }
    }
};
