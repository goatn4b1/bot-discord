const fs = require("fs/promises");
const path = require("path");

const GPT_HISTORY_FILE_PATH = path.join(__dirname, "..", "data", "gpt-history.json");
const MAX_HISTORY_ITEMS = 12;

async function ensureHistoryFile() {
    await fs.mkdir(path.dirname(GPT_HISTORY_FILE_PATH), { recursive: true });

    try {
        await fs.access(GPT_HISTORY_FILE_PATH);
    } catch (error) {
        await fs.writeFile(GPT_HISTORY_FILE_PATH, "{}\n", "utf8");
    }
}

function getConversationKey(message) {
    const guildId = message.guild?.id || "dm";
    return `${guildId}:${message.channel.id}:${message.author.id}`;
}

async function getHistoryStore(client) {
    if (client.gptHistoryStore) {
        return client.gptHistoryStore;
    }

    if (!client.gptHistoryStorePromise) {
        client.gptHistoryStorePromise = (async () => {
            await ensureHistoryFile();

            let parsedData = {};

            try {
                const rawData = await fs.readFile(GPT_HISTORY_FILE_PATH, "utf8");
                parsedData = rawData.trim() ? JSON.parse(rawData) : {};
            } catch (error) {
                parsedData = {};
            }

            client.gptHistoryStore = new Map(Object.entries(parsedData));
            return client.gptHistoryStore;
        })();
    }

    return client.gptHistoryStorePromise;
}

async function saveHistoryStore(client) {
    const historyStore = await getHistoryStore(client);
    const payload = JSON.stringify(Object.fromEntries(historyStore), null, 2);
    const previousWrite = client.gptHistoryWriteQueue || Promise.resolve();

    client.gptHistoryWriteQueue = previousWrite
        .catch(() => {})
        .then(() => fs.writeFile(GPT_HISTORY_FILE_PATH, `${payload}\n`, "utf8"));

    return client.gptHistoryWriteQueue;
}

async function getConversationHistory(message) {
    const historyStore = await getHistoryStore(message.client);
    const conversationKey = getConversationKey(message);
    const history = historyStore.get(conversationKey);

    return Array.isArray(history) ? history : [];
}

async function appendConversationTurn(message, userText, modelText) {
    const historyStore = await getHistoryStore(message.client);
    const conversationKey = getConversationKey(message);
    const currentHistory = await getConversationHistory(message);

    const nextHistory = [
        ...currentHistory,
        { role: "user", text: userText },
        { role: "model", text: modelText }
    ].slice(-MAX_HISTORY_ITEMS);

    historyStore.set(conversationKey, nextHistory);
    await saveHistoryStore(message.client);
}

async function clearConversationHistory(message) {
    const historyStore = await getHistoryStore(message.client);
    const conversationKey = getConversationKey(message);

    historyStore.delete(conversationKey);
    await saveHistoryStore(message.client);
}

module.exports = {
    getConversationHistory,
    appendConversationTurn,
    clearConversationHistory
};
