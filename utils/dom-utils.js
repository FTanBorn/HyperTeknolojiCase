export function isElementVisible(element) {
  if (!element) return false;

  const style = window.getComputedStyle(element);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.opacity !== "0"
  );
}

export function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    const context = this;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

export function createElement(tag, attrs = {}, content = "") {
  const element = document.createElement(tag);

  Object.entries(attrs).forEach(([key, value]) => {
    if (key === "class") {
      element.className = value;
    } else if (key === "dataset") {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else {
      element.setAttribute(key, value);
    }
  });

  if (content) {
    if (typeof content === "string") {
      element.innerHTML = content;
    } else {
      element.appendChild(content);
    }
  }

  return element;
}

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

export function scrollToElement(element) {
  const target =
    typeof element === "string" ? document.getElementById(element) : element;

  if (target) {
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

export function clearElement(element) {
  if (element) {
    element.innerHTML = "";
  }
}

export function onElementReady(selector, callback) {
  const element = document.querySelector(selector);

  if (element) {
    callback(element);
    return;
  }

  const observer = new MutationObserver((mutations) => {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
