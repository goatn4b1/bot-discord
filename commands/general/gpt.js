const {
    askGeminiWithHistory,
    DEFAULT_MODEL
} = require("../../services/geminiService");
const {
    getConversationHistory,
    appendConversationTurn,
    clearConversationHistory
} = require("../../services/gptHistoryService");

const DISCORD_MESSAGE_LIMIT = 2000;
const SAFE_CHUNK_SIZE = 1800;

function splitMessage(text) {
    if (text.length <= DISCORD_MESSAGE_LIMIT) {
        return [text];
    }

    const chunks = [];
    let remaining = text;

    while (remaining.length > SAFE_CHUNK_SIZE) {
        let splitIndex = remaining.lastIndexOf("\n", SAFE_CHUNK_SIZE);

        if (splitIndex < 0) {
            splitIndex = remaining.lastIndexOf(" ", SAFE_CHUNK_SIZE);
        }

        if (splitIndex < 0) {
            splitIndex = SAFE_CHUNK_SIZE;
        }

        chunks.push(remaining.slice(0, splitIndex).trim());
        remaining = remaining.slice(splitIndex).trim();
    }

    if (remaining) {
        chunks.push(remaining);
    }

    return chunks.filter(Boolean);
}

module.exports = {
    name: "gpt",
    aliases: ["chatgpt"],

    async execute(message, args) {
        const question = args.join(" ").trim();

        if (!question) {
            return message.reply(
                "Dung: `hwn gpt <cau hoi>` hoac `hwn chatgpt <cau hoi>`"
            );
        }

        if (["reset", "clear"].includes(question.toLowerCase())) {
            await clearConversationHistory(message);

            return message.reply({
                content: "Da xoa lich su hoi dap cua ban trong kenh nay.",
                allowedMentions: { repliedUser: false }
            });
        }

        const loadingMessage = await message.reply({
            content: `Dang hoi Gemini bang model \`${DEFAULT_MODEL}\`...`,
            allowedMentions: { repliedUser: false }
        });

        try {
            const history = await getConversationHistory(message);
            const answer = await askGeminiWithHistory(question, history);
            const chunks = splitMessage(answer);

            await appendConversationTurn(message, question, answer);

            await loadingMessage.edit({
                content: chunks[0],
                allowedMentions: { repliedUser: false }
            });

            for (let index = 1; index < chunks.length; index += 1) {
                await message.channel.send({
                    content: chunks[index],
                    allowedMentions: { repliedUser: false }
                });
            }
        } catch (error) {
            console.error("gpt command error:", error);

            let errorMessage = "Khong goi duoc Gemini luc nay. Thu lai sau nhe.";

            if (error.code === "missing_api_key") {
                errorMessage = "Chua co `GEMINI_API_KEY` trong file `.env`.";
            } else if (error.code === "empty_response") {
                errorMessage = "Gemini khong tra ve noi dung hop le.";
            } else if (error.message) {
                errorMessage = `Loi Gemini: ${error.message}`;
            }

            await loadingMessage.edit({
                content: errorMessage,
                allowedMentions: { repliedUser: false }
            }).catch(() => {});
        }
    }
};
