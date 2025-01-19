const { OpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();

const deepseekClient = new OpenAI({
    baseURL: process.env.DEEPSEEK_BASE_URL,
    apiKey: process.env.DEEPSEEK_API_KEY,
    dangerouslyAllowBrowser: true,
});

module.exports = deepseekClient;
