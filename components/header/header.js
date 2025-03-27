export function createHeader() {
  return `
      <header class="site-header gradient-bg">
        <div class="container">
          <nav class="navbar navbar-expand-lg navbar-dark">
            <div class="container-fluid">
              <a class="navbar-brand" href="index.html">
                <span>Hyper</span> Teknoloji
              </a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-controls="navbarMain" aria-expanded="false" aria-label="Menüyü aç/kapat">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarMain">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                    <a class="nav-link active" href="index.html">
                      <i class="fas fa-home me-1"></i>Ana Sayfa
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#">
                      <i class="fas fa-tags me-1"></i>Kampanyalar
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#">
                      <i class="fas fa-info-circle me-1"></i>Hakkımızda
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#">
                      <i class="fas fa-envelope me-1"></i>İletişim
                    </a>
                  </li>
                </ul>
                <div class="d-flex align-items-center">
                  <a href="#" class="btn btn-outline-light me-2 d-none d-md-block">
                    <i class="fas fa-user me-1"></i> Giriş Yap
                  </a>
                  <a href="#" class="btn btn-primary">
                    <i class="fas fa-shopping-cart me-1"></i> Sepet <span class="cart-count">(0)</span>
                  </a>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>
    `;
}

export function initHeader() {
  const header = document.querySelector(".site-header");
  if (header) {
    header.style.opacity = "0";
    header.style.transform = "translateY(-10px)";
    header.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    setTimeout(() => {
      header.style.opacity = "1";
      header.style.transform = "translateY(0)";
    }, 100);
  }

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  navLinks.forEach((link, index) => {
    link.style.opacity = "0";
    link.style.transform = "translateY(-10px)";
    link.style.transition = "opacity 0.3s ease, transform 0.3s ease";

    setTimeout(() => {
      link.style.opacity = "1";
      link.style.transform = "translateY(0)";
    }, 150 + index * 100);

    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  const toggleButton = document.querySelector(".navbar-toggler");
  if (toggleButton) {
    toggleButton.addEventListener("mousedown", function () {
      this.style.transform = "scale(0.95)";
    });

    toggleButton.addEventListener("mouseup", function () {
      this.style.transform = "scale(1)";
    });

    toggleButton.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  }

  const cartButton = document.querySelector(".btn-primary");
  if (cartButton) {
    const cartIcon = cartButton.querySelector("i");
    const cartCount = cartButton.querySelector(".cart-count");

    if (cartIcon && cartCount) {
      cartButton.addEventListener("mouseenter", function () {
        cartIcon.style.transform = "translateY(-3px) scale(1.1)";
        cartCount.style.color = "#fff";
      });

      cartButton.addEventListener("mouseleave", function () {
        cartIcon.style.transform = "";
        cartCount.style.color = "";
      });
    }
  }
}

export function updateCartCount(count, animate = true) {
  const cartCountElem = document.querySelector(".cart-count");
  if (!cartCountElem) return;

  const currentText = cartCountElem.textContent;
  const newText = `(${count})`;

  cartCountElem.textContent = newText;

  if (animate) {
    cartCountElem.style.animation = "none";

    setTimeout(() => {
      cartCountElem.style.animation = "pulse 0.5s ease";
    }, 10);

    const cartIcon = document.querySelector(".btn-primary i");
    if (cartIcon) {
      cartIcon.style.animation = "none";

      setTimeout(() => {
        cartIcon.style.animation = "pulse 0.5s ease";
      }, 10);
    }
  }
}
