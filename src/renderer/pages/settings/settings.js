import alertUI from "../../components/AlertUI";
const cancelBtn = document.getElementById("cancelSettingsBtn");
const saveBtn = document.getElementById("saveSettingsBtn");
const clientConnectBtn = document.getElementById("clientConnectBtn");

document.addEventListener("DOMContentLoaded", () => {
    alert.init();
});

cancelBtn.addEventListener("click", () => {
    window.close();
});

saveBtn.addEventListener("click", () => {
    const selectedProvider = document.getElementById("providerSelect").value;
    const apiKey = document.getElementById("apiKeyInput").value;
    window.services.settings.save({ selectedProvider, apiKey });
});

clientConnectBtn.addEventListener("click", async () => {
    const selectedProvider = document.getElementById("providerSelect").value;
    const apiKey = document.getElementById("apiKeyInput").value;
    // TODO: validate provider and key
    // provider and api key check
    const connectResult = await window.services.chat.testConnection(
        selectedProvider,
        apiKey,
    );
});
