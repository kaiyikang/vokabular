const { OpenAI } = require('openai');

const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({
    baseURL: process.env.BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
});

async function generateChatResponse() {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a german assistant." }],
        model: "deepseek-chat",
    });

    return completion.choices[0].message.content;
}

module.exports = {
    generateChatResponse
}