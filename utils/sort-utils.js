import { calculateDiscountRate } from "./formatter.js";

export function sortProducts(products, sortOptions) {
  if (!products || !Array.isArray(products)) {
    return [];
  }

  const { field, direction } = sortOptions;
  const directionMultiplier = direction === "desc" ? -1 : 1;

  return [...products].sort((a, b) => {
    let valueA, valueB;

    switch (field) {
      case "name":
        valueA = a.productName || "";
        valueB = b.productName || "";
        return directionMultiplier * valueA.localeCompare(valueB);

      case "price":
        valueA = a.salePrice || a.marketPrice || 0;
        valueB = b.salePrice || b.marketPrice || 0;
        return directionMultiplier * (valueA - valueB);

      case "discount":
        const discountA =
          calculateDiscountRate(a.marketPrice, a.salePrice) || 0;
        const discountB =
          calculateDiscountRate(b.marketPrice, b.salePrice) || 0;
        return directionMultiplier * (discountA - discountB);

      case "stock":
        valueA = a.totalStock || 0;
        valueB = b.totalStock || 0;
        return directionMultiplier * (valueA - valueB);

      default:
        return 0;
    }
  });
}

export function sortOptionsToString(sortOptions) {
  return `${sortOptions.field}-${sortOptions.direction}`;
}

export function stringToSortOptions(sortString) {
  if (!sortString || !sortString.includes("-")) {
    return { field: "name", direction: "asc" };
  }

  const [field, direction] = sortString.split("-");
  return { field, direction };
}

export function getSortLabel(sortOptions) {
  const labels = {
    "name-asc": "İsim (A-Z)",
    "name-desc": "İsim (Z-A)",
    "price-asc": "Fiyat (Düşükten Yükseğe)",
    "price-desc": "Fiyat (Yüksekten Düşüğe)",
    "discount-desc": "İndirim Oranı (Yüksekten Düşüğe)",
    "discount-asc": "İndirim Oranı (Düşükten Yükseğe)",
    "stock-desc": "Stok (Çoktan Aza)",
    "stock-asc": "Stok (Azdan Çoğa)",
  };

  const key = `${sortOptions.field}-${sortOptions.direction}`;
  return labels[key] || "Varsayılan Sıralama";
}
