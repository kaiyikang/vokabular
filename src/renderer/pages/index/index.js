const DEBUG = false;
const inputSentence = document.getElementById("inputSentence");
const outputExplanation = document.getElementById("outputExplanation");
const selectedWordDisplay = document.getElementById("selectedWordDisplay");
const saveToAnkiBtn = document.getElementById("saveToAnkiBtn");
const clearInputBtn = document.getElementById("clearInputBtn");
const clipboardToggle = document.getElementById("clipboardToggle");

// ===== Init =====

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("settingBtn").addEventListener("click", () => {
        window.electronAPI.openSettings();
    });

    setInterval(updateAnkiButtonState, 10000);
    updateAnkiButtonState();
});

// ===== Clear Button =====

clearInputBtn.addEventListener("click", () => {
    inputSentence.value = "";
    selectedWordDisplay.value = "";
    outputExplanation.value = "";
    inputSentence.focus();
    updateAnkiButtonState();
    sendToStatusBar("All fields are cleared!");
    setupClipboardMonitoring();
});

// ===== Input Sentence =====

inputSentence.addEventListener("input", async (event) => {
    const text = event.target.value;
    const singleLineText = text.replace(/\s+/g, " ");
    inputSentence.value = singleLineText;
});

inputSentence.addEventListener("dblclick", async (event) => {
    // Stop the interval since the user will select word
    stopClipboardMonitoring();

    const trimmedText = window.getSelection().toString().trim();

    if (trimmedText === "" || /^[\s\p{P}]+$/u.test(trimmedText)) {
        return;
    }

    const selectedWord = trimmedText;
    const inputPhrase = event.target.value.trim();
    try {
        lockUI();
        const response = DEBUG
            ? "TEST"
            : await window.services.chat.generateWordExplanation(
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
                ?.trim() || "Error: Cannot find <extracted_combination>";
        outputExplanation.value =
            response
                .match(/<explanation>([\s\S]*?)<\/explanation>/)?.[1]
                ?.trim() || "Error: Cannot find <explanation>";
    } catch (error) {
        sendToStatusBar(`Error: ${error.message}`);
    } finally {
        unlockUI();
    }
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

// ===== Send To Anki Button =====

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
        validateAnkiFieldsBeforeSend(ankiFields);

        DEBUG ? null : window.services.anki.addNoteToAnki(ankiFields);
        sendToStatusBar(`Added Note: ${selectedWordDisplay.value}`);
    } catch (error) {
        sendToStatusBar(`Error: ${error.message}`);
    }
    setupClipboardMonitoring();
});

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

// ===== Clipboard Monitoring =====

let clipboardInterval = null;

clipboardToggle.addEventListener("change", async function () {
    setupClipboardMonitoring();
});

async function setupClipboardMonitoring() {
    if (clipboardToggle.checked && clipboardInterval === null) {
        startClipboardMonitoring();
    } else if (!clipboardToggle.checked && clipboardInterval) {
        stopClipboardMonitoring();
    }
}

async function startClipboardMonitoring() {
    clipboardInterval = setInterval(async () => {
        const text = await window.electronAPI.getClipboardText();
        if (text && inputSentence.text !== text) {
            inputSentence.value = text.replace(/\s+/g, " ");
        }
    }, 1000);
}

async function stopClipboardMonitoring() {
    clearInterval(clipboardInterval);
    clipboardInterval = null;
}

// ===== Status Bar =====

function sendToStatusBar(content) {
    document.getElementById("statusBar").textContent = content;
}
