const fs = require("fs/promises");
const path = require("path");

const AFK_FILE_PATH = path.join(__dirname, "..", "data", "afk.json");
const AFK_PREFIX = "[AFK] - ";
const MAX_NICKNAME_LENGTH = 32;

async function ensureAfkFile() {
    await fs.mkdir(path.dirname(AFK_FILE_PATH), { recursive: true });

    try {
        await fs.access(AFK_FILE_PATH);
    } catch (error) {
        await fs.writeFile(AFK_FILE_PATH, "{}\n", "utf8");
    }
}

function normalizeAfkData(rawData) {
    if (!rawData || typeof rawData !== "object") {
        return null;
    }

    return {
        reason: rawData.reason || "AFK",
        since: Number(rawData.since) || Date.now(),
        nicknames: rawData.nicknames && typeof rawData.nicknames === "object"
            ? rawData.nicknames
            : {}
    };
}

function stripAfkPrefix(name) {
    if (!name) return name;

    return name.startsWith(AFK_PREFIX)
        ? name.slice(AFK_PREFIX.length).trim()
        : name;
}

function buildAfkNickname(baseName) {
    const safeBaseName = stripAfkPrefix(baseName || "AFK") || "AFK";
    const maxBaseLength = MAX_NICKNAME_LENGTH - AFK_PREFIX.length;
    const truncatedBaseName = safeBaseName.slice(0, maxBaseLength).trim() || "AFK";

    return `${AFK_PREFIX}${truncatedBaseName}`;
}

async function setAfkNickname(member, afkData) {
    if (!member || !member.guild || !member.manageable) {
        return;
    }

    const guildId = member.guild.id;

    if (!(guildId in afkData.nicknames)) {
        afkData.nicknames[guildId] = member.nickname ?? null;
    }

    const afkNickname = buildAfkNickname(member.displayName);

    if (member.nickname === afkNickname) {
        return;
    }

    try {
        await member.setNickname(afkNickname, "AFK enabled");
    } catch (error) {}
}

async function restoreNicknameForMember(member, previousNickname) {
    if (!member || !member.manageable) {
        return;
    }

    const targetNickname = previousNickname ?? null;

    if ((member.nickname ?? null) === targetNickname) {
        return;
    }

    try {
        await member.setNickname(targetNickname, "AFK disabled");
    } catch (error) {}
}

async function restoreAfkNicknames(client, userId, afkData, fallbackMember) {
    if (!afkData?.nicknames || typeof afkData.nicknames !== "object") {
        return;
    }

    const restoredGuildIds = new Set();

    if (fallbackMember?.guild?.id && fallbackMember.id === userId) {
        const fallbackGuildId = fallbackMember.guild.id;
        restoredGuildIds.add(fallbackGuildId);
        await restoreNicknameForMember(
            fallbackMember,
            afkData.nicknames[fallbackGuildId]
        );
    }

    for (const [guildId, previousNickname] of Object.entries(afkData.nicknames)) {
        if (restoredGuildIds.has(guildId)) {
            continue;
        }

        const guild = client.guilds.cache.get(guildId);

        if (!guild) {
            continue;
        }

        let member = guild.members.cache.get(userId) || null;

        if (!member) {
            try {
                member = await guild.members.fetch(userId);
            } catch (error) {
                member = null;
            }
        }

        if (!member) {
            continue;
        }

        await restoreNicknameForMember(member, previousNickname);
    }
}

async function getAfkStore(client) {
    if (client.afkUsers) {
        return client.afkUsers;
    }

    if (!client.afkStorePromise) {
        client.afkStorePromise = (async () => {
            await ensureAfkFile();

            let parsedData = {};

            try {
                const rawData = await fs.readFile(AFK_FILE_PATH, "utf8");
                parsedData = rawData.trim() ? JSON.parse(rawData) : {};
            } catch (error) {
                parsedData = {};
            }

            const normalizedEntries = Object.entries(parsedData)
                .map(([userId, afkData]) => [userId, normalizeAfkData(afkData)])
                .filter(([, afkData]) => afkData);

            client.afkUsers = new Map(normalizedEntries);
            return client.afkUsers;
        })();
    }

    return client.afkStorePromise;
}

async function saveAfkStore(client) {
    const afkUsers = await getAfkStore(client);
    const payload = JSON.stringify(Object.fromEntries(afkUsers), null, 2);
    const previousWrite = client.afkWriteQueue || Promise.resolve();

    client.afkWriteQueue = previousWrite
        .catch(() => {})
        .then(() => fs.writeFile(AFK_FILE_PATH, `${payload}\n`, "utf8"));

    return client.afkWriteQueue;
}

async function handleAfkStatus(message, prefix) {
    const afkUsers = await getAfkStore(message.client);
    const authorAfk = afkUsers.get(message.author.id);

    if (authorAfk && !message.content.toLowerCase().startsWith(`${prefix}afk`)) {
        afkUsers.delete(message.author.id);
        await restoreAfkNicknames(
            message.client,
            message.author.id,
            authorAfk,
            message.member || null
        );
        await saveAfkStore(message.client);

        await message.reply({
            content: `Chào mừng quay lại, **${message.author.username}**. Mình đã tắt AFK cho bạn rồi.`,
            allowedMentions: { repliedUser: false }
        }).catch(() => {});
    }

    const mentionedUsers = [...message.mentions.users.values()].filter(
        user => user.id !== message.author.id
    );

    const afkMentions = [];

    for (const user of mentionedUsers) {
        const afkData = afkUsers.get(user.id);

        if (!afkData) continue;

        afkMentions.push(
            `**${user.username}** đang AFK: ${afkData.reason} (từ <t:${Math.floor(afkData.since / 1000)}:R>)`
        );
    }

    if (afkMentions.length > 0) {
        await message.reply({
            content: afkMentions.join("\n"),
            allowedMentions: { repliedUser: false }
        }).catch(() => {});
    }
}

module.exports = {
    getAfkStore,
    saveAfkStore,
    handleAfkStatus,
    setAfkNickname
};
