

const inputSentence = document.getElementById('inputSentence');
const outputExplanation = document.getElementById('outputExplanation');
const selectedWordDisplay = document.getElementById('selectedWordDisplay');
const statusBar = document.getElementById('statusBar');

// 锁定界面元素
function lockUI() {
    inputSentence.disabled = true;
    outputExplanation.disabled = true;
    selectedWordDisplay.disabled = true;
    inputSentence.style.backgroundColor = '#f0f0f0';
    outputExplanation.style.backgroundColor = '#f0f0f0';
    selectedWordDisplay.style.backgroundColor = '#f0f0f0';
    statusBar.textContent = 'Generating...';

}

// 解锁界面元素
function unlockUI() {
    inputSentence.disabled = false;
    outputExplanation.disabled = false;
    selectedWordDisplay.disabled = false;
    inputSentence.style.backgroundColor = '#ffffff';
    outputExplanation.style.backgroundColor = '#ffffff';
    selectedWordDisplay.style.backgroundColor = '#ffffff';
    statusBar.textContent = 'Ready';

}


inputSentence.addEventListener('input', (event) => {
    const sentence = event.target.value;
    const singleLineText = sentence.replace(/[\r\n]+/g, ' ');
    outputExplanation.value = singleLineText;

});

inputSentence.addEventListener('dblclick', async (event) => {
    const selectedText = window.getSelection().toString();
    if(selectedText.trim() !== '') {
        const selectedWord = selectedText.trim();
        selectedWordDisplay.value = selectedWord;
        
        try {
            lockUI();
            const response = await window.api.generateChatResponse(selectedWord);
            outputExplanation.value = response;
        } catch (error) {
            outputExplanation.value = `Error: ${error.message}`;
        } finally {
            unlockUI();
        }
    }
});

outputExplanation.setAttribute('readonly', true);