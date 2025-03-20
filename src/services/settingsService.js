export function createSettingService(config) {
    return {
        save(newConfig) {
            try {
                Object.entries(newConfig).forEach(([key, val]) =>
                    config.set(key, val),
                );
            } catch (error) {
                console.error("Configuration save failed.");
            }
            console.log("Configuration save success.");
        },
        loadDefaultProvider() {
            return config.get("defaultProvider");
        },
        loadApiKeyByProvider(provider) {
            switch (provider.toLowerCase()) {
                case "openai":
                    return config.get("openaiApiKey");
                case "openrouter":
                    return config.get("openrouterApiKey");
                case "deepseek":
                    return config.get("deepseekApiKey");
                case "anthropic":
                    return config.get("anthropicApiKey");
                default:
                    return "";
            }
        },
    };
}
