const { OpenAI } = require("openai");
const { Anthropic } = require("@anthropic-ai/sdk");
const dotenv = require("dotenv");

dotenv.config();

export function createChatApi(config) {
    const openRouterClient = new OpenAI({
        baseURL: process.env.OPENROUTER_BASE_URL,
        apiKey: process.env.OPENROUTER_API_KEY,
        dangerouslyAllowBrowser: true,
    });

    const deepseekClient = new OpenAI({
        baseURL: process.env.DEEPSEEK_BASE_URL,
        apiKey: process.env.DEEPSEEK_API_KEY,
        dangerouslyAllowBrowser: true,
    });

    const anthropicClient = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
        dangerouslyAllowBrowser: true,
    });

    async function callAnthropicAPI(promptContent) {
        const msg = await anthropicClient.messages.create({
            model: "claude-3-5-haiku-20241022",
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
    }

    async function callDeepSeekAPI(promptContent) {
        const completion = await deepseekClient.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: promptContent,
                },
            ],
            model: "deepseek-chat",
        });
        return completion.choices[0].message.content;
    }

    async function callOpenRouterAPI(
        promptContent,
        model = "google/gemini-2.0-flash-001",
    ) {
        const completion = await openRouterClient.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: promptContent,
                },
            ],
            model: model,
        });
        return completion.choices[0].message.content;
    }

    return {
        callAnthropicAPI,
        callDeepSeekAPI,
        callOpenRouterAPI,
    };
}
