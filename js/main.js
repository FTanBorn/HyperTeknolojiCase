import { fetchProducts } from "../services/api.js";
import { createHeader, initHeader } from "../components/header/header.js";
import { createFooter, initFooter } from "../components/footer/footer.js";
import {
  createFilterBar,
  initFilterBar,
} from "../components/filter/filter-bar.js";
import {
  initProductList,
  showProductListLoading,
  updateProductList,
} from "../components/product/product-list.js";
import { createLoading, toggleLoading } from "../components/ui/loading.js";
import {
  createNoProductsMessage,
  createErrorMessage,
} from "../components/ui/messages.js";
import {
  initPagination,
  updatePagination,
} from "../components/ui/pagination.js";
import { filterProducts } from "../utils/filter-utils.js";
import { sortProducts } from "../utils/sort-utils.js";
import { paginateProducts } from "../utils/filter-utils.js";
import {
  getFilterState,
  saveFilterState,
  getPageState,
  savePageState,
} from "../services/storage.js";
import { getUrlParams } from "../utils/formatter.js";

document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("header-container");
  const filterContainer = document.getElementById("filter-bar-container");
  const loadingContainer = document.getElementById("loading-container");
  const noProductsContainer = document.getElementById("no-products-container");
  const footerContainer = document.getElementById("footer-container");

  let allProducts = [];
  let filteredProducts = [];
  let categories = [];
  let currentViewType = localStorage.getItem("product_view_type") || "grid";

  headerContainer.innerHTML = createHeader();
  footerContainer.innerHTML = createFooter();
  loadingContainer.innerHTML = createLoading("Ürünler yükleniyor...");

  initHeader();
  initFooter();

  initEventListeners();

  checkUrlParameters();

  initializeApp();

  function initEventListeners() {
    document.addEventListener("filterChanged", (e) => {
      const { filterState } = e.detail;

      const pageState = getPageState();
      pageState.currentPage = 1;
      savePageState(pageState);

      applyFiltersAndRender();
    });

    document.addEventListener("sortChanged", (e) => {
      const { sortOptions } = e.detail;

      const pageState = getPageState();
      pageState.sort = sortOptions;
      savePageState(pageState);

      applyFiltersAndRender();
    });

    document.addEventListener("pageChanged", (e) => {
      const { page } = e.detail;

      const pageState = getPageState();
      pageState.currentPage = page;
      savePageState(pageState);

      applyFiltersAndRender();
    });

    document.addEventListener("pageStateChanged", (e) => {
      const { pageState } = e.detail;

      savePageState(pageState);

      applyFiltersAndRender();
    });

    document.addEventListener("viewTypeChanged", (e) => {
      const { viewType } = e.detail;

      currentViewType = viewType;

      applyFiltersAndRender();
    });
  }

  function checkUrlParameters() {
    const params = getUrlParams();

    const filterState = getFilterState();

    if (params.category) {
      filterState.category = params.category;
    }

    if (params.search) {
      filterState.search = params.search;
    }

    saveFilterState(filterState);
  }

  async function initializeApp() {
    try {
      toggleLoading(loadingContainer, true);

      const [productsResponse] = await Promise.all([fetchProducts()]);

      allProducts = productsResponse;

      console.log(`${allProducts.length} `);

      const filterState = getFilterState();
      const pageState = getPageState();
      filterContainer.innerHTML = createFilterBar(
        filterState,
        pageState.sort,
        pageState.itemsPerPage,
        currentViewType
      );
      initFilterBar();

      applyFiltersAndRender();

      toggleLoading(loadingContainer, false);
    } catch (error) {
      toggleLoading(loadingContainer, false);

      noProductsContainer.innerHTML = createErrorMessage(
        "Ürünler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
        "Tekrar Dene",
        "retry-button"
      );
      noProductsContainer.classList.remove("d-none");

      const retryButton = document.getElementById("retry-button");
      if (retryButton) {
        retryButton.addEventListener("click", initializeApp);
      }

      console.error("Uygulama başlatılırken hata oluştu:", error);
    }
  }

  function applyFiltersAndRender() {
    showProductListLoading();

    const filterState = getFilterState();
    const pageState = getPageState();

    filteredProducts = filterProducts(allProducts, filterState);

    filteredProducts = sortProducts(filteredProducts, pageState.sort);

    const paginatedProducts = paginateProducts(
      filteredProducts,
      pageState.currentPage,
      pageState.itemsPerPage
    );

    updateProductList(paginatedProducts, currentViewType);
    initProductList();

    updatePagination(
      pageState.currentPage,
      Math.ceil(filteredProducts.length / pageState.itemsPerPage),
      filteredProducts.length,
      pageState.itemsPerPage
    );
    initPagination();

    if (filteredProducts.length === 0) {
      noProductsContainer.innerHTML = createNoProductsMessage(
        "Arama kriterlerinize uygun ürün bulunamadı. Lütfen filtrelerinizi değiştirin.",
        true
      );
      noProductsContainer.classList.remove("d-none");

      const clearFiltersBtn = document.getElementById("clear-filters-btn");
      if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", () => {
          const event = new CustomEvent("clearFilters");
          document.dispatchEvent(event);
        });
      }
    } else {
      noProductsContainer.classList.add("d-none");
    }
  }
});
