const { PermissionFlagsBits } = require("discord.js");
const { setRoleDelayConfig } = require("../../handlers/roleDelayHandler");

const ROLE_DELAY_MAP = {
    "36s": 36,
    "5s": 5
};

module.exports = {
    name: "create",

    async execute(message, args) {
        if (!message.guild || !message.member) {
            return message.reply("Lenh nay chi dung duoc trong server.");
        }

        const roleOption = args[0]?.toLowerCase();
        const roleName = args[1]?.toLowerCase();

        if (roleOption !== "role" || !Object.prototype.hasOwnProperty.call(ROLE_DELAY_MAP, roleName)) {
            return message.reply("Dung: `hwn create role 36s` hoac `hwn create role 5s`");
        }

        if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return message.reply("Ban khong co quyen quan ly role.");
        }

        if (!message.guild.members.me?.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return message.reply("Minh chua co quyen quan ly role trong server nay.");
        }

        const delaySeconds = ROLE_DELAY_MAP[roleName];
        let role = message.guild.roles.cache.find(
            cachedRole => cachedRole.name.toLowerCase() === roleName
        );
        let created = false;

        if (!role) {
            try {
                role = await message.guild.roles.create({
                    name: roleName,
                    mentionable: false,
                    hoist: false,
                    reason: `Tao role delay ${roleName} boi ${message.author.tag}`
                });
                created = true;
            } catch {
                return message.reply("Khong the tao role moi. Kiem tra lai quyen cua bot.");
            }
        }

        await setRoleDelayConfig(message.client, message.guild.id, {
            roleId: role.id,
            roleName: role.name,
            delaySeconds
        });

        if (created) {
            return message.reply(
                `Da tao role **${role.name}** va kich hoat delay chat ${delaySeconds} giay cho role nay.`
            );
        }

        return message.reply(
            `Role **${role.name}** da ton tai. Minh da gan che do delay chat ${delaySeconds} giay cho role nay.`
        );
    }
};
