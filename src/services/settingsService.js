export function createSettingService(config) {
    const SUPPORTED_PROVIDERS = [
        "openai",
        "openrouter",
        "deepseek",
        "anthropic",
    ];

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
            const providerLowCase = provider.toLowerCase();
            if (SUPPORTED_PROVIDERS.includes(providerLowCase)) {
                return config.get(`${providerLowCase}ApiKey`);
            }
            return "";
        },
        loadDefaultModelByProvider(provider) {
            const providerLowCase = provider.toLowerCase();
            if (SUPPORTED_PROVIDERS.includes(providerLowCase)) {
                return config.get(`${providerLowCase}DefaultModel`);
            }
            return "";
        },
    };
}
