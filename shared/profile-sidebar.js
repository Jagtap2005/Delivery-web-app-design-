(function () {
    const design1Routes = {
        profile: "my-profile-page.html",
        orders: "my-order-page.html",
        addresses: "save-manage-address-page.html",
        favourites: "fvt-food-page.html",
        offers: "offers-coupans-page.html",
        help: "../../design%206/web/help-support-page.html",
        settings: "../../design%206/web/my-profile-account-setting-page.html"
    };

    const design6Routes = {
        profile: "my-profile-account-setting-page.html",
        orders: "my-order-order-history-page.html",
        addresses: "saved-address-address-management-page.html",
        favourites: "my-favourites-page.html",
        offers: "offeres-coupan-page.html",
        help: "help-support-page.html",
        settings: "my-profile-account-setting-page.html"
    };

    const navigationItems = [
        { id: "profile", label: "My Profile", icon: "person" },
        { id: "orders", label: "My Orders", icon: "receipt_long", badge: "1 Active" },
        { id: "addresses", label: "Saved Addresses", icon: "pin_drop" },
        { id: "favourites", label: "My Favourites", icon: "favorite" },
        { id: "offers", label: "Offers & Coupons", icon: "loyalty", badge: "2 Active" },
        { id: "help", label: "Help & Support", icon: "support_agent" },
        { id: "settings", label: "Account Settings", icon: "tune" }
    ];

    function createElement(tagName, className, text) {
        const element = document.createElement(tagName);
        element.className = className;
        if (text) {
            element.textContent = text;
        }
        return element;
    }

    function createSidebar(activePage, routes) {
        if (!routes[activePage]) {
            throw new Error(`Unknown profile sidebar page: ${activePage}`);
        }

        const sidebar = createElement("aside", "profile-sidebar");
        sidebar.setAttribute("aria-label", "Customer account");

        const profile = createElement("section", "profile-sidebar__profile");
        profile.setAttribute("aria-label", "Member profile");
        const portraitFrame = createElement("div", "profile-sidebar__portrait-frame");
        const portrait = createElement("img", "profile-sidebar__portrait");
        portrait.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuA2PeDylVXQ0Kp8mw-V0-pGHfsDv1G6nmO6oxXknOlFnEmtnYrXTJ_Zui8l6VEtr-1JrpMHC9bBZdqon1amxLgpIWejs5wGNF9NHu2JlBr5lwuINh99Xdf7zzBD6LGzqOkrFodOviUzPWiIA3oQnyYWgetvma0k_SVm8sAipy--Gpqjy1YujlzgFGaFHWAYZHMa8SKPA00bx7qEMU2-EzKNMfP3DLFBnAnXYriGBCSd";
        portrait.alt = "Anya Kapoor";
        portraitFrame.append(portrait);
        profile.append(
            portraitFrame,
            createElement("h2", "profile-sidebar__name", "Anya Kapoor"),
            createElement("p", "profile-sidebar__membership", "EPICUREAN MEMBER #EK-9821")
        );

        const tier = createElement("div", "profile-sidebar__tier");
        const tierIcon = createElement("span", "material-symbols-outlined profile-sidebar__tier-icon", "workspace_premium");
        tierIcon.setAttribute("aria-hidden", "true");
        tier.append(tierIcon, createElement("span", "", "Grand Cru Privilège Tier"));
        profile.append(tier);

        const navigation = createElement("nav", "profile-sidebar__navigation");
        navigation.setAttribute("aria-label", "Account Navigation");

        navigationItems.forEach((item) => {
            const link = createElement("a", "profile-sidebar__link");
            link.href = routes[item.id];

            const contents = createElement("span", "profile-sidebar__link-content");
            const icon = createElement("span", "material-symbols-outlined profile-sidebar__icon", item.icon);
            icon.setAttribute("aria-hidden", "true");
            contents.append(icon, createElement("span", "", item.label));
            link.append(contents);

            if (item.badge) {
                link.append(createElement("span", "profile-sidebar__badge", item.badge));
            } else {
                const chevron = createElement("span", "material-symbols-outlined profile-sidebar__chevron", "chevron_right");
                chevron.setAttribute("aria-hidden", "true");
                link.append(chevron);
            }

            if (item.id === activePage) {
                link.classList.add("profile-sidebar__link--active");
                link.setAttribute("aria-current", "page");
            }

            navigation.append(link);
        });

        const logout = createElement("button", "profile-sidebar__logout", "");
        logout.type = "button";
        const logoutIcon = createElement("span", "material-symbols-outlined profile-sidebar__icon", "logout");
        logoutIcon.setAttribute("aria-hidden", "true");
        logout.append(logoutIcon, createElement("span", "", "Logout Atelier Session"));
        navigation.append(createElement("div", "profile-sidebar__divider"), logout);

        const concierge = createElement("section", "profile-sidebar__concierge");
        const conciergeDecor = createElement("div", "profile-sidebar__concierge-decoration");
        conciergeDecor.setAttribute("aria-hidden", "true");
        const conciergeLabel = createElement("div", "profile-sidebar__concierge-label");
        const conciergeIcon = createElement("span", "material-symbols-outlined", "room_service");
        conciergeIcon.setAttribute("aria-hidden", "true");
        conciergeLabel.append(conciergeIcon, createElement("span", "", "CONCIERGE DESK"));
        concierge.append(
            conciergeDecor,
            conciergeLabel,
            createElement("h3", "profile-sidebar__concierge-title", "Have an exclusive dining voucher?"),
            createElement("p", "profile-sidebar__concierge-copy", "Contact your dedicated Maître D' or Concierge Desk directly to authenticate private club and diplomatic privileges.")
        );
        const conciergeButton = createElement("a", "profile-sidebar__concierge-button", "");
        conciergeButton.href = routes.help;
        conciergeButton.append(
            createElement("span", "", "Inquire with Maître D'"),
            createElement("span", "material-symbols-outlined", "arrow_forward")
        );
        conciergeButton.lastElementChild.setAttribute("aria-hidden", "true");
        concierge.append(conciergeButton);

        sidebar.append(profile, navigation, concierge);
        return sidebar;
    }

    document.querySelectorAll("[data-profile-sidebar]").forEach((placeholder) => {
        const routeSet = placeholder.dataset.routeSet;
        const routes = routeSet === "design1" ? design1Routes : routeSet === "design6" ? design6Routes : null;
        if (!routes) {
            throw new Error(`Unknown profile sidebar route set: ${routeSet}`);
        }

        placeholder.replaceWith(createSidebar(placeholder.dataset.activePage, routes));
    });
})();
