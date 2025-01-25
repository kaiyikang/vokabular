// API: https://foosoft.net/projects/anki-connect/index.html

const ANKI_CONNECT_URL = "http://localhost:8765";

// 调用 Anki Connect API
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

const AnkiApi = {
    // Deck
    getDeckNames: () => invokeAnki("deckNames"),
    // Model
    getModelNames: () => invokeAnki("modelNames"),
    getModelTemplatesByName: (modelName) =>
        invokeAnki("modelTemplates", { modelName: modelName }),
    // Card
    getCardsByDeckName: (deckName) =>
        invokeAnki("findCards", { query: `deck:${deckName}` }),
    getCardsInfo: (cards) => invokeAnki("cardsInfo", { cards: cards }),
    // Note
    getNotesInfo: (notes) => invokeAnki("notesInfo", { notes: notes }),
};

module.exports = {
    AnkiApi,
};

// 测试代码
(async () => {
    // const health = await ankiHealthCheck();
    // const cardIds = await AnkiClient.getCardsByDeckName("Deutsch");
    // const models = await AnkiClient.getModelNames();
    // console.log(models);
    // AnkiClient.getModelTemplatesByName(models[3]).then((templates) => {
    //     console.log(templates);
    // });
    // AnkiClient.getNotesInfo(cardIds).then((cards) => {
    //     cards.map((card) => {
    //         console.log(card.fields);
    //     });
    // });
})();
