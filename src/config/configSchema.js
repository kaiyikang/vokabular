import Store from "electron-store";

export const configSchema = {
    // ===== Language Learning =====
    nativeLanguage: {
        type: "string",
        default: "English",
    },
    targetLanguage: {
        type: "string",
        default: "German",
    },

    // ===== AI Client =====
    defaultProvider: {
        type: "string",
        default: "openai",
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
    openrouterDefaultModel: {
        type: "string",
        default: "google/gemini-2.0-flash-001",
    },
    // deepseek
    deepseekApiKey: {
        type: "string",
        default: "",
    },
    deepseekDefaultModel: {
        type: "string",
        default: "deepseek-chat",
    },

    // ====== Prompt ======
    promptTemplate: {
        type: "string",
        default: "",
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
    additionalProperties: false, // 禁止额外属性
};

const config = new Store({
    schema: configSchema,
    clearInvalidConfig: true, // 清除无效配置
});

export default config;
