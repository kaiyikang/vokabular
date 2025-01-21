// API: https://foosoft.net/projects/anki-connect/index.html

const ANKI_CONNECT_URL = "http://localhost:8765";
const ANKI_DEFAULT_DECK = "TEST_DEFAULT";
const ANKI_DEFAULT_MODEL = {
    modelName: "vokabular-model",
    inOrderFields: [
        "Sentence",
        "Word",
        "Definition",
        "Definition#2",
        "Image",
        "Pronunciation",
        "Tags",
    ],
    css: "default css",
    isCloze: false,
    cardTemplates: [
        {
            Name: "Card 1",
            Front: '<div class="widget front"><div class="title">What does this word mean here?</div><div class="box targetLang"><div class="question">{{Sentence}}</div></div>{{#Word}}<div class="box targetLang"><div class="question"><b>{{Word}}</b></div></div>{{/Word}}</div>',
            Back: '{{FrontSide}}<hr id=answer><div class="widget back">{{#Definition}}<div class="box nativeLang answer">{{Definition}}</div>{{/Definition}}{{#Definition#2}}<div class="box nativeLang answer">{{Definition#2}}</div>{{/Definition#2}}{{#Image}}<div class="image">{{Image}}</div>{{/Image}}{{#Pronunciation}}<div class="box targetLang">{{Pronunciation}}</div>{{/Pronunciation}}{{#Tags}}<div class="tags">{{Tags}}</div>{{/Tags}}</div>',
        },
    ],
};

async function invokeAnki(action, params = {}) {
    try {
        const response = await fetch(ANKI_CONNECT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action,
                version: 6,
                params,
            }),
        });

        const result = await response.json();
        if (result.error) {
            throw new Error(result.error);
        }
        return result.result;
    } catch (error) {
        console.error("Anki connect error:", error);
    }
}

const AnkiClient = {
    getDeckNames: () => invokeAnki("deckNames"),
    getModelNames: () => invokeAnki("modelNames"),
    getModelTemplatesByName: (modelName) =>
        invokeAnki("modelTemplates", { modelName: modelName }),
    getCardsByDeckName: (deckName) =>
        invokeAnki("findCards", { query: `deck:${deckName}` }),
    getCardsInfo: (cards) => invokeAnki("cardsInfo", { cards: cards }),
    getNotesInfo: (notes) => invokeAnki("notesInfo", { notes: notes }),
};

// 测试代码
(async () => {
    const cardIds = await AnkiClient.getCardsByDeckName("Deutsch");
    const models = await AnkiClient.getModelNames();
    console.log(models);
    AnkiClient.getModelTemplatesByName(models[3]).then((templates) => {
        console.log(templates);
    });
    // AnkiClient.getNotesInfo(cardIds).then((cards) => {
    //     cards.map((card) => {
    //         console.log(card.fields);
    //     });
    // });
})();

module.exports = {
    AnkiClient,
};
