import {
  formatPrice,
  getStockStatus,
  calculateDiscountRate,
  truncateText,
} from "../../utils/formatter.js";

export function createProductCard(product, viewType = "grid") {
  const {
    productID,
    productName = "İsimsiz Ürün",
    productSlug,
    marketPrice,
    salePrice,
    totalStock,
    productData = {},
  } = product;

  const imageUrl = productData.productMainImage || "assets/img/placeholder.svg";

  const description =
    productData.productDescription || productData.productInfo || "";

  const currentPrice = salePrice || marketPrice || 0;
  const formattedPrice = formatPrice(currentPrice);
  const formattedOldPrice =
    marketPrice && salePrice && marketPrice > salePrice
      ? formatPrice(marketPrice)
      : "";

  const discountRate = calculateDiscountRate(marketPrice, salePrice);

  const stockStatus = getStockStatus(totalStock);

  const productUrl = productSlug || `#product-${productID}`;

  let badgeText = "";
  let badgeClass = "";

  if (discountRate) {
    badgeText = `%${discountRate} İndirim`;
    badgeClass = "bg-danger";
  } else if (stockStatus.status !== "in") {
    badgeText = stockStatus.text;
    badgeClass = stockStatus.class;
  }

  const animationDelay = (productID % 5) * 0.1;
  const cardStyle = `animation-delay: ${animationDelay}s;`;

  if (viewType === "list") {
    return `
      <div class="product-card fade-in" style="${cardStyle}">
        <div class="product-image-container">
          <img src="${imageUrl}" class="product-image" alt="${productName}" loading="lazy">
          ${
            badgeText
              ? `<span class="product-badge ${badgeClass}">${badgeText}</span>`
              : ""
          }
        </div>
        <div class="product-card-body">
          <h5 class="product-name" title="${productName}">${productName}</h5>
          <p class="product-description">${description}</p>
          
          <div class="product-price-actions">
            <div class="product-price-container">
              <div class="d-flex align-items-center">
                <span class="product-price">${formattedPrice}</span>
                ${
                  formattedOldPrice
                    ? `<span class="product-old-price">${formattedOldPrice}</span>`
                    : ""
                }
              </div>
              <div class="product-stock mt-2">
                <small class="${
                  stockStatus.status === "out"
                    ? "text-danger"
                    : stockStatus.status === "low" ||
                      stockStatus.status === "critical"
                    ? "text-warning"
                    : "text-success"
                }">
                  <i class="fas ${
                    stockStatus.status === "out"
                      ? "fa-times-circle"
                      : stockStatus.status === "low" ||
                        stockStatus.status === "critical"
                      ? "fa-exclamation-circle"
                      : "fa-check-circle"
                  } me-1"></i>
                  ${stockStatus.text}
                </small>
              </div>
            </div>
            
            <div class="d-flex align-items-center">
              <div class="product-quick-actions">
                <button class="product-quick-btn" title="Favorilere Ekle" data-product-id="${productID}">
                  <i class="far fa-heart"></i>
                </button>
                <button class="product-quick-btn" title="Sepete Ekle" data-product-id="${productID}">
                  <i class="fas fa-shopping-cart"></i>
                </button>
              </div>
              <a href="${productUrl}" class="btn btn-primary product-detail-btn">
                <span>Detay</span>
                <i class="fas fa-arrow-right ms-2"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    return `
      <div class="product-card fade-in" style="${cardStyle}">
        <div class="product-image-container">
          <img src="${imageUrl}" class="product-image" alt="${productName}" loading="lazy">
          ${
            badgeText
              ? `<span class="product-badge ${badgeClass}">${badgeText}</span>`
              : ""
          }
        </div>
        <div class="product-card-body d-flex flex-column">
          <!-- Ürün bilgileri ve açıklama alanı - sabit yükseklikli olacak -->
          <div class="product-info-container" style="height: 120px; overflow: hidden;">
            <h5 class="product-name text-truncate-2" title="${productName}">${productName}</h5>
            <p class="product-description text-truncate-3">${truncateText(
              description,
              100
            )}</p>
          </div>
          
          <!-- Fiyat ve butonlar alanı - alt kısımda sabitlenmiş -->
          <div class="product-actions-container mt-auto">
            <div class="d-flex align-items-center mb-2">
              <span class="product-price">${formattedPrice}</span>
              ${
                formattedOldPrice
                  ? `<span class="product-old-price">${formattedOldPrice}</span>`
                  : ""
              }
            </div>
            <div class="product-card-footer mb-2">
              <div class="product-rating">
                ${getRandomRating()}
                <span class="product-rating-count">(${
                  Math.floor(Math.random() * 100) + 5
                })</span>
              </div>
              <div class="product-quick-actions">
                <button class="product-quick-btn" title="Favorilere Ekle" data-product-id="${productID}">
                  <i class="far fa-heart"></i>
                </button>
                <button class="product-quick-btn" title="Sepete Ekle" data-product-id="${productID}">
                  <i class="fas fa-shopping-cart"></i>
                </button>
              </div>
            </div>
            <a href="${productUrl}" class="btn btn-primary product-detail-btn w-100">
              <span>Detay</span>
              <i class="fas fa-arrow-right ms-2"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

function getRandomRating() {
  const rating = (Math.floor(Math.random() * 10) + 35) / 10;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let html = "";

  for (let i = 0; i < fullStars; i++) {
    html += '<i class="fas fa-star"></i>';
  }

  if (hasHalfStar) {
    html += '<i class="fas fa-star-half-alt"></i>';
  }

  for (let i = 0; i < emptyStars; i++) {
    html += '<i class="far fa-star"></i>';
  }

  return html;
}

export function initProductCards() {
  document
    .querySelectorAll('.product-quick-btn[title="Favorilere Ekle"]')
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const productId = btn.dataset.productId;

        const icon = btn.querySelector("i");
        if (icon.classList.contains("far")) {
          icon.classList.replace("far", "fas");
          icon.classList.add("text-danger");

          btn.classList.add("pulse");
          setTimeout(() => {
            btn.classList.remove("pulse");
          }, 800);

          showToast(`Ürün favorilere eklendi (ID: ${productId})`, "success");
        } else {
          icon.classList.replace("fas", "far");
          icon.classList.remove("text-danger");
          showToast(`Ürün favorilerden çıkarıldı (ID: ${productId})`, "info");
        }
      });
    });

  document
    .querySelectorAll('.product-quick-btn[title="Sepete Ekle"]')
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const productId = btn.dataset.productId;

        btn.classList.add("pulse");
        setTimeout(() => btn.classList.remove("pulse"), 1000);

        updateCartCount(1);

        const card = btn.closest(".product-card");
        if (card) {
          const priceElement = card.querySelector(".product-price");
          if (priceElement) {
            priceElement.style.animation = "none";
            setTimeout(() => {
              priceElement.style.animation = "pulse 0.8s ease";
            }, 10);
          }
        }

        showToast(`Ürün sepete eklendi (ID: ${productId})`, "success");
      });
    });
}

function updateCartCount(count) {
  const cartButton = document.querySelector(".navbar .btn-primary");
  if (!cartButton) return;

  const regex = /\((\d+)\)/;
  const match = cartButton.textContent.match(regex);

  if (match) {
    const currentCount = parseInt(match[1]);
    const newCount = currentCount + count;
    cartButton.textContent = cartButton.textContent.replace(
      regex,
      `(${newCount})`
    );

    const cartIcon = cartButton.querySelector("i");
    if (cartIcon) {
      cartIcon.style.animation = "none";
      setTimeout(() => {
        cartIcon.style.animation = "pulse 0.8s ease";
      }, 10);
    }
  }
}

function showToast(message, type = "success") {
  let toastContainer = document.querySelector(".toast-container");

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className =
      "toast-container position-fixed bottom-0 end-0 p-3";
    document.body.appendChild(toastContainer);
  }

  const toastId = "toast-" + Date.now();

  let iconClass = "fas fa-check-circle";
  let bgClass = "bg-success";

  switch (type) {
    case "info":
      iconClass = "fas fa-info-circle";
      bgClass = "bg-info";
      break;
    case "warning":
      iconClass = "fas fa-exclamation-triangle";
      bgClass = "bg-warning";
      break;
    case "error":
      iconClass = "fas fa-exclamation-circle";
      bgClass = "bg-danger";
      break;
  }

  const toastHtml = `
    <div id="${toastId}" class="toast fade-in" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header ${bgClass} text-white">
        <i class="${iconClass} me-2"></i>
        <strong class="me-auto">Bildirim</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Kapat"></button>
      </div>
      <div class="toast-body bg-dark text-light">
        ${message}
      </div>
    </div>
  `;

  toastContainer.insertAdjacentHTML("beforeend", toastHtml);

  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
  toast.show();

  toastElement.addEventListener("hidden.bs.toast", () => {
    toastElement.remove();
  });
}
