const { PermissionFlagsBits } = require("discord.js");
const { setRoleDelayConfig } = require("../../handlers/roleDelayHandler");

const ROLE_NAME = "36s";
const DELAY_SECONDS = 36;

module.exports = {
    name: "create",

    async execute(message, args) {
        if (!message.guild || !message.member) {
            return message.reply("Lenh nay chi dung duoc trong server.");
        }

        if (args[0]?.toLowerCase() !== "role" || args[1]?.toLowerCase() !== "36s") {
            return message.reply("Dung: `hwn create role 36s`");
        }

        if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return message.reply("Ban khong co quyen quan ly role.");
        }

        if (!message.guild.members.me?.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return message.reply("Minh chua co quyen quan ly role trong server nay.");
        }

        let role = message.guild.roles.cache.find(
            cachedRole => cachedRole.name.toLowerCase() === ROLE_NAME
        );
        let created = false;

        if (!role) {
            try {
                role = await message.guild.roles.create({
                    name: ROLE_NAME,
                    mentionable: false,
                    hoist: false,
                    reason: `Tao role delay ${ROLE_NAME} boi ${message.author.tag}`
                });
                created = true;
            } catch {
                return message.reply("Khong the tao role moi. Kiem tra lai quyen cua bot.");
            }
        }

        await setRoleDelayConfig(message.client, message.guild.id, {
            roleId: role.id,
            roleName: role.name,
            delaySeconds: DELAY_SECONDS
        });

        if (created) {
            return message.reply(
                `Da tao role **${role.name}** va kich hoat delay chat ${DELAY_SECONDS} giay cho role nay.`
            );
        }

        return message.reply(
            `Role **${role.name}** da ton tai. Minh da gan che do delay chat ${DELAY_SECONDS} giay cho role nay.`
        );
    }
};
