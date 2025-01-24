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


async function generateWordExplanation(phrase = "", word = "", targetLang = 'English') {

    const promptContent = [
        {
            type: "text",
            text: "<examples>\n<example>\n<ORIGINAL_TEXT>\nDann hat sich mein Kollege hingesetzt und hat das umgesetzt.\n</ORIGINAL_TEXT>\n<SELECTED_WORD>\nhingesetzt\n</SELECTED_WORD>\n<TARGET_LANGUAGE>\nEnglish\n</TARGET_LANGUAGE>\n<ideal_output>\n<extracted_combination>\nsich hinsetzen\n</extracted_combination>\n\n<explanation>\nto sit down, to settle down to do something\n</explanation>\n</ideal_output>\n</example>\n</examples>\n\n",
        },
        {
            type: "text",
            text: 'You are a linguistic analysis tool designed to extract complete linguistic units from text. Your task is to extract the full linguistic unit containing a specified word.\n\nHere is the original text:\n\n<original_text>\n{{ORIGINAL_TEXT}}\n</original_text>\n\nThe word you need to focus on is:\n\n<selected_word>\n{{SELECTED_WORD}}\n</selected_word>\n\nRule:\n1. Analyze the context around the <selected_word>, looking for:\n   - Associated prepositions (e.g., "look at", "depend on")\n   - Reflexive pronouns (e.g., "sich" in German verbs like "sich freuen")\n   - Separated particles or prefixes\n   - Words forming idiomatic expressions or fixed phrases with the <selected_word>\n2. If the <selected_word> is part of a larger word (e.g., compound word or inflected form), include the full word.\n3. If it\'s a verb it should be in its original form.\n4. Provide an explanation of the extracted linguistic unit in {{TARGET_LANGUAGE}}.\n5. The explanation should:\n- Define the meaning of the linguistic unit.\n- Highlight any cultural or contextual significance if applicable.\n- Avoid unnecessary elaboration.\n\noutput structure:\n<extracted_combination>\n[The complete extracted linguistic unit]\n</extracted_combination>\n\n<explanation>\n[Explanation of the extracted linguistic unit in {{TARGET_LANGUAGE}}]\n</explanation>\n\nRemember to return only the result without additional explanation or commentary outside of the specified tags. Ensure the explanation is concise, accurate, and tailored to the {{TARGET_LANGUAGE}} audience.'
                .replace('{{ORIGINAL_TEXT}}', phrase)
                .replace('{{SELECTED_WORD}}', word)
                .replace('{{TARGET_LANGUAGE}}', targetLang),
        },
    ];

    const msg = await anthropicClient.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 4096,
      temperature: 0,
      messages: [
        {
          "role": "user",
          "content": promptContent
        }
      ] 
    });
    return msg.content[0].text;

    // Deepseek method
    // const completion = await deepseekClient.chat.completions.create({
    //     messages: [
    //         {
    //             role: "user",
    //             content: promptContent,
    //         },
    //     ],
    //     model: "deepseek-chat",
    // });

    // return completion.choices[0].message.content;
}

module.exports = {
    generateWordExplanation,
};
