const inputSentence = document.getElementById("inputSentence");
const outputExplanation = document.getElementById("outputExplanation");
const selectedWordDisplay = document.getElementById("selectedWordDisplay");
const statusBar = document.getElementById("statusBar");
const saveToAnkiBtn = document.getElementById("saveToAnkiBtn");
const clearInputBtn = document.getElementById("clearInputBtn");

function updateStatusBarContent(content) {
    statusBar.textContent = content;
}

// Setting 监听输入框的输入事件
document.addEventListener("DOMContentLoaded", () => {
    const settingBtn = document.getElementById("settingBtn");
    if (settingBtn) {
        settingBtn.addEventListener("click", () => {
            window.electronAPI.openSettings();
        });
    } else {
        console.error("Setting button not found");
    }
});

// 页面加载的时候启动健康检查
document.addEventListener("DOMContentLoaded", () => {
    updateAnkiButtonState();
    setInterval(updateAnkiButtonState, 10000);
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
    updateStatusBarContent("AI Generating...");
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
}

clearInputBtn.addEventListener("click", () => {
    inputSentence.value = "";
    selectedWordDisplay.value = "";
    outputExplanation.value = "";
    inputSentence.focus();
    updateAnkiButtonState();
    updateStatusBarContent("All fields are cleared!");
});

inputSentence.addEventListener("input", (event) => {
    const sentence = event.target.value;
    const singleLineText = sentence.replace(/\s+/g, " ");
    inputSentence.value = singleLineText;
});

inputSentence.addEventListener("dblclick", async (event) => {
    const trimmedText = window.getSelection().toString().trim();
    if (trimmedText !== "" && !/^[\s\p{P}]+$/u.test(trimmedText)) {
        const selectedWord = trimmedText;
        const inputPhrase = event.target.value.trim();
        try {
            lockUI();
            const response = await window.services.chat.generateWordExplanation(
                inputPhrase,
                selectedWord,
            );
            inputSentence.value = inputPhrase
                .replace(/<[^>]*>/g, "")
                .replace(new RegExp(`(${selectedWord})`, "gi"), "<b>$1</b>");
            selectedWordDisplay.value =
                response
                    .match(
                        /<extracted_combination>([\s\S]*?)<\/extracted_combination>/,
                    )?.[1]
                    ?.trim() || selectedWord;
            outputExplanation.value =
                response
                    .match(/<explanation>([\s\S]*?)<\/explanation>/)?.[1]
                    ?.trim() || response;
        } catch (error) {
            updateStatusBarContent(`Error: ${error.message}`);
        } finally {
            unlockUI();
        }
    }
});

// Anki related functions
function validateAnkiFieldsBeforeSend(fields) {
    if (!fields.Sentence?.trim()) {
        throw new Error("Example Sentence is required");
    }
    if (!fields.Word?.trim()) {
        throw new Error("Selected Word is required");
    }
    if (!fields.Definition?.trim()) {
        throw new Error("Definition is required");
    }
    return true;
}

saveToAnkiBtn.addEventListener("click", async (event) => {
    try {
        const isHealthy = await window.services.anki.checkAnkiHealth();
        if (!isHealthy) {
            throw new Error("Anki is not running or not accessible.");
        }
        const ankiFields = {
            Sentence: inputSentence.value,
            Word: selectedWordDisplay.value,
            Definition: outputExplanation.value,
        };
        validateAnkiFieldsBeforeSend(ankiFields);

        window.services.anki.addNoteToAnki(ankiFields);
        updateStatusBarContent(`Added Note: ${selectedWordDisplay.value}`);
        await updateAnkiButtonState();
    } catch (error) {
        updateStatusBarContent(`Error: ${error.message}`);
        await updateAnkiButtonState();
    }
});

async function updateAnkiButtonState() {
    try {
        const isHealthy = await window.services.anki.checkAnkiHealth();
        saveToAnkiBtn.disabled = !isHealthy;
        saveToAnkiBtn.style.opacity = isHealthy ? "1" : "0.5";
        saveToAnkiBtn.title = isHealthy ? "" : "Please open Anki";
        saveToAnkiBtn.style.cursor = isHealthy ? "pointer" : "not-allowed";
    } catch (error) {
        saveToAnkiBtn.disabled = true;
        saveToAnkiBtn.style.opacity = "0.5";
        saveToAnkiBtn.style.cursor = "not-allowed";
        // updateStatusBarContent(`Error: ${error.message}`);
    }
}
