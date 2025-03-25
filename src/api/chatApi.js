import { OpenAI } from "openai";
import { Anthropic } from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import axios from "axios";
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

// TODO: API should not know configuration
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
            apiKey:
                process.env.openrouterApiKey ?? config.get("openrouterApiKey"),
            model:
                config.get("openrouterDefaultModel") ||
                "google/gemini-2.0-flash-001",
        },
        deepseek: {
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
        openrouter: apiConfig.openrouter.apiKey
            ? new OpenAI({
                  baseURL: "https://openrouter.ai/api/v1",
                  apiKey: apiConfig.openrouter.apiKey,
                  dangerouslyAllowBrowser: true,
              })
            : null,
        deepseek: apiConfig.deepseek.apiKey
            ? new OpenAI({
                  baseURL: "https://api.deepseek.com",
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

    // TODO: Should not use config
    async function chat(promptContent, options = {}) {
        const provider = options.provider || apiConfig.defaultProvider;
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

    /**
     * 向AI提供商发送API请求的基础函数
     * @param {string} provider - AI提供商名称
     * @param {string} apiKey - API密钥
     * @param {boolean} isTest - 是否为连接测试（影响某些提供商的端点选择）
     * @returns {Promise<Object>} - 请求结果
     */
    async function requestProviderAPI(provider, apiKey, isTest = false) {
        try {
            // 验证输入
            if (!provider || !apiKey) {
                return {
                    success: false,
                    message: "Provider and API key are required",
                };
            }

            let endpoint;
            let headers = {
                "Content-Type": "application/json",
            };

            // 根据不同提供商设置不同的请求参数
            switch (provider.toLowerCase()) {
                case "openai":
                    endpoint = "https://api.openai.com/v1/models";
                    headers["Authorization"] = `Bearer ${apiKey}`;
                    break;

                case "openrouter":
                    // 测试连接时使用不同的端点
                    endpoint = isTest
                        ? "https://openrouter.ai/api/v1/key"
                        : "https://openrouter.ai/api/v1/models";
                    headers["Authorization"] = `Bearer ${apiKey}`;
                    break;

                case "deepseek":
                    endpoint = "https://api.deepseek.com/v1/models";
                    headers["Authorization"] = `Bearer ${apiKey}`;
                    break;

                case "anthropic":
                    endpoint = "https://api.anthropic.com/v1/models";
                    headers["x-api-key"] = apiKey;
                    headers["anthropic-version"] = "2023-06-01";
                    break;

                default:
                    return {
                        success: false,
                        message: `Unsupported provider: ${provider}`,
                    };
            }

            const response = await axios({
                method: "GET",
                url: endpoint,
                headers: headers,
                timeout: 10000, // 10秒
            });

            return {
                success: response.status >= 200 && response.status < 300,
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            console.error(
                `API request error for ${provider}:`,
                error.code || error.message,
            );
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async function testConnectionByProvider(provider, apiKey) {
        const result = await requestProviderAPI(provider, apiKey, true);
        return {
            success: result.success,
            message: result.message,
        };
    }

    async function listModelsByProvider(provider, apiKey) {
        const result = await requestProviderAPI(provider, apiKey, false);

        if (!result.success) {
            return [];
        }

        if (Array.isArray(result.data)) {
            return result.data.map((item) => item.id);
        } else if (result.data && Array.isArray(result.data.data)) {
            return result.data.data.map((item) => item.id);
        }

        return [];
    }

    return {
        chat,
        listModelsByProvider,
        testConnectionByProvider,
    };
}
