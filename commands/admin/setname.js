module.exports = {
    name: "setname",

    async execute(message, args) {

        if (!message.member.permissions.has("ManageNicknames")) {
            return message.reply("❌ Bạn không có quyền đổi nickname.");
        }

        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("❌ Vui lòng mention người cần đổi tên.");
        }

        const newName = args.slice(1).join(" ");

        if (!newName) {
            return message.reply("❌ Vui lòng nhập tên mới.");
        }

        try {

            await member.setNickname(newName);

            const msg = await message.channel.send(
                `✏️ Đã đổi tên **${member.user.tag}** thành **${newName}**`
            );

            setTimeout(() => {
                msg.delete().catch(() => {});
            }, 5000);

        } catch (error) {

            message.reply("❌ Không thể đổi nickname người dùng này.");

        }

    }
};