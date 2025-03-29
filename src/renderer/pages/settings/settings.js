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

const SUPPORTED_PROVIDERS = ["openai", "openrouter", "deepseek", "anthropic"];

let tempConfig;

document.addEventListener("DOMContentLoaded", async () => {
    tempConfig = await initialConfig();
    alert.init();
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
    window.close();
});

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
    tempConfig.defaultProvider = event.target.value;
    apiKeyInput.value = tempConfig[`${event.target.value}ApiKey`];
    const defaultModel = await settingsService.loadDefaultModelByProvider(
        event.target.value,
    );
    modelSelect.innerHTML = `<option value="${defaultModel}" disabled selected>${defaultModel}</option>`;
});

apiKeyInput.addEventListener("input", (event) => {
    tempConfig.defaultProvider = providerSelect.value;
    tempConfig[`${providerSelect.value}ApiKey`] = apiKeyInput.value;
});

// Click list models
modelSelect.addEventListener("click", async (event) => {
    try {
        const models = await window.services.chat.getModelsByProvider(
            providerSelect.value,
            apiKeyInput.value,
        );

        if (Array.isArray(models) && models.length !== 0) {
            const sortedModels = [...models].sort().reverse();
            updateModelOptions(sortedModels);
        } else {
            modelSelect.innerHTML = `<option value="" disabled selected>Failed to load models</option>`;
        }
    } catch (error) {
        console.error("Error loading models:", error);
        modelSelect.innerHTML =
            '<option value="" disabled selected>Error loading models</option>';
    }
});

modelSelect.addEventListener("change", () => {
    tempConfig[`${providerSelect.value}Default`] = modelSelect.value;
});

// ===== Functions =====

function updateModelOptions(models) {
    // 清空现有选项
    modelSelect.innerHTML = "";

    // 没有模型时显示提示
    if (!models || models.length === 0) {
        const noModelsOption = document.createElement("option");
        noModelsOption.disabled = true;
        noModelsOption.textContent = "No models available";
        modelSelect.appendChild(noModelsOption);
        return;
    }

    // 添加每个模型作为选项
    models.forEach((modelId) => {
        const option = document.createElement("option");
        option.value = modelId;
        option.textContent = modelId;
        modelSelect.appendChild(option);
    });
}

async function initialConfig() {
    // load and render provider from store as default
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
