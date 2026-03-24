const {
    joinMemberVoiceChannel,
    getMemberVoiceChannel,
    getBotVoiceChannel,
    validateVoiceAccess,
    formatMusicError
} = require("../../services/musicService");

module.exports = {
    name: "join",
    aliases: ["vao"],

    async execute(message) {
        const validationError = validateVoiceAccess(message);

        if (validationError) {
            return message.reply({
                content: validationError,
                allowedMentions: { repliedUser: false }
            });
        }

        const memberVoiceChannel = getMemberVoiceChannel(message);
        const botVoiceChannel = getBotVoiceChannel(message);

        if (botVoiceChannel?.id === memberVoiceChannel.id) {
            return message.reply({
                content: `Minh da o san trong **${memberVoiceChannel.name}** roi.`,
                allowedMentions: { repliedUser: false }
            });
        }

        if (botVoiceChannel && botVoiceChannel.id !== memberVoiceChannel.id) {
            return message.reply({
                content: `Minh dang o **${botVoiceChannel.name}**. Dung \`hwn leave\` roi thu lai nhe.`,
                allowedMentions: { repliedUser: false }
            });
        }

        try {
            await joinMemberVoiceChannel(message);

            return message.reply({
                content: `Minh da vao **${memberVoiceChannel.name}** roi va se o day cho toi khi ban dung \`hwn leave\`.`,
                allowedMentions: { repliedUser: false }
            });
        } catch (error) {
            console.error("join command error:", error);

            return message.reply({
                content: formatMusicError(error),
                allowedMentions: { repliedUser: false }
            });
        }
    }
};
