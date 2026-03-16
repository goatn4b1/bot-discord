module.exports = {
    name: "clear",

    async execute(message, args) {

        if (!message.member.permissions.has("ManageMessages")) {
            return message.reply("❌ Bạn không có quyền xoá tin nhắn.");
        }

        const member = message.mentions.members.first();
        let amount = 0;

        // ======================
        // CLEAR USER
        // ======================

        if (member) {

            amount = parseInt(args[1]);

            if (!amount || amount < 1 || amount > 100) {
                return message.reply("❌ Nhập số từ 1 đến 100.");
            }

            const messages = await message.channel.messages.fetch({ limit: 100 });

            const filtered = messages
                .filter(msg => msg.author.id === member.id)
                .first(amount);

            const deleted = await message.channel.bulkDelete(filtered, true);

            const msg = await message.channel.send(
                `Đã xoá **${deleted.size}** tin nhắn của **${member.user.tag}**`
            );

            setTimeout(() => {
                msg.delete().catch(() => {});
            }, 5000);

            return;
        }

        // ======================
        // CLEAR NORMAL
        // ======================

        amount = parseInt(args[0]);

        if (!amount || amount < 1 || amount > 100) {
            return message.reply("❌ Nhập số từ 1 đến 100.");
        }

        const deleted = await message.channel.bulkDelete(amount, true);

        const msg = await message.channel.send(`Đã xoá **${deleted.size}** tin nhắn.`);

        setTimeout(() => {
            msg.delete().catch(() => {});
        }, 5000);

    }
};