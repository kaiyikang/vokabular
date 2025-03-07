const cancelBtn = document.getElementById("cancelSettingsBtn");
const saveBtn = document.getElementById("saveSettingsBtn");

cancelBtn.addEventListener("click", () => {
    window.close();
});

saveBtn.addEventListener("click", () => {
    window.services.settings.save("ok saved!");
});
