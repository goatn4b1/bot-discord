const { PermissionFlagsBits } = require("discord.js");
const { getRoleDelayConfig } = require("../../handlers/roleDelayHandler");

const ALLOWED_ROLES = ["5s", "36s"];

module.exports = {
    name: "addrole",
    aliases: ["ar"],

    async execute(message, args) {
        if (!message.guild || !message.member) {
            return message.reply("Lenh nay chi dung duoc trong server.");
        }

        if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return message.reply("Ban khong co quyen quan ly role.");
        }

        if (!message.guild.members.me?.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return message.reply("Minh chua co quyen quan ly role trong server nay.");
        }

        const roleName = args[0]?.toLowerCase();
        const member = message.mentions.members.first();

        if (!roleName || !ALLOWED_ROLES.includes(roleName)) {
            return message.reply("Dung: `hwn addrole 5s @user` hoac `hwn addrole 36s @user`");
        }

        if (!member) {
            return message.reply("Vui long mention nguoi can gan role.");
        }

        const config = await getRoleDelayConfig(message.client, message.guild.id);
        if (!config || config.roleName.toLowerCase() !== roleName) {
            return message.reply(`Chua co cau hinh role ${roleName}. Hay dung ` + "`" + `hwn create role ${roleName}` + "`" + ` truoc.`);
        }

        const role = message.guild.roles.cache.get(config.roleId) ||
            message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName);

        if (!role) {
            return message.reply(`Khong tim thay role ${roleName}. Hay dung ` + "`" + `hwn create role ${roleName}` + "`" + ` truoc.`);
        }

        if (member.roles.cache.has(role.id)) {
            return message.reply(`**${member.user.tag}** da co role **${role.name}** roi.`);
        }

        if (!member.manageable) {
            return message.reply("Minh khong the chinh sua role cua nguoi dung nay.");
        }

        try {
            await member.roles.add(role, `Gan role ${role.name} boi ${message.author.tag}`);
            return message.reply(`Da them role **${role.name}** cho **${member.user.tag}**.`);
        } catch {
            return message.reply("Khong the them role. Kiem tra thu tu role va quyen cua bot.");
        }
    }
};