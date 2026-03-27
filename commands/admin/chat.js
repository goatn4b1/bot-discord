const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "chat",

    async execute(message, args) {
        if (!message.guild || !message.member) {
            return message.reply("Lenh nay chi dung duoc trong server.");
        }

        if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return message.reply("Chi quan tri vien (Manage Server) moi duoc su dung lenh nay.");
        }

        const defaultChannelId = "1449203228787871848";

        let targetChannelId = defaultChannelId;
        let text = args.join(" ").trim();

        if (args.length > 0) {
            const firstArg = args[0].replace(/<#(\d+)>/, "$1");
            if (/^\d+$/.test(firstArg) && firstArg.length >= 17) {
                targetChannelId = firstArg;
                text = args.slice(1).join(" ").trim();
            }
        }

        if (!text) {
            return message.reply("Dung: `hwn chat [channelId] <noi dung>`");
        }

        const targetChannel = message.guild.channels.cache.get(targetChannelId);

        if (!targetChannel || !targetChannel.isTextBased()) {
            return message.reply(`Khong tim thay kenh ${targetChannelId} de gui tin nhan.`);
        }

        try {
            await targetChannel.send(text);
            return message.reply("Da gui noi dung vao kenh chung.");
        } catch (err) {
            console.error("chat command error", err);
            return message.reply("Khong the gui noi dung vao kenh chung. Kiem tra quyen cua bot.");
        }
    }
};