import { createChatApi, PROVIDERS } from "../api/chatApi.js";

export function createChatService(config) {
    const api = createChatApi(config);
    const nativeLanguage = config.get("nativeLanguage");
    const targetLanguage = config.get("targetLanguage");
    const promptTemplate = config.get("promptTemplate"); // TODO
    return {
        async generateWordExplanation(sourceText = "", focusWord = "") {
            const promptTemplate = `You are a language analysis tool. Extract the complete linguistic unit containing the specified word from the text.

            Original text:
            {{ORIGINAL_TEXT}}

            Target word:
            {{SELECTED_WORD}}

            Requirements:
            1. For verbs, always provide the base form (infinitive) even if conjugated in the text
            2. Include all related elements (prepositions, particles, etc.) that form the complete expression
            3. Provide an extremely concise explanation in {{NATIVE_LANGUAGE}} - maximum 10-20 words
            4. Focus only on core meaning without any elaboration or examples
            5. Use simple, direct language as if defining a term in a pocket dictionary

            Please answer in this format:
            <extracted_combination>
            [The complete linguistic unit in base form]
            </extracted_combination>

            <explanation>
            [Ultra-brief definition in {{NATIVE_LANGUAGE}}]
            </explanation>`;
            const filledPrompt = promptTemplate
                .replace("{{ORIGINAL_TEXT}}", sourceText)
                .replace("{{SELECTED_WORD}}", focusWord)
                .replace(/{{NATIVE_LANGUAGE}}/g, nativeLanguage)
                .replace(/{{TARGET_LANGUAGE}}/g, targetLanguage);

            const promptContent = [
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
            return PROVIDERS;
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
