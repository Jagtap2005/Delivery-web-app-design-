(function () {
    "use strict";

    const routes = {
        home: "design1web.html",
        "all-menu-categories": "menu-page.html",
        "curated-menu": "menu-page.html",
        "chefs-specials": "menu-page.html",
        "organic-bowls": "menu-page.html",
        "wood-fired-pizza": "menu-page.html",
        "artisan-bakery": "menu-page.html",
        "gourmet-desserts": "menu-page.html",
        "explore-restaurants": "explore-restaurants-page.html",
        "search": "search-filter-page.html",
        "search-and-filters": "search-filter-page.html",
        "food-details": "food-details-custmiz-page.html",
        "favorites": "fvt-food-page.html",
        "deals-and-offers": "offers-coupans-page.html",
        "offers-vault": "offers-coupans-page.html",
        "offers-and-vault": "offers-coupans-page.html",
        "login": "customer-login-page.html",
        "user-profile": "my-profile-page.html",
        "my-orders": "my-order-page.html",
        "saved-addresses": "save-manage-address-page.html",
        "cart-and-checkout": "shopping-cart-page.html",
        "naurio---curated-menu": "menu-page.html",
        "naurio---explore-restaurants": "explore-restaurants-page.html",
        "naurio---shopping-cart": "shopping-cart-page.html",
        "order-success": "order-confirmation-page.html",
        "order-tracking": "order-tracking-page.html",
        "our-chefs": "explore-restaurants-page.html",
        "rare-harvests": "menu-page.html",
        "tasting-cellars": "menu-page.html",
        "dietary-standards": "search-filter-page.html"
    };

    const storageKeys = {
        cart: "naurio-demo-cart",
        favourites: "naurio-demo-favourites",
        order: "naurio-demo-order"
    };

    const searchFilterState = {
        cuisine: "",
        budget: null,
        rating: false,
        fast: false,
        voucher: false
    };

    const categoryNavigation = [
        { path: "explore-restaurants", label: "Explore Restaurants", route: "explore-restaurants-page.html" },
        { path: "curated-menu", label: "Menu", route: "menu-page.html" },
        { path: "search-and-filters", label: "Search", route: "search-filter-page.html" },
        { path: "deals-and-offers", label: "Offers", route: "offers-coupans-page.html" },
        { path: "my-orders", label: "My Orders", route: "my-order-page.html" },
        { path: "favorites", label: "Favourites", route: "fvt-food-page.html" },
        { path: "saved-addresses", label: "Saved Addresses", route: "save-manage-address-page.html" },
        { path: "order-tracking", label: "Order Tracking", route: "order-tracking-page.html" }
    ];

    function activeCategoryForPage() {
        const page = window.location.pathname.split("/").pop();
        if (page === "design1web.html" || page === "explore-restaurants-page.html" ||
            page === "restaurants-detalis-page.html") return "explore-restaurants";
        if (page === "food-details-custmiz-page.html" || page === "menu-page.html") return "curated-menu";
        if (page === "search-filter-page.html") return "search-and-filters";
        if (page === "offers-coupans-page.html") return "deals-and-offers";
        if (page === "my-order-page.html") return "my-orders";
        if (page === "fvt-food-page.html") return "favorites";
        if (page === "save-manage-address-page.html") return "saved-addresses";
        if (page === "order-tracking-page.html") return "order-tracking";
        return "";
    }

    function createCategoryNavigation() {
        const nav = document.createElement("nav");
        nav.setAttribute("aria-label", "Main categories");
        nav.className = "flex items-center gap-space-xs overflow-x-auto h-11 whitespace-nowrap no-scrollbar";

        const activePath = activeCategoryForPage();
        categoryNavigation.forEach((item) => {
            const link = document.createElement("a");
            link.href = item.route;
            link.dataset.path = item.path;
            link.textContent = item.label;
            link.className = item.path === activePath
                ? "px-3 py-space-xs font-label-md text-label-md bg-primary-container text-on-primary font-bold rounded-full transition-colors whitespace-nowrap"
                : "px-3 py-space-xs font-label-md text-label-md text-on-surface-variant hover:text-on-surface rounded-full transition-colors whitespace-nowrap";
            if (item.path === activePath) link.setAttribute("aria-current", "page");
            nav.append(link);
        });
        return nav;
    }

    function createSharedHeader() {
        const header = document.createElement("header");
        header.className = "fixed top-0 w-full z-50 bg-surface/95 backdrop-blur-xl border-b border-surface-container-highest shadow-[0_1px_8px_rgba(0,0,0,0.04)]";
        header.innerHTML = `
            <div class="w-full border-b border-surface-container bg-surface-container-low/60">
                <div class="max-w-7xl mx-auto px-margin lg:px-margin-lg min-h-9 flex flex-wrap items-center justify-between gap-x-space-md gap-y-space-xs py-1 font-body-sm text-body-sm text-on-surface-variant">
                    <div class="flex items-center gap-space-md">
                        <div class="flex items-center gap-space-xs text-on-surface">
                            <span class="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                            <span class="font-label-md text-label-md">Deliver to:</span>
                            <span class="font-body-md text-body-md font-semibold text-on-surface">247 Maple Avenue, Central District</span>
                        </div>
                        <span class="hidden sm:flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-secondary/10 text-secondary font-label-caps text-label-caps">
                            <span class="material-symbols-outlined text-[14px]">schedule</span>15-25 Mins
                        </span>
                    </div>
                    <a class="hover:text-on-surface transition-colors" href="my-profile-page.html">Help &amp; Support</a>
                </div>
            </div>
            <div class="w-full border-b border-surface-container-highest bg-surface">
                <div class="max-w-7xl mx-auto px-margin lg:px-margin-lg min-h-20 flex flex-wrap items-center justify-between gap-space-md py-space-sm">
                    <a class="flex flex-col shrink-0" href="design1web.html" aria-label="NAURIO home">
                        <span class="font-display-hero text-headline-sm text-primary tracking-tight font-bold leading-none">NAURIO</span>
                        <span class="font-label-caps text-[9px] uppercase tracking-widest text-on-tertiary-container">Haute Cuisine</span>
                    </a>
                    <div class="relative order-3 w-full md:order-none md:w-auto md:flex-1 md:max-w-2xl">
                        <div class="flex items-center bg-surface-container-lowest rounded-full p-1 border border-surface-container-highest shadow-[0_2px_12px_rgba(23,41,35,0.04)] focus-within:border-primary transition-all">
                            <button class="flex items-center gap-space-xs px-space-md py-space-xs text-on-surface-variant font-label-md text-label-md shrink-0 hover:text-on-surface border-r border-surface-container-highest" type="button" aria-label="Browse menu">
                                <span>Menu</span><span class="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
                            </button>
                            <div class="flex items-center flex-1 min-w-0 px-space-md gap-space-xs">
                                <span class="material-symbols-outlined text-outline text-[18px]">search</span>
                                <input class="w-full min-w-0 bg-transparent border-0 outline-none text-on-surface font-body-md text-body-md placeholder:text-outline" placeholder="Search dishes and restaurants..." type="text" aria-label="Search dishes and restaurants">
                            </div>
                            <button class="px-space-lg py-2.5 bg-secondary-container hover:bg-secondary text-on-primary font-label-md text-label-md rounded-full shadow-[0_4px_12px_rgba(244,119,53,0.25)] flex items-center gap-space-xs transition-all shrink-0" type="button">
                                <span>Search</span><span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center gap-space-sm sm:gap-space-md shrink-0">
                        <span class="hidden lg:flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-tertiary-fixed/40 border border-tertiary-fixed-dim/60 text-on-tertiary-fixed">
                            <span class="material-symbols-outlined text-[18px] text-on-tertiary-container">monetization_on</span>
                            <span class="font-label-caps text-label-caps tracking-wider">1,450 COINS</span>
                        </span>
                        <a class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" data-path="favorites" href="fvt-food-page.html" aria-label="Favourites">
                            <span class="material-symbols-outlined text-[20px]">favorite</span>
                        </a>
                        <a class="flex items-center gap-space-xs px-space-sm py-1 rounded-full hover:bg-surface-container text-on-surface transition-colors" href="customer-login-page.html">
                            <span class="material-symbols-outlined text-[20px] text-on-surface-variant">person</span>
                            <span class="font-label-md text-label-md">Sign In</span>
                        </a>
                        <button class="flex items-center gap-space-sm pl-space-md sm:pl-space-lg pr-space-sm py-2 rounded-full bg-primary-container text-on-primary shadow-[0_8px_20px_rgba(23,41,35,0.15)] hover:bg-primary transition-all" type="button" aria-label="Shopping cart">
                            <span class="material-symbols-outlined text-[18px]">shopping_bag</span>
                            <span class="font-title-md text-title-md tracking-tight">$48.50</span>
                            <span class="flex items-center justify-center bg-secondary-container text-on-primary font-label-caps text-label-caps w-6 h-6 rounded-full">3</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="w-full bg-surface-container-low border-b border-surface-container-highest">
                <div data-category-nav-container class="max-w-7xl mx-auto px-margin lg:px-margin-lg h-11 flex items-center"></div>
            </div>`;

        const navContainer = header.querySelector("[data-category-nav-container]");
        navContainer.append(createCategoryNavigation());

        document.querySelectorAll("header").forEach((existingHeader) => existingHeader.remove());
        document.body.insertBefore(header, document.body.firstChild);

        const updateMainOffset = () => {
            const headerHeight = header.offsetHeight;
            document.querySelectorAll("main").forEach((main) => {
                main.style.paddingTop = `${headerHeight}px`;
                if (main.closest(".min-h-screen")) {
                    main.style.minHeight = `calc(100vh - ${headerHeight}px)`;
                }
            });
        };
        updateMainOffset();
        window.addEventListener("load", updateMainOffset, { once: true });
        window.addEventListener("resize", updateMainOffset);
        window.requestAnimationFrame(updateMainOffset);
        if ("ResizeObserver" in window) {
            new ResizeObserver(updateMainOffset).observe(header);
        }
    }

    function readStorage(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : JSON.parse(value);
        } catch (error) {
            console.error(`Unable to read NAURIO demo data (${key}).`, error);
            return fallback;
        }
    }

    function writeStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Unable to save NAURIO demo data (${key}).`, error);
            return false;
        }
    }

    function routeTo(file, params) {
        const url = new URL(file, window.location.href);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value) {
                    url.searchParams.set(key, value);
                }
            });
        }
        window.location.href = url.href;
    }

    function normalize(value) {
        return (value || "").replace(/\s+/g, " ").trim().toLowerCase();
    }

    function routeForLink(link) {
        const path = normalize(link.dataset.path);
        if (routes[path]) {
            return routes[path];
        }

        const label = normalize(link.innerText || link.getAttribute("aria-label"));
        if (/^(home|home page|naurio haute cuisine|naurio)$/.test(label)) return routes.home;
        if (/search/.test(label)) return routes.search;
        if (/explore all .*partner|explore restaurants|partner restaurants|partner ateliers|view restaurant/.test(label)) {
            return /view restaurant/.test(label) ? "restaurants-detalis-page.html" : routes["explore-restaurants"];
        }
        if (/view all .*restaurant|view all .*partner/.test(label)) return routes["explore-restaurants"];
        if (/view details|view dish|dish details/.test(label)) return routes["food-details"];
        if (/^view all\b/.test(label)) return routes["curated-menu"];
        if (/^(restaurant|award_star)$/.test(label)) return routes["explore-restaurants"];
        if (/curated menu|chef.?s specials|menu|wood-fired|organic bowls|gourmet dessert|artisan bakery/.test(label)) {
            return routes["curated-menu"];
        }
        if (/favorite/.test(label)) return routes.favorites;
        if (/offer|deal|coupon|vault/.test(label)) return routes["deals-and-offers"];
        if (/track|courier/.test(label)) return routes["order-tracking"];
        if (/^(order history|my orders)$/.test(label)) return "my-order-page.html";
        if (/my account|my profile/.test(label)) return routes["user-profile"];
        if (/sign in|login/.test(label)) return routes.login;
        if (/cart|bag|checkout/.test(label)) return routes["cart-and-checkout"];
        if (/concierge|help|support|faq/.test(label)) return null;
        if (/master chefs|michelin collaborations/.test(label)) return routes["explore-restaurants"];
        if (/dietary|allergen/.test(label)) return routes["dietary-standards"];
        if (link.closest("article")) return "restaurants-detalis-page.html";
        return null;
    }

    function connectLinks() {
        document.querySelectorAll('a[href="#"]').forEach((link) => {
            const destination = routeForLink(link);
            if (destination) {
                link.href = destination;
            }
        });

        document.querySelectorAll("header").forEach((header) => {
            const brand = Array.from(header.querySelectorAll("span, h1, div"))
                .find((element) => element.children.length <= 2 && normalize(element.textContent) === "naurio");
            if (brand && !brand.closest("a")) {
                const link = document.createElement("a");
                link.href = routes.home;
                link.setAttribute("aria-label", "NAURIO home");
                brand.parentNode.insertBefore(link, brand);
                link.append(brand);
            }

            const signInLabel = Array.from(header.querySelectorAll("span"))
                .find((element) => /^(sign in|log in|profile)$/.test(normalize(element.textContent)));
            const signIn = signInLabel && signInLabel.parentElement;
            if (signIn && !signIn.closest("a") && signIn.tagName !== "BUTTON") {
                signIn.setAttribute("role", "link");
                signIn.setAttribute("tabindex", "0");
                signIn.addEventListener("click", () => routeTo(routes.login));
                signIn.addEventListener("keydown", (event) => {
                    if (event.key === "Enter" || event.key === " ") routeTo(routes.login);
                });
            }

            const cartControl = Array.from(header.querySelectorAll("button"))
                .find((element) => element.querySelector(".rounded-full") && /[$₹]\s*[\d,.]+/.test(element.textContent));
            if (cartControl) {
                cartControl.setAttribute("aria-label", "Shopping cart");
                cartControl.addEventListener("click", () => routeTo(routes["cart-and-checkout"]));
            }
        });
    }

    function readProduct(button) {
        const card = button.closest("article, .group, .menu-item, [data-product]");
        const source = card || document.querySelector("main");
        const heading = source && source.querySelector("h1, h2, h3, h4");
        const name = heading ? heading.textContent.replace(/\s+/g, " ").trim() : "NAURIO menu selection";
        const priceText = source ? source.innerText.match(/([₹$])\s*([\d,]+(?:\.\d{1,2})?)/) : null;
        let quantity = 1;
        let unitPrice = priceText ? Number(priceText[2].replace(/,/g, "")) : 0;
        let currency = priceText ? priceText[1] : "₹";
        let customizations = "";

        if (document.getElementById("dyn-quantity")) {
            quantity = Math.max(1, Number(document.getElementById("dyn-quantity").textContent) || 1);
            const totalText = document.getElementById("dyn-cta-price") || document.getElementById("dyn-total-price");
            const total = totalText && totalText.textContent.match(/([\d,]+(?:\.\d{1,2})?)/);
            if (total) unitPrice = Number(total[1].replace(/,/g, "")) / quantity;
            if (totalText && /[$₹]/.test(totalText.textContent)) currency = totalText.textContent.match(/[$₹]/)[0];
            const selectedOptions = Array.from(document.querySelectorAll(
                ".size-card.bg-primary-container, .crust-pill.bg-primary-container, .spice-pill.bg-secondary-container"
            )).map((option) => option.textContent.replace(/\s+/g, " ").trim());
            const selectedToppings = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                .map((input) => (input.closest("label") || input.parentElement).textContent.replace(/\s+/g, " ").trim());
            customizations = [...selectedOptions, ...selectedToppings].join(", ");
            const notes = document.getElementById("prep-notes");
            if (notes && notes.value.trim()) customizations += `${customizations ? " • " : ""}${notes.value.trim()}`;
        }

        return {
            id: `site-item-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            name,
            quantity,
            price: unitPrice,
            currency,
            customizations
        };
    }

    function addToCart(item) {
        const cart = readStorage(storageKeys.cart, []);
        const existing = cart.find((entry) => entry.id === item.id &&
            entry.customizations === item.customizations && (entry.currency || "₹") === item.currency);
        if (existing) {
            existing.quantity += item.quantity;
        } else {
            cart.push(item);
        }
        writeStorage(storageKeys.cart, cart);
    }

    function setFavourite(item, shouldSave) {
        const favourites = readStorage(storageKeys.favourites, []);
        const index = favourites.findIndex((entry) => entry.id === item.id);
        if (shouldSave && index < 0) favourites.push(item);
        if (!shouldSave && index >= 0) favourites.splice(index, 1);
        writeStorage(storageKeys.favourites, favourites);
    }

    function connectSearch() {
        const searchInputs = Array.from(document.querySelectorAll('input[placeholder*="Search" i], input[type="search"]'));
        const submitSearch = (input) => {
                const query = input.value.trim();
                routeTo(routes.search, { q: query });
        };

        searchInputs.forEach((input) => {
            input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    submitSearch(input);
                }
            });

            const wrapper = input.closest("form, div");
            const button = wrapper && wrapper.querySelector("button");
            if (button && /search/i.test(button.innerText)) {
                button.addEventListener("click", (event) => {
                    event.preventDefault();
                    submitSearch(input);
                });
            }
        });

        document.querySelectorAll("header button").forEach((button) => {
            if (!/search/i.test(button.innerText) || button.dataset.naurioSearchConnected) return;
            button.dataset.naurioSearchConnected = "true";
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const headerInput = button.closest("header") &&
                    button.closest("header").querySelector('input[placeholder*="Search" i], input[type="search"]');
                const input = headerInput || searchInputs[0];
                if (input) submitSearch(input);
                else routeTo(routes.search);
            });
        });
    }

    function connectSearchFilterControls() {
        if (!window.location.pathname.endsWith("search-filter-page.html")) return;

        const selects = Array.from(document.querySelectorAll("main select"));
        const cuisineSelect = selects.find((select) =>
            normalize(select.parentElement && select.parentElement.textContent).startsWith("cuisine:")
        );
        const sortSelect = selects.find((select) =>
            Array.from(select.options).some((option) => /rating: high|price: low|prep time/i.test(option.textContent))
        );
        const budgetLabel = Array.from(document.querySelectorAll("main span"))
            .find((element) => normalize(element.textContent) === "budget:");
        const budgetButtons = budgetLabel ? Array.from(budgetLabel.parentElement.querySelectorAll("button")) : [];
        const criteriaButtons = Array.from(document.querySelectorAll("main button")).filter((button) =>
            /4\.5\+ rating|<\s*25 mins|chef tasting voucher/i.test(normalize(button.textContent))
        );
        const setSelected = (button, selected) => {
            button.setAttribute("aria-pressed", String(selected));
            button.classList.toggle("bg-primary-container", selected);
            button.classList.toggle("text-on-primary", selected);
            button.classList.toggle("bg-surface-container-lowest", !selected);
            button.classList.toggle("text-on-surface", !selected);
        };
        const setBudgetSelected = (button, selected) => {
            button.setAttribute("aria-pressed", String(selected));
            button.classList.toggle("bg-surface-container-high", selected);
            button.classList.toggle("font-semibold", selected);
            button.classList.toggle("text-primary", selected);
            button.classList.toggle("text-on-surface", !selected);
        };

        if (cuisineSelect) {
            cuisineSelect.addEventListener("change", () => {
                searchFilterState.cuisine = cuisineSelect.value === "All Cuisines" ? "" : cuisineSelect.value;
                filterSearchResults();
            });
        }

        if (sortSelect) sortSelect.addEventListener("change", filterSearchResults);

        budgetButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const label = normalize(button.textContent);
                const selected = searchFilterState.budget && searchFilterState.budget.label === label;
                searchFilterState.budget = selected ? null : {
                    label,
                    min: label.includes("2.5k") && !label.includes("1.2k") ? 2500 :
                        label.includes("1.2k") ? (label.includes("500") ? 500 : 1200) :
                            label.includes("500") ? 500 : 0,
                    max: label.includes("500") && label.includes("1.2k") ? 1200 :
                        label.includes("1.2k") && label.includes("2.5k") ? 2500 :
                            label.includes("<") ? 500 : null
                };
                budgetButtons.forEach((candidate) => setBudgetSelected(candidate, candidate === button && !selected));
                filterSearchResults();
            });
        });

        criteriaButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const label = normalize(button.textContent);
                const key = label.includes("rating") ? "rating" : label.includes("mins") ? "fast" : "voucher";
                searchFilterState[key] = !searchFilterState[key];
                setSelected(button, searchFilterState[key]);
                filterSearchResults();
            });
        });

        const resetButton = Array.from(document.querySelectorAll("main button"))
            .find((button) => /reset filters/.test(normalize(button.textContent)));
        if (resetButton) {
            resetButton.addEventListener("click", () => {
                Object.assign(searchFilterState, { cuisine: "", budget: null, rating: false, fast: false, voucher: false });
                budgetButtons.forEach((button) => setBudgetSelected(button, false));
                criteriaButtons.forEach((button) => setSelected(button, false));
                if (cuisineSelect) cuisineSelect.value = "All Cuisines";
                if (sortSelect) sortSelect.value = "relevance";
                const searchUrl = new URL(window.location.href);
                searchUrl.searchParams.delete("q");
                window.history.replaceState(null, "", searchUrl.href);
                filterSearchResults();
            });
        }

        const input = document.querySelector('input[placeholder*="Search" i], input[type="search"]');
        if (input) input.addEventListener("input", filterSearchResults);
    }

    function connectInteractions() {
        document.addEventListener("click", (event) => {
            const button = event.target.closest("button");
            if (!button || button.closest(".profile-sidebar")) return;

            const label = normalize(button.innerText || button.getAttribute("aria-label"));
            const ariaLabel = normalize(button.getAttribute("aria-label"));

            if (label.includes("search")) return;

            if (/^all categories\b|^browse menu\b/.test(label)) {
                routeTo(routes["curated-menu"]);
                return;
            }

            if (button.id === "filter-pure-veg" || button.id === "filter-non-veg") {
                filterSearchResults();
                return;
            }

            if (/add to cart|add pairing|add to order|add item/.test(`${label} ${ariaLabel}`) ||
                button.classList.contains("add-cart-btn") ||
                (label === "add add" && button.closest(".group, [data-product]") &&
                    !button.classList.contains("add-pairing-btn"))) {
                addToCart(readProduct(button));
                routeTo(routes["cart-and-checkout"]);
                return;
            }

            if (/place order/.test(label)) {
                const order = {
                    id: `NAU-${Date.now().toString().slice(-6)}`,
                    placedAt: new Date().toISOString(),
                    status: "confirmed",
                    demo: true,
                    total: button.textContent.trim(),
                    items: readStorage(storageKeys.cart, [])
                };
                writeStorage(storageKeys.order, order);
                window.setTimeout(() => routeTo(routes["order-success"]), 2800);
                return;
            }

            if (/proceed to checkout|continue to checkout|checkout|pay now/.test(label)) {
                routeTo("checkout-payment-page.html");
                return;
            }

            if (/track live order|track order|track delivery|live tracking/.test(label)) {
                routeTo(routes["order-tracking"]);
                return;
            }

            if (/reorder/.test(label)) {
                const item = readProduct(button);
                addToCart(item);
                routeTo(routes["cart-and-checkout"]);
                return;
            }

            if (/view restaurant/.test(label)) {
                routeTo("restaurants-detalis-page.html");
                return;
            }

            if (/explore restaurants|view all .*restaurants|view menu/.test(label)) {
                routeTo(/view menu/.test(label) ? routes["curated-menu"] : routes["explore-restaurants"]);
                return;
            }

            if (/explore menu|view all .*menu|browse curated menu|continue shopping/.test(label)) {
                routeTo(routes["curated-menu"]);
                return;
            }

            if (/view details/.test(label)) {
                const card = button.closest("article");
                const orderId = card && card.innerText.match(/NAU-[A-Z0-9-]+/i);
                if (orderId) {
                    routeTo(routes["order-tracking"], { order: orderId[0] });
                } else {
                    routeTo("food-details-custmiz-page.html");
                }
                return;
            }

            if (/^back\b|back to login|back to home/.test(label)) {
                if (window.history.length > 1) window.history.back();
                else routeTo(routes.home);
                return;
            }

            if (/add new address/.test(label)) {
                routeTo("save-manage-address-page.html");
                return;
            }

            if (/favorite/.test(`${label} ${ariaLabel}`)) {
                const item = readProduct(button);
                const favourites = readStorage(storageKeys.favourites, []);
                const index = favourites.findIndex((entry) => entry.id === item.id);
                const icon = button.querySelector(".material-symbols-outlined");
                if (/remove from favou?rites/.test(normalize(button.title))) {
                    setFavourite(item, false);
                    return;
                }
                if (index >= 0) {
                    setFavourite(item, false);
                    if (icon) icon.textContent = "favorite_border";
                    button.setAttribute("aria-pressed", "false");
                } else {
                    setFavourite(item, true);
                    if (icon) icon.textContent = "favorite";
                    button.setAttribute("aria-pressed", "true");
                }
                return;
            }

            if (button.matches('[data-filter], .filter-chip') || button.closest("[data-filters]")) {
                button.setAttribute("aria-pressed", button.getAttribute("aria-pressed") !== "true");
            }
        });

        document.querySelectorAll("form").forEach((form) => {
            form.addEventListener("submit", (event) => {
                const fields = Array.from(form.querySelectorAll("input")).filter((input) =>
                    ["email", "password", "text", "tel"].includes(input.type)
                );
                if (!fields.length) return;

                event.preventDefault();
                const isLogin = fields.some((input) => input.type === "password");
                if (isLogin) {
                    writeStorage("naurio-demo-session", { signedIn: true, demo: true });
                    routeTo(routes["user-profile"]);
                } else if (fields.some((input) => input.type === "email")) {
                    routeTo(routes.login);
                }
            });
        });
    }

    function filterSearchResults() {
        if (!window.location.pathname.endsWith("search-filter-page.html")) return;
        const query = new URLSearchParams(window.location.search).get("q");
        const input = document.querySelector('input[placeholder*="Search" i], input[type="search"]');
        if (query && input && !input.value) input.value = query;
        const effectiveQuery = input && input.value.trim() ? input.value.trim() : query || "";
        const terms = effectiveQuery.toLowerCase().split(/\s+/).filter(Boolean);
        const vegActive = document.getElementById("filter-pure-veg")?.classList.contains("bg-primary-container");
        const nonVegActive = document.getElementById("filter-non-veg")?.classList.contains("bg-primary-container");
        const cards = Array.from(document.querySelectorAll("article"));
        cards.forEach((card, index) => {
            if (!card.dataset.naurioSortIndex) card.dataset.naurioSortIndex = String(index);
        });

        const sortSelect = Array.from(document.querySelectorAll("main select")).find((select) =>
            Array.from(select.options).some((option) => /rating: high|price: low|prep time/i.test(option.textContent))
        );
        const sortMode = sortSelect ? sortSelect.value : "relevance";
        const ratingMatch = (text) => text.match(/\b([0-5]\.\d)\b/);
        const priceMatch = (text) => text.match(/[₹$]\s*([\d,]+(?:\.\d{1,2})?)/);
        const timeMatch = (text) => text.match(/(\d+)\s*(?:mins?|minutes?)/i);

        const getSortValue = (card) => {
            const text = card.textContent.toLowerCase();
            if (sortMode === "rating") return ratingMatch(text) ? -Number(ratingMatch(text)[1]) : Number.POSITIVE_INFINITY;
            if (sortMode === "time") return timeMatch(text) ? Number(timeMatch(text)[1]) : Number.POSITIVE_INFINITY;
            if (sortMode === "price-asc") return priceMatch(text) ? Number(priceMatch(text)[1].replace(/,/g, "")) : Number.POSITIVE_INFINITY;
            if (sortMode === "price-desc") return priceMatch(text) ? -Number(priceMatch(text)[1].replace(/,/g, "")) : Number.POSITIVE_INFINITY;
            return Number(card.dataset.naurioSortIndex);
        };

        const groups = new Map();
        cards.forEach((card) => {
            if (!groups.has(card.parentElement)) groups.set(card.parentElement, []);
            groups.get(card.parentElement).push(card);
        });
        groups.forEach((group) => {
            group.sort((a, b) => getSortValue(a) - getSortValue(b));
            group.forEach((card) => card.parentElement.append(card));
        });

        const visibleCards = [];
        cards.forEach((card) => {
            const text = card.textContent.toLowerCase();
            const matchesQuery = terms.every((term) => text.includes(term));
            const isDish = Boolean(card.closest("#results-dishes-view"));
            const tags = Array.from(card.querySelectorAll("span")).map((tag) => normalize(tag.textContent));
            const isVeg = tags.includes("veg");
            const isNonVeg = tags.includes("non-veg");
            const matchesDiet = !isDish || (!vegActive && !nonVegActive) ||
                (vegActive && isVeg) || (nonVegActive && isNonVeg);
            const matchesCuisine = !isDish || !searchFilterState.cuisine ||
                text.includes(searchFilterState.cuisine.toLowerCase().split(" ")[0]);
            const price = priceMatch(text) ? Number(priceMatch(text)[1].replace(/,/g, "")) : null;
            const matchesBudget = !isDish || !searchFilterState.budget || price === null ||
                (price >= searchFilterState.budget.min &&
                    (searchFilterState.budget.max === null || price <= searchFilterState.budget.max));
            const rating = ratingMatch(text) ? Number(ratingMatch(text)[1]) : 0;
            const time = timeMatch(text) ? Number(timeMatch(text)[1]) : Number.POSITIVE_INFINITY;
            const matchesRating = !isDish || !searchFilterState.rating || rating >= 4.5;
            const matchesSpeed = !isDish || !searchFilterState.fast || time < 25;
            const matchesVoucher = !isDish || !searchFilterState.voucher || /voucher|coupon|offer/i.test(text);
            card.hidden = !matchesQuery || !matchesDiet || !matchesCuisine || !matchesBudget ||
                !matchesRating || !matchesSpeed || !matchesVoucher;
            if (!card.hidden) visibleCards.push(card);
        });

        const resultsCount = Array.from(document.querySelectorAll("main span"))
            .find((element) => /^showing \d+ of \d+ filtered results$/i.test(element.textContent.trim()));
        if (resultsCount) {
            const total = resultsCount.textContent.match(/of\s+(\d+)/i);
            resultsCount.textContent = `Showing ${visibleCards.length} of ${total ? total[1] : cards.length} filtered results`;
        }
    }

    function syncCartHeader() {
        const cart = readStorage(storageKeys.cart, []);
        if (!cart.length) return;
        const count = 3 + cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);

        document.querySelectorAll("header button, header a").forEach((control) => {
            if (!/cart|shopping_bag|shopping bag/i.test(`${control.innerText} ${control.getAttribute("aria-label") || ""}`)) return;
            const countElement = control.querySelector(".rounded-full");
            if (countElement) countElement.textContent = String(count);
        });
    }

    function formatINR(value) {
        return `₹${Number(value).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }

    function syncCheckoutSummary() {
        if (!window.location.pathname.endsWith("checkout-payment-page.html")) return;

        const rows = Array.from(document.querySelectorAll("main .flex.justify-between"));
        const findRow = (label) => rows.find((row) =>
            normalize(row.firstElementChild && row.firstElementChild.textContent).startsWith(label)
        );
        const subtotalRow = findRow("dish subtotal");
        const discountRow = findRow("seasonal privilege");
        const transitRow = findRow("priority vault transit");
        const taxRow = findRow("taxes & atelier surcharge");
        const grandTotalRow = document.querySelector("main .flex.justify-between.items-baseline");
        const orderButton = document.getElementById("place-order-cta");
        const subtotalValue = subtotalRow && subtotalRow.lastElementChild;
        const discountValue = discountRow && discountRow.lastElementChild;
        const transitValue = transitRow && transitRow.lastElementChild;
        const taxValue = taxRow && taxRow.lastElementChild;
        const totalValue = grandTotalRow && grandTotalRow.lastElementChild;

        if (!subtotalValue || !discountValue || !transitValue || !taxValue || !totalValue || !orderButton) return;

        const baseSubtotal = Number(subtotalValue.textContent.replace(/[^\d.]/g, ""));
        const discount = Number(discountValue.textContent.replace(/[^\d.]/g, ""));
        const transit = Number(transitValue.textContent.replace(/[^\d.]/g, ""));
        const addedItems = readStorage(storageKeys.cart, []);
        const foreignSubtotals = {};
        const rupeeAddition = addedItems.reduce((sum, item) => {
            const amount = (Number(item.price) || 0) * (Number(item.quantity) || 1);
            const currency = item.currency || "₹";
            if (currency === "₹") return sum + amount;
            foreignSubtotals[currency] = (foreignSubtotals[currency] || 0) + amount;
            return sum;
        }, 0);
        const subtotal = baseSubtotal + rupeeAddition;
        const appliedDiscount = Math.min(discount, subtotal);
        const taxable = Math.max(0, subtotal - appliedDiscount);
        const tax = taxable * 0.05;
        const total = taxable + transit + tax;
        const foreignSuffix = Object.entries(foreignSubtotals)
            .map(([currency, amount]) => ` + ${currency}${amount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`)
            .join("");

        subtotalValue.textContent = `${formatINR(subtotal)}${foreignSuffix}`;
        taxValue.textContent = formatINR(tax);
        totalValue.textContent = `${formatINR(total)}${foreignSuffix}`;
        const orderButtonLabel = Array.from(orderButton.querySelectorAll("span")).pop();
        if (orderButtonLabel) orderButtonLabel.textContent = `Place Order • ${formatINR(total)}${foreignSuffix}`;

        const firstItem = Array.from(document.querySelectorAll("main h4"))
            .find((heading) => /san marzano burrata/i.test(heading.textContent));
        const itemList = firstItem && firstItem.closest(".flex.flex-col.gap-space-md");
        if (!itemList) return;

        itemList.querySelectorAll("[data-demo-cart-item]").forEach((item) => item.remove());
        addedItems.forEach((item) => {
            const row = document.createElement("div");
            row.className = "flex items-start justify-between gap-space-sm pb-space-sm border-b border-surface-container/60";
            row.dataset.demoCartItem = "true";

            const details = document.createElement("div");
            details.className = "flex items-start gap-2.5";
            const quantity = document.createElement("span");
            quantity.className = "w-5 h-5 rounded-full bg-surface-container text-primary font-bold text-xs flex items-center justify-center mt-0.5";
            quantity.textContent = `${Number(item.quantity) || 1}×`;
            const text = document.createElement("div");
            const name = document.createElement("h4");
            name.className = "font-title-md text-title-md text-primary font-bold leading-snug";
            name.textContent = item.name;
            const customization = document.createElement("p");
            customization.className = "font-body-sm text-body-sm text-on-surface-variant";
            customization.textContent = item.customizations || "Selected from the NAURIO menu";
            text.append(name, customization);
            details.append(quantity, text);

            const amount = document.createElement("span");
            amount.className = "font-title-md text-title-md text-primary font-bold whitespace-nowrap";
            const currency = item.currency || "₹";
            amount.textContent = `${currency}${(Number(item.price) * (Number(item.quantity) || 1))
                .toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            row.append(details, amount);
            itemList.append(row);
        });
    }

    function syncOrderTracking() {
        if (!window.location.pathname.endsWith("order-tracking-page.html")) return;
        const order = readStorage(storageKeys.order, null);
        const reference = new URLSearchParams(window.location.search).get("order") || (order && order.id);
        if (!reference) return;

        document.querySelectorAll("main span").forEach((element) => {
            if (/^(?:order #)?#?NAU-[A-Z0-9-]+$/i.test(element.textContent.trim())) {
                element.textContent = element.textContent.replace(/NAU-[A-Z0-9-]+/i, reference);
            }
        });
    }

    window.NaurioSite = {
        getCart() {
            return readStorage(storageKeys.cart, []);
        },
        setCart(cart) {
            return writeStorage(storageKeys.cart, cart);
        },
        getOrder() {
            return readStorage(storageKeys.order, null);
        },
        restoreFavourite(card) {
            setFavourite(readProduct(card), true);
        },
        routeTo
    };

    if (window.location.pathname.endsWith("order-confirmation-page.html")) {
        const order = window.NaurioSite.getOrder();
        const reference = document.getElementById("order-reference");
        if (reference && order && order.id) reference.textContent = order.id;
    }

    createSharedHeader();
    connectLinks();
    connectSearch();
    connectSearchFilterControls();
    connectInteractions();
    filterSearchResults();
    syncCartHeader();
    syncCheckoutSummary();
    syncOrderTracking();
})();
