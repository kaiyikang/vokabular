import { createChatApi } from "../api/chatApi.js";

export function createChatService(config) {
    const api = createChatApi(config);
    const nativeLanguage = config.get("nativeLanguage");
    const targetLanguage = config.get("targetLanguage");
    const promptTemplate = config.get("promptTemplate");

    return {
        async generateWordExplanation(sourceText = "", focusWord = "") {
            const examples =
                "<examples>\n<example>\n<ORIGINAL_TEXT>\nDann hat sich mein Kollege hingesetzt und hat das umgesetzt.\n</ORIGINAL_TEXT>\n<SELECTED_WORD>\nhingesetzt\n</SELECTED_WORD>\n<NATIVE_LANGUAGE>\nEnglish\n</NATIVE_LANGUAGE>\n<ideal_output>\n<extracted_combination>\nsich hinsetzen\n</extracted_combination>\n\n<explanation>\nto sit down, to settle down to do something\n</explanation>\n</ideal_output>\n</example>\n</examples>\n\n";

            const promptTemplate =
                'You are a linguistic analysis tool designed to extract complete linguistic units from text. Your task is to extract the full linguistic unit containing a specified word.\n\nHere is the original text:\n\n<original_text>\n{{ORIGINAL_TEXT}}\n</original_text>\n\nThe word you need to focus on is:\n\n<selected_word>\n{{SELECTED_WORD}}\n</selected_word>\n\nRule:\n1. Analyze the context around the <selected_word>, looking for:\n   - Associated prepositions (e.g., "look at", "depend on")\n   - Reflexive pronouns (e.g., "sich" in German verbs like "sich freuen")\n   - Separated particles or prefixes\n   - Words forming idiomatic expressions or fixed phrases with the <selected_word>\n2. If the <selected_word> is part of a larger word (e.g., compound word or inflected form), include the full word.\n3. If it\'s a verb it should be in its original form.\n4. Provide an explanation of the extracted linguistic unit in {{NATIVE_LANGUAGE}}.\n5. The explanation should:\n- Define the meaning of the linguistic unit.\n- Highlight any cultural or contextual significance if applicable.\n- Avoid unnecessary elaboration.\n\noutput structure:\n<extracted_combination>\n[The complete extracted linguistic unit]\n</extracted_combination>\n\n<explanation>\n[Explanation of the extracted linguistic unit in {{NATIVE_LANGUAGE}}]\n</explanation>\n\nRemember to return only the result without additional explanation or commentary outside of the specified tags.';

            const filledPrompt = promptTemplate
                .replace("{{ORIGINAL_TEXT}}", sourceText)
                .replace("{{SELECTED_WORD}}", focusWord)
                .replace(/{{NATIVE_LANGUAGE}}/g, nativeLanguage)
                .replace(/{{TARGET_LANGUAGE}}/g, targetLanguage);

            const promptContent = [
                {
                    type: "text",
                    text: examples,
                },
                {
                    type: "text",
                    text: filledPrompt,
                },
            ];
            const provider = config.get("defaultProvider");
            const apiKey = config.get(`${provider}ApiKey`);
            const model = config.get(`${provider}DefaultModel`);

            const answer = await api.chat(
                promptContent,
                provider,
                apiKey,
                model,
            );
            return answer;
        },
        getProviders() {
            return ["openai", "openrouter", "deepseek", "anthropic"];
        },
        async testConnection(provider, apiKey) {
            const result = await api.testConnectionByProvider(provider, apiKey);
            return result.success;
        },
        async getModelsByProvider(provider, apiKey) {
            try {
                const models = await api.listModelsByProvider(provider, apiKey);
                return models;
            } catch (error) {
                console.error("Error fetching models:", error);
                throw new Error("Failed to fetch models.");
            }
        },
    };
}
