const ANKI_CONNECT_URL = "http://localhost:8765";

async function invokeAnki(action, params={}) {
    try{
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
        if(result.error) {
            throw new Error(result.error);
        }

        return result.result;
    } catch(error) {
        console.error('Anki connect error:', error);
    }
}

const AnkiClient = {
    getDeckNames: () => invokeAnki("deckNames"),
};

module.exports = {
    AnkiClient,
};