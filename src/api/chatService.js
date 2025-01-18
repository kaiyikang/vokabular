const { OpenAI } = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({
    baseURL: process.env.BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

async function generateChatResponse(queriedPhrase="", queriedWord="") {
    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "You are a german assistant." },
            { role: "user", content: `You are tasked with providing a brief Chinese explanation for a specific German word within a given sentence. Follow these steps:

1. You will be given a German sentence:
<german_sentence>
${queriedPhrase}
</german_sentence>

2. The word to be explained is:
<target_word>
${queriedWord}
</target_word>

3. Your task is to:
   a) Understand the context of the sentence
   b) Determine the meaning of the target word in this specific context
   c) Provide a concise Chinese explanation of the word's meaning

4. Important rules:
   - Provide only a brief explanation in Chinese
   - Focus solely on the meaning of the word in the given context
   - Omit any unnecessary information or elaboration

5. Format your response as follows:
   <explanation>
   [Your concise Chinese explanation here]
   </explanation>

Remember to keep your explanation short and to the point, addressing only the meaning of the target word in the context of the given sentence.` }
        ],
        model: "deepseek-chat"
    });

    return completion.choices[0].message.content;
}

module.exports = {
    generateChatResponse
}