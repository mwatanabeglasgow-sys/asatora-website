/* ============================================================
   ASATORA — behaviour
   Cart drawer (AJAX, focus-trap, Esc) · header scroll · hero
   choreography · scroll reveals · Klaviyo signup · analytics.
   Vanilla, no framework. Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- analytics helper (Plausible + Shopify-agnostic) §14 ---- */
  function track(name, props) {
    try { if (window.plausible) window.plausible(name, props ? { props: props } : undefined); } catch (e) {}
    window.dispatchEvent(new CustomEvent("asatora:" + name, { detail: props || {} }));
  }
  window.AsatoraTrack = track;

  /* ---- money formatting (uses theme setting injected on window) ---- */
  function money(cents) {
    var fmt = window.AsatoraMoneyFormat || "¥{{amount_no_decimals}}";
    var amount = Math.round(cents / 100);
    return fmt.replace(/\{\{\s*amount_no_decimals\s*\}\}/, amount.toLocaleString());
  }

  /* ============================================================
     Header: transparent over hero → condensed solid on scroll §9
     ============================================================ */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      var past = window.scrollY > 24;
      header.classList.toggle("is-condensed", past);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* mobile nav toggle */
  var menuBtn = document.querySelector("[data-menu-open]");
  var mobileNav = document.querySelector("[data-mobile-nav]");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      var open = mobileNav.hasAttribute("hidden");
      if (open) { mobileNav.removeAttribute("hidden"); } else { mobileNav.setAttribute("hidden", ""); }
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", function (e) {
      if (!mobileNav.hasAttribute("hidden") && !e.target.closest("[data-mobile-nav]") && !e.target.closest("[data-menu-open]")) {
        mobileNav.setAttribute("hidden", ""); menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* announcement bar dismiss */
  var announce = document.querySelector("[data-announce]");
  if (announce) {
    var key = "asatora-announce-dismissed";
    if (sessionStorage.getItem(key)) announce.remove();
    var close = announce.querySelector("[data-announce-close]");
    if (close) close.addEventListener("click", function () { sessionStorage.setItem(key, "1"); announce.remove(); });
  }

  /* ============================================================
     Hero orchestrated load + seal press §8
     ============================================================ */
  var hero = document.querySelector("[data-load]");
  if (hero) {
    if (REDUCED) { hero.classList.add("is-ready"); }
    else { requestAnimationFrame(function () { setTimeout(function () { hero.classList.add("is-ready"); }, 80); }); }
  }

  /* ============================================================
     Scroll reveals §8 (once, gentle)
     ============================================================ */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (REDUCED || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ============================================================
     Cart drawer §9 — focus trap, Esc, backdrop, AJAX
     ============================================================ */
  var drawer = document.querySelector("[data-cart-drawer]");
  var overlay = document.querySelector("[data-overlay]");
  var lastFocused = null;

  function focusables(scope) {
    return Array.prototype.slice.call(scope.querySelectorAll(
      'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])'
    )).filter(function (el) { return el.offsetParent !== null; });
  }
  function trap(e) {
    if (e.key === "Escape") { closeCart(); return; }
    if (e.key !== "Tab" || !drawer) return;
    var f = focusables(drawer); if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function openCart() {
    if (!drawer) return;
    lastFocused = document.activeElement;
    drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden", "false");
    if (overlay) overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", trap);
    var f = focusables(drawer); if (f.length) f[0].focus();
    track("view_cart");
  }
  function closeCart() {
    if (!drawer) return;
    drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden", "true");
    if (overlay) overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", trap);
    if (lastFocused) lastFocused.focus();
  }
  window.AsatoraCart = { open: openCart, close: closeCart };

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-cart-open]")) { e.preventDefault(); openCart(); }
    if (e.target.closest("[data-cart-close]")) { e.preventDefault(); closeCart(); }
  });
  if (overlay) overlay.addEventListener("click", closeCart);

  /* ---- render cart from Shopify /cart.js ---- */
  function renderCart(cart) {
    var countEls = document.querySelectorAll("[data-cart-count]");
    countEls.forEach(function (el) { el.textContent = cart.item_count; el.setAttribute("data-count", cart.item_count); });
    if (!drawer) return;
    var itemsEl = drawer.querySelector("[data-cart-items]");
    var footEl = drawer.querySelector("[data-cart-foot]");
    if (cart.item_count === 0) {
      itemsEl.innerHTML = '<div class="drawer__empty"><p class="lede" data-i18n="cart.empty">Your cart is quiet.</p>' +
        '<p style="margin-top:1rem"><a class="textlink" href="/collections/all" data-i18n="cart.shop">Shop matcha</a></p></div>';
      if (footEl) footEl.hidden = true;
      return;
    }
    if (footEl) footEl.hidden = false;
    itemsEl.innerHTML = cart.items.map(function (it) {
      return '<div class="line" data-key="' + it.key + '">' +
        '<img src="' + (it.image ? it.image.replace(/(\.[a-z]+)(\?|$)/i, "_160x$1$2") : "") + '" alt="" loading="lazy">' +
        '<div><div class="line__title">' + it.product_title + '</div>' +
        '<div class="small" style="color:var(--text-soft)">' + (it.variant_title || "") + '</div>' +
        '<div class="qty" style="margin-top:.5rem">' +
          '<button type="button" data-qty-down aria-label="Decrease quantity">–</button>' +
          '<input type="text" inputmode="numeric" value="' + it.quantity + '" data-qty aria-label="Quantity">' +
          '<button type="button" data-qty-up aria-label="Increase quantity">+</button>' +
        '</div></div>' +
        '<div style="text-align:right"><div>' + money(it.final_line_price) + '</div>' +
        '<button class="line__remove" type="button" data-remove data-i18n="cart.remove">Remove</button></div>' +
      '</div>';
    }).join("");
    var subEl = drawer.querySelector("[data-cart-subtotal]");
    if (subEl) subEl.textContent = money(cart.total_price);
  }

  function fetchCart() {
    return fetch("/cart.js", { headers: { "Accept": "application/json" } })
      .then(function (r) { return r.json(); }).then(function (c) { renderCart(c); return c; });
  }

  function changeLine(key, quantity) {
    return fetch("/cart/change.js", {
      method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ id: key, quantity: quantity })
    }).then(function (r) { return r.json(); }).then(function (c) { renderCart(c); return c; });
  }

  if (drawer) {
    drawer.addEventListener("click", function (e) {
      var line = e.target.closest(".line"); if (!line) return;
      var key = line.getAttribute("data-key");
      var input = line.querySelector("[data-qty]");
      if (e.target.closest("[data-remove]")) { changeLine(key, 0); track("remove_from_cart"); }
      else if (e.target.closest("[data-qty-up]")) { changeLine(key, parseInt(input.value, 10) + 1); }
      else if (e.target.closest("[data-qty-down]")) { changeLine(key, Math.max(0, parseInt(input.value, 10) - 1)); }
    });
    drawer.addEventListener("change", function (e) {
      if (e.target.matches("[data-qty]")) {
        var line = e.target.closest(".line");
        changeLine(line.getAttribute("data-key"), Math.max(0, parseInt(e.target.value, 10) || 0));
      }
    });
  }

  /* ============================================================
     Add to cart — never full reload §10
     ============================================================ */
  document.addEventListener("submit", function (e) {
    var form = e.target.closest("[data-add-to-cart]");
    if (!form) return;
    e.preventDefault();
    var btn = form.querySelector('[type="submit"]');
    if (btn) { btn.classList.add("is-loading"); btn.setAttribute("aria-disabled", "true"); }
    fetch("/cart/add.js", {
      method: "POST", headers: { "Accept": "application/json" }, body: new FormData(form)
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok) throw res.d;
        track("add_to_cart", { id: res.d.product_id, title: res.d.product_title });
        return fetchCart();
      })
      .then(function () { openCart(); })
      .catch(function (err) {
        var msg = form.querySelector("[data-add-error]");
        if (msg) { msg.textContent = (err && err.description) || "Could not add to cart."; msg.hidden = false; }
      })
      .finally(function () {
        if (btn) { btn.classList.remove("is-loading"); btn.removeAttribute("aria-disabled"); }
      });
  });

  /* ============================================================
     PDP: gallery + sticky mobile ATC §11
     ============================================================ */
  var gallery = document.querySelector("[data-gallery]");
  if (gallery) {
    var mainImg = gallery.querySelector("[data-gallery-main] img");
    gallery.addEventListener("click", function (e) {
      var thumb = e.target.closest("[data-thumb]"); if (!thumb || !mainImg) return;
      mainImg.src = thumb.getAttribute("data-src");
      mainImg.alt = thumb.querySelector("img") ? thumb.querySelector("img").alt : "";
      gallery.querySelectorAll("[data-thumb]").forEach(function (t) { t.setAttribute("aria-current", "false"); });
      thumb.setAttribute("aria-current", "true");
    });
  }
  var stickyAtc = document.querySelector("[data-sticky-atc]");
  var buyBlock = document.querySelector("[data-buy]");
  if (stickyAtc && buyBlock && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      stickyAtc.classList.toggle("is-shown", !entries[0].isIntersecting);
    }, { rootMargin: "-80% 0px 0px 0px" }).observe(buyBlock);
  }

  /* ---- generic qty steppers outside the cart drawer (PDP) ---- */
  document.addEventListener("click", function (e) {
    var stepper = e.target.closest(".qty");
    if (!stepper || stepper.closest("[data-cart-drawer]")) return;
    var input = stepper.querySelector("[data-qty]");
    if (!input) return;
    var val = parseInt(input.value, 10) || 1;
    if (e.target.closest("[data-qty-up]")) input.value = val + 1;
    else if (e.target.closest("[data-qty-down]")) input.value = Math.max(1, val - 1);
  });

  /* ============================================================
     PDP variant selection — update hidden id, price, availability
     ============================================================ */
  var pdpForm = document.getElementById("pdp-form");
  if (pdpForm && window.AsatoraVariants) {
    var idInput = pdpForm.querySelector('input[name="id"]');
    var priceEl = document.querySelector("[data-price]");
    var stickyPrice = document.querySelector("[data-sticky-atc] .price");
    pdpForm.addEventListener("change", function (e) {
      if (!e.target.matches("select")) return;
      var chosen = Array.prototype.map.call(pdpForm.querySelectorAll("select"), function (s) { return s.value; });
      var match = window.AsatoraVariants.find(function (v) { return v.options.join("~~") === chosen.join("~~"); });
      if (!match) return;
      idInput.value = match.id;
      if (priceEl) priceEl.textContent = money(match.price);
      if (stickyPrice) stickyPrice.textContent = money(match.price);
      var submit = pdpForm.querySelector('[type="submit"] .btn__label') || pdpForm.querySelector('[type="submit"]');
      pdpForm.querySelectorAll('[type="submit"]').forEach(function (b) { b.disabled = !match.available; });
    });
  }

  /* ============================================================
     "The Mountain Letter" — Klaviyo subscribe §11 §13
     ============================================================ */
  document.addEventListener("submit", function (e) {
    var form = e.target.closest("[data-letter]");
    if (!form) return;
    e.preventDefault();
    var email = form.querySelector('input[type="email"]');
    var msg = form.parentElement.querySelector("[data-letter-msg]");
    var listId = form.getAttribute("data-klaviyo-list");
    var company = form.getAttribute("data-klaviyo-company");
    if (msg) { msg.className = "letter__msg"; msg.textContent = ""; }
    if (!email || !email.checkValidity()) {
      if (msg) { msg.classList.add("is-error"); msg.textContent = form.getAttribute("data-err") || "Enter a valid email."; }
      return;
    }
    var btn = form.querySelector('[type="submit"]');
    if (btn) btn.classList.add("is-loading");

    // Klaviyo Client API (requires public company id). PLACEHOLDER list/company injected via theme settings.
    var done = function (ok) {
      if (btn) btn.classList.remove("is-loading");
      if (msg) {
        msg.classList.add(ok ? "is-ok" : "is-error");
        msg.textContent = ok ? (form.getAttribute("data-ok") || "Welcome to the mountain.")
                             : (form.getAttribute("data-err2") || "Something went wrong. Try again.");
      }
      if (ok) { form.reset(); track("email_signup", { source: "mountain_letter" }); }
    };

    if (!company || !listId || company.indexOf("PLACEHOLDER") === 0) {
      // No Klaviyo creds yet — succeed locally so the UX is testable; flag in console.
      console.warn("[Asatora] Klaviyo company/list not configured — email not sent. Set in theme settings.");
      done(true); return;
    }
    fetch("https://a.klaviyo.com/client/subscriptions/?company_id=" + encodeURIComponent(company), {
      method: "POST",
      headers: { "Content-Type": "application/json", "revision": "2024-10-15" },
      body: JSON.stringify({
        data: { type: "subscription", attributes: {
          profile: { data: { type: "profile", attributes: { email: email.value } } }
        }, relationships: { list: { data: { type: "list", id: listId } } } }
      })
    }).then(function (r) { done(r.ok || r.status === 202); }).catch(function () { done(false); });
  });

  /* begin_checkout §14 — fires before Shopify's native checkout takes over */
  document.addEventListener("click", function (e) {
    if (e.target.closest('button[name="checkout"]')) track("begin_checkout");
  });

  /* initial cart paint */
  fetchCart();
})();
