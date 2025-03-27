import { createProductCard, initProductCards } from "./product-card.js";

export function createProductList(products, viewType = "grid") {
  if (!products || !Array.isArray(products) || products.length === 0) {
    return `
      <div class="col-12">
        <div class="no-products">
          <i class="fas fa-gamepad"></i>
          <h4>Ürün Bulunamadı</h4>
          <p>Arama kriterlerinize uygun ürün bulunamadı. Lütfen filtrelerinizi değiştirin.</p>
          <button id="clear-filters-btn" class="btn btn-outline-primary">
            <i class="fas fa-sync-alt me-2"></i>Tüm Filtreleri Temizle
          </button>
        </div>
      </div>
    `;
  }

  let html = "";

  if (viewType === "list") {
    products.forEach((product, index) => {
      html += `
        <div class="col-12 mb-1">
          ${createProductCard(product, "list")}
        </div>
      `;
    });
  } else {
    products.forEach((product, index) => {
      html += `
        <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
          ${createProductCard(product, "grid")}
        </div>
      `;
    });
  }

  return html;
}

export function initProductList() {
  initProductCards();

  const clearFiltersBtn = document.getElementById("clear-filters-btn");
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", () => {
      const event = new CustomEvent("clearFilters");
      document.dispatchEvent(event);
    });
  }

  const gridViewBtn = document.getElementById("grid-view-btn");
  const listViewBtn = document.getElementById("list-view-btn");

  if (gridViewBtn && listViewBtn) {
    gridViewBtn.addEventListener("click", () => {
      gridViewBtn.classList.add("active");
      listViewBtn.classList.remove("active");

      localStorage.setItem("product_view_type", "grid");

      const event = new CustomEvent("viewTypeChanged", {
        detail: { viewType: "grid" },
      });
      document.dispatchEvent(event);

      gridViewBtn.style.animation = "none";
      setTimeout(() => {
        gridViewBtn.style.animation = "pulse 0.5s ease";
      }, 10);
    });

    listViewBtn.addEventListener("click", () => {
      listViewBtn.classList.add("active");
      gridViewBtn.classList.remove("active");

      localStorage.setItem("product_view_type", "list");

      const event = new CustomEvent("viewTypeChanged", {
        detail: { viewType: "list" },
      });
      document.dispatchEvent(event);

      listViewBtn.style.animation = "none";
      setTimeout(() => {
        listViewBtn.style.animation = "pulse 0.5s ease";
      }, 10);
    });

    const savedViewType = localStorage.getItem("product_view_type") || "grid";
    if (savedViewType === "list") {
      listViewBtn.classList.add("active");
      gridViewBtn.classList.remove("active");
    } else {
      gridViewBtn.classList.add("active");
      listViewBtn.classList.remove("active");
    }
  }
}

export function updateProductList(products, viewType = "grid") {
  const productListContainer = document.getElementById(
    "product-list-container"
  );
  if (!productListContainer) return;

  viewType = viewType || localStorage.getItem("product_view_type") || "grid";

  if (viewType === "list") {
    productListContainer.classList.add("product-list-view");
  } else {
    productListContainer.classList.remove("product-list-view");
  }

  productListContainer.innerHTML = createProductList(products, viewType);

  initProductList();
}

export function showProductListLoading() {
  const productListContainer = document.getElementById(
    "product-list-container"
  );
  if (!productListContainer) return;

  productListContainer.innerHTML = `
    <div class="col-12 text-center py-5 fade-in">
      <div class="spinner-border" style="color: var(--game-primary)" role="status">
        <span class="visually-hidden">Yükleniyor...</span>
      </div>
      <p class="mt-2 text-light">Ürünler yükleniyor...</p>
    </div>
  `;
}
