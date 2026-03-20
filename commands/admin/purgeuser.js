const { ChannelType, PermissionsBitField } = require("discord.js");

const RECENT_MESSAGE_AGE = 14 * 24 * 60 * 60 * 1000;
const STATUS_UPDATE_INTERVAL = 3;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function canManageChannel(channel, botMember) {
    if (!channel || typeof channel.messages?.fetch !== "function") {
        return false;
    }

    const permissions = channel.permissionsFor(botMember);

    return Boolean(
        permissions?.has(PermissionsBitField.Flags.ViewChannel) &&
        permissions?.has(PermissionsBitField.Flags.ReadMessageHistory) &&
        permissions?.has(PermissionsBitField.Flags.ManageMessages)
    );
}

async function deleteMessagesInChannel(channel, targetUserId) {
    let deletedCount = 0;
    let scannedCount = 0;
    let before;

    while (true) {
        const fetched = await channel.messages.fetch({
            limit: 100,
            before
        });

        if (fetched.size === 0) {
            break;
        }

        scannedCount += fetched.size;

        const targetMessages = [...fetched.values()].filter(
            msg => msg.author.id === targetUserId
        );

        const recentMessages = targetMessages.filter(
            msg => Date.now() - msg.createdTimestamp < RECENT_MESSAGE_AGE
        );
        const oldMessages = targetMessages.filter(
            msg => Date.now() - msg.createdTimestamp >= RECENT_MESSAGE_AGE
        );

        if (recentMessages.length > 0) {
            try {
                const deleted = await channel.bulkDelete(recentMessages, true);
                deletedCount += deleted.size;
            } catch (error) {
                for (const msg of recentMessages) {
                    try {
                        await msg.delete();
                        deletedCount += 1;
                        await sleep(250);
                    } catch (deleteError) {}
                }
            }
        }

        for (const msg of oldMessages) {
            try {
                await msg.delete();
                deletedCount += 1;
                await sleep(250);
            } catch (error) {}
        }

        before = fetched.last().id;
        await sleep(400);
    }

    return {
        deletedCount,
        scannedCount
    };
}

module.exports = {
    name: "purgeuser",

    async execute(message, args) {
        return message.reply("Tính năng này hiện đang bảo trì, vui lòng thử lại sau.");

        if (!message.guild) {
            return message.reply("Lệnh này chỉ dùng được trong server.");
        }

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply("Bạn không có quyền dùng lệnh này.");
        }

        const targetInput = args[0];
        const confirmation = args[1]?.toLowerCase();
        const member = message.mentions.members.first();
        const userId = member?.id || targetInput?.replace(/[<@!>]/g, "");

        if (!userId || !/^\d{17,20}$/.test(userId)) {
            return message.reply("Vui lòng mention hoặc nhập đúng user ID cần xóa tin nhắn.");
        }

        if (confirmation !== "confirm") {
            return message.reply(
                "Lệnh này sẽ xóa tin nhắn của người đó trong tất cả kênh mà bot truy cập được.\nDùng: `hwn purgeuser @user confirm` hoặc `hwn purgeuser 123456789012345678 confirm`"
            );
        }

        let targetUser = member?.user || null;

        if (!targetUser) {
            try {
                targetUser = await message.client.users.fetch(userId);
            } catch (error) {
                return message.reply("Không tìm thấy người dùng với ID đó.");
            }
        }

        const botMember = message.guild.members.me;

        if (!botMember) {
            return message.reply("Không lấy được thông tin quyền của bot.");
        }

        const channels = [...message.guild.channels.cache.values()].filter(channel => {
            if (channel.type === ChannelType.GuildCategory) {
                return false;
            }

            return canManageChannel(channel, botMember);
        });

        if (channels.length === 0) {
            return message.reply("Bot không có quyền quét kênh nào để xóa tin nhắn.");
        }

        const statusMessage = await message.reply(
            `Bắt đầu quét ${channels.length} kênh để xóa tin nhắn của **${targetUser.tag}**...`
        );

        let totalDeleted = 0;
        let totalScanned = 0;
        let processedChannels = 0;

        for (const channel of channels) {
            try {
                const result = await deleteMessagesInChannel(channel, userId);
                totalDeleted += result.deletedCount;
                totalScanned += result.scannedCount;
            } catch (error) {}
            
            processedChannels += 1;

            if (
                processedChannels === channels.length ||
                processedChannels % STATUS_UPDATE_INTERVAL === 0
            ) {
                await statusMessage.edit(
                    `Đang quét: ${processedChannels}/${channels.length} kênh\nĐã xóa: ${totalDeleted} tin nhắn`
                ).catch(() => {});
            }
        }

        return statusMessage.edit(
            `Đã quét xong ${channels.length} kênh.\nĐã kiểm tra khoảng ${totalScanned} tin nhắn và xóa **${totalDeleted}** tin nhắn của **${targetUser.tag}**.`
        ).catch(() => {});
    }
};
