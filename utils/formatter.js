export function formatPrice(price, currency = "₺") {
  if (price === null || price === undefined || isNaN(price)) {
    return "Belirtilmemiş";
  }

  return price.toLocaleString("tr-TR") + " " + currency;
}

export function getStockStatus(stock) {
  if (stock === null || stock === undefined || isNaN(stock)) {
    return {
      status: "unknown",
      text: "Belirsiz",
      class: "bg-secondary",
    };
  }

  if (stock <= 0) {
    return {
      status: "out",
      text: "Stokta Yok",
      class: "bg-secondary",
    };
  } else if (stock <= 5) {
    return {
      status: "critical",
      text: "Son " + stock + " Ürün",
      class: "bg-danger",
    };
  } else if (stock <= 10) {
    return {
      status: "low",
      text: "Sınırlı Stok",
      class: "bg-warning text-dark",
    };
  } else {
    return {
      status: "in",
      text: "Stokta",
      class: "bg-success",
    };
  }
}

export function calculateDiscountRate(originalPrice, salePrice) {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) {
    return null;
  }

  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
}

export function truncateText(text, maxLength) {
  if (!text || typeof text !== "string") {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.substr(0, maxLength) + "...";
}

export function getUrlParams(url = window.location.href) {
  const params = {};
  const queryString = url.split("?")[1];

  if (!queryString) {
    return params;
  }

  const paramPairs = queryString.split("&");

  paramPairs.forEach((pair) => {
    const [key, value] = pair.split("=");
    params[decodeURIComponent(key)] = decodeURIComponent(value || "");
  });

  return params;
}

export function daysBetween(date1, date2 = new Date()) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
