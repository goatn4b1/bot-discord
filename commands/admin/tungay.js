const ROLE_ID = "1482756722618798324";

module.exports = {
    name: "tungay",

    async execute(message) {
        if (!message.guild) {
            return message.reply("Lệnh này chỉ dùng được trong server.");
        }

        if (!message.member.permissions.has("ManageRoles")) {
            return message.reply("Bạn không có quyền quản lý role.");
        }

        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("Vui lòng mention người cần thêm role.");
        }

        const role = message.guild.roles.cache.get(ROLE_ID);

        if (!role) {
            return message.reply("Không tìm thấy role cần gán.");
        }

        if (member.roles.cache.has(ROLE_ID)) {
            return message.reply(`**${member.user.tag}** đã có role này rồi.`);
        }

        if (!member.manageable) {
            return message.reply("Mình không thể chỉnh sửa role của người dùng này.");
        }

        try {
            await member.roles.add(role, `Gán role tungay bởi ${message.author.tag}`);

            return message.reply(`Đã thêm role **${role.name}** cho **${member.user.tag}**.`);
        } catch (error) {
            return message.reply("Không thể thêm role. Kiểm tra thứ tự role và quyền của bot.");
        }
    }
};
