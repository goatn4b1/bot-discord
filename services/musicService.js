const { PermissionsBitField } = require("discord.js");
const {
    VoiceConnectionStatus,
    entersState,
    joinVoiceChannel
} = require("@discordjs/voice");

const voiceConnections = new Map();

function initializeMusic(client) {
    if (!client.voiceConnections) {
        client.voiceConnections = voiceConnections;
    }
}

function getMemberVoiceChannel(message) {
    return message.member?.voice?.channel || null;
}

function getBotVoiceChannel(message) {
    return message.guild?.members?.me?.voice?.channel || null;
}

function validateVoiceAccess(message, options = {}) {
    const {
        requireUserInVoice = true,
        requireSameChannel = false
    } = options;

    if (!message.guild || !message.member) {
        return "Lenh nay chi dung duoc trong server.";
    }

    const memberVoiceChannel = getMemberVoiceChannel(message);
    const botVoiceChannel = getBotVoiceChannel(message);

    if (requireUserInVoice && !memberVoiceChannel) {
        return "Ban can vao mot kenh thoai truoc da.";
    }

    if (memberVoiceChannel) {
        const permissions = memberVoiceChannel.permissionsFor(message.guild.members.me);

        if (!permissions?.has(PermissionsBitField.Flags.Connect)) {
            return "Minh chua co quyen vao kenh thoai cua ban.";
        }

        if (requireSameChannel && botVoiceChannel && memberVoiceChannel.id !== botVoiceChannel.id) {
            return `Minh dang o **${botVoiceChannel.name}**. Hay vao cung kenh voi minh roi thu lai nhe.`;
        }
    }

    return null;
}

async function waitForConnectionReady(connection) {
    if (connection.state.status === VoiceConnectionStatus.Ready) {
        return;
    }

    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
}

function destroyStoredConnection(guildId) {
    const storedConnection = voiceConnections.get(guildId);

    if (!storedConnection) {
        return;
    }

    try {
        storedConnection.connection.destroy();
    } catch {

    }

    voiceConnections.delete(guildId);
}

function attachConnectionListeners(guildId, connection) {
    connection.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5_000)
            ]);
        } catch {
            voiceConnections.delete(guildId);
        }
    });

    connection.on("error", () => {
        voiceConnections.delete(guildId);
    });
}

async function joinMemberVoiceChannel(message) {
    const guildId = message.guild?.id;
    const voiceChannel = getMemberVoiceChannel(message);

    if (!guildId || !voiceChannel) {
        throw new Error("Ban can vao mot kenh thoai truoc da.");
    }

    const existingConnection = voiceConnections.get(guildId);

    if (existingConnection) {
        return existingConnection.connection;
    }

    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId,
        adapterCreator: message.guild.voiceAdapterCreator,
        selfDeaf: true
    });

    await waitForConnectionReady(connection);

    voiceConnections.set(guildId, {
        connection,
        channelId: voiceChannel.id
    });

    attachConnectionListeners(guildId, connection);

    return connection;
}

function stopAndLeave(message) {
    if (!message.guild?.id) {
        return;
    }

    destroyStoredConnection(message.guild.id);
}

function formatMusicError(error) {
    const rawMessage = String(error?.message || error || "").trim();

    if (!rawMessage) {
        return "Co loi khi xu ly kenh thoai. Ban thu lai sau nhe.";
    }

    if (rawMessage.includes("VOICE_CONNECT_FAILED")) {
        return "Minh khong the vao kenh thoai nay.";
    }

    if (rawMessage.includes("timed out")) {
        return "Ket noi vao kenh thoai bi qua thoi gian cho.";
    }

    return `Co loi khi vao kenh thoai: ${rawMessage}`;
}

module.exports = {
    initializeMusic,
    getMemberVoiceChannel,
    getBotVoiceChannel,
    joinMemberVoiceChannel,
    stopAndLeave,
    validateVoiceAccess,
    formatMusicError
};
