const inputSentence = document.getElementById("inputSentence");
const outputExplanation = document.getElementById("outputExplanation");
const selectedWordDisplay = document.getElementById("selectedWordDisplay");
const saveToAnkiBtn = document.getElementById("saveToAnkiBtn");
const clearInputBtn = document.getElementById("clearInputBtn");
const clipboardToggle = document.getElementById("clipboardToggle");

let clipboardInterval = null;

function sendToStatusBar(content) {
    document.getElementById("statusBar").textContent = content;
}

// When DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("settingBtn").addEventListener("click", () => {
        window.electronAPI.openSettings();
    });
    // Anki Health Check
    updateAnkiButtonState();
    setInterval(updateAnkiButtonState, 10000);
});

function lockUI() {
    inputSentence.disabled = true;
    outputExplanation.disabled = true;
    selectedWordDisplay.disabled = true;
    saveToAnkiBtn.disabled = true;
    inputSentence.style.backgroundColor = "#f0f0f0";
    outputExplanation.style.backgroundColor = "#f0f0f0";
    selectedWordDisplay.style.backgroundColor = "#f0f0f0";
    clearInputBtn.style.backgroundColor = "#f0f0f0";
    sendToStatusBar("AI Generating...");
}

function unlockUI() {
    inputSentence.disabled = false;
    outputExplanation.disabled = false;
    selectedWordDisplay.disabled = false;
    saveToAnkiBtn.disabled = false;
    inputSentence.style.backgroundColor = "#ffffff";
    outputExplanation.style.backgroundColor = "#ffffff";
    selectedWordDisplay.style.backgroundColor = "#ffffff";
    clearInputBtn.style.backgroundColor = "#ffffff";
}

clearInputBtn.addEventListener("click", () => {
    inputSentence.value = "";
    selectedWordDisplay.value = "";
    outputExplanation.value = "";
    inputSentence.focus();
    updateAnkiButtonState();
    sendToStatusBar("All fields are cleared!");
});

inputSentence.addEventListener("input", async (event) => {
    const text = event.target.value;
    const singleLineText = text.replace(/\s+/g, " ");
    inputSentence.value = singleLineText;
});

inputSentence.addEventListener("dblclick", async (event) => {
    // Stop the interval since the user will select word
    if (clipboardInterval !== null) {
        clearInterval(clipboardInterval);
    }

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
            sendToStatusBar(`Error: ${error.message}`);
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
        const isAnkiHealthy = await window.services.anki.checkAnkiHealth();
        if (!isAnkiHealthy) {
            throw new Error("Anki is not running or not accessible.");
        }
        const ankiFields = {
            Sentence: inputSentence.value,
            Word: selectedWordDisplay.value,
            Definition: outputExplanation.value,
        };
        // validateAnkiFieldsBeforeSend(ankiFields);

        // window.services.anki.addNoteToAnki(ankiFields);
        sendToStatusBar(`Added Note: ${selectedWordDisplay.value}`);
    } catch (error) {
        sendToStatusBar(`Error: ${error.message}`);
    }
    // restart clipboard
    updateClipboardInterval();
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
        // sendToStatusBar(`Error: ${error.message}`);
    }
}

clipboardToggle.addEventListener("change", async function () {
    console.log("Toggle of clipboard: " + clipboardToggle.checked);
    updateClipboardInterval();
});

async function updateClipboardInterval() {
    const readFromClipboard = async () => {
        const text = await window.electronAPI.getClipboardText();
        if (text && inputSentence.text !== text) {
            inputSentence.value = text.replace(/\s+/g, " ");
        }
    };
    if (clipboardToggle.checked) {
        clipboardInterval = setInterval(readFromClipboard, 1000);
        readFromClipboard();
    } else {
        if (clipboardInterval) {
            clearInterval(clipboardInterval);
            clipboardInterval = null;
        }
    }
}
