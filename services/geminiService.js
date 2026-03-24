const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const SYSTEM_PROMPT =
    "Ban la tro ly trong bot Discord. Tra loi bang tieng Viet, ro rang, than thien, va dung trong tam.";

function extractTextFromResponse(data) {
    if (!Array.isArray(data?.candidates)) {
        return "";
    }

    const texts = [];

    for (const candidate of data.candidates) {
        const parts = candidate?.content?.parts;

        if (!Array.isArray(parts)) continue;

        for (const part of parts) {
            if (typeof part?.text === "string" && part.text.trim()) {
                texts.push(part.text.trim());
            }
        }
    }

    return texts.join("\n\n").trim();
}

async function askGemini(question) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        const error = new Error("missing_api_key");
        error.code = "missing_api_key";
        throw error;
    }

    const response = await fetch(
        `${GEMINI_API_BASE_URL}/${DEFAULT_MODEL}:generateContent`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `${SYSTEM_PROMPT}\n\nNguoi dung hoi: ${question}`
                            }
                        ]
                    }
                ]
            })
        }
    );

    if (!response.ok) {
        let errorMessage = `Gemini API error: ${response.status}`;
        let errorCode = `http_${response.status}`;

        try {
            const errorBody = await response.json();
            const apiMessage = errorBody?.error?.message;
            const apiStatus = errorBody?.error?.status;

            if (apiMessage) {
                errorMessage = apiMessage;
            }

            if (apiStatus) {
                errorCode = apiStatus;
            }
        } catch (error) {}

        const requestError = new Error(errorMessage);
        requestError.code = errorCode;
        requestError.status = response.status;

        throw requestError;
    }

    const data = await response.json();
    const answer = extractTextFromResponse(data);

    if (!answer) {
        const error = new Error("empty_response");
        error.code = "empty_response";
        throw error;
    }

    return answer;
}

async function askGeminiWithHistory(question, history = []) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        const error = new Error("missing_api_key");
        error.code = "missing_api_key";
        throw error;
    }

    const contents = history
        .filter(item => item && typeof item.text === "string" && item.text.trim())
        .map(item => ({
            role: item.role === "model" ? "model" : "user",
            parts: [{ text: item.text.trim() }]
        }));

    contents.push({
        role: "user",
        parts: [
            {
                text: `${SYSTEM_PROMPT}\n\nNguoi dung hoi: ${question}`
            }
        ]
    });

    const response = await fetch(
        `${GEMINI_API_BASE_URL}/${DEFAULT_MODEL}:generateContent`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey
            },
            body: JSON.stringify({ contents })
        }
    );

    if (!response.ok) {
        let errorMessage = `Gemini API error: ${response.status}`;
        let errorCode = `http_${response.status}`;

        try {
            const errorBody = await response.json();
            const apiMessage = errorBody?.error?.message;
            const apiStatus = errorBody?.error?.status;

            if (apiMessage) {
                errorMessage = apiMessage;
            }

            if (apiStatus) {
                errorCode = apiStatus;
            }
        } catch (error) {}

        const requestError = new Error(errorMessage);
        requestError.code = errorCode;
        requestError.status = response.status;

        throw requestError;
    }

    const data = await response.json();
    const answer = extractTextFromResponse(data);

    if (!answer) {
        const error = new Error("empty_response");
        error.code = "empty_response";
        throw error;
    }

    return answer;
}

module.exports = {
    askGemini,
    askGeminiWithHistory,
    DEFAULT_MODEL
};
