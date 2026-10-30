(() => {
  "use strict";

  const pages = {
    home: "design6web.html",
    restaurants: "exploreRestaurants.html",
    restaurant: "restaurant-details-menu.html",
    food: "food-details-customization.html",
    search: "search-filter-page.html",
    cart: "shopping-cart-page.html",
    checkout: "checkout-payemt-page.html",
    success: "order-successful-confirmation.html",
    tracking: "live-order-tracking.html",
    login: "login-signup-page.html",
    profile: "my-profile-account-setting-page.html",
    orders: "my-order-order-history-page.html",
    favourites: "my-favourites-page.html",
    addresses: "saved-address-address-management-page.html",
    offers: "offeres-coupan-page.html",
    support: "help-support-page.html"
  };

  const keys = {
    cart: "naurio.cart",
    favourites: "naurio.favourites",
    addresses: "naurio.addresses",
    coupon: "naurio.coupon",
    session: "naurio.demoSession",
    orders: "naurio.orders",
    selectedAddress: "naurio.selectedAddress"
  };

  const currentPage = decodeURIComponent(location.pathname.split("/").pop() || "");

  function read(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      console.error(`Unable to read NAURIO demo data "${key}".`, error);
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Unable to save NAURIO demo data "${key}".`, error);
      window.alert("Your browser could not save this demo data. Check its local storage settings.");
      return false;
    }
  }

  function hasStoredValue(key) {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Unable to check NAURIO demo data "${key}".`, error);
      return false;
    }
  }

  function textWithoutIcons(element) {
    const clone = element.cloneNode(true);
    clone.querySelectorAll(".material-symbols-outlined").forEach(icon => icon.remove());
    return (clone.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function routeForPath(path) {
    const routes = {
      home: pages.home,
      account: pages.login,
      "user-profile": pages.login,
      cart: pages.cart,
      "cart-and-checkout": pages.cart,
      "explore-menu": pages.restaurant,
      categories: pages.search,
      restaurants: pages.restaurants,
      "offers-and-deals": pages.offers,
      "live-tracking": pages.tracking,
      "order-tracking": pages.tracking,
      "artisan-pizzas": pages.restaurant,
      "gourmet-burgers": pages.restaurant,
      "street-chaat": pages.restaurant,
      "golden-samosas": pages.restaurant,
      "house-beverages": pages.restaurant,
      desserts: pages.restaurant,
      "coin-rewards": pages.offers,
      "naurio-coins-club": pages.offers,
      "our-kitchens": pages.restaurants,
      "about-us": pages.support,
      "culinary-philosophy": pages.support,
      careers: pages.support,
      media: pages.support,
      "terms-and-privacy": pages.support,
      "privacy-policy": pages.support,
      "terms-of-service": pages.support,
      "refund-cancellation": pages.support,
      "user-orders": pages.orders,
      "my-orders": pages.orders,
      favourites: pages.favourites,
      "saved-addresses": pages.addresses,
      support: pages.support,
      "help-and-support": pages.support,
      "explore-restaurants": pages.restaurants
    };
    return routes[path] || "";
  }

  function routeForText(text, element) {
    const icon = element?.querySelector(".material-symbols-outlined")?.textContent.trim() || "";
    if (icon === "tag") return pages.offers;
    if (icon === "work") return pages.support;
    if (/back to home|^home$|naurio brand/i.test(text)) return pages.home;
    if (/pinsa|truffle brioche|biryani pot|pistachio gelato|dan dan|woodfired pizza|smashed burgers|handcrafted pasta/.test(text)) return pages.food;
    if (/central ncr|\d+\s+kitchens|explore all/.test(text)) return pages.restaurants;
    if (/artisanal sourdough|smash wagyu|kyoto omakase|heritage dumplings|botanical smoothie|small-batch gelato|gourmet burgers|street chaat|golden samosas|house beverages|desserts/.test(text)) return pages.restaurant;
    if (/explore restaurants|continue shopping|partner kitchens|our kitchens|restaurants|restaurant/.test(text)) return pages.restaurants;
    if (/view menu|view kitchen|master menu|browse full menu|explore menu|full menu/.test(text)) return pages.restaurant;
    if (/food details|view dish|reserve dish|explore dishes|add to crave cart/.test(text)) return pages.food;
    if (/customization|^modify$/.test(text)) return /modify/.test(text) ? pages.cart : pages.food;
    if (/search|find bites|browse catalog/.test(text)) return pages.search;
    if (/cart|modify cart/.test(text)) return pages.cart;
    if (/checkout|proceed to/.test(text)) return pages.checkout;
    if (/track order|track active|live tracking/.test(text)) return pages.tracking;
    if (/my orders|order history|view my orders|orders/.test(text)) return pages.orders;
    if (/favourites|favorites|favourite foods|favourite restaurants/.test(text)) return pages.favourites;
    if (/saved addresses|delivery address|change address|address management/.test(text)) return pages.addresses;
    if (/offers|coupon|promo|deal|crave coins|redeem/.test(text)) return pages.offers;
    if (/help|support|concierge|contact/.test(text)) return pages.support;
    if (/chef partner|catering|sustainability|cold-chain|newsroom|press|media|careers|culinary philosophy|about us/.test(text)) return pages.support;
    if (/black membership|black tier|black perk/.test(text)) return pages.offers;
    if (/security compliance|terms of service|privacy policy|forgot password|password recovery/.test(text)) return /forgot password|password recovery/.test(text) ? pages.login : pages.support;
    if (/mygate|nobrokerhood|integration|learn more/.test(text)) return pages.support;
    if (/logout|log out/.test(text)) return pages.login;
    if (/account settings|manage account|edit profile/.test(text)) {
      return read(keys.session, null) ? pages.profile : pages.login;
    }
    if (/login|sign in|account|profile|register|create account/.test(text)) {
      return read(keys.session, null) ? pages.profile : pages.login;
    }
    if (/view details|view order/.test(text)) return pages.tracking;
    if (/^(privacy policy|terms of service|terms & privacy|fssai disclosures|security)$/.test(text)) {
      return pages.support;
    }
    if (element && element.closest("article, .restaurant-card, .food-card")) {
      return pages.food;
    }
    return "";
  }

  function wireLinks() {
    document.querySelectorAll("a[data-path]").forEach(link => {
      let destination = routeForPath(link.dataset.path);
      if (link.dataset.path === "user-profile" || link.dataset.path === "account") {
        destination = read(keys.session, null) ? pages.profile : pages.login;
      }
      if (destination) link.href = destination;
    });

    document.querySelectorAll('a[href="#"]').forEach(link => {
      if (link.closest("header nav") && link.dataset.path) return;
      const destination = routeForPath(link.dataset.path || "") || routeForText(textWithoutIcons(link), link);
      if (destination) link.href = destination;
    });
  }

  function getCart() {
    const cart = read(keys.cart, []);
    return Array.isArray(cart) ? cart : [];
  }

  function getFavourites() {
    const favourites = read(keys.favourites, []);
    return Array.isArray(favourites) ? favourites : [];
  }

  function formatMoney(value) {
    return `₹${Math.round(value).toLocaleString("en-IN")}`;
  }

  function moneyFromText(text) {
    const match = String(text).match(/₹\s*([\d,]+)/);
    return match ? Number(match[1].replace(/,/g, "")) : 0;
  }

  function productFrom(element) {
    if (currentPage === pages.food || currentPage === "foodDetails&Customization.html") {
      const title = document.querySelector("main h1")?.textContent.trim() || "Artisan Woodfired Truffle Crust";
      const price = moneyFromText(document.getElementById("base-price-display")?.textContent || "") || 349;
      const quantity = Number(document.getElementById("qty-value")?.textContent || 1);
      const image = document.querySelector("main img")?.src || "";
      return { id: title.toLowerCase(), title, price, quantity, image };
    }

    let card = element.closest("article");
    if (!card) {
      for (let parent = element.parentElement; parent && parent !== document.querySelector("main"); parent = parent.parentElement) {
        if (parent.querySelector("h2, h3, h4") && parent.querySelector("img") && /₹\s*[\d,]+/.test(parent.textContent)) {
          card = parent;
          break;
        }
      }
    }

    const title = card?.querySelector("h2, h3, h4")?.textContent.replace(/\s+/g, " ").trim()
      || "Artisan Woodfired Truffle Crust";
    const price = moneyFromText(card?.textContent || "") || 349;
    const image = card?.querySelector("img")?.src || "";
    return { id: title.toLowerCase(), title, price, quantity: 1, image };
  }

  function updateHeaderCart() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const total = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
    document.querySelectorAll('header a[data-path="cart-and-checkout"], header a[data-path="cart"]').forEach(link => {
      const label = link.querySelector("span:last-child");
      if (label) label.textContent = `Cart (${count}) • ${formatMoney(total)}`;
    });
  }

  function addToCart(item) {
    const cart = getCart();
    const existing = cart.find(entry => entry.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.push({ ...item });
    }
    if (!write(keys.cart, cart)) return false;
    updateHeaderCart();
    return true;
  }

  function getCartList() {
    const heading = [...document.querySelectorAll("main h2")].find(item => /Curated Items/.test(item.textContent));
    const panel = heading?.closest(".bg-surface-container-lowest");
    return panel?.querySelector(".divide-y") || null;
  }

  function seedCartFromMarkup(list) {
    const rows = [...list.querySelectorAll(":scope > div.py-5")];
    return rows.map((row, index) => {
      const title = row.querySelector("h4")?.textContent.replace(/\s+/g, " ").trim();
      const text = row.textContent;
      const unit = text.match(/(\d+)\s*[×x]\s*₹\s*([\d,]+)/i);
      const quantityButton = [...row.querySelectorAll("button")].find(button =>
        button.querySelector(".material-symbols-outlined")?.textContent.trim() === "remove"
      );
      const quantity = unit
        ? Number(unit[1])
        : Number(quantityButton?.parentElement.querySelector(":scope > span")?.textContent || 1);
      const eachPrice = moneyFromText(row.querySelector(".text-right span:nth-of-type(2)")?.textContent || "");
      const price = unit ? Number(unit[2].replace(/,/g, "")) : eachPrice || moneyFromText(text);
      return title ? {
        id: title.toLowerCase(),
        title,
        price,
        quantity,
        image: row.querySelector("img")?.src || "",
        seededIndex: index
      } : null;
    }).filter(Boolean);
  }

  function renderCart() {
    const list = getCartList();
    if (!list) return;

    let cart = getCart();
    if (!hasStoredValue(keys.cart)) {
      cart = seedCartFromMarkup(list);
      write(keys.cart, cart);
    }

    const template = list.querySelector(":scope > div.py-5");
    const panel = list.closest(".bg-surface-container-lowest");
    const countHeading = panel?.querySelector("h2");
    if (countHeading) countHeading.textContent = `Curated Items (${cart.length})`;
    list.replaceChildren();

    if (cart.length === 0) {
      const empty = document.createElement("p");
      empty.className = "py-8 text-center text-body-md text-on-surface-variant";
      empty.textContent = "Your cart is empty. Continue shopping to add something delicious.";
      list.append(empty);
    } else if (template) {
      cart.forEach((item, index) => {
        const row = template.cloneNode(true);
        row.dataset.cartIndex = String(index);
        row.hidden = false;
        const title = row.querySelector("h4");
        if (title) title.textContent = item.title;
        const image = row.querySelector("img");
        if (image && item.image) {
          image.src = item.image;
          image.alt = item.title;
        }
        const price = row.querySelector(".text-right .font-title-lg");
        if (price) price.textContent = formatMoney(item.price * item.quantity);
        const line = row.querySelector(".text-right span:nth-of-type(2)");
        if (line) line.textContent = `${formatMoney(item.price)} each`;

        const quantityButton = [...row.querySelectorAll("button")].find(button =>
          button.querySelector(".material-symbols-outlined")?.textContent.trim() === "remove"
        );
        const quantityBox = quantityButton?.parentElement;
        const quantityValue = quantityBox?.querySelector(":scope > span");
        if (quantityValue) quantityValue.textContent = String(item.quantity);

        [...row.querySelectorAll("button")].forEach(button => {
          const label = textWithoutIcons(button);
          const icon = button.querySelector(".material-symbols-outlined")?.textContent.trim() || "";
          if (label === "remove" && !icon) button.dataset.cartAction = "remove-item";
          else if (icon === "remove") button.dataset.cartAction = "decrease";
          else if (icon === "add") button.dataset.cartAction = "increase";
        });
        list.append(row);
      });
    }

    updateHeaderCart();
    const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    document.querySelectorAll("main span").forEach(span => {
      if (span.childElementCount === 0 && /Progress:/.test(span.textContent)) {
        span.textContent = span.textContent.replace(/₹[\d,]+/, formatMoney(total));
      }
    });
    updateCartSummary(cart);
  }

  function toggleFavourite(item, button) {
    const favourites = getFavourites();
    const index = favourites.findIndex(entry => entry.id === item.id);
    const removing = index >= 0 || button?.getAttribute("aria-label") === "Remove favourite";
    if (removing) {
      if (index >= 0) favourites.splice(index, 1);
    } else {
      favourites.push({ ...item, quantity: 1 });
    }
    if (!write(keys.favourites, favourites)) return;
    if (button) {
      const icon = button.querySelector(".material-symbols-outlined");
      if (icon) icon.textContent = removing ? "favorite_border" : "favorite";
    }
    if (removing && currentPage === pages.favourites) {
      button?.closest("article")?.remove();
      const count = document.querySelectorAll("main article").length;
      const tab = document.querySelector("#tab-foods span:last-child");
      if (tab) tab.textContent = `Favourite Foods (${count})`;
    }
  }

  function renderFavourites() {
    if (currentPage !== pages.favourites) return;
    const template = document.querySelector("main article");
    const grid = template?.parentElement;
    if (!template || !grid) return;
    const currentTitles = new Set([...grid.querySelectorAll("article h3")].map(heading => heading.textContent.trim().toLowerCase()));
    getFavourites().forEach(item => {
      if (currentTitles.has(item.title.toLowerCase())) return;
      const card = template.cloneNode(true);
      const title = card.querySelector("h3");
      if (title) title.textContent = item.title;
      const image = card.querySelector("img");
      if (image && item.image) {
        image.src = item.image;
        image.alt = item.title;
      }
      const price = card.querySelector(".font-headline-sm");
      if (price) price.textContent = formatMoney(item.price);
      const favouriteButton = card.querySelector('button[aria-label="Remove favourite"]');
      if (favouriteButton) favouriteButton.setAttribute("aria-label", "Remove favourite");
      grid.append(card);
      currentTitles.add(item.title.toLowerCase());
    });
    const count = grid.querySelectorAll("article").length;
    const tab = document.querySelector("#tab-foods span:last-child");
    if (tab) tab.textContent = `Favourite Foods (${count})`;
  }

  function renderCurrentOrder() {
    if (currentPage !== pages.orders) return;
    const order = read("naurio.currentOrder", null);
    if (!order) return;
    const orderId = [...document.querySelectorAll("main span")].find(span => /^Order #NAU-/.test(span.textContent.trim()));
    if (orderId) orderId.textContent = `Order #${order.id}`;
    const total = [...document.querySelectorAll("main span")].find(span => /^Total: ₹/.test(span.textContent.trim()));
    if (total) total.textContent = `Total: ${formatMoney(order.total)}`;
    const manifest = [...document.querySelectorAll("main p")].find(paragraph => /x .+,\s*\d+x/.test(paragraph.textContent));
    if (manifest && order.items?.length) {
      manifest.textContent = order.items.map(item => `${item.quantity}x ${item.title}`).join(", ");
    }
  }

  function applyCoupon(input, destination) {
    const code = (input?.value || "").trim().toUpperCase();
    const validCodes = ["NAURIO50", "FIRSTBITE", "FREEDEL", "WEEKEND20", "CRAVEFEAST", "BLACKVIP"];
    if (!validCodes.includes(code)) {
      window.alert(code ? "That demo coupon code is not valid." : "Enter a coupon code first.");
      return false;
    }
    if (!write(keys.coupon, { code, appliedAt: Date.now() })) return false;
    if (currentPage === pages.cart) renderCart();
    if (destination) location.href = destination;
    else window.alert(`${code} is saved for this demo order.`);
    return true;
  }

  function saveOrder() {
    const cart = getCart();
    const id = `NAU-${Date.now().toString().slice(-6)}`;
    const order = {
      id,
      items: cart,
      total: cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
      createdAt: new Date().toISOString(),
      status: "confirmed"
    };
    const storedOrders = read(keys.orders, []);
    const orders = Array.isArray(storedOrders) ? storedOrders : [];
    orders.unshift(order);
    if (!write(keys.orders, orders)) return false;
    if (!write(keys.cart, [])) return false;
    if (!write("naurio.currentOrder", order)) return false;
    return true;
  }

  function saveAddress() {
    const form = document.querySelector("#new-address-section form");
    const inputs = [...(form?.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"]') || [])]
      .filter(input => !input.readOnly && input.value.trim());
    const name = inputs[0]?.value.trim() || "Saved Address";
    const addressText = inputs.slice(2).map(input => input.value.trim()).join(", ") || "Sector 62, Noida";
    const storedAddresses = read(keys.addresses, []);
    const addresses = Array.isArray(storedAddresses) ? storedAddresses : [];
    const selected = { name, address: addressText, label: addressText };
    if (!addresses.some(address => address.label === addressText)) addresses.push({ ...selected, isDefault: addresses.length === 0 });
    return write(keys.addresses, addresses) && write(keys.selectedAddress, selected);
  }

  function renderSelectedAddress() {
    if (currentPage !== pages.checkout) return;
    const stored = read(keys.selectedAddress, null);
    if (!stored) return;
    const selected = typeof stored === "string" ? { name: "Saved Address", address: stored } : stored;
    const card = [...document.querySelectorAll("main .bg-surface-container-lowest")]
      .find(element => element.textContent.includes("Deliver Here"));
    const name = card?.querySelector(".font-title-md");
    const address = card?.querySelector("p");
    if (name && selected.name) name.textContent = selected.name;
    if (address && selected.address) address.textContent = selected.address;
  }

  function currentProductCard(element) {
    return element.closest("article") || element.closest(".bg-surface-container-lowest.rounded-3xl") || element.closest(".rounded-3xl");
  }

  function updateCartSummary(cart) {
    const summary = [...document.querySelectorAll("main h3")]
      .find(heading => heading.textContent.trim() === "Order Summary")
      ?.closest(".bg-surface-container-lowest");
    if (!summary) return;

    const items = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const subtotal = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
    const rows = [...summary.querySelectorAll(".flex.justify-between")];
    const rowByLabel = label => rows.find(row => row.textContent.includes(label));
    const moneyIn = element => Number(element?.textContent.match(/-?₹\s*([\d,]+)/)?.[1].replace(/,/g, "") || 0);
    const itemTotalRow = rowByLabel("Item Total");
    const itemTotalValue = itemTotalRow?.querySelector("span:last-child");
    const itemCount = [...summary.querySelectorAll("span")].find(span => /^\d+ Items?$/.test(span.textContent.trim()));
    if (itemTotalValue) itemTotalValue.textContent = formatMoney(subtotal);
    if (itemCount) itemCount.textContent = `${items} ${items === 1 ? "Item" : "Items"}`;

    const packaging = moneyIn(rowByLabel("Packaging"));
    const taxes = moneyIn(rowByLabel("Taxes"));
    const coupon = read(keys.coupon, null);
    let promoDiscount = moneyIn(rowByLabel("Promo"));
    if (coupon?.code) {
      const code = String(coupon.code).toUpperCase();
      promoDiscount = code === "FIRSTBITE" || code === "CRAVEFEAST" ? 150
        : code === "NAURIO50" ? 50
          : code === "WEEKEND20" ? Math.round(subtotal * 0.2)
            : code === "BLACKVIP" ? Math.round(subtotal * 0.15)
              : 0;
      const promoRow = rowByLabel("Promo");
      if (promoRow) {
        const label = promoRow.querySelector("span:first-child");
        const value = promoRow.querySelector("span:last-child");
        if (label) label.textContent = `Promo ${code}`;
        if (value) value.textContent = `-${formatMoney(promoDiscount)}`;
      }
    }

    const coinBox = summary.querySelector('input[type="checkbox"]');
    const coinDiscount = coinBox?.checked ? moneyIn(coinBox.closest(".p-3")) : 0;
    const total = Math.max(0, subtotal + packaging + taxes - promoDiscount - coinDiscount);
    const totalValue = summary.querySelector("div.border-t span.font-headline-md");
    if (totalValue) totalValue.textContent = formatMoney(total);
    const proceed = [...summary.querySelectorAll("button")].find(button => /Proceed to Checkout/.test(button.textContent));
    const proceedLabel = proceed?.querySelector("span:not(.material-symbols-outlined)");
    if (proceedLabel) proceedLabel.textContent = `Checkout (${formatMoney(total)})`;
  }

  function handleButton(button, event) {
    const text = textWithoutIcons(button);
    const icon = button.querySelector(".material-symbols-outlined")?.textContent.trim() || "";
    const card = currentProductCard(button);
    const item = productFrom(button);

    if (/logout|log out/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      try {
        localStorage.removeItem(keys.session);
      } catch (error) {
        console.error("Unable to clear the NAURIO demo session.", error);
        window.alert("Your browser could not clear the demo session.");
        return;
      }
      location.href = pages.login;
      return;
    }
    if (/add pairing/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!addToCart({ ...item, id: `pairing-${item.id}`, title: `Chef's Pairing: ${item.title}` })) return;
      location.href = pages.cart;
      return;
    }
    const addAction = button.id === "submit-cart-btn"
      || /add to crave cart|add to cart|reorder items|^reorder$/.test(text)
      || (/^(?:\+\s*)?add(?:\s*\+)?$/.test(text) && (!button.closest("[data-cart-index]") || currentPage !== pages.cart));
    if (addAction) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!addToCart(item)) return;
      if (currentPage === pages.cart) renderCart();
      else location.href = pages.cart;
      return;
    }
    if (/add trio bundle/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!addToCart({ id: "trio-bundle", title: "Artisan Trio Bundle", price: 799, quantity: 1, image: item.image })) return;
      location.href = pages.cart;
      return;
    }
    if (button.getAttribute("aria-label") === "Add to wishlist" || /favorite/.test(icon) || /remove favourite/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      toggleFavourite(item, button);
      return;
    }
    if (/clear cart/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!write(keys.cart, [])) return;
      renderCart();
      return;
    }
    if (text === "remove" && currentPage === pages.checkout) {
      event.preventDefault();
      event.stopImmediatePropagation();
      try {
        localStorage.removeItem(keys.coupon);
      } catch (error) {
        console.error("Unable to remove the NAURIO demo coupon.", error);
        window.alert("Your browser could not remove the demo coupon.");
        return;
      }
      button.parentElement?.remove();
      return;
    }
    if (button.dataset.cartAction) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const index = Number(button.closest("[data-cart-index]")?.dataset.cartIndex);
      const cart = getCart();
      if (button.dataset.cartAction === "remove-item") cart.splice(index, 1);
      else if (cart[index]) {
        cart[index].quantity += button.dataset.cartAction === "increase" ? 1 : -1;
        if (cart[index].quantity <= 0) cart.splice(index, 1);
      }
      if (!write(keys.cart, cart)) return;
      renderCart();
      return;
    }
    if (currentPage === pages.offers && /apply to cart|apply coupon|^apply$/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const code = card?.textContent.match(/\b(?:NAURIO50|FIRSTBITE|FREEDEL|WEEKEND20|CRAVEFEAST|BLACKVIP)\b/i)?.[0]
        || document.querySelector("#manualCouponInput")?.value.trim();
      if (code && ["NAURIO50", "FIRSTBITE", "FREEDEL", "WEEKEND20", "CRAVEFEAST", "BLACKVIP"].includes(code.toUpperCase())) {
        if (!write(keys.coupon, { code: code.toUpperCase(), appliedAt: Date.now() })) return;
        location.href = pages.cart;
      } else {
        window.alert("Choose a valid demo coupon first.");
      }
      return;
    }
    if ([pages.cart, pages.checkout].includes(currentPage) && /apply to cart|apply coupon/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const codeInput = document.querySelector("input[placeholder*='Promo'], input[placeholder*='Coupon'], #manualCouponInput");
      if (applyCoupon(codeInput, pages.cart)) return;
      return;
    }
    if (text === "apply" && currentPage === pages.cart) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const input = document.querySelector("input[placeholder*='Promo'], input[placeholder*='Coupon']");
      applyCoupon(input);
      return;
    }
    if (text === "apply" && currentPage === pages.checkout) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const input = document.querySelector("input[placeholder*='Promo'], input[placeholder*='Coupon']");
      applyCoupon(input);
      return;
    }
    if (/place order/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!saveOrder()) return;
      location.href = pages.success;
      return;
    }
    const paymentMethod = text.match(/(google pay|phonepe|paytm upi|cred pay)$/)?.[1];
    if (paymentMethod && currentPage === pages.checkout) {
      event.preventDefault();
      event.stopImmediatePropagation();
      document.querySelectorAll("main button").forEach(option => {
        if (textWithoutIcons(option).endsWith(paymentMethod)) {
          const selected = option === button;
          option.classList.toggle("ring-2", selected);
          option.classList.toggle("ring-primary", selected);
          option.setAttribute("aria-pressed", String(selected));
        }
      });
      if (!write("naurio.demoPaymentMethod", paymentMethod)) return;
      return;
    }
    if (/drop at security desk|leave with neighbor|beware of pet|call before arriving/.test(text) && currentPage === pages.checkout) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const selectedInstructions = read("naurio.deliveryInstructions", []);
      const values = Array.isArray(selectedInstructions) ? selectedInstructions : [];
      const index = values.indexOf(text);
      if (index >= 0) values.splice(index, 1);
      else values.push(text);
      if (!write("naurio.deliveryInstructions", values)) return;
      button.classList.toggle("ring-2", index < 0);
      button.classList.toggle("ring-primary", index < 0);
      button.setAttribute("aria-pressed", String(index < 0));
      return;
    }
    if (/show dynamic qr code/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.alert("Dynamic QR payments are not connected in this frontend demo.");
      return;
    }
    if (/^verified/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.alert("This UPI ID is marked as verified for the demo only.");
      return;
    }
    if (/load 5 earlier orders/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.alert("No earlier demo order records are available.");
      return;
    }
    if (/proceed to checkout/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      location.href = pages.checkout;
      return;
    }
    if (/edit address/.test(text) && currentPage === pages.addresses) {
      event.preventDefault();
      event.stopImmediatePropagation();
      document.getElementById("new-address-section")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (/select address|edit address|change address|add new delivery address/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      location.href = `${pages.addresses}?returnTo=${encodeURIComponent(currentPage === pages.checkout ? pages.checkout : "")}`;
      return;
    }
    if (/save address to dispatch ledger/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const form = document.querySelector("#new-address-section form");
      if (!form?.reportValidity()) return;
      if (!saveAddress()) return;
      location.href = pages.checkout;
      return;
    }
    if (/set as default/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const card = button.closest("article, section, .rounded-2xl, .rounded-3xl");
      const name = card?.querySelector("h3, h4")?.textContent.replace(/\s+/g, " ").trim() || "Saved Address";
      const address = [...(card?.querySelectorAll("p") || [])]
        .map(paragraph => paragraph.textContent.replace(/\s+/g, " ").trim())
        .find(value => /\d{4,}/.test(value) && !/^\+?91/.test(value)) || "";
      const label = address || name;
      const storedAddresses = read(keys.addresses, []);
      const addresses = Array.isArray(storedAddresses) ? storedAddresses : [];
      const selected = addresses.find(entry => entry.label === label) || { name, address, label };
      const updatedAddresses = [...addresses.filter(entry => entry.label !== label).map(entry => ({ ...entry, isDefault: false })), { ...selected, isDefault: true }];
      if (!write(keys.addresses, updatedAddresses) || !write(keys.selectedAddress, { ...selected, name, address })) return;
      if (new URLSearchParams(location.search).has("returnTo")) location.href = pages.checkout;
      else window.alert("Default delivery address updated for this demo.");
      return;
    }
    if (/track live order|track active order|track order/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      location.href = pages.tracking;
      return;
    }
    if (/view my orders|my orders|order history/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      location.href = pages.orders;
      return;
    }
    if (/continue shopping|add more items|explore restaurants|browse chef curations/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      location.href = pages.restaurants;
      return;
    }
    if (/view all|offers|coupon|redeem token/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      location.href = pages.offers;
      return;
    }
    if (/^(visibility|receipt_long)$/.test(icon) && currentPage === pages.orders) {
      event.preventDefault();
      event.stopImmediatePropagation();
      location.href = pages.tracking;
      return;
    }
    const destination = routeForText(text, button);
    if (destination && !button.form) {
      event.preventDefault();
      event.stopImmediatePropagation();
      location.href = destination;
      return;
    }
    if (/contact support|contact concierge|initiate chat|request call|report an issue|need help/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      location.href = pages.support;
      return;
    }
    if (/use current gps location|reposition pin/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.alert("Location selection is a frontend demo; GPS is not accessed.");
      return;
    }
    if (/search|find bites/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const input = button.closest("header")?.querySelector('input[type="text"]')
        || document.getElementById("main-crave-search");
      location.href = `${pages.search}?q=${encodeURIComponent(input?.value.trim() || "")}`;
      return;
    }
    if (/rate order|edit review/.test(text)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.alert("Order reviews are a frontend demo and are not submitted to a restaurant.");
      return;
    }
    if (/clear all filters|reset filters/.test(text) && currentPage === pages.search) {
      event.preventDefault();
      event.stopImmediatePropagation();
      document.querySelectorAll("main input[type='checkbox'], main input[type='radio']").forEach(input => {
        input.checked = false;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
      document.querySelectorAll("main select").forEach(select => {
        select.selectedIndex = 0;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      });
      const search = document.getElementById("main-crave-search");
      if (search) search.value = "";
      return;
    }
    if (/save changes/.test(text) && currentPage === pages.profile) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const profile = [...document.querySelectorAll("main input")].map(input => input.value.trim()).filter(Boolean);
      if (!write("naurio.demoProfile", profile)) return;
      window.alert("Profile details saved in this demo.");
      return;
    }
    if (text === "edit" || /edit profile/.test(text)) {
      const addressEdit = button.closest("main")?.textContent.includes("Delivery Address");
      if (addressEdit) {
        event.preventDefault();
        event.stopImmediatePropagation();
        location.href = pages.addresses;
      }
      return;
    }
    if (button.closest("header") && icon === "location_on") {
      event.preventDefault();
      event.stopImmediatePropagation();
      location.href = pages.addresses;
    }
    if (button.closest("header") && icon === "phone_iphone") {
      event.preventDefault();
      event.stopImmediatePropagation();
      location.href = pages.login;
    }
  }

  function handleSubmit(form, event) {
    if (/handleLoginSubmit/.test(form.getAttribute("onsubmit") || "")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const identifier = document.getElementById("login-identifier")?.value.trim();
      const otpMode = document.getElementById("otp-input-group") && !document.getElementById("otp-input-group").classList.contains("hidden");
      const password = document.getElementById("login-password")?.value;
      const otp = [...document.querySelectorAll(".otp-box")].map(input => input.value).join("");
      if (!identifier || (otpMode ? otp.length !== 6 : !password)) {
        window.alert(otpMode ? "Enter the 6-digit demo code to continue." : "Enter your email/phone and password to continue.");
        return;
      }
      if (!write(keys.session, { identifier, signedInAt: new Date().toISOString(), demo: true })) return;
      location.href = pages.profile;
      return;
    }
    if (/handleRegisterSubmit/.test(form.getAttribute("onsubmit") || "")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const identifier = form.querySelector('input[type="email"], input[type="tel"], input[type="text"]')?.value.trim();
      if (!form.reportValidity()) return;
      if (!write(keys.session, { identifier: identifier || "demo-customer", signedInAt: new Date().toISOString(), demo: true })) return;
      location.href = pages.profile;
      return;
    }
    if (currentPage === pages.addresses && form.closest("#new-address-section")) {
      event.preventDefault();
      if (!saveAddress()) return;
      location.href = pages.checkout;
      return;
    }
    if (currentPage === pages.profile) {
      event.preventDefault();
      window.alert("Profile details saved in this demo.");
    }
  }

  function handleCardNavigation(event) {
    if (event.defaultPrevented || event.target.closest("a, button, input, select, textarea")) return;
    const clickableLabel = (event.target.closest("[role='button'], .cursor-pointer")?.textContent || "").replace(/\s+/g, " ").trim();
    if (/add new delivery address/i.test(clickableLabel)) {
      event.preventDefault();
      location.href = `${pages.addresses}?returnTo=${encodeURIComponent(pages.checkout)}`;
      return;
    }
    if (!["exploreRestaurants.html", "search-filter-page.html", "restaurant-details-menu.html"].includes(currentPage)) return;
    const card = event.target.closest("article, .group, [class*='rounded-3xl']");
    if (!card || !card.querySelector("h2, h3, h4")) return;
    event.preventDefault();
    location.href = currentPage === "exploreRestaurants.html" && /view menu/i.test(card.textContent)
      ? pages.restaurant
      : pages.food;
  }

  function initializeSearch() {
    const query = new URLSearchParams(location.search).get("q") || "";
    const searchInputs = [...document.querySelectorAll('header input[type="text"], #main-crave-search')];
    searchInputs.forEach(input => {
      if (query && !input.value) input.value = query;
      input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          event.preventDefault();
          location.href = `${pages.search}?q=${encodeURIComponent(input.value.trim())}`;
        }
      });
    });
    document.querySelectorAll("form[role='search']").forEach(form => {
      form.addEventListener("submit", event => {
        event.preventDefault();
        const input = form.querySelector("input");
        location.href = `${pages.search}?q=${encodeURIComponent(input?.value.trim() || "")}`;
      });
      if (currentPage === pages.search) {
        const searchButton = [...document.querySelectorAll("main button")].find(button => /find bites|search/.test(textWithoutIcons(button)));
        searchButton?.addEventListener("click", event => {
          event.preventDefault();
          const input = document.getElementById("main-crave-search");
          location.href = `${pages.search}?q=${encodeURIComponent(input?.value.trim() || "")}`;
        });
      }
    });
  }

  function initializePageState() {
    wireLinks();
    initializeSearch();
    updateHeaderCart();
    renderCart();
    renderFavourites();
    renderCurrentOrder();
    renderSelectedAddress();

    const activePathByPage = {
      "design6web.html": "home",
      "exploreRestaurants.html": "restaurants",
      "restaurant-details-menu.html": "restaurants",
      "food-details-customization.html": "explore-menu",
      "foodDetails&Customization.html": "explore-menu",
      "search-filter-page.html": "categories",
      "offeres-coupan-page.html": "offers-and-deals",
      "shopping-cart-page.html": "cart-and-checkout",
      "checkout-payemt-page.html": "cart-and-checkout",
      "order-successful-confirmation.html": "cart-and-checkout",
      "live-order-tracking.html": "live-tracking",
      "login-signup-page.html": "user-profile",
      "my-favourites-page.html": "user-profile",
      "my-order-order-history-page.html": "user-profile",
      "my-profile-account-setting-page.html": "user-profile",
      "saved-address-address-management-page.html": "user-profile",
      "help-support-page.html": "user-profile"
    };
    document.querySelectorAll("header nav a[data-path]").forEach(link => {
      const activeClass = "px-3.5 py-1.5 transition-colors whitespace-nowrap bg-primary-container text-on-primary font-bold rounded-full";
      const normalClass = "px-3.5 py-1.5 rounded-full text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors whitespace-nowrap";
      if (link.dataset.path === activePathByPage[currentPage]) {
        link.className = activeClass;
        link.setAttribute("aria-current", "page");
      } else {
        link.className = normalClass;
        link.removeAttribute("aria-current");
      }
    });

    const coinToggle = [...document.querySelectorAll("main input[type='checkbox']")]
      .find(input => input.closest(".p-3")?.textContent.includes("Naurio Coins"));
    coinToggle?.addEventListener("change", () => updateCartSummary(getCart()));

    if (currentPage === pages.success) {
      const order = read("naurio.currentOrder", null);
      const orderId = document.getElementById("order-id-val");
      if (order && orderId) orderId.textContent = `#${order.id}`;
    }
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (button) {
      handleButton(button, event);
      return;
    }
    const link = event.target.closest("a");
    if (link && /logout|log out/.test(textWithoutIcons(link))) {
      event.preventDefault();
      event.stopImmediatePropagation();
      try {
        localStorage.removeItem(keys.session);
      } catch (error) {
        console.error("Unable to clear the NAURIO demo session.", error);
        window.alert("Your browser could not clear the demo session.");
        return;
      }
      location.href = pages.login;
      return;
    }
    handleCardNavigation(event);
  }, true);

  document.addEventListener("submit", event => {
    if (event.target instanceof HTMLFormElement) handleSubmit(event.target, event);
  }, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePageState, { once: true });
  } else {
    initializePageState();
  }
})();
