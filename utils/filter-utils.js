export function filterProducts(products, filters) {
  if (!products || !Array.isArray(products)) {
    return [];
  }

  return products.filter((product) => {
    if (
      filters.category &&
      product.categoryID !== filters.category &&
      product.productData?.categoryID !== filters.category
    ) {
      return false;
    }

    if (
      filters.priceMin !== null &&
      filters.priceMin !== undefined &&
      (product.salePrice < filters.priceMin ||
        (!product.salePrice && product.marketPrice < filters.priceMin))
    ) {
      return false;
    }

    if (
      filters.priceMax !== null &&
      filters.priceMax !== undefined &&
      (product.salePrice > filters.priceMax ||
        (!product.salePrice && product.marketPrice > filters.priceMax))
    ) {
      return false;
    }

    if (
      filters.inStock === true &&
      (product.totalStock <= 0 || product.totalStock === undefined)
    ) {
      return false;
    }

    if (
      filters.discount === true &&
      (!product.marketPrice ||
        !product.salePrice ||
        product.marketPrice <= product.salePrice)
    ) {
      return false;
    }

    if (filters.search && filters.search.trim() !== "") {
      const searchTerm = filters.search.toLowerCase().trim();
      const nameMatch =
        product.productName &&
        product.productName.toLowerCase().includes(searchTerm);
      const descMatch =
        product.productData &&
        product.productData.productDescription &&
        product.productData.productDescription
          .toLowerCase()
          .includes(searchTerm);
      const infoMatch =
        product.productData &&
        product.productData.productInfo &&
        product.productData.productInfo.toLowerCase().includes(searchTerm);

      if (!nameMatch && !descMatch && !infoMatch) {
        return false;
      }
    }

    return true;
  });
}

export function getActiveFilterLabels(filters, categories = []) {
  const labels = [];

  if (filters.category) {
    const category = categories.find((c) => c.categoryID === filters.category);
    if (category) {
      labels.push({
        type: "category",
        label: `Kategori: ${category.categoryName}`,
      });
    }
  }

  if (filters.priceMin || filters.priceMax) {
    const priceRange = [];
    if (filters.priceMin) priceRange.push(`min: ${filters.priceMin} ₺`);
    if (filters.priceMax) priceRange.push(`max: ${filters.priceMax} ₺`);

    labels.push({
      type: "price",
      label: `Fiyat: ${priceRange.join(", ")}`,
    });
  }

  if (filters.inStock) {
    labels.push({
      type: "inStock",
      label: "Stokta Olanlar",
    });
  }

  if (filters.discount) {
    labels.push({
      type: "discount",
      label: "İndirimli Ürünler",
    });
  }

  if (filters.search) {
    labels.push({
      type: "search",
      label: `Arama: ${filters.search}`,
    });
  }

  return labels;
}

export function paginateProducts(products, currentPage, itemsPerPage) {
  if (!products || !Array.isArray(products)) {
    return [];
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return products.slice(startIndex, endIndex);
}
