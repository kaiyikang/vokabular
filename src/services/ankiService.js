// API: https://foosoft.net/projects/anki-connect/index.html

import { createAnkiApi } from "../api/ankiApi.js";

const ANKI_DEFAULT_MODEL = {
    // modelName: "vokabular-model",
    modelName: "vocabsieve-notes",
    inOrderFields: [
        "Sentence",
        "Word",
        "Definition",
        "Definition#2",
        "Image",
        "Pronunciation",
    ],
    css: "default css",
    isCloze: false,
    cardTemplates: [
        {
            Name: "Card 1",
            Front: '<div class="widget front"><div class="title">What does this word mean here?</div><div class="box targetLang"><div class="question">{{Sentence}}</div></div>{{#Word}}<div class="box targetLang"><div class="question"><b>{{Word}}</b></div></div>{{/Word}}</div>',
            Back: '{{FrontSide}}<hr id=answer><div class="widget back">{{#Definition}}<div class="box nativeLang answer">{{Definition}}</div>{{/Definition}}{{#Definition#2}}<div class="box nativeLang answer">{{Definition#2}}</div>{{/Definition#2}}{{#Image}}<div class="image">{{Image}}</div>{{/Image}}{{#Pronunciation}}<div class="box targetLang">{{Pronunciation}}</div>{{/Pronunciation}}',
        },
    ],
};

export function createAnkiService(config) {
    const api = createAnkiApi(config);
    const ANKI_DEFAULT_DECK = config.get("ankiDockerName");

    async function checkHealth() {
        return await api.ankiHealthCheck();
    }

    async function addNoteToAnki(fields) {
        // 检查note是否符合条件
        for (const [key, value] of Object.entries(fields)) {
            if (value === null || value === undefined) {
                throw new Error(
                    `Field "${key}" has a null or undefined value.`,
                );
            }
        }

        // 确保deck存在
        const deckNames = await api.getDeckNames();
        if (!deckNames.includes(ANKI_DEFAULT_DECK)) {
            await ankiApi.createDeck(ANKI_DEFAULT_DECK);
            console.log("Deck created");
        }

        // 确保model存在
        const models = await api.getModelNames();
        if (!models.includes(ANKI_DEFAULT_MODEL.modelName)) {
            await ankiApi.createModel(ANKI_DEFAULT_MODEL);
            console.log("Model created");
        }

        // 5. 保存note
        await api.addNote(
            ANKI_DEFAULT_DECK,
            ANKI_DEFAULT_MODEL.modelName,
            fields,
        );

        console.log("Note added");
    }

    return {
        checkHealth,
        addNoteToAnki,
    };
}
