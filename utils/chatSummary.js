const MAX_MESSAGES = 300;
const DEFAULT_MESSAGES = 30;
const DISCORD_FETCH_LIMIT = 100;

const STOP_WORDS = new Set([
    "a", "an", "and", "are", "as", "at", "au", "ba", "ban", "be", "bi", "bị", "bo", "bot",
    "cac", "cái", "cần", "cho", "co", "có", "con", "cua", "của", "da", "dang", "đã", "đang",
    "day", "đây", "de", "để", "den", "đến", "di", "đi", "do", "duoc", "được", "em", "from",
    "gi", "gì", "ha", "hai", "hay", "hi", "hihi", "hoa", "hong", "hơn", "i", "is", "it", "k",
    "ka", "khong", "không", "khi", "ko", "la", "là", "lai", "lại", "len", "lên", "like", "luon",
    "luôn", "ma", "mà", "minh", "mình", "mot", "một", "nay", "này", "ne", "nè", "neu", "nếu",
    "ngay", "người", "nha", "nhá", "nhe", "nhé", "nhieu", "nhiều", "nhung", "nhưng", "not", "now",
    "o", "ở", "of", "ok", "oke", "qua", "quá", "ra", "rồi", "roi", "se", "sẽ", "sao", "số",
    "so", "tao", "ta", "the", "thi", "thì", "theo", "this", "to", "toi", "tôi", "tren", "trên",
    "troi", "trời", "tu", "từ", "uh", "um", "va", "và", "vay", "vậy", "ve", "về", "voi", "với",
    "vua", "vừa", "was", "what", "when", "where", "why", "xin", "yeu", "yêu"
]);

function sanitizeContent(content) {
    return content
        .replace(/https?:\/\/\S+/gi, " ")
        .replace(/<a?:\w+:\d+>/g, " ")
        .replace(/<@!?\d+>/g, " ")
        .replace(/<#\d+>/g, " ")
        .replace(/<@&\d+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function tokenize(text) {
    const normalized = text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, " ");

    return normalized
        .split(/\s+/)
        .filter(word => word.length >= 3 && !STOP_WORDS.has(word));
}

function truncate(text, limit) {
    if (text.length <= limit) return text;
    return `${text.slice(0, limit - 3)}...`;
}

function collectKeywords(messages) {
    const counts = new Map();

    for (const message of messages) {
        const tokens = new Set(tokenize(message.cleanContent));

        for (const token of tokens) {
            counts.set(token, (counts.get(token) || 0) + 1);
        }
    }

    return [...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 5)
        .map(([word]) => word);
}

function pickHighlights(messages, keywords) {
    const keywordSet = new Set(keywords);

    const scored = messages
        .map(message => {
            const tokens = tokenize(message.cleanContent);
            const keywordHits = tokens.filter(token => keywordSet.has(token)).length;
            const lengthScore = Math.min(message.cleanContent.length / 80, 2);
            const attachmentBonus = message.attachmentsCount > 0 ? 0.4 : 0;

            return {
                ...message,
                score: keywordHits * 2 + lengthScore + attachmentBonus
            };
        })
        .filter(message => message.score > 0.5)
        .sort((a, b) => b.score - a.score || b.createdTimestamp - a.createdTimestamp);

    const highlights = [];
    const usedAuthors = new Set();

    for (const item of scored) {
        if (highlights.length >= 4) break;

        const duplicate = highlights.some(existing =>
            existing.cleanContent.toLowerCase() === item.cleanContent.toLowerCase()
        );

        if (duplicate) continue;

        if (usedAuthors.has(item.authorTag) && highlights.length < 2) continue;

        highlights.push(item);
        usedAuthors.add(item.authorTag);
    }

    if (highlights.length === 0) {
        return messages
            .slice(-3)
            .reverse()
            .map(message => ({
                ...message,
                score: 1
            }));
    }

    return highlights
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
        .slice(0, 4);
}

function buildSummary(messages) {
    const cleanedMessages = messages
        .map(message => {
            const cleanContent = sanitizeContent(message.content || "");
            const attachmentCount = message.attachments?.size || 0;

            return {
                id: message.id,
                authorTag: message.author.username,
                cleanContent,
                createdTimestamp: message.createdTimestamp,
                attachmentsCount: attachmentCount
            };
        })
        .filter(message => message.cleanContent || message.attachmentsCount > 0);

    if (cleanedMessages.length === 0) {
        return {
            participantSummary: "Không có nội dung hợp lệ để tóm tắt.",
            keywordSummary: "Không tìm thấy từ khóa nổi bật.",
            highlights: ["Không có tin nhắn văn bản để tóm tắt trong đoạn này."]
        };
    }

    const participantCounts = new Map();

    for (const message of cleanedMessages) {
        participantCounts.set(
            message.authorTag,
            (participantCounts.get(message.authorTag) || 0) + 1
        );
    }

    const participantSummary = [...participantCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([author, count]) => `${author} (${count})`)
        .join(", ");

    const keywords = collectKeywords(cleanedMessages);
    const keywordSummary = keywords.length > 0
        ? keywords.join(", ")
        : "Không tìm thấy từ khóa rõ ràng.";

    const highlights = pickHighlights(cleanedMessages, keywords).map(message => {
        const body = message.cleanContent
            ? truncate(message.cleanContent, 120)
            : "Gui anh / file";

        return `${message.authorTag}: ${body}`;
    });

    return {
        participantSummary,
        keywordSummary,
        highlights
    };
}

async function fetchMessagesBefore(channel, beforeMessageId, requestedAmount) {
    const target = Math.min(Math.max(requestedAmount, 1), MAX_MESSAGES);
    const collected = [];
    let before = beforeMessageId;

    while (collected.length < target) {
        const batchSize = Math.min(DISCORD_FETCH_LIMIT, target - collected.length);
        const fetched = await channel.messages.fetch({
            limit: batchSize,
            before
        });

        if (fetched.size === 0) break;

        const items = [...fetched.values()];
        collected.push(...items);
        before = items[items.length - 1].id;
    }

    return collected
        .filter(message => !message.author.bot)
        .slice(0, target)
        .reverse();
}

module.exports = {
    MAX_MESSAGES,
    DEFAULT_MESSAGES,
    buildSummary,
    fetchMessagesBefore
};
