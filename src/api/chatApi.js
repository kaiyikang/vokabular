const { OpenAI } = require("openai");
const { Anthropic } = require("@anthropic-ai/sdk");
const dotenv = require("dotenv");

dotenv.config();

function validateClient(client, name) {
    if (!client) {
        throw new Error(`${name} API client is not configured!`);
    }

    if (!client.chat || !client.chat.completions) {
        throw new Error(
            `${name} API client is not properly initialized. Check your API key.`,
        );
    }

    return true;
}

export function createChatApi(config = {}) {
    const apiConfig = {
        // Default provider
        defaultProvider:
            process.env.defaultProvider ??
            config.get("defaultProvider") ??
            "openai",
        // List of providers
        openai: {
            apiKey: process.env.openaiApiKey ?? config.get("openaiApiKey"),
            model: config.get("openaiDefaultModel") || "gpt-4o-mini",
        },
        openrouter: {
            baseURL:
                process.env.openrouterBaseUrl ??
                config.get("openrouterBaseUrl"),
            apiKey:
                process.env.openrouterApiKey ?? config.get("openrouterApiKey"),
            model:
                config.get("openrouterDefaultModel") ||
                "google/gemini-2.0-flash-001",
        },
        deepseek: {
            baseURL:
                process.env.deepseekBaseUrl ?? config.get("deepseekBaseUrl"),
            apiKey: process.env.deepseekApiKey ?? config.get("deepseekApiKey"),
            model: config.get("deepseekDefaultModel") || "deepseek-chat",
        },
        anthropic: {
            apiKey:
                process.env.anthropicApiKey ?? config.get("anthropicApiKey"),
            model:
                config.get("anthropicDefaultModel") ||
                "claude-3-5-haiku-20241022",
        },
    };

    const clients = {
        openai: apiConfig.openai.apiKey
            ? new OpenAI({
                  apiKey: apiConfig.openai.apiKey,
              })
            : null,
        openrouter:
            apiConfig.openrouter.baseURL && apiConfig.openrouter.apiKey
                ? new OpenAI({
                      baseURL: apiConfig.openrouter.baseURL,
                      apiKey: apiConfig.openrouter.apiKey,
                      dangerouslyAllowBrowser: true,
                  })
                : null,
        deepseek:
            apiConfig.deepseek.baseURL && apiConfig.deepseek.apiKey
                ? new OpenAI({
                      baseURL: apiConfig.deepseek.baseURL,
                      apiKey: apiConfig.deepseek.apiKey,
                      dangerouslyAllowBrowser: true,
                  })
                : null,
        anthropic: apiConfig.anthropic.apiKey
            ? new Anthropic({
                  apiKey: apiConfig.anthropic.apiKey,
                  dangerouslyAllowBrowser: true,
              })
            : null,
    };

    if (!clients[apiConfig.defaultProvider]) {
        // 尝试找到第一个可用的提供商
        const availableProvider = Object.keys(clients).find(
            (key) => clients[key],
        );
        if (availableProvider) {
            console.warn(
                `Default provider '${apiConfig.defaultProvider}' not configured. Using '${availableProvider}' instead.`,
            );
            apiConfig.defaultProvider = availableProvider;
        } else {
            throw new Error("No API providers are properly configured!");
        }
    }

    async function callOpenaiAPI(promptContent) {
        if (!clients.openai) {
            throw new Error("Openai API client is not configured!");
        }
        try {
            const completion = await clients.openai.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: promptContent,
                    },
                ],
                model: apiConfig.openai.model,
            });
            return completion.choices[0].message.content;
        } catch (error) {
            console.error("Openai API call failed: ", error);
            throw error;
        }
    }

    async function callAnthropicAPI(promptContent) {
        if (!clients.anthropic) {
            throw new Error("Anthropic API client is not configured");
        }
        try {
            const msg = await clients.anthropic.messages.create({
                model: apiConfig.models.anthropic,
                max_tokens: 4096,
                temperature: 0,
                messages: [
                    {
                        role: "user",
                        content: promptContent,
                    },
                ],
            });
            return msg.content[0].text;
        } catch (error) {
            console.error("Anthropic API call failed: ", error);
            throw error;
        }
    }

    async function callDeepSeekAPI(promptContent) {
        if (!clients.deepseek) {
            throw new Error("DeepSeek API client is not configured!");
        }
        try {
            const completion = await clients.deepseek.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: promptContent,
                    },
                ],
                model: apiConfig.deepseek.model,
            });
            return completion.choices[0].message.content;
        } catch (error) {
            console.error("DeepSeek API call failed: ", error);
            throw error;
        }
    }

    async function callOpenRouterAPI(promptContent) {
        if (!clients.openrouter) {
            throw new Error("Openrouter client is not configured!");
        }
        try {
            const completion = await clients.openrouter.chat.completions.create(
                {
                    messages: [
                        {
                            role: "user",
                            content: promptContent,
                        },
                    ],
                    model: apiConfig.openrouter.model,
                },
            );
            return completion.choices[0].message.content;
        } catch (error) {
            console.error("Openrouter API call failed: ", error);
            throw error;
        }
    }

    // Unified Chat API
    async function chat(promptContent, options = {}) {
        const provider = options.provider || apiConfig.defaultProvider;
        console.log(provider);
        switch (provider) {
            case "openai":
                return callOpenaiAPI(promptContent, options);
            case "anthropic":
                return callAnthropicAPI(promptContent, options);
            case "deepseek":
                return callDeepSeekAPI(promptContent, options);
            case "openrouter":
                return callOpenRouterAPI(promptContent, options);
            default:
                throw new Error(`Unknown provider: ${provider}`);
        }
    }

    return {
        chat,
        callAnthropicAPI,
        callDeepSeekAPI,
        callOpenRouterAPI,
        callOpenaiAPI,
    };
}
