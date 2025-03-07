const cancelBtn = document.getElementById("cancelSettingsBtn");
const saveBtn = document.getElementById("saveSettingsBtn");

cancelBtn.addEventListener("click", () => {
    window.close();
});

saveBtn.addEventListener("click", () => {
    const selectedProvider = document.getElementById("providerSelect").value;
    const apiKey = document.getElementById("apiKeyInput").value;
    window.services.settings.save({ selectedProvider, apiKey });
});
