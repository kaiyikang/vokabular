// default with hidden
const alertTemplate = `
<div id="alert-container" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 hidden">
  <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden transform transition-all">
    <div class="flex items-center px-6 py-4 border-b border-stone-200">
      <div id="alert-icon" class="flex-shrink-0 mr-4">
        <!-- 图标将根据警告类型动态插入 -->
      </div>
      <h3 id="alert-title" class="text-lg font-medium text-stone-900">提示</h3>
    </div>
    <div class="px-6 py-4">
      <p id="alert-message" class="text-stone-700"></p>
    </div>
    <div class="px-6 py-3 bg-stone-50 flex justify-end">
      <button id="alert-close-btn" class="px-4 py-2 bg-stone-600 text-white rounded-md hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 transition-colors">
        确定
      </button>
    </div>
  </div>
</div>
`;

function createAlertUI() {
    let initialized = false;
    let cleanUpFunction = null;

    function createAlertContainer() {
        // check if it exists
        if (document.getElementById("alert-container")) return;

        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = alertTemplate;
        document.body.appendChild(tempContainer.firstElementChild);
        registerEventHandlers();
    }

    /**
     * handle event
     */
    function registerEventHandlers() {
        const alertContainer = document.getElementById("alert-container");
        const alertCloseBtn = document.getElementById("alert-close-btn");

        // close button
        alertCloseBtn.addEventListener("click", () => {
            hideAlert();
        });

        // close when click the background
        alertContainer.addEventListener("click", (e) => {
            if (e.target === alertContainer) {
                hideAlert();
            }
        });
    }

    function hideAlert() {
        const alertContainer = document.getElementById("alert-container");
        alertContainer.classList.add("hidden");
    }

    function showAlertInternal({
        type = "error",
        title = "Error",
        message = "One Error Happens",
    }) {
        const alertContainer = document.getElementById("alert-container");
        const alertTitle = document.getElementById("alert-title");
        const alertMessage = document.getElementById("alert-message");
        const alertIcon = document.getElementById("alert-icon");

        alertTitle.textContent = title;
        alertMessage.textContent = message;

        alertIcon.innerHTML = getIconForType(type);

        alertContainer.classList.remove("hidden");
    }

    function getIconForType(type) {
        switch (type) {
            case "error":
                return `<svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>`;
            case "warning":
                return `<svg class="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>`;
            case "info":
                return `<svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>`;
            default:
                return "";
        }
    }

    return {
        init() {
            if (initialized) return;
            createAlertContainer();
            initialized = true;
        },

        showAlert(options) {
            if (!initialized) {
                this.init();
            }
            showAlertInternal(options);
        },
    };
}

const alertUI = createAlertUI();
export default alertUI;
