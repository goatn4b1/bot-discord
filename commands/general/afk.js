const {
    getAfkStore,
    saveAfkStore,
    setAfkNickname
} = require("../../handlers/afkHandler");

module.exports = {
    name: "afk",

    async execute(message, args) {
        const afkUsers = await getAfkStore(message.client);
        const reason = args.join(" ").trim() || "AFK";
        const existingAfkData = afkUsers.get(message.author.id);

        const afkData = {
            reason,
            since: Date.now(),
            nicknames: existingAfkData?.nicknames || {}
        };

        await setAfkNickname(message.member || null, afkData);

        afkUsers.set(message.author.id, afkData);
        await saveAfkStore(message.client);

        return message.reply({
            content: `Bạn đã bật AFK với lý do: **${reason}**`,
            allowedMentions: { repliedUser: false }
        });
    }
};
