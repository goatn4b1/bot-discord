const { PermissionFlagsBits } = require("discord.js");
const { getRoleDelayConfig } = require("../../handlers/roleDelayHandler");

module.exports = {
    name: "delay36",

    async execute(message) {
        if (!message.guild || !message.member) {
            return message.reply("Lenh nay chi dung duoc trong server.");
        }

        if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return message.reply("Ban khong co quyen quan ly role.");
        }

        if (!message.guild.members.me?.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return message.reply("Minh chua co quyen quan ly role trong server nay.");
        }

        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("Vui long mention nguoi can gan role 36s.");
        }

        const config = await getRoleDelayConfig(message.client, message.guild.id);

        if (!config) {
            return message.reply("Chua co cau hinh role 36s. Hay dung `hwn create role 36s` truoc.");
        }

        const role = message.guild.roles.cache.get(config.roleId);

        if (!role) {
            return message.reply("Khong tim thay role 36s da luu. Hay dung `hwn create role 36s` lai nhe.");
        }

        if (member.roles.cache.has(role.id)) {
            return message.reply(`**${member.user.tag}** da co role **${role.name}** roi.`);
        }

        if (!member.manageable) {
            return message.reply("Minh khong the chinh sua role cua nguoi dung nay.");
        }

        try {
            await member.roles.add(role, `Gan role ${role.name} boi ${message.author.tag}`);

            return message.reply(
                `Da them role **${role.name}** cho **${member.user.tag}**. Nguoi nay se bi delay ${config.delaySeconds} giay khi chat.`
            );
        } catch {
            return message.reply("Khong the them role. Kiem tra thu tu role va quyen cua bot.");
        }
    }
};
