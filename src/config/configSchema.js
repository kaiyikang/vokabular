import Store from "electron-store";

const configSchema = {
    // ===== language learning =====
    nativeLanguage: {
        type: "string",
        default: "English",
    },
    targetLanguage: {
        type: "string",
        default: "German",
    },
    // ===== ai =====
    defaultProvider: {
        type: "string",
        default: "anthropic",
    },
    // Openai
    openaiApiKey: {
        type: "string",
        default: "",
    },
    openaiDefaultModel: {
        type: "string",
        default: "gpt-4o-mini",
    },
    // Anthropic
    anthropicApiKey: {
        type: "string",
        default: "",
    },
    anthropicDefaultModel: {
        type: "string",
        default: "claude-3-5-haiku-latest",
    },
    // openRouter
    openrouterApiKey: {
        type: "string",
        default: "",
    },
    openrouterBaseUrl: {
        type: "string",
        format: "uri",
        default: "https://openrouter.ai/api/v1",
    },
    openrouterDefaultModel: {
        type: "string",
        default: "google/gemini-2.0-flash-001",
    },
    // deepseek
    deepseekApiKey: {
        type: "string",
        default: "",
    },
    deepseekBaseUrl: {
        type: "string",
        format: "uri",
        default: "https://api.deepseek.com",
    },
    deepseekDefaultModel: {
        type: "string",
        default: "deepseek-chat",
    },
    // ===== anki ======
    ankiDockerName: {
        type: "string",
        default: "Deutsch",
    },
    ankiModelName: {
        type: "string",
        default: "vocabsieve-notes",
    },
};

const config = new Store({
    schema: configSchema,
});

export default config;
