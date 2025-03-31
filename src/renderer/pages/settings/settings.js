import alert from "../../components/AlertUI";
const settingsService = window.services.settings;
const chatService = window.services.chat;
const cancelBtn = document.getElementById("cancelSettingsBtn");
const saveBtn = document.getElementById("saveSettingsBtn");
const clientConnectBtn = document.getElementById("clientConnectBtn");
const reloadModelsBtn = document.getElementById("reloadModels");

const providerSelect = document.getElementById("providerSelect");
const apiKeyInput = document.getElementById("apiKeyInput");
const connectionSuccess = document.getElementById("connectionSuccess");
const connectionError = document.getElementById("connectionError");
const connectionLoading = document.getElementById("connectionLoading");

const SUPPORTED_PROVIDERS = ["openai", "openrouter", "deepseek", "anthropic"];

let tempConfig;

// ====== Setup =====

document.addEventListener("DOMContentLoaded", async () => {
    tempConfig = await initialConfig();
    alert.init();
});

window.addEventListener("beforeunload", () => {
    // clean up tempConfig
    tempConfig = null;
});

// ===== Cancel Button =====

cancelBtn.addEventListener("click", () => {
    window.close();
});

// ===== Save Button =====

saveBtn.addEventListener("click", async () => {
    await settingsService.save(tempConfig);
    window.close();
});

// ===== ClientConnect Button =====

clientConnectBtn.addEventListener("click", async () => {
    const provider = providerSelect.value;
    const apiKey = apiKeyInput.value;

    connectionSuccess.classList.add("hidden");
    connectionError.classList.add("hidden");
    connectionLoading.classList.remove("hidden");

    const connectResult = await chatService.testConnection(provider, apiKey);

    console.log(`AI Client connection result: ${connectResult}`);
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
    tempConfig.defaultProvider = event.target.value.toLowerCase();
    apiKeyInput.value = tempConfig[`${event.target.value.toLowerCase()}ApiKey`];
    const defaultModel = await settingsService.loadDefaultModelByProvider(
        event.target.value,
    );
    modelSelect.innerHTML = `<option value="${defaultModel}" disabled selected>${defaultModel}</option>`;
});

apiKeyInput.addEventListener("input", (event) => {
    tempConfig.defaultProvider = providerSelect.value.toLowerCase();
    tempConfig[`${providerSelect.value.toLowerCase()}ApiKey`] =
        apiKeyInput.value;
});

// Click list models
reloadModelsBtn.addEventListener("click", async (event) => {
    const errorMessage =
        '<option value="" disabled selected>Failed to load models, please check API key</option>';

    if (apiKeyInput.value === "") {
        modelSelect.innerHTML = errorMessage;
    }

    const models = await window.services.chat.getModelsByProvider(
        providerSelect.value,
        apiKeyInput.value,
    );

    if (Array.isArray(models) && models.length !== 0) {
        const sortedModels = [...models].sort().reverse();
        updateModelOptions(sortedModels);
    } else {
        modelSelect.innerHTML = errorMessage;
    }
});

modelSelect.addEventListener("change", () => {
    tempConfig[`${providerSelect.value.toLowerCase()}DefaultModel`] =
        modelSelect.value;
});

// ===== Functions =====

function updateModelOptions(models) {
    const defaultSelectedModel =
        tempConfig[`${providerSelect.value.toLowerCase()}DefaultModel`];

    // Clear existing options
    modelSelect.innerHTML = "";

    // Handle no models available
    if (!models || models.length === 0) {
        const noModelsOption = document.createElement("option");
        noModelsOption.disabled = true;
        noModelsOption.textContent = "No models available";
        modelSelect.appendChild(noModelsOption);
        return;
    }

    const selectedModel = models.includes(defaultSelectedModel)
        ? defaultSelectedModel
        : models[0];

    const options = models.map((modelId) => {
        const option = document.createElement("option");
        option.value = modelId;
        option.textContent = modelId;
        option.selected = modelId === selectedModel; // Set selected attribute
        return option;
    });

    // Append options to the select element
    modelSelect.append(...options);
}

async function initialConfig() {
    // load and render provider from store as default
    // provider from setting config should be lowercase
    const provider = await settingsService.loadDefaultProvider();
    providerSelect.value = provider;

    // load and render api key based on provider
    apiKeyInput.value = await settingsService.loadApiKeyByProvider(provider);

    // load selected model
    const defaultModel =
        await settingsService.loadDefaultModelByProvider(provider);
    modelSelect.innerHTML = `<option value="${defaultModel}" disabled selected>${defaultModel}</option>`;

    // initial temp config
    // It should always map to the configSchema.js
    return {
        defaultProvider: provider,

        openaiApiKey: await settingsService.loadApiKeyByProvider("openai"),
        openaiDefaultModel:
            await settingsService.loadDefaultModelByProvider("openai"),

        openrouterApiKey:
            await settingsService.loadApiKeyByProvider("openrouter"),
        openrouterDefaultModel:
            await settingsService.loadDefaultModelByProvider("openrouter"),

        deepseekApiKey: await settingsService.loadApiKeyByProvider("deepseek"),
        deepseekDefaultModel:
            await settingsService.loadDefaultModelByProvider("deepseek"),

        anthropicApiKey:
            await settingsService.loadApiKeyByProvider("anthropic"),
        anthropicDefaultModel:
            await settingsService.loadDefaultModelByProvider("anthropic"),
    };
}
