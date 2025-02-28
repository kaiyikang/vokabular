import Store from "electron-store";

const configSchema = {
    openaiApiKey: {
        type: "string",
        default: "",
    },
    anthropicApiKey: {
        type: "string",
        default: "",
    },
    openrouterApiKey: {
        type: "string",
        default: "",
    },
    openrouterBaseUrl: {
        type: "string",
        format: "uri",
        default: "https://openrouter.ai/api/v1",
    },
    openrouterModel: {
        type: "string",
        default: "google/gemini-2.0-flash-001",
    },
    deepseekApiKey: {
        type: "string",
        default: "",
    },
    deepseekBaseUrl: {
        type: "string",
        format: "uri",
        default: "https://api.deepseek.com",
    },
    anthropicModel: {
        type: "string",
        default: "claude-3-5-haiku-20241022",
    },
    deepseekModel: {
        type: "string",
        default: "deepseek-chat",
    },
    ankiDockerName: {
        type: "string",
        default: "Deutsch",
    },
    ankiModelName: {
        type: "string",
        default: "vocabsieve-notes",
    },
    nativeLanguage: {
        type: "string",
        default: "English",
    },
    targetLanguage: {
        type: "string",
        default: "German",
    },
};

const config = new Store({
    schema: configSchema,
});

export default config;
