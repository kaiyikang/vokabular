const { OpenAI } = require("openai");
const { Anthropic } = require("@anthropic-ai/sdk");
const dotenv = require("dotenv");
dotenv.config();

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

async function callDeepseekAPI(promptContent) {
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

module.exports = {
    callAnthropicAPI,
    callDeepseekAPI,
};