// API: https://foosoft.net/projects/anki-connect/index.html
const { createDeck, getIfDeckExists, getDeckNames } = require("../api/ankiApi");
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

async function addNoteToAnki() {
    // 1. 输入想要添加的note，参考
    // 2. 检查note是否符合条件
    // 3. 确保deck存在
    // 4. 保存note
}

module.exports = {
    addNoteToAnki,
};
