export function createFooter() {
  const currentYear = new Date().getFullYear();

  return `
      <footer class="site-footer">
        <div class="container">
          <div class="row">
            <div class="col-lg-4 mb-4 mb-lg-0">
              <h5>Hyper Teknoloji</h5>
              <p class="mb-4">Teknoloji dünyasındaki çözüm ortağınız. En yeni ve kaliteli ürünleri uygun fiyatlarla sunuyoruz.</p>
              <div class="social-links">
                <a href="#" aria-label="Facebook" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="#" aria-label="Twitter" title="Twitter"><i class="fab fa-twitter"></i></a>
                <a href="#" aria-label="Instagram" title="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="#" aria-label="Discord" title="Discord"><i class="fab fa-discord"></i></a>
              </div>
              <div class="footer-payments mt-3">
                <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" alt="Visa" />
                <img src="https://cdn-icons-png.flaticon.com/128/349/349230.png" alt="MasterCard" />
                <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" alt="PayPal" />
                <img src="https://cdn-icons-png.flaticon.com/128/5968/5968299.png" alt="BTC" />
              </div>
            </div>
            <div class="col-lg-2 col-md-6 mb-4 mb-md-0">
              <h5>Hızlı Linkler</h5>
              <ul class="footer-links">
                <li><a href="index.html">Ana Sayfa</a></li>
                <li><a href="#">Ürünlerimiz</a></li>
                <li><a href="#">Kampanyalar</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Hakkımızda</a></li>
              </ul>
            </div>
            <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
              <h5>Kategoriler</h5>
              <ul class="footer-links" id="footer-categories">
                <li><a href="#">Bilgisayarlar</a></li>
                <li><a href="#">Telefonlar</a></li>
                <li><a href="#">Oyun Ürünleri</a></li>
                <li><a href="#">Aksesuarlar</a></li>
                <li><a href="#">Ev Elektroniği</a></li>
              </ul>
            </div>
            <div class="col-lg-3 mb-4 mb-lg-0">
              <h5>İletişim</h5>
              <ul class="footer-contact">
                <li><i class="fas fa-map-marker-alt"></i> <span>İstanbul, Türkiye</span></li>
                <li><i class="fas fa-phone"></i> <span>+90 (555) 123 45 67</span></li>
                <li><i class="fas fa-envelope"></i> <span>info@hyperteknoloji.com</span></li>
                <li><i class="fas fa-clock"></i> <span>Pazartesi - Cuma: 09:00 - 18:00</span></li>
              </ul>
            </div>
          </div>
          <div class="copyright text-center">
            <p>&copy; ${currentYear} Hyper Teknoloji. Tüm hakları saklıdır.</p>
            <p class="mt-2">
              <a href="#" class="text-decoration-none me-3">Gizlilik Politikası</a>
              <a href="#" class="text-decoration-none">Kullanım Şartları</a>
            </p>
          </div>
        </div>
      </footer>
    `;
}

export function updateFooterCategories(categories) {
  const footerCategories = document.getElementById("footer-categories");
  if (!footerCategories || !categories || !Array.isArray(categories)) return;

  footerCategories.innerHTML = "";

  const categoriesToShow = categories.slice(0, 5);
  categoriesToShow.forEach((category, index) => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    li.style.opacity = "0";
    li.style.transform = "translateX(-10px)";
    li.style.transition = "opacity 0.3s ease, transform 0.3s ease";

    a.href = `index.html?category=${category.categoryID}`;
    a.textContent = category.categoryName;

    li.appendChild(a);
    footerCategories.appendChild(li);

    setTimeout(() => {
      li.style.opacity = "1";
      li.style.transform = "translateX(0)";
    }, 100 + index * 100);
  });
}

export function initFooter() {
  const footer = document.querySelector(".site-footer");
  if (footer) {
    const footerHeadings = footer.querySelectorAll("h5");
    footerHeadings.forEach((heading, index) => {
      heading.style.opacity = "0";
      heading.style.transform = "translateY(20px)";
      heading.style.transition = "opacity 0.5s ease, transform 0.5s ease";

      setTimeout(() => {
        heading.style.opacity = "1";
        heading.style.transform = "translateY(0)";
      }, 300 + index * 150);
    });

    const footerLinks = footer.querySelectorAll(".footer-links");
    footerLinks.forEach((linkGroup) => {
      const links = linkGroup.querySelectorAll("li");
      links.forEach((link, index) => {
        link.style.opacity = "0";
        link.style.transform = "translateX(-10px)";
        link.style.transition = "opacity 0.3s ease, transform 0.3s ease";

        setTimeout(() => {
          link.style.opacity = "1";
          link.style.transform = "translateX(0)";
        }, 500 + index * 100);
      });
    });

    const contactItems = footer.querySelectorAll(".footer-contact li");
    contactItems.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateX(-10px)";
      item.style.transition = "opacity 0.3s ease, transform 0.3s ease";

      setTimeout(() => {
        item.style.opacity = "1";
        item.style.transform = "translateX(0)";
      }, 500 + index * 100);
    });

    const socialLinks = footer.querySelectorAll(".social-links a");
    socialLinks.forEach((link, index) => {
      link.style.opacity = "0";
      link.style.transform = "scale(0.5)";
      link.style.transition = "opacity 0.3s ease, transform 0.3s ease";

      setTimeout(() => {
        link.style.opacity = "1";
        link.style.transform = "scale(1)";
      }, 800 + index * 100);
    });
  }

  const scrollTopButton = document.createElement("div");
  scrollTopButton.className = "scroll-top";
  scrollTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  document.body.appendChild(scrollTopButton);

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollTopButton.style.opacity = "1";
    } else {
      scrollTopButton.style.opacity = "0";
    }
  });

  scrollTopButton.addEventListener("click", () => {
    scrollTopButton.style.transform = "scale(0.8)";
    setTimeout(() => {
      scrollTopButton.style.transform = "scale(1.1)";
      setTimeout(() => {
        scrollTopButton.style.transform = "scale(1)";
      }, 150);
    }, 150);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  scrollTopButton.addEventListener("mouseenter", () => {
    scrollTopButton.style.transform = "translateY(-5px)";
  });

  scrollTopButton.addEventListener("mouseleave", () => {
    scrollTopButton.style.transform = "translateY(0)";
  });

  const paymentIcons = footer.querySelectorAll(".footer-payments img");
  paymentIcons.forEach((icon, index) => {
    icon.style.opacity = "0";
    icon.style.transform = "scale(0.9)";
    icon.style.transition = "all 0.3s ease";

    setTimeout(() => {
      icon.style.opacity = "0.5";
      icon.style.transform = "scale(1)";
    }, 1000 + index * 100);

    icon.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1)";
      this.style.opacity = "1";
    });

    icon.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
      this.style.opacity = "0.5";
    });
  });
}
