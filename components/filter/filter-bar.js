import { getActiveFilterLabels } from "../../utils/filter-utils.js";
import {
  getSortLabel,
  sortOptionsToString,
  stringToSortOptions,
} from "../../utils/sort-utils.js";
import {
  saveFilterState,
  getFilterState,
  savePageState,
  getPageState,
} from "../../services/storage.js";

export function createFilterBar(
  filterState = {},
  categories = [],
  sortOptions = { field: "name", direction: "asc" },
  itemsPerPage = 12,
  viewType = "grid"
) {
  const sortString = sortOptionsToString(sortOptions);
  const filterLabels = getActiveFilterLabels(filterState, categories);
  const hasActiveFilters = filterLabels.length > 0;
  const activeFilterCount = filterLabels.length;

  const savedViewType = localStorage.getItem("product_view_type") || viewType;

  const mainFilterBar = `
    <div class="filter-bar mt-3">
      <div class="search-container">
        <div class="search-wrapper">
          <div class="input-group">
            <input 
              type="text" 
              class="form-control" 
              id="search-input" 
              placeholder="Ürün ara..." 
              value="${filterState.search || ""}"
            >
            <button class="btn btn-primary" type="button" id="search-button">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
        
        <button class="filter-drawer-toggle" id="filter-drawer-toggle">
          <i class="fas fa-sliders-h"></i>
          <span>Filtreler</span>
          ${
            activeFilterCount > 0
              ? `<div class="filter-drawer-badge">${activeFilterCount}</div>`
              : ""
          }
        </button>
        
        <div class="view-options-container">
          <div class="view-options">
            <button id="grid-view-btn" class="view-btn ${
              savedViewType === "grid" ? "active" : ""
            }" title="Grid Görünüm">
              <i class="fas fa-th"></i>
            </button>
            <button id="list-view-btn" class="view-btn ${
              savedViewType === "list" ? "active" : ""
            }" title="Liste Görünüm">
              <i class="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Aktif Filtreler -->
      ${
        hasActiveFilters
          ? `
      <div id="active-filters" class="mt-3">
        <div class="d-flex flex-wrap align-items-center">
          <small class="text-muted me-2">Aktif Filtreler:</small>
          <div id="filter-badges" class="d-flex flex-wrap">
            ${filterLabels
              .map(
                (label) => `
              <span class="filter-badge" data-filter="${label.type}">
                ${label.label} <i class="fas fa-times-circle"></i>
              </span>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
      `
          : ""
      }
    </div>
  `;

  const drawerHTML = `
    <div class="filter-drawer-overlay" id="filter-drawer-overlay"></div>
    
    <div class="filter-drawer" id="filter-drawer">
      <div class="filter-drawer-header">
        <h5 class="filter-drawer-title">Filtreler</h5>
        <button class="filter-drawer-close" id="filter-drawer-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="filter-drawer-body">
     
        <!-- Sıralama -->
        <div class="filter-section">
          <h6 class="filter-section-title">Sıralama</h6>
          <select class="form-select" id="sort-select">
            <option value="name-asc" ${
              sortString === "name-asc" ? "selected" : ""
            }>İsim (A-Z)</option>
            <option value="name-desc" ${
              sortString === "name-desc" ? "selected" : ""
            }>İsim (Z-A)</option>
            <option value="price-asc" ${
              sortString === "price-asc" ? "selected" : ""
            }>Fiyat (Düşükten Yükseğe)</option>
            <option value="price-desc" ${
              sortString === "price-desc" ? "selected" : ""
            }>Fiyat (Yüksekten Düşüğe)</option>
            <option value="discount-desc" ${
              sortString === "discount-desc" ? "selected" : ""
            }>İndirim Oranı</option>
          </select>
        </div>
        
        <!-- Sayfa Başı Ürün Sayısı -->
        <div class="filter-section">
          <h6 class="filter-section-title">Gösterim Sayısı</h6>
          <select class="form-select" id="per-page-select">
            <option value="12" ${
              itemsPerPage === 12 ? "selected" : ""
            }>12 Ürün</option>
            <option value="24" ${
              itemsPerPage === 24 ? "selected" : ""
            }>24 Ürün</option>
            <option value="36" ${
              itemsPerPage === 36 ? "selected" : ""
            }>36 Ürün</option>
            <option value="48" ${
              itemsPerPage === 48 ? "selected" : ""
            }>48 Ürün</option>
          </select>
        </div>
        
        <!-- Fiyat Aralığı -->
        <div class="filter-section">
          <h6 class="filter-section-title">Fiyat Aralığı</h6>
          <div class="d-flex gap-2">
            <div class="input-group">
              <span class="input-group-text">Min</span>
              <input 
                type="number" 
                class="form-control" 
                id="price-min" 
                placeholder="0" 
                value="${filterState.priceMin || ""}"
                min="0"
              >
            </div>
            <div class="input-group">
              <span class="input-group-text">Max</span>
              <input 
                type="number" 
                class="form-control" 
                id="price-max" 
                placeholder="10000" 
                value="${filterState.priceMax || ""}"
                min="0"
              >
            </div>
          </div>
        </div>
        
        <!-- Stok ve İndirim Seçenekleri -->
        <div class="filter-section">
          <h6 class="filter-section-title">Ek Filtreler</h6>
          <div class="d-flex flex-column gap-2">
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                id="stock-filter" 
                ${filterState.inStock ? "checked" : ""}
              >
              <label class="form-check-label" for="stock-filter">Stokta Olanlar</label>
            </div>
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                id="discount-filter" 
                ${filterState.discount ? "checked" : ""}
              >
              <label class="form-check-label" for="discount-filter">İndirimli Ürünler</label>
            </div>
          </div>
        </div>
      </div>
      
      <div class="filter-drawer-footer">
        <button id="clear-filters" class="btn btn-sm btn-outline-secondary">
          <i class="fas fa-eraser me-1"></i>Temizle
        </button>
        <button id="apply-filters" class="btn btn-sm btn-primary">
          <i class="fas fa-filter me-1"></i>Uygula
        </button>
      </div>
    </div>
  `;

  return mainFilterBar + drawerHTML;
}

function clearAllFilters() {
  saveFilterState({});

  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");
  const priceMin = document.getElementById("price-min");
  const priceMax = document.getElementById("price-max");
  const stockFilter = document.getElementById("stock-filter");
  const discountFilter = document.getElementById("discount-filter");

  if (searchInput) searchInput.value = "";
  if (categoryFilter) categoryFilter.value = "";
  if (priceMin) priceMin.value = "";
  if (priceMax) priceMax.value = "";
  if (stockFilter) stockFilter.checked = false;
  if (discountFilter) discountFilter.checked = false;

  const clearBtn = document.getElementById("clear-filters");
  if (clearBtn) {
    clearBtn.innerHTML = '<i class="fas fa-check me-1"></i>Temizlendi';
    setTimeout(() => {
      clearBtn.innerHTML = '<i class="fas fa-eraser me-1"></i>Temizle';
    }, 1000);
  }

  updateFilterBadgeCount();

  const event = new CustomEvent("filterChanged", {
    detail: { filterState: {} },
  });
  document.dispatchEvent(event);

  setTimeout(() => {
    closeDrawer();
  }, 500);
}

export function initFilterBar() {
  initDrawer();

  const searchButton = document.getElementById("search-button");
  if (searchButton) {
    searchButton.addEventListener("click", handleSearch);

    searchButton.addEventListener("mousedown", function () {
      this.style.transform = "scale(0.95)";
    });

    searchButton.addEventListener("mouseup", function () {
      this.style.transform = "scale(1)";
    });

    searchButton.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  }

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch();

        searchInput.classList.add("pulse-effect");
        setTimeout(() => {
          searchInput.classList.remove("pulse-effect");
        }, 500);
      }
    });

    searchInput.addEventListener("focus", function () {
      const inputGroup = this.closest(".input-group");
      if (inputGroup) {
        inputGroup.style.boxShadow = "0 0 0 0.25rem rgba(99, 102, 241, 0.25)";
      }
    });

    searchInput.addEventListener("blur", function () {
      const inputGroup = this.closest(".input-group");
      if (inputGroup) {
        inputGroup.style.boxShadow = "";
      }
    });
  }

  const categoryFilter = document.getElementById("category-filter");
  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      const categoryId = categoryFilter.value || null;
      updateFilter("category", categoryId);

      categoryFilter.classList.add("pulse-effect");
      setTimeout(() => {
        categoryFilter.classList.remove("pulse-effect");
      }, 500);
    });
  }

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      const sortValue = sortSelect.value;
      updateSort(sortValue);

      sortSelect.classList.add("pulse-effect");
      setTimeout(() => {
        sortSelect.classList.remove("pulse-effect");
      }, 500);
    });
  }

  const perPageSelect = document.getElementById("per-page-select");
  if (perPageSelect) {
    perPageSelect.addEventListener("change", () => {
      const perPage = parseInt(perPageSelect.value);
      updatePerPage(perPage);

      perPageSelect.classList.add("pulse-effect");
      setTimeout(() => {
        perPageSelect.classList.remove("pulse-effect");
      }, 500);
    });
  }

  const applyFiltersButton = document.getElementById("apply-filters");
  if (applyFiltersButton) {
    applyFiltersButton.addEventListener("click", () => {
      applyFilters();
      closeDrawer();
    });

    applyFiltersButton.addEventListener("mousedown", function () {
      this.style.transform = "scale(0.95)";
    });

    applyFiltersButton.addEventListener("mouseup", function () {
      this.style.transform = "scale(1)";
    });

    applyFiltersButton.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  }

  const clearFiltersButton = document.getElementById("clear-filters");
  if (clearFiltersButton) {
    clearFiltersButton.addEventListener("click", clearAllFilters);

    clearFiltersButton.addEventListener("mousedown", function () {
      this.style.transform = "scale(0.95)";
    });

    clearFiltersButton.addEventListener("mouseup", function () {
      this.style.transform = "scale(1)";
    });

    clearFiltersButton.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  }

  const filterBadges = document.querySelectorAll(".filter-badge");
  filterBadges.forEach((badge) => {
    badge.addEventListener("click", () => {
      const filterType = badge.getAttribute("data-filter");

      badge.style.transform = "scale(0.8) translateY(10px)";
      badge.style.opacity = "0";

      setTimeout(() => {
        removeFilter(filterType);
      }, 300);
    });
  });

  initViewOptions();

  document.addEventListener("clearFilters", clearAllFilters);
}

function initDrawer() {
  const drawerToggle = document.getElementById("filter-drawer-toggle");
  const drawer = document.getElementById("filter-drawer");
  const drawerClose = document.getElementById("filter-drawer-close");
  const overlay = document.getElementById("filter-drawer-overlay");

  if (!drawerToggle || !drawer || !drawerClose || !overlay) return;

  drawerToggle.addEventListener("click", () => {
    openDrawer();
  });

  drawerClose.addEventListener("click", () => {
    closeDrawer();
  });

  overlay.addEventListener("click", () => {
    closeDrawer();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("active")) {
      closeDrawer();
    }
  });
}

function openDrawer() {
  const drawer = document.getElementById("filter-drawer");
  const overlay = document.getElementById("filter-drawer-overlay");
  const drawerToggle = document.getElementById("filter-drawer-toggle");

  if (!drawer || !overlay || !drawerToggle) return;

  drawer.classList.remove("closing");
  drawer.classList.add("active");

  overlay.classList.remove("closing");
  overlay.classList.add("active");

  drawerToggle.classList.add("active");

  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  const drawer = document.getElementById("filter-drawer");
  const overlay = document.getElementById("filter-drawer-overlay");
  const drawerToggle = document.getElementById("filter-drawer-toggle");

  if (!drawer || !overlay || !drawerToggle) return;

  drawer.classList.add("closing");
  overlay.classList.add("closing");

  setTimeout(() => {
    drawer.classList.remove("active");
    drawer.classList.remove("closing");

    overlay.classList.remove("active");
    overlay.classList.remove("closing");

    drawerToggle.classList.remove("active");

    document.body.style.overflow = "";
  }, 300);
}

function initViewOptions() {
  const gridViewBtn = document.getElementById("grid-view-btn");
  const listViewBtn = document.getElementById("list-view-btn");

  if (gridViewBtn && listViewBtn) {
    const savedViewType = localStorage.getItem("product_view_type") || "grid";

    if (savedViewType === "list") {
      listViewBtn.classList.add("active");
      gridViewBtn.classList.remove("active");
    } else {
      gridViewBtn.classList.add("active");
      listViewBtn.classList.remove("active");
    }

    gridViewBtn.addEventListener("click", () => {
      gridViewBtn.classList.add("clicked");
      setTimeout(() => {
        gridViewBtn.classList.remove("clicked");
      }, 300);

      gridViewBtn.classList.add("active");
      listViewBtn.classList.remove("active");

      localStorage.setItem("product_view_type", "grid");

      const event = new CustomEvent("viewTypeChanged", {
        detail: { viewType: "grid" },
      });
      document.dispatchEvent(event);
    });

    listViewBtn.addEventListener("click", () => {
      listViewBtn.classList.add("clicked");
      setTimeout(() => {
        listViewBtn.classList.remove("clicked");
      }, 300);

      listViewBtn.classList.add("active");
      gridViewBtn.classList.remove("active");

      localStorage.setItem("product_view_type", "list");

      const event = new CustomEvent("viewTypeChanged", {
        detail: { viewType: "list" },
      });
      document.dispatchEvent(event);
    });
  }
}

function handleSearch() {
  const searchInput = document.getElementById("search-input");
  if (!searchInput) return;

  const searchTerm = searchInput.value.trim();

  const searchButton = document.getElementById("search-button");
  if (searchButton) {
    const icon = searchButton.querySelector("i");
    if (icon) {
      icon.classList.add("fa-spin");
      setTimeout(() => {
        icon.classList.remove("fa-spin");
      }, 500);
    }
  }

  updateFilter("search", searchTerm);
}

function updateFilter(filterType, value) {
  const filterState = getFilterState();

  if (value === null || value === "" || value === undefined) {
    delete filterState[filterType];
  } else {
    filterState[filterType] = value;
  }

  saveFilterState(filterState);

  const event = new CustomEvent("filterChanged", { detail: { filterState } });
  document.dispatchEvent(event);

  updateFilterBadgeCount();
}

function updateFilterBadgeCount() {
  const filterState = getFilterState();
  const filterLabels = getActiveFilterLabels(filterState, []);
  const activeFilterCount = filterLabels.length;

  const filterToggle = document.getElementById("filter-drawer-toggle");
  if (!filterToggle) return;

  const existingBadge = filterToggle.querySelector(".filter-drawer-badge");
  if (existingBadge) {
    existingBadge.remove();
  }

  if (activeFilterCount > 0) {
    const badgeHTML = `<div class="filter-drawer-badge">${activeFilterCount}</div>`;
    filterToggle.insertAdjacentHTML("beforeend", badgeHTML);

    const newBadge = filterToggle.querySelector(".filter-drawer-badge");
    if (newBadge) {
      newBadge.style.transform = "scale(0)";
      setTimeout(() => {
        newBadge.style.transition = "transform 0.3s ease";
        newBadge.style.transform = "scale(1)";
      }, 10);
    }
  }

  updateActiveFiltersSection(filterLabels);
}

function updateActiveFiltersSection(filterLabels) {
  const activeFiltersContainer = document.getElementById("active-filters");
  if (!activeFiltersContainer) return;

  if (filterLabels.length === 0) {
    activeFiltersContainer.style.opacity = "0";
    activeFiltersContainer.style.transform = "translateY(-10px)";

    setTimeout(() => {
      activeFiltersContainer.classList.add("d-none");
      activeFiltersContainer.style.opacity = "";
      activeFiltersContainer.style.transform = "";
    }, 300);
    return;
  }

  const badgesHTML = filterLabels
    .map(
      (label) => `
    <span class="filter-badge" data-filter="${label.type}">
      ${label.label} <i class="fas fa-times-circle"></i>
    </span>
  `
    )
    .join("");

  const badgesContainer =
    activeFiltersContainer.querySelector("#filter-badges");
  if (badgesContainer) {
    badgesContainer.innerHTML = badgesHTML;
  } else {
    activeFiltersContainer.innerHTML = `
      <div class="d-flex flex-wrap align-items-center">
        <small class="text-muted me-2">Aktif Filtreler:</small>
        <div id="filter-badges" class="d-flex flex-wrap">
          ${badgesHTML}
        </div>
      </div>
    `;
  }

  activeFiltersContainer.classList.remove("d-none");
  activeFiltersContainer.style.opacity = "0";
  activeFiltersContainer.style.transform = "translateY(-10px)";

  setTimeout(() => {
    activeFiltersContainer.style.transition =
      "opacity 0.3s ease, transform 0.3s ease";
    activeFiltersContainer.style.opacity = "1";
    activeFiltersContainer.style.transform = "translateY(0)";
  }, 10);

  const filterBadges = activeFiltersContainer.querySelectorAll(".filter-badge");
  filterBadges.forEach((badge) => {
    badge.addEventListener("click", () => {
      const filterType = badge.getAttribute("data-filter");

      badge.style.transform = "scale(0.8) translateY(10px)";
      badge.style.opacity = "0";

      setTimeout(() => {
        removeFilter(filterType);
      }, 300);
    });
  });
}

function updateSort(sortValue) {
  const sortOptions = stringToSortOptions(sortValue);

  const pageState = getPageState();
  pageState.sort = sortOptions;

  savePageState(pageState);

  const event = new CustomEvent("sortChanged", { detail: { sortOptions } });
  document.dispatchEvent(event);
}

function updatePerPage(perPage) {
  const pageState = getPageState();
  pageState.itemsPerPage = perPage;
  pageState.currentPage = 1;

  savePageState(pageState);

  const event = new CustomEvent("pageStateChanged", { detail: { pageState } });
  document.dispatchEvent(event);
}

function applyFilters() {
  const priceMin = document.getElementById("price-min");
  const priceMax = document.getElementById("price-max");

  const stockFilter = document.getElementById("stock-filter");
  const discountFilter = document.getElementById("discount-filter");

  const filterState = getFilterState();

  filterState.priceMin =
    priceMin && priceMin.value ? parseFloat(priceMin.value) : null;
  filterState.priceMax =
    priceMax && priceMax.value ? parseFloat(priceMax.value) : null;

  filterState.inStock = stockFilter && stockFilter.checked;
  filterState.discount = discountFilter && discountFilter.checked;

  saveFilterState(filterState);

  const applyBtn = document.getElementById("apply-filters");
  if (applyBtn) {
    applyBtn.innerHTML = '<i class="fas fa-check me-1"></i>Uygulandı';
    setTimeout(() => {
      applyBtn.innerHTML = '<i class="fas fa-filter me-1"></i>Uygula';
    }, 1000);
  }

  const event = new CustomEvent("filterChanged", { detail: { filterState } });
  document.dispatchEvent(event);

  updateFilterBadgeCount();
}

function removeFilter(filterType) {
  const filterState = getFilterState();

  switch (filterType) {
    case "category":
      delete filterState.category;

      const categoryFilter = document.getElementById("category-filter");
      if (categoryFilter) {
        categoryFilter.value = "";
      }
      break;

    case "price":
      delete filterState.priceMin;
      delete filterState.priceMax;

      const priceMin = document.getElementById("price-min");
      const priceMax = document.getElementById("price-max");

      if (priceMin) priceMin.value = "";
      if (priceMax) priceMax.value = "";
      break;

    case "inStock":
      delete filterState.inStock;

      const stockFilter = document.getElementById("stock-filter");
      if (stockFilter) {
        stockFilter.checked = false;
      }
      break;

    case "discount":
      delete filterState.discount;

      const discountFilter = document.getElementById("discount-filter");
      if (discountFilter) {
        discountFilter.checked = false;
      }
      break;

    case "search":
      delete filterState.search;

      const searchInput = document.getElementById("search-input");
      if (searchInput) {
        searchInput.value = "";
      }
      break;
  }

  saveFilterState(filterState);

  updateFilterBadgeCount();

  const event = new CustomEvent("filterChanged", { detail: { filterState } });
  document.dispatchEvent(event);
}
