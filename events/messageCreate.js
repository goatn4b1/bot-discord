const keywordHandler = require("../handlers/keywordHandler");
const { handleAfkStatus } = require("../handlers/afkHandler");

module.exports = {
    name: "messageCreate",

    async execute(message, client) {
        if (message.author.bot) return;

        const prefix = "hwn ";

        await handleAfkStatus(message, prefix);
        await keywordHandler(message);

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) return;

        const command = client.commands.get(commandName);

        if (!command) return;

        await command.execute(message, args);
    }
};
