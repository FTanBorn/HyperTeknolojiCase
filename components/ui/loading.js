export function createLoading(message = "Yükleniyor...") {
  return `
      <div class="loading-container">
        <div class="spinner-container mb-3">
          <div class="spinner"></div>
        </div>
        <p class="text-muted">${message}</p>
      </div>
    `;
}

export function toggleLoading(container, isLoading, message = "Yükleniyor...") {
  if (!container) return;

  if (isLoading) {
    container.innerHTML = createLoading(message);
    container.classList.remove("d-none");
  } else {
    container.innerHTML = "";
    container.classList.add("d-none");
  }
}

export function toggleGlobalLoading(show, message = "Yükleniyor...") {
  let loadingOverlay = document.getElementById("global-loading-overlay");

  if (!show) {
    if (loadingOverlay) {
      loadingOverlay.style.opacity = "0";

      setTimeout(() => {
        loadingOverlay.remove();
      }, 300);
    }
    return null;
  }

  if (!loadingOverlay) {
    loadingOverlay = document.createElement("div");
    loadingOverlay.id = "global-loading-overlay";
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s;
      `;

    loadingOverlay.innerHTML = `
        <div class="loading-container" style="background-color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); padding: 2rem;">
          <div class="spinner-container mb-3">
            <div class="spinner"></div>
          </div>
          <p class="text-muted">${message}</p>
        </div>
      `;

    document.body.appendChild(loadingOverlay);

    loadingOverlay.offsetWidth;
    loadingOverlay.style.opacity = "1";
  } else {
    const messageEl = loadingOverlay.querySelector("p");
    if (messageEl) {
      messageEl.textContent = message;
    }
  }

  return loadingOverlay;
}
