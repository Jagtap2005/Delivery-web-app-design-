(function () {
    "use strict";

    const navigationItems = [
        { label: "Explore Restaurants", file: "explore-restaurant-page.html", active: ["design1app.html", "explore-restaurant-page.html", "restaurant-details-page.html"] },
        { label: "Menu", file: "menu-page.html", active: ["menu-page.html", "food-details-page.html"] },
        { label: "Search", file: "search-filter-page.html", active: ["search-filter-page.html"] },
        { label: "Offers", file: "offer-coupan.html", active: ["offer-coupan.html"] },
        { label: "My Orders", file: "my-order-history.html", active: ["my-order-history.html"] },
        { label: "Favourites", file: "fvt-food.html", active: ["fvt-food.html"] },
        { label: "Saved Addresses", file: "save-manage-address.html", active: ["save-manage-address.html"] },
        { label: "Order Tracking", file: "live-order-tracking.html", active: ["live-order-tracking.html"] }
    ];

    function createNavigation() {
        const nav = document.createElement("nav");
        nav.setAttribute("aria-label", "Main categories");
        nav.className = "w-full border-t border-surface-container bg-surface/95";

        const links = document.createElement("div");
        links.className = "flex items-center gap-1 overflow-x-auto whitespace-nowrap no-scrollbar px-margin py-1";

        const currentPage = window.location.pathname.split("/").pop();
        navigationItems.forEach((item) => {
            const link = document.createElement("a");
            link.href = item.file;
            link.textContent = item.label;
            link.className = item.active.includes(currentPage)
                ? "shrink-0 rounded-full bg-primary-container px-3 py-1 font-label-md text-label-md text-on-primary"
                : "shrink-0 rounded-full px-3 py-1 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container";
            if (item.active.includes(currentPage)) {
                link.setAttribute("aria-current", "page");
            }
            links.append(link);
        });

        nav.append(links);
        return nav;
    }

    const header = document.querySelector("header");
    const main = document.querySelector("main");
    const nav = createNavigation();

    if (header) {
        header.append(nav);
        if (main && header.classList.contains("fixed") && !main.contains(header)) {
            const updateMainOffset = () => {
                main.style.paddingTop = `${header.offsetHeight}px`;
            };
            updateMainOffset();
            window.addEventListener("load", updateMainOffset, { once: true });
            window.addEventListener("resize", updateMainOffset);
            if ("ResizeObserver" in window) {
                new ResizeObserver(updateMainOffset).observe(header);
            }
        }
    } else if (main) {
        document.body.insertBefore(nav, main);
    }
})();
