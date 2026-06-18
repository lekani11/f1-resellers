/* ================================================
   F1 RESELLERS — CLEAN FIXED VERSION
================================================ */


/* =========================
   LIGHTBOX (UNCHANGED)
========================= */
const Lightbox = (function () {

  const overlay = document.createElement("div");
  overlay.id = "lightbox-overlay";

  overlay.innerHTML = `
    <button id="lb-close">&#10005;</button>
    <button id="lb-prev">&#10094;</button>
    <div id="lb-img-wrap">
      <img id="lb-img" src="" alt="">
    </div>
    <button id="lb-next">&#10095;</button>
    <p id="lb-counter"></p>
  `;

  document.body.appendChild(overlay);

  const img = document.getElementById("lb-img");
  const prev = document.getElementById("lb-prev");
  const next = document.getElementById("lb-next");
  const close = document.getElementById("lb-close");
  const counter = document.getElementById("lb-counter");

  let images = [];
  let current = 0;

  function show(srcs, index) {
    images = srcs;
    current = index;
    render();
    overlay.classList.add("lb-active");
    document.body.style.overflow = "hidden";
  }

  function hide() {
    overlay.classList.remove("lb-active");
    document.body.style.overflow = "";
  }

  function render() {
    img.src = images[current];
    counter.textContent = images.length > 1 ? `${current + 1} / ${images.length}` : "";
  }

  function nextImg() {
    current = (current + 1) % images.length;
    render();
  }

  function prevImg() {
    current = (current - 1 + images.length) % images.length;
    render();
  }

  close.addEventListener("click", hide);
  prev.addEventListener("click", e => { e.stopPropagation(); prevImg(); });
  next.addEventListener("click", e => { e.stopPropagation(); nextImg(); });

  overlay.addEventListener("click", e => {
    if (e.target === overlay) hide();
  });

  document.addEventListener("keydown", e => {
    if (!overlay.classList.contains("lb-active")) return;
    if (e.key === "Escape") hide();
    if (e.key === "ArrowLeft") prevImg();
    if (e.key === "ArrowRight") nextImg();
  });

  return { show, hide };

})();


/* =========================
   GLOBAL IMAGE EFFECTS (FIXED SAFE)
========================= */
(function imageEffects() {

  const images = document.querySelectorAll("img:not(header img):not(#lb-img)");

  const srcs = [...images].map(img => img.src);

  images.forEach((img, index) => {

    img.style.cursor = "pointer";

    img.addEventListener("click", () => {
      Lightbox.show(srcs, index);
    });

  });

})();


/* =========================
   PRODUCTS PAGE (FIXED)
========================= */
(function products() {

  const buttons = document.querySelectorAll(".product-card button");
  if (!buttons.length) return;

  let count = 0;

  const cart = document.createElement("div");
  cart.id = "cart-badge";
  cart.innerHTML = `🛒 <span id="cart-count">0</span> items`;

  cart.style.cssText = `
    position:fixed;
    bottom:20px;
    right:20px;
    background:#d90429;
    color:#fff;
    padding:12px 18px;
    border-radius:30px;
    display:none;
    z-index:9999;
  `;

  document.body.appendChild(cart);

  function toast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;

    t.style.cssText = `
      position:fixed;
      top:80px;
      right:20px;
      background:#1f1f1f;
      color:#fff;
      padding:12px 18px;
      border-left:4px solid #d90429;
      border-radius:6px;
      z-index:9999;
    `;

    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {

      const card = btn.closest(".product-card");
      const name = card.querySelector("h3")?.textContent || "Item";
      const price = card.querySelector(".price")?.textContent || "";

      count++;
      document.getElementById("cart-count").textContent = count;
      cart.style.display = "block";

      toast(`Added: ${name} ${price}`);
    });
  });

})();


/* =========================
   GALLERY SLIDESHOW (YOUR ORIGINAL FIXED VERSION)
========================= */
(function gallerySlideshow() {

  const mainEl = document.querySelector("main");
  if (!mainEl) return;

  const rawImgs = Array.from(mainEl.querySelectorAll("img:not(#lb-img)"));
  if (rawImgs.length < 2) return;

  const slides = rawImgs.map(img => ({
    src: img.src,
    alt: img.alt || ""
  }));

  const srcs = slides.map(s => s.src);

  rawImgs.forEach(img => img.remove());

  let current = 0;
  let timer;

  const wrapper = document.createElement("div");
  wrapper.id = "slideshow";

  wrapper.innerHTML = `
    <div id="ss-stage">
      <button id="ss-prev">&#10094;</button>
      <div id="ss-img-wrap">
        <img id="ss-main-img" src="${slides[0].src}">
        <div id="ss-caption">${slides[0].alt}</div>
      </div>
      <button id="ss-next">&#10095;</button>
    </div>
  `;

  mainEl.appendChild(wrapper);

  const mainImg = document.getElementById("ss-main-img");
  const caption = document.getElementById("ss-caption");

  function goTo(i) {
    current = (i + slides.length) % slides.length;

    mainImg.style.opacity = "0";

    setTimeout(() => {
      mainImg.src = slides[current].src;
      caption.textContent = slides[current].alt;
      mainImg.style.opacity = "1";
    }, 200);
  }

  document.getElementById("ss-prev").onclick = () => goTo(current - 1);
  document.getElementById("ss-next").onclick = () => goTo(current + 1);

  mainImg.onclick = () => Lightbox.show(srcs, current);

  timer = setInterval(() => goTo(current + 1), 4000);

  wrapper.addEventListener("mouseenter", () => clearInterval(timer));
  wrapper.addEventListener("mouseleave", () => {
    timer = setInterval(() => goTo(current + 1), 4000);
  });

})();


/* =========================
   CONTACT OPEN/CLOSED (RESTORED)
========================= */
(function contactStatus() {

  const main = document.querySelector("main");
  if (!main) return;

  const hours = {
    0: null,
    1: [9, 15],
    2: [9, 15.5],
    3: [9, 15],
    4: [9, 15],
    5: [9, 15],
    6: [9, 13]
  };

  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  const now = new Date();
  const d = now.getDay();
  const time = now.getHours() + now.getMinutes()/60;

  const today = hours[d];

  let text = "";
  let color = "";

  if (!today) {
    text = "🔴 Closed today";
    color = "#d90429";
  } else if (time >= today[0] && time < today[1]) {
    text = "🟢 OPEN NOW";
    color = "#2ecc71";
  } else {
    text = "🟡 Closed";
    color = "#f39c12";
  }

  const banner = document.createElement("div");
  banner.textContent = text;

  banner.style.cssText = `
    background:#1f1f1f;
    border-left:4px solid ${color};
    color:${color};
    padding:12px 20px;
    margin:15px auto;
    max-width:400px;
    text-align:center;
    font-weight:bold;
  `;

  const h1 = main.querySelector("h1");
  if (h1) h1.insertAdjacentElement("afterend", banner);

})();


/* =========================
   SMOOTH SCROLL
========================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});


/* =========================
   PRODUCT IMAGE FIX (ONLY STYLING)
========================= */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".product-card img").forEach(img => {
    img.style.width = "100%";
    img.style.height = "320px";
    img.style.objectFit = "cover";
  });
});

document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let valid = true;

    // inputs
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const message = document.getElementById("message");

    // error fields
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");
    const messageError = document.getElementById("messageError");
    const successMsg = document.getElementById("successMsg");

    // reset messages
    nameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    messageError.textContent = "";
    successMsg.textContent = "";

    // Name validation
    if (name.value.trim() === "") {
        nameError.textContent = "Name is required";
        valid = false;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
        emailError.textContent = "Enter a valid email";
        valid = false;
    }

    // Phone validation (South Africa style)
    const phonePattern = /^0[6-8][0-9]{8}$/;
    if (!phonePattern.test(phone.value)) {
        phoneError.textContent = "Enter a valid SA phone number";
        valid = false;
    }

    // Message validation
    if (message.value.trim().length < 10) {
        messageError.textContent = "Message must be at least 10 characters";
        valid = false;
    }

    // success
    if (valid) {
        successMsg.textContent = "Message sent successfully!";
        this.reset();
    }
});