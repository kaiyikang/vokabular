import Store from "electron-store";

const configSchema = {
    OPENAI_API_KEY: {
        type: "string",
        default: "",
    },
    ANTHROPIC_API_KEY: {
        type: "string",
        default: "",
    },
    OPENROUTER_API_KEY: {
        type: "string",
        default: "",
    },
    OPENROUTER_BASE_URL: {
        type: "string",
        format: "uri",
        default: "https://openrouter.ai/api/v1",
    },
    OPENROUTER_MODEL: {
        type: "string",
        default: "google/gemini-2.0-flash-001",
    },
    DEEPSEEK_API_KEY: {
        type: "string",
        default: "",
    },
    DEEPSEEK_BASE_URL: {
        type: "string",
        format: "uri",
        default: "https://api.deepseek.com",
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
