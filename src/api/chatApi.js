const { OpenAI } = require("openai");
const { Anthropic } = require("@anthropic-ai/sdk");
const dotenv = require("dotenv");

dotenv.config();

export function createChatApi(config = {}) {
    console.log(config.store);
    const apiConfig = {
        openrouter: {
            baseURL:
                process.env.OPENROUTER_BASE_URL ??
                config.get("openrouterBaseUrl"),
            apiKey:
                process.env.OPENROUTER_API_KEY ??
                config.get("openrouterApiKey"),
            model:
                process.env.OPENROUTER_MODEL ?? config.get("openrouterModel"),
        },
        deepseek: {
            baseURL:
                process.env.DEEPSEEK_BASE_URL ?? config.get("deepseekBaseUrl"),
            apiKey:
                process.env.DEEPSEEK_API_KEY ?? config.get("deepseekApiKey"),
        },
        antropic: {
            apiKey:
                process.env.ANTHROPIC_API_KEY ?? config.get("anthropicApiKey"),
        },
        models: {
            anthropic:
                config.get("anthropicModel") || "claude-3-5-haiku-20241022",
            deepseek: config.get("deepseekModel") || "deepseek-chat",
            openrouter:
                config.get("openrouterModel") || "google/gemini-2.0-flash-001",
        },
    };
    console.log(apiConfig);

    const clients = {
        openRouter:
            apiConfig.openrouter.baseURL &&
            apiConfig.openrouter.apiKey &&
            apiConfig.openrouter.model
                ? new OpenAI({
                      baseURL: process.env.OPENROUTER_BASE_URL,
                      apiKey: process.env.OPENROUTER_API_KEY,
                      dangerouslyAllowBrowser: true,
                  })
                : null,
        deepseek:
            apiConfig.deepseek.baseURL && apiConfig.deepseek.apiKey
                ? new OpenAI({
                      baseURL: process.env.DEEPSEEK_BASE_URL,
                      apiKey: process.env.DEEPSEEK_API_KEY,
                      dangerouslyAllowBrowser: true,
                  })
                : null,
        anthropic: apiConfig.antropic.apiKey
            ? new Anthropic({
                  apiKey: apiConfig.anthropic.apiKey,
                  dangerouslyAllowBrowser: true,
              })
            : null,
    };

    console.log(clients);
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
                model: apiConfig.models.deepseek,
            });
            return completion.choices[0].message.content;
        } catch (error) {
            console.error("DeepSeek API call failed: ", error);
            throw error;
        }
    }

    async function callOpenRouterAPI(promptContent, model = null) {
        try {
            const completion = await clients.openRouter.chat.completions.create(
                {
                    messages: [
                        {
                            role: "user",
                            content: promptContent,
                        },
                    ],
                    model: model || apiConfig.models.openrouter,
                },
            );
            return completion.choices[0].message.content;
        } catch (error) {
            console.error("Openrouter");
        }
    }

    return {
        callAnthropicAPI,
        callDeepSeekAPI,
        callOpenRouterAPI,
    };
}
