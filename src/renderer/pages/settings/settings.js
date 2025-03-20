import alert from "../../components/AlertUI";
const settingsService = window.services.settings;
const chatService = window.services.chat;
const cancelBtn = document.getElementById("cancelSettingsBtn");
const saveBtn = document.getElementById("saveSettingsBtn");
const clientConnectBtn = document.getElementById("clientConnectBtn");

const providerSelect = document.getElementById("providerSelect");
const apiKeyInput = document.getElementById("apiKeyInput");
const connectionSuccess = document.getElementById("connectionSuccess");
const connectionError = document.getElementById("connectionError");
const connectionLoading = document.getElementById("connectionLoading");

let tempConfig;

document.addEventListener("DOMContentLoaded", async () => {
    tempConfig = await initialConfig();
    alert.init();
    updateClientConnectBtnState();
});

window.addEventListener("beforeunload", () => {
    // clean up tempConfig
    tempConfig = null;
});

cancelBtn.addEventListener("click", () => {
    window.close();
});

saveBtn.addEventListener("click", async () => {
    await settingsService.save(tempConfig);
});

clientConnectBtn.addEventListener("click", async () => {
    const provider = providerSelect.value;
    const apiKey = apiKeyInput.value;

    connectionSuccess.classList.add("hidden");
    connectionError.classList.add("hidden");
    connectionLoading.classList.remove("hidden");

    const connectResult = await chatService.testConnection(provider, apiKey);

    console.log(`AI Client connection resutl: ${connectResult}`);
    if (connectResult) {
        connectionSuccess.classList.remove("hidden");
        connectionError.classList.add("hidden");
        connectionLoading.classList.add("hidden");
    } else {
        connectionSuccess.classList.add("hidden");
        connectionError.classList.remove("hidden");
        connectionLoading.classList.add("hidden");
    }
});

providerSelect.addEventListener("change", async (event) => {
    updateClientConnectBtnState();
    tempConfig.defaultProvider = event.target.value;
    apiKeyInput.value = tempConfig[`${event.target.value}ApiKey`];
});

apiKeyInput.addEventListener("input", (event) => {
    updateClientConnectBtnState();
    tempConfig.defaultProvider = providerSelect.value;
    tempConfig[`${providerSelect.value}ApiKey`] = apiKeyInput.value;
});

// ===== Functions =====

async function initialConfig() {
    // load and render provider from store as default
    const provider = await settingsService.loadDefaultProvider();
    providerSelect.value = provider;

    // load and render api key based on provider
    apiKeyInput.value = await settingsService.loadApiKeyByProvider(provider);

    // initial temp config
    // It should always map to the configSchema.js
    return {
        defaultProvider: provider,
        openaiApiKey: await settingsService.loadApiKeyByProvider("openai"),
        openrouterApiKey:
            await settingsService.loadApiKeyByProvider("openrouter"),
        deepseekApiKey: await settingsService.loadApiKeyByProvider("deepseek"),
        anthropicApiKey:
            await settingsService.loadApiKeyByProvider("anthropic"),
    };
}

function updateClientConnectBtnState() {
    const selectedProvider = providerSelect.value;
    const apiKey = apiKeyInput.value;
    // reset connection status
    connectionLoading.classList.remove("hidden");
    connectionSuccess.classList.add("hidden");
    connectionError.classList.add("hidden");

    if (selectedProvider && apiKey) {
        clientConnectBtn.disabled = false;
    } else {
        clientConnectBtn.disabled = true;
    }
}
