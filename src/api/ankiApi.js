// API: https://foosoft.net/projects/anki-connect/index.html

const ANKI_CONNECT_URL = "http://localhost:8765";

// 通用请求函数
async function sendAnkiRequest(action, params = {}) {
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
        console.error("Anki Connect request error:", error);
        throw error; // 抛出错误以便上层处理
    }
}

// 健康检查：确保 Anki Connect 已正确连接
async function ankiHealthCheck() {
    try {
        const result = await sendAnkiRequest("version");
        return true;
    } catch (error) {
        console.error("Anki Connect health check failed:", error);
        return false;
    }
}

// 调用 Anki Connect API
async function invokeAnki(action, params = {}) {
    try {
        await ankiHealthCheck();
        return await sendAnkiRequest(action, params);
    } catch (error) {
        console.error("Anki Connect request error:", error);
        throw error;
    }
}

// Deck 相关函数
async function getDeckNames() {
    return invokeAnki("deckNames");
}

async function createDeck(deckName) {
    return invokeAnki("createDeck", { deck: deckName });
}

async function getIfDeckExists(deckName) {
    const deckNames = await getDeckNames();
    return deckNames.includes(deckName);
}

// Model 相关函数
async function getModelNames() {
    return invokeAnki("modelNames");
}

async function getModelTemplatesByName(modelName) {
    return invokeAnki("modelTemplates", { modelName });
}

// Card 相关函数
async function getCardsByDeckName(deckName) {
    return invokeAnki("findCards", { query: `deck:${deckName}` });
}

async function getCardsInfo(cards) {
    return invokeAnki("cardsInfo", { cards });
}

// Note 相关函数
async function getNotesInfo(notes) {
    return invokeAnki("notesInfo", { notes });
}

// 确保 Deck 存在
// async function ensureDeckExists(deckName) {
//     try {
//         const deckNames = await getDeckNames();
//         if (!deckNames.includes(deckName)) {
//             await createDeck(deckName);
//             console.log(`Deck "${deckName}" created.`);
//         } else {
//             console.log(`Deck "${deckName}" already exists.`);
//         }
//     } catch (error) {
//         console.error("Error ensuring deck exists:", error.message);
//         throw error; // 抛出错误以便上层处理
//     }
// }

// 导出 AnkiApi 对象
const AnkiApi = {
    createDeck,
    getIfDeckExists,
    getDeckNames,
    getModelNames,
    getModelTemplatesByName,
    getCardsByDeckName,
    getCardsInfo,
    getNotesInfo,
    // ensureDeckExists,
};

module.exports = {
    AnkiApi,
};

// 测试代码
(async () => {
    try {
        const deckName = "testDeck";
        await AnkiApi.ensureDeckExists(deckName);
    } catch (error) {
        console.error("Error:", error.message);
    }
})();
