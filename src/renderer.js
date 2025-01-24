const inputSentence = document.getElementById("inputSentence");
const outputExplanation = document.getElementById("outputExplanation");
const selectedWordDisplay = document.getElementById("selectedWordDisplay");
const statusBar = document.getElementById("statusBar");
const saveToAnkiBtn = document.getElementById("saveToAnkiBtn");

// Setting 监听输入框的输入事件
document.addEventListener('DOMContentLoaded', () => {
    const settingBtn = document.getElementById('settingBtn');
    if (settingBtn) {
        settingBtn.addEventListener('click', () => {
            window.electronAPI.openSettings();
        });
    } else {
        console.error('Setting button not found');
    }
});

// 锁定界面元素
function lockUI() {
    inputSentence.disabled = true;
    outputExplanation.disabled = true;
    selectedWordDisplay.disabled = true;
    saveToAnkiBtn.disabled = true;
    inputSentence.style.backgroundColor = "#f0f0f0";
    outputExplanation.style.backgroundColor = "#f0f0f0";
    selectedWordDisplay.style.backgroundColor = "#f0f0f0";
    statusBar.textContent = "Generating...";
}

// 解锁界面元素
function unlockUI() {
    inputSentence.disabled = false;
    outputExplanation.disabled = false;
    selectedWordDisplay.disabled = false;
    saveToAnkiBtn.disabled = false;
    inputSentence.style.backgroundColor = "#ffffff";
    outputExplanation.style.backgroundColor = "#ffffff";
    selectedWordDisplay.style.backgroundColor = "#ffffff";
    statusBar.textContent = "Done";
}

inputSentence.addEventListener("input", (event) => {
    const sentence = event.target.value;
    const singleLineText = sentence.replace(/[\r\n]+/g, " ");
    outputExplanation.value = singleLineText;
});

inputSentence.addEventListener("dblclick", async (event) => {
    // 获取选中的文本
    const trimmedText = window.getSelection().toString().trim();
    // 如果选中的文本不为空且不是标点符号
    if (trimmedText !== "" && !/^[\s\p{P}]+$/u.test(trimmedText)) {
        const selectedWord = trimmedText;
        const inputPhrase = event.target.value.trim();


        try {
            lockUI();
            const response = await window.services.chat.generateWordExplanation(
                inputPhrase,
                selectedWord
            );
            selectedWordDisplay.value = response.match(/<extracted_combination>([\s\S]*?)<\/extracted_combination>/)?.[1]?.trim() || selectedWord;
            outputExplanation.value = response.match(/<explanation>([\s\S]*?)<\/explanation>/)?.[1]?.trim() || response;;
        } catch (error) {
            outputExplanation.value = `Error: ${error.message}`;
        } finally {
            unlockUI();
        }
    }
});

saveToAnkiBtn.addEventListener('click', async (event) => {
    const info = await window.services.anki.getDeckNames();
    console.log(info);
});

// testing
// window.services.anki.getDeckNames().then((deckNames) => {
//     console.log(deckNames);
// });