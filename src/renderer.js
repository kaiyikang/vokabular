
console.log('Hello from renderer process!')
const inputSentence = document.getElementById('inputSentence');
const outputExplanation = document.getElementById('outputExplanation');
const selectedWordDisplay = document.getElementById('selectedWordDisplay');

inputSentence.addEventListener('input', (event) => {
    const sentence = event.target.value;
    const singleLineText = sentence.replace(/[\r\n]+/g, ' ');
    outputExplanation.value = singleLineText;
});

inputSentence.addEventListener('dblclick', (event) => {
    const selectedText = window.getSelection().toString();

    if(selectedText.trim() !== '') {
        console.log(event.target.value)
        const selectedWord = selectedText.trim();
        selectedWordDisplay.value = selectedWord;
    }
});

outputExplanation.setAttribute('readonly', true);