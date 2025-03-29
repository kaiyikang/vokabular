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
    function getClient(provider, apiKey) {
        if (!provider || !apiKey) {
            console.error("Provider and API key are required.");
            throw new Error("Provider and API key are required.");
        }
        const baseClientOptions = {
            apiKey: apiKey,
            dangerouslyAllowBrowser: true,
        };
        let client;
        try {
            switch (provider) {
                case "openai":
                    client = new OpenAI(baseClientOptions);
                    break;
                case "openrouter":
                    client = new OpenAI({
                        ...baseClientOptions,
                        baseURL: "https://openrouter.ai/api/v1",
                    });
                    break;
                case "deepseek":
                    client = new OpenAI({
                        ...baseClientOptions,
                        baseURL: "https://api.deepseek.com",
                    });
                    break;
                case "anthropic":
                    client = new Anthropic(baseClientOptions);
                    break;
                default:
                    const errorMessage = `Unsupported provider: ${provider}`;
                    console.error(errorMessage);
                    throw new Error(errorMessage);
            }
        } catch (error) {
            console.error(
                `Error creating client for provider ${provider}:`,
                error,
            );
            throw new Error(
                `Failed to create client for provider ${provider}: ${error.message}`,
            );
        }
        return client;
    }

    async function chat(promptContent, provider, apiKey, model) {
        if (!model) {
            console.error("Model is required.");
            throw new Error("Model is required.");
        }

        const client = getClient(provider, apiKey);

        try {
            const completion = await client.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: promptContent,
                    },
                ],
                model: model,
            });
            return completion.choices[0].message.content;
        } catch (error) {
            console.error(
                `Chat API call failed for provider ${provider}:`,
                error,
            );
            throw new Error(
                `Chat API call failed for provider ${provider}: ${error.message}`,
            );
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
        try {
            const result = await requestProviderAPI(provider, apiKey, false);
            // TODO: Uncomment the following lines when the client is available
            // const client = getClient(provider, apiKey);
            // const result = await client.models.list();

            if (Array.isArray(result.data)) {
                return result.data.map((item) => item.id);
            } else if (result.data && Array.isArray(result.data.data)) {
                return result.data.data.map((item) => item.id);
            }
        } catch (error) {
            console.error(
                `Error fetching models for provider ${provider}:`,
                error,
            );
            throw new Error(
                `Failed to fetch models for provider ${provider}: ${error.message}`,
            );
        }
    }

    return {
        chat,
        listModelsByProvider,
        testConnectionByProvider,
    };
}
