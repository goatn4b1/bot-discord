const fs = require("fs/promises");
const path = require("path");

const ROLE_DELAY_FILE_PATH = path.join(__dirname, "..", "data", "role-delay-roles.json");
const WARNING_TTL_MS = 5_000;

async function ensureRoleDelayFile() {
    await fs.mkdir(path.dirname(ROLE_DELAY_FILE_PATH), { recursive: true });

    try {
        await fs.access(ROLE_DELAY_FILE_PATH);
    } catch {
        await fs.writeFile(ROLE_DELAY_FILE_PATH, "{}\n", "utf8");
    }
}

function normalizeRoleDelayConfig(rawConfig) {
    if (!rawConfig || typeof rawConfig !== "object") {
        return null;
    }

    const roleId = String(rawConfig.roleId || "").trim();
    const roleName = String(rawConfig.roleName || "").trim() || "36s";
    const delaySeconds = Number(rawConfig.delaySeconds) || 0;

    if (!roleId || delaySeconds <= 0) {
        return null;
    }

    return {
        roleId,
        roleName,
        delaySeconds
    };
}

async function getRoleDelayStore(client) {
    if (client.roleDelayConfigs) {
        return client.roleDelayConfigs;
    }

    if (!client.roleDelayStorePromise) {
        client.roleDelayStorePromise = (async () => {
            await ensureRoleDelayFile();

            let parsedData = {};

            try {
                const rawData = await fs.readFile(ROLE_DELAY_FILE_PATH, "utf8");
                parsedData = rawData.trim() ? JSON.parse(rawData) : {};
            } catch {
                parsedData = {};
            }

            const normalizedEntries = Object.entries(parsedData)
                .map(([guildId, config]) => [guildId, normalizeRoleDelayConfig(config)])
                .filter(([, config]) => config);

            client.roleDelayConfigs = new Map(normalizedEntries);
            return client.roleDelayConfigs;
        })();
    }

    return client.roleDelayStorePromise;
}

async function saveRoleDelayStore(client) {
    const roleDelayStore = await getRoleDelayStore(client);
    const payload = JSON.stringify(Object.fromEntries(roleDelayStore), null, 2);
    const previousWrite = client.roleDelayWriteQueue || Promise.resolve();

    client.roleDelayWriteQueue = previousWrite
        .catch(() => {})
        .then(() => fs.writeFile(ROLE_DELAY_FILE_PATH, `${payload}\n`, "utf8"));

    return client.roleDelayWriteQueue;
}

async function getRoleDelayConfig(client, guildId) {
    const roleDelayStore = await getRoleDelayStore(client);
    return roleDelayStore.get(guildId) || null;
}

async function setRoleDelayConfig(client, guildId, config) {
    const normalizedConfig = normalizeRoleDelayConfig(config);

    if (!normalizedConfig) {
        throw new Error("Cau hinh role delay khong hop le.");
    }

    const roleDelayStore = await getRoleDelayStore(client);
    roleDelayStore.set(guildId, normalizedConfig);
    await saveRoleDelayStore(client);

    return normalizedConfig;
}

function getRoleDelayState(client) {
    if (!client.roleDelayState) {
        client.roleDelayState = new Map();
    }

    return client.roleDelayState;
}

async function handleRoleDelayMessage(message) {
    if (!message.guild || !message.member || message.author.bot) {
        return false;
    }

    const config = await getRoleDelayConfig(message.client, message.guild.id);

    if (!config || !message.member.roles.cache.has(config.roleId)) {
        return false;
    }

    const roleDelayState = getRoleDelayState(message.client);
    const key = `${message.guild.id}:${message.author.id}`;
    const now = Date.now();
    const lastMessageAt = roleDelayState.get(key) || 0;
    const nextAllowedAt = lastMessageAt + (config.delaySeconds * 1000);

    if (now >= nextAllowedAt) {
        roleDelayState.set(key, now);
        return false;
    }

    const remainingSeconds = Math.ceil((nextAllowedAt - now) / 1000);

    try {
        if (message.deletable) {
            await message.delete();
        }
    } catch {}

    const warningMessage = await message.channel.send({
        content: `${message.author}, ban can doi ${remainingSeconds} giay nua moi duoc nhan tiep.`,
        allowedMentions: { users: [message.author.id] }
    }).catch(() => null);

    if (warningMessage) {
        const cleanupTimer = setTimeout(() => {
            warningMessage.delete().catch(() => {});
        }, WARNING_TTL_MS);

        if (typeof cleanupTimer.unref === "function") {
            cleanupTimer.unref();
        }
    }

    return true;
}

module.exports = {
    getRoleDelayConfig,
    setRoleDelayConfig,
    handleRoleDelayMessage
};
