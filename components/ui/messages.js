export function createNoProductsMessage(
  message = "Ürün bulunamadı",
  showClearButton = true
) {
  return `
      <div class="no-products">
        <i class="fas fa-search"></i>
        <h4>Ürün Bulunamadı</h4>
        <p>${message}</p>
        ${
          showClearButton
            ? `
          <button id="clear-filters-btn" class="btn btn-outline-primary">
            Tüm Filtreleri Temizle
          </button>
        `
            : ""
        }
      </div>
    `;
}

export function createErrorMessage(
  message = "Bir hata oluştu",
  buttonText = "Tekrar Dene",
  buttonId = "retry-button"
) {
  return `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <h4>Hata</h4>
        <p>${message}</p>
        <button id="${buttonId}" class="btn btn-outline-primary">
          ${buttonText}
        </button>
      </div>
    `;
}

export function createToastMessage(
  title = "Bildirim",
  message,
  type = "success"
) {
  const toastId = "toast-" + Date.now();

  let icon, bgClass;
  switch (type) {
    case "success":
      icon = "fas fa-check-circle";
      bgClass = "bg-success";
      break;
    case "error":
      icon = "fas fa-exclamation-circle";
      bgClass = "bg-danger";
      break;
    case "warning":
      icon = "fas fa-exclamation-triangle";
      bgClass = "bg-warning";
      break;
    case "info":
    default:
      icon = "fas fa-info-circle";
      bgClass = "bg-info";
  }

  return `
      <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header ${bgClass} text-white">
          <i class="${icon} me-2"></i>
          <strong class="me-auto">${title}</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Kapat"></button>
        </div>
        <div class="toast-body">
          ${message}
        </div>
      </div>
    `;
}

export function showToast(title, message, type = "success", delay = 3000) {
  let toastContainer = document.querySelector(".toast-container");

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className =
      "toast-container position-fixed bottom-0 end-0 p-3";
    document.body.appendChild(toastContainer);
  }

  const toastHtml = createToastMessage(title, message, type);
  toastContainer.insertAdjacentHTML("beforeend", toastHtml);

  const toastId = toastHtml.match(/id="([^"]+)"/)[1];

  const toastElement = document.getElementById(toastId);
  if (toastElement) {
    const toast = new bootstrap.Toast(toastElement, { delay });
    toast.show();

    toastElement.addEventListener("hidden.bs.toast", () => {
      toastElement.remove();

      if (toastContainer.children.length === 0) {
        toastContainer.remove();
      }
    });
  }
}

export function createModal(title, content, options = {}) {
  const modalId = "modal-" + Date.now();
  const modalSize = options.size || "";
  const closeButton = options.closeButton !== false;
  const confirmButton = options.confirmButton || null;
  const cancelButton = options.cancelButton || null;

  const modalHtml = `
      <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}-label" aria-hidden="true">
        <div class="modal-dialog ${modalSize} modal-dialog-centered">
          <div class="modal-content modal-custom">
            <div class="modal-header">
              <h5 class="modal-title" id="${modalId}-label">${title}</h5>
              ${
                closeButton
                  ? '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Kapat"></button>'
                  : ""
              }
            </div>
            <div class="modal-body">
              ${content}
            </div>
            ${
              confirmButton || cancelButton
                ? `
              <div class="modal-footer">
                ${
                  cancelButton
                    ? `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${cancelButton}</button>`
                    : ""
                }
                ${
                  confirmButton
                    ? `<button type="button" class="btn btn-primary" id="${modalId}-confirm">${confirmButton}</button>`
                    : ""
                }
              </div>
            `
                : ""
            }
          </div>
        </div>
      </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const modalElement = document.getElementById(modalId);
  const modal = new bootstrap.Modal(modalElement, options);

  if (confirmButton) {
    const confirmBtn = document.getElementById(`${modalId}-confirm`);
    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        if (options.onConfirm) {
          options.onConfirm();
        }
        modal.hide();
      });
    }
  }

  modalElement.addEventListener("hidden.bs.modal", () => {
    if (options.onClose) {
      options.onClose();
    }

    if (options.removeOnClose !== false) {
      setTimeout(() => {
        modalElement.remove();
      }, 300);
    }
  });

  return {
    show: () => modal.show(),
    hide: () => modal.hide(),
    isVisible: () => modalElement.classList.contains("show"),
    getElement: () => modalElement,
  };
}
