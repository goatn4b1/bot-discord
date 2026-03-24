const {
    getBotVoiceChannel,
    stopAndLeave,
    validateVoiceAccess,
    formatMusicError
} = require("../../services/musicService");

module.exports = {
    name: "leave",
    aliases: ["disconnect"],

    async execute(message) {
        const botVoiceChannel = getBotVoiceChannel(message);

        if (!botVoiceChannel) {
            return message.reply({
                content: "Minh chua o trong kenh thoai nao.",
                allowedMentions: { repliedUser: false }
            });
        }

        const validationError = validateVoiceAccess(message, {
            requireSameChannel: true
        });

        if (validationError) {
            return message.reply({
                content: validationError,
                allowedMentions: { repliedUser: false }
            });
        }

        try {
            stopAndLeave(message);

            return message.reply({
                content: "Minh da roi kenh thoai.",
                allowedMentions: { repliedUser: false }
            });
        } catch (error) {
            console.error("leave command error:", error);

            return message.reply({
                content: formatMusicError(error),
                allowedMentions: { repliedUser: false }
            });
        }
    }
};
