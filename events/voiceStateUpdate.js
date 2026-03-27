module.exports = {
    name: "voiceStateUpdate",

    async execute(oldState, newState) {
        const member = newState.member || oldState.member;
        const channel = newState.channel || oldState.channel;

        if (!member || member.user?.bot || !channel || typeof channel.send !== "function") {
            return;
        }

        if (!oldState.channel && newState.channel) {
            try {
                await channel.send({
                    content: `${member} đã tham gia **${channel.name}**`,
                    allowedMentions: { parse: [] }
                });
            } catch {}
        }

        if (oldState.channel && !newState.channel) {
            try {
                await channel.send({
                    content: `${member} đã rời khỏi **${channel.name}**`,
                    allowedMentions: { parse: [] }
                });
            } catch {}
        }
    }
};