module.exports = {
    name: "voiceStateUpdate",

    async execute(oldState, newState) {

        const member = newState.member || oldState.member;

        // JOIN
        if (!oldState.channel && newState.channel) {

            const channel = newState.channel;

            await channel.send({
                content: `${member} đã tham gia **${channel.name}**`
            });
        }

        // LEAVE
        if (oldState.channel && !newState.channel) {

            const channel = oldState.channel;
            try{
                await channel.send({
                    content: `${member} đã rời khỏi **${channel.name}**`,
                    allowedMentions: { users: [member.id] }
                });
            }catch{

            }
            
        }

    }
};