const { EmbedBuilder } = require("discord.js");
const {
    MAX_MESSAGES,
    DEFAULT_MESSAGES,
    buildSummary,
    fetchMessagesBefore
} = require("../../utils/chatSummary");

module.exports = {
    name: "summary",

    async execute(message, args) {
        const requestedAmount = args[0] ? Number.parseInt(args[0], 10) : DEFAULT_MESSAGES;

        if (Number.isNaN(requestedAmount)) {
            return message.reply("Dùng: `hwn summary <số_tin_nhắn>`");
        }

        if (requestedAmount < 1 || requestedAmount > MAX_MESSAGES) {
            return message.reply(`Bạn chỉ được nhập từ 1 đến ${MAX_MESSAGES} tin nhắn.`);
        }

        if (!message.channel || !message.channel.isTextBased()) {
            return message.reply("Lệnh này chỉ dùng được trong kênh text.");
        }

        try {
            const history = await fetchMessagesBefore(
                message.channel,
                message.id,
                requestedAmount
            );

            if (history.length === 0) {
                return message.reply("Không lấy được tin nhắn nào để tóm tắt.");
            }

            const summary = buildSummary(history);

            const embed = new EmbedBuilder()
                .setColor("#2b90d9")
                .setTitle("Tóm tắt đoạn chat")
                .setDescription(
                    `Đã đọc ${history.length} tin nhắn gần nhất trước lệnh của bạn.`
                )
                .addFields(
                    {
                        name: "Người nói nhiều",
                        value: summary.participantSummary,
                        inline: false
                    },
                    {
                        name: "Từ khóa nổi bật",
                        value: summary.keywordSummary,
                        inline: false
                    },
                    {
                        name: "Tóm tắt nhanh",
                        value: summary.highlights.map(line => `- ${line}`).join("\n"),
                        inline: false
                    }
                )
                .setFooter({
                    text: `Cú pháp: hwn summary ${requestedAmount}`
                })
                .setTimestamp();

            return message.reply({
                embeds: [embed]
            });
        } catch (error) {
            console.error("summary command error:", error);
            return message.reply(
                "Mình không đọc được lịch sử tin nhắn. Kiểm tra quyền Read Message History cho bot nhé."
            );
        }
    }
};
