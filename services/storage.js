export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Veri kaydedilirken hata oluştu: ${key}`, error);
    return false;
  }
}

export function getFromStorage(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    if (data === null) return defaultValue;
    return JSON.parse(data);
  } catch (error) {
    console.error(`Veri çekilirken hata oluştu: ${key}`, error);
    return defaultValue;
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Veri silinirken hata oluştu: ${key}`, error);
    return false;
  }
}

export function clearStorage() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Depolama temizlenirken hata oluştu", error);
    return false;
  }
}

export function saveFilterState(filters) {
  return saveToStorage("hyper_filters", filters);
}

export function getFilterState() {
  return getFromStorage("hyper_filters", {});
}

export function savePageState(pageState) {
  return saveToStorage("hyper_page_state", pageState);
}

export function getPageState() {
  return getFromStorage("hyper_page_state", {
    currentPage: 1,
    itemsPerPage: 12,
    sort: { field: "name", direction: "asc" },
  });
}
