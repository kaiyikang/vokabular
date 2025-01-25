// API: https://foosoft.net/projects/anki-connect/index.html

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



module.exports = {

}