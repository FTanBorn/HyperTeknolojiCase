import { savePageState, getPageState } from "../../services/storage.js";
import { scrollToTop } from "../../utils/dom-utils.js";

export function createPagination(
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage
) {
  if (totalPages <= 1) {
    return totalItems > 0
      ? `
      <div class="pagination-container">
        <div class="pagination-info">
          Toplam ${totalItems} ürün gösteriliyor
        </div>
      </div>
    `
      : "";
  }

  let paginationHTML = `
    <div class="pagination-container">
      <nav aria-label="Ürün sayfaları">
        <ul class="pagination">
          <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" aria-label="İlk Sayfa" data-page="1">
              <i class="fas fa-angle-double-left"></i>
            </a>
          </li>
          <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" aria-label="Önceki" data-page="${
              currentPage - 1
            }">
              <i class="fas fa-angle-left"></i>
            </a>
          </li>
  `;

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }

  paginationHTML += `
          <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" href="#" aria-label="Sonraki" data-page="${
              currentPage + 1
            }">
              <i class="fas fa-angle-right"></i>
            </a>
          </li>
          <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" href="#" aria-label="Son Sayfa" data-page="${totalPages}">
              <i class="fas fa-angle-double-right"></i>
            </a>
          </li>
        </ul>
      </nav>
      <div class="pagination-info">
        Toplam ${totalItems} ürün | Sayfa ${currentPage}/${totalPages} | 
        Sayfa başına ${itemsPerPage} ürün gösteriliyor
      </div>
    </div>
  `;

  return paginationHTML;
}

export function initPagination() {
  document.querySelectorAll(".pagination .page-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = parseInt(link.getAttribute("data-page"));
      if (isNaN(page)) return;

      handlePageChange(page);
    });
  });
}

function handlePageChange(page) {
  const pageState = getPageState();

  if (page < 1) page = 1;

  if (pageState.currentPage === page) return;

  pageState.currentPage = page;

  savePageState(pageState);

  scrollToTop();

  const event = new CustomEvent("pageChanged", { detail: { page } });
  document.dispatchEvent(event);
}

export function updatePagination(
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage
) {
  const paginationContainer = document.getElementById("pagination-container");
  if (!paginationContainer) return;

  paginationContainer.innerHTML = createPagination(
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage
  );
  initPagination();
}
