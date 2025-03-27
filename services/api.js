const API_BASE_URL = "https://api.hyperteknoloji.com.tr";
const API_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dpblR5cGUiOiIxIiwiQ3VzdG9tZXJJRCI6IjU1NzI0IiwiRmlyc3ROYW1lIjoiRGVtbyIsIkxhc3ROYW1lIjoiSHlwZXIiLCJFbWFpbCI6ImRlbW9AaHlwZXIuY29tIiwiQ3VzdG9tZXJUeXBlSUQiOiIzMiIsIklzUmVzZWxsZXIiOiIwIiwiSXNBUEkiOiIxIiwiUmVmZXJhbmNlSUQiOiIiLCJSZWdpc3RlckRhdGUiOiIzLzI1LzIwMjUgMTowMDo0OCBQTSIsImV4cCI6MjA1NDAyMjIzMSwiaXNzIjoiaHR0cHM6Ly9oeXBlcnRla25vbG9qaS5jb20iLCJhdWQiOiJodHRwczovL2h5cGVydGVrbm9sb2ppLmNvbSJ9.nBkxthRs0olmBP3Iamlv4-l37Y6dW1LUaxjnLrjXsTo";
const API_KEY = "de59806d4c0449f69f38a62c4e72874a";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
    "X-API-Key": API_KEY,
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error(
      "API Hatası:",
      error.response?.data?.message || error.message
    );
    return Promise.reject(error);
  }
);

export async function fetchProducts(params = {}) {
  try {
    const response = await apiClient.post("/products/list", params);

    let productList = [];

    if (Array.isArray(response)) {
      productList = response;
    } else if (response.data && Array.isArray(response.data)) {
      productList = response.data;
    } else if (response.products && Array.isArray(response.products)) {
      productList = response.products;
    } else if (response.items && Array.isArray(response.items)) {
      productList = response.items;
    } else if (response.results && Array.isArray(response.results)) {
      productList = response.results;
    } else {
      console.warn("API yanıtında beklenen veri formatı bulunamadı:", response);
      return [];
    }

    return productList.filter(
      (product) => product && (product.productID || product.id)
    );
  } catch (error) {
    console.error("Ürünler çekilirken hata oluştu:", error);
    throw error;
  }
}

export async function fetchProductById(productId) {
  try {
    const response = await apiClient.post(`/products/${productId}`);

    if (response && response.productID) {
      return response;
    } else if (response && response.data) {
      return response.data;
    } else {
      console.warn("API yanıtında beklenen ürün detayı bulunamadı:", response);
      return null;
    }
  } catch (error) {
    console.error(`${productId} ID'li ürün çekilirken hata oluştu:`, error);
    throw error;
  }
}

export async function searchProducts(keyword, additionalParams = {}) {
  try {
    const params = {
      search: keyword,
      ...additionalParams,
    };

    return await fetchProducts(params);
  } catch (error) {
    console.error("Ürün araması yapılırken hata oluştu:", error);
    throw error;
  }
}
