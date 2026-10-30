(function () {
    'use strict';

    const screens = {
        home: 'design6app.html',
        explore: 'explore-restaurant-page.html',
        search: 'search-filter.html',
        dining: 'menu-page.html',
        restaurant: 'restaurant-details-menu-page.html',
        food: 'food-details-costumize-page.html',
        cart: 'shopping-cart-page.html',
        checkout: 'checkout-payment-page.html',
        success: 'order-success-confirm-page.html',
        tracking: 'live-order-tracking-page.html',
        profile: 'my-profile-page.html',
        login: 'login-signup-page.html',
        favourites: 'myfavourites-page.html',
        offers: 'offers-coupan-page.html',
        addresses: 'address-save-chnage-page.html',
        help: 'help-suppor-page.html',
        orders: 'myorder.html'
    };
    const page = location.pathname.split('/').pop();
    const storageKey = 'naurio-demo-state';
    const sessionTabKey = 'naurio-active-tab';
    const state = readState();

    function readState() {
        try {
            const value = localStorage.getItem(storageKey);
            return value ? Object.assign(defaultState(), JSON.parse(value)) : defaultState();
        } catch (error) {
            console.error('Unable to load NAURIO demo data:', error);
            return defaultState();
        }
    }

    function defaultState() {
        return {
            cart: [],
            cartInitialized: false,
            favourites: [],
            favouritesInitialized: false,
            address: '',
            addressFromSaved: false,
            deletedAddressKeys: [],
            coupon: null,
            couponInitialized: false,
            payment: '',
            profile: {},
            orders: []
        };
    }

    function saveState() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(state));
        } catch (error) {
            console.error('Unable to save NAURIO demo data:', error);
        }
    }

    function initializeDemoCoupon() {
        if (state.couponInitialized || ![screens.cart, screens.checkout].includes(page)) return;
        const label = Array.from(document.querySelectorAll('main span')).find(function (span) {
            return /^(?:Promo|Coupon Discount)\s*\(/i.test(cleanText(span));
        });
        const match = label && cleanText(label).match(/\(([^)]+)\)/);
        const value = label && label.parentElement.querySelectorAll('span')[1];
        state.coupon = match ? {
            code: match[1],
            discount: numberFromText(cleanText(value))
        } : null;
        state.couponInitialized = true;
        saveState();
    }

    function mainTabForPage() {
        if (page === screens.home || page === screens.explore) return 'explore';
        if (page === screens.search) return 'search';
        if (page === screens.dining || page === screens.restaurant) return 'dining';
        if (page === screens.cart || page === screens.checkout) return 'cart';
        if (page === screens.orders) return 'orders';
        try {
            return sessionStorage.getItem(sessionTabKey) || 'explore';
        } catch (error) {
            console.error('Unable to read NAURIO navigation state:', error);
            return 'explore';
        }
    }

    function go(screen) {
        const destination = screens[screen];
        if (!destination) {
            console.error('Unknown NAURIO screen:', screen);
            return;
        }
        if (destination === page) return;
        if (['explore', 'search', 'dining', 'cart'].includes(screen)) {
            try {
                sessionStorage.setItem(sessionTabKey, screen);
            } catch (error) {
                console.error('Unable to save NAURIO navigation state:', error);
            }
        }
        if (screen === 'offers') {
            try {
                sessionStorage.setItem('naurio-coupon-return', page === screens.cart ? 'cart' : 'checkout');
            } catch (error) {
                console.error('Unable to save coupon navigation state:', error);
            }
        }
        if (screen === 'tracking' && page === screens.orders) {
            try {
                sessionStorage.setItem('naurio-tracking-return', 'orders');
            } catch (error) {
                console.error('Unable to save tracking navigation state:', error);
            }
        }
        location.href = destination;
    }

    function cleanText(node) {
        return (node && node.innerText ? node.innerText : '').replace(/\s+/g, ' ').trim();
    }

    function visibleLabel(node) {
        const clone = node.cloneNode(true);
        clone.querySelectorAll('.material-symbols-outlined').forEach(function (icon) {
            icon.remove();
        });
        return cleanText(clone);
    }

    function numberFromText(text) {
        const match = String(text || '').replace(/,/g, '').match(/₹\s*(\d+(?:\.\d{1,2})?)/);
        return match ? Number(match[1]) : 0;
    }

    function getProduct(element) {
        let card = element;
        let productName = '';
        for (let depth = 0; card && depth < 8; depth += 1, card = card.parentElement) {
            const heading = card.querySelector('h1,h2,h3,h4,h5,h6');
            const text = cleanText(card);
            if (heading && text.includes('₹')) {
                productName = cleanText(heading);
                break;
            }
        }
        if (!productName) {
            const heading = document.querySelector('main h1, main h2, main h3');
            productName = cleanText(heading) || 'NAURIO Demo Item';
        }
        let cardRoot = element.closest('article');
        if (!cardRoot) {
            cardRoot = element;
            for (let depth = 0; cardRoot && depth < 7; depth += 1, cardRoot = cardRoot.parentElement) {
                if (cardRoot.querySelector('h1,h2,h3,h4,h5,h6') && cleanText(cardRoot).includes('₹')) break;
            }
        }
        const image = cardRoot && cardRoot.querySelector('img');
        const handler = element.getAttribute('onclick') || '';
        const handlerProduct = handler.match(/(?:triggerCartAdd|addCompanion)\(\s*this\s*,\s*['"]([^'"]+)['"]\s*,\s*(\d+)/);
        const price = numberFromText(cleanText(element)) ||
            (handlerProduct ? Number(handlerProduct[2]) : 0) ||
            numberFromText(cleanText(cardRoot)) ||
            numberFromText(cleanText(document.getElementById('craveCartBtn'))) || 349;
        const quantity = page === screens.food
            ? Number((document.getElementById('qtyVal') || {}).textContent) || 1
            : 1;
        const options = Array.from(document.querySelectorAll('input:checked')).map(function (input) {
            const label = input.closest('label');
            return cleanText(label);
        }).filter(Boolean);
        document.querySelectorAll('.spice-btn').forEach(function (button) {
            if (button.classList.contains('bg-inverse-surface')) options.push(cleanText(button));
        });
        const cardText = cleanText(cardRoot);
        return {
            name: handlerProduct ? handlerProduct[1] : productName,
            price: price,
            quantity: quantity,
            image: image ? image.getAttribute('src') : '',
            customization: options.join(', '),
            type: page === screens.explore ||
                (page === screens.home && /view menu|\d+\s*mins?\s*[•·]/i.test(cardText)) ? 'restaurant' : 'food'
        };
    }

    function findProductCard(element) {
        let candidate = element;
        for (let depth = 0; candidate && depth < 8 && candidate.tagName !== 'MAIN'; depth += 1, candidate = candidate.parentElement) {
            if (candidate.querySelector('h2,h3,h4,h5') && candidate.querySelector('img') && /₹\s*[\d,]+/.test(cleanText(candidate))) {
                return candidate;
            }
        }
        return null;
    }

    function productCards() {
        const results = new Set();
        document.querySelectorAll('main h2,main h3,main h4,main h5').forEach(function (heading) {
            const card = findProductCard(heading);
            if (card) results.add(card);
        });
        return Array.from(results);
    }

    function addToCart(product) {
        if (Number.isInteger(state.editingIndex) && state.cart[state.editingIndex]) {
            const item = state.cart[state.editingIndex];
            item.customization = product.customization;
            state.editingIndex = null;
            state.cartInitialized = true;
            saveState();
            updateCartBadges();
            renderCart();
            return;
        }
        const existing = state.cart.find(function (item) {
            return item.name === product.name && item.customization === product.customization;
        });
        if (existing) existing.quantity += product.quantity;
        else state.cart.push(product);
        state.cartInitialized = true;
        saveState();
        updateCartBadges();
        renderCart();
    }

    function cartQuantity() {
        return state.cart.reduce(function (total, item) {
            return total + Math.max(0, Number(item.quantity) || 0);
        }, 0);
    }

    function updateCartBadges() {
        document.querySelectorAll('nav [data-path="cart"]').forEach(function (link) {
            const badge = link.querySelector('.absolute');
            if (badge) {
                badge.textContent = String(cartQuantity());
                badge.hidden = cartQuantity() === 0;
            }
        });
        document.querySelectorAll('[data-cart-count]').forEach(function (badge) {
            badge.textContent = String(cartQuantity());
        });
    }

    function parseExistingCart() {
        const rows = Array.from(document.querySelectorAll('[id^="cart-item-"]'));
        if (!rows.length || state.cart.length || state.cartInitialized) return;
        state.cart = rows.map(function (row) {
            const heading = row.querySelector('h1,h2,h3,h4,h5,h6');
            const price = Array.from(row.querySelectorAll('span')).map(function (span) {
                return numberFromText(cleanText(span));
            }).find(Boolean) || 0;
            const qtyElement = row.querySelector('[id^="qty-"]');
            return {
                name: cleanText(heading) || 'NAURIO Demo Item',
                price: price,
                quantity: Number(qtyElement && qtyElement.textContent) || 1,
                image: (row.querySelector('img') || {}).src || '',
                customization: ''
            };
        });
        state.cartInitialized = true;
        saveState();
    }

    function renderCart() {
        if (page !== screens.cart) return;
        let rows = Array.from(document.querySelectorAll('[id^="cart-item-"]'));
        if (!rows.length) return;
        const parent = rows[0].parentElement;
        while (rows.length < state.cart.length) {
            const clone = rows[0].cloneNode(true);
            parent.appendChild(clone);
            rows.push(clone);
        }
        rows.forEach(function (row, index) {
            const item = state.cart[index];
            row.hidden = !item;
            if (!item) return;
            row.id = 'cart-item-' + (index + 1);
            const heading = row.querySelector('h1,h2,h3,h4,h5,h6');
            if (heading) heading.textContent = item.name;
            const priceElement = Array.from(row.querySelectorAll('span')).find(function (span) {
                return /^₹\s*[\d,]+/.test(cleanText(span));
            });
            if (priceElement) priceElement.textContent = '₹' + item.price;
            if (item.image) {
                const image = row.querySelector('img');
                if (image) image.src = item.image;
            }
            const qtyElement = row.querySelector('[id^="qty-"]');
            if (qtyElement) {
                qtyElement.id = 'qty-' + (index + 1);
                qtyElement.textContent = String(item.quantity);
            }
            if (item.customization) {
                const description = row.querySelector('p');
                if (description) description.textContent = item.customization;
            }
            row.querySelectorAll('[onclick]').forEach(function (button) {
                button.removeAttribute('onclick');
            });
        });
        const subtotal = state.cart.reduce(function (total, item) {
            return total + item.price * item.quantity;
        }, 0);
        const discount = state.coupon ? Number(state.coupon.discount) || 0 : 0;
        const coins = document.querySelector('input[type="checkbox"]');
        const coinDiscount = coins && coins.checked ? 24 : 0;
        const total = subtotal
            ? Math.max(0, subtotal + 25 + Math.ceil(subtotal * 0.05) - discount - coinDiscount)
            : 0;
        const subtotalDisplay = document.getElementById('summary-subtotal');
        const grandTotal = document.getElementById('grand-total-display');
        const stickyTotal = document.getElementById('sticky-total');
        if (subtotalDisplay) subtotalDisplay.textContent = '₹' + subtotal.toFixed(2);
        if (grandTotal) grandTotal.textContent = '₹' + total;
        if (stickyTotal) stickyTotal.textContent = '₹' + total;
        renderCoupon();
        updateCartBadges();
    }

    function renderCoupon() {
        const code = state.coupon && state.coupon.code;
        const discount = state.coupon ? Number(state.coupon.discount) || 0 : 0;
        const removeButton = document.querySelector('[title="Remove promo"]');
        const couponCard = removeButton && removeButton.parentElement;
        if (couponCard) {
            couponCard.hidden = !code;
            const codeLabel = Array.from(couponCard.querySelectorAll('span')).find(function (span) {
                return /^[A-Z0-9]+$/.test(cleanText(span));
            });
            const savings = Array.from(couponCard.querySelectorAll('span')).find(function (span) {
                return /^Saving ₹/i.test(cleanText(span));
            });
            if (codeLabel && code) codeLabel.textContent = code;
            if (savings && code) savings.textContent = 'Saving ₹' + discount + ' on this feast!';
        }
        Array.from(document.querySelectorAll('main span')).forEach(function (label) {
            if (!/^(?:Promo|Coupon Discount)\s*\(/i.test(cleanText(label))) return;
            const value = label.parentElement.querySelectorAll('span')[1];
            label.textContent = code
                ? (cleanText(label).startsWith('Promo') ? 'Promo (' + code + ')' : 'Coupon Discount (' + code + ')')
                : 'Coupon Discount';
            label.parentElement.hidden = !code;
            if (value) value.textContent = '-₹' + discount.toFixed(2);
        });
    }

    function renderCheckout() {
        if (page !== screens.checkout) return;
        if (state.address) {
            const addressSection = Array.from(document.querySelectorAll('main section')).find(function (section) {
                return Array.from(section.querySelectorAll('button')).some(function (button) {
                    return /^Change$/i.test(visibleLabel(button));
                });
            });
            const addressText = addressSection && addressSection.querySelector('p');
            if (addressText) addressText.textContent = state.address;
        }
        renderCoupon();
        const subtotal = state.cart.length
            ? state.cart.reduce(function (total, item) { return total + item.price * item.quantity; }, 0)
            : 947;
        const discount = state.coupon ? Number(state.coupon.discount) || 0 : 0;
        const tax = Math.ceil(subtotal * 0.05);
        const total = Math.max(0, subtotal + 29 + tax - discount - 24);
        const itemAccordion = document.getElementById('order-items-accordion');
        if (itemAccordion && state.cart.length) {
            let rows = Array.from(itemAccordion.children).filter(function (row) {
                return row.querySelector('img') && row.querySelector('p');
            });
            while (rows.length < state.cart.length) {
                const clone = rows[0].cloneNode(true);
                itemAccordion.insertBefore(clone, rows[rows.length] || null);
                rows.push(clone);
            }
            rows.forEach(function (row, index) {
                const item = state.cart[index];
                row.hidden = !item;
                if (!item) return;
                const paragraphs = row.querySelectorAll('p');
                if (paragraphs[0]) paragraphs[0].textContent = item.name;
                if (paragraphs[1]) {
                    paragraphs[1].textContent = 'Qty: ' + item.quantity +
                        (item.customization ? ' • ' + item.customization : '');
                }
                const price = Array.from(row.querySelectorAll('span')).find(function (span) {
                    return /^₹/.test(cleanText(span));
                });
                if (price) price.textContent = '₹' + item.price;
                const image = row.querySelector('img');
                if (image && item.image) image.src = item.image;
            });
        }
        const lineValue = function (labelText, valueText) {
            const label = Array.from(document.querySelectorAll('main span')).find(function (span) {
                return cleanText(span) === labelText;
            });
            const value = label && Array.from(label.parentElement.querySelectorAll('span')).find(function (span) {
                return span !== label;
            });
            if (value) value.textContent = valueText;
        };
        lineValue('Item Total', '₹' + subtotal);
        lineValue('Taxes & Packaging', '₹' + tax);
        const footer = document.querySelector('main aside');
        const totalDisplay = footer && Array.from(footer.querySelectorAll('span')).find(function (span) {
            return /^₹/.test(cleanText(span));
        });
        if (totalDisplay) totalDisplay.textContent = '₹' + total;
        renderCoupon();
    }

    function productIsFavourite(product) {
        return state.favourites.some(function (item) {
            return item.name === product.name;
        });
    }

    function toggleFavourite(product) {
        const index = state.favourites.findIndex(function (item) {
            return item.name === product.name;
        });
        if (index >= 0) state.favourites.splice(index, 1);
        else state.favourites.push(product);
        saveState();
        return index < 0;
    }

    function initializeFavourites() {
        if (page !== screens.favourites || state.favouritesInitialized) return;
        if (!state.favourites.length) {
            state.favourites = Array.from(document.querySelectorAll('main article')).map(function (card) {
                const heading = card.querySelector('h1,h2,h3,h4,h5,h6');
                const price = numberFromText(cleanText(card));
                const image = card.querySelector('img');
                const text = cleanText(card);
                return {
                    name: cleanText(heading),
                    price: price,
                    quantity: 1,
                    image: image ? image.getAttribute('src') : '',
                    customization: '',
                    type: /kitchen|restaurant|view menu/i.test(text) ? 'restaurant' : 'food'
                };
            }).filter(function (item) { return item.name; });
        }
        state.favouritesInitialized = true;
        saveState();
    }

    function renderFavourites() {
        if (page !== screens.favourites) return;
        const cards = Array.from(document.querySelectorAll('main article'));
        const known = new Set();
        cards.forEach(function (card) {
            const heading = card.querySelector('h1,h2,h3,h4,h5,h6');
            const name = cleanText(heading);
            const item = state.favourites.find(function (favourite) { return favourite.name === name; });
            card.hidden = !item;
            if (item) known.add(item.name);
        });
        state.favourites.forEach(function (item) {
            if (known.has(item.name) || !cards.length) return;
            const template = cards.find(function (card) {
                return item.type !== 'restaurant' || /view menu/i.test(cleanText(card));
            }) || cards[0];
            const clone = template.cloneNode(true);
            const heading = clone.querySelector('h1,h2,h3,h4,h5,h6');
            if (heading) heading.textContent = item.name;
            const priceElement = Array.from(clone.querySelectorAll('span')).find(function (span) {
                return /^₹\s*[\d,]+/.test(cleanText(span));
            });
            if (priceElement && item.price) priceElement.textContent = '₹' + item.price;
            const image = clone.querySelector('img');
            if (image && item.image) image.src = item.image;
            clone.hidden = false;
            clone.dataset.naurioFavorite = 'true';
            const parent = template.parentElement;
            parent.appendChild(clone);
            cards.push(clone);
        });
    }

    function routeFromLabel(label, element) {
        const text = (label || '').toLowerCase();
        if (/view cart|shopping cart|cart icon/.test(text)) return 'cart';
        if (/back to home|home screen|^home$/.test(text)) return 'home';
        if (/view menu/.test(text)) {
            if ([screens.home, screens.explore].includes(page)) return 'restaurant';
            return 'dining';
        }
        if (/browse full menu|full menu|dining/.test(text)) return 'dining';
        if (/view all|see all/.test(text)) {
            let context = element;
            for (let depth = 0; context && depth < 3; depth += 1, context = context.parentElement) {
                if (/offers|coupons|vouchers/i.test(cleanText(context))) return 'offers';
            }
            return 'explore';
        }
        if (/explore top curated kitchens/.test(text)) return 'explore';
        if (/search/.test(text)) return 'search';
        if (/edit profile|my profile|profile icon|account/.test(text)) return 'profile';
        if (/favourites|wishlist|my favourites|my favorites/.test(text)) return 'favourites';
        if (/offers|coupon|voucher/.test(text)) return 'offers';
        if (/saved addresses|change address|delivery address/.test(text)) return 'addresses';
        if (/order issue/.test(text)) return 'tracking';
        if (/help|support/.test(text)) return 'help';
        if (/live chat|contact support|concierge/.test(text)) return 'help';
        if (/track (your )?order|live tracking/.test(text)) return 'tracking';
        if (/my orders|order history|view my orders|orders/.test(text)) return 'orders';
        if (/checkout|proceed to/.test(text)) return 'checkout';
        if (/restaurant details/.test(text)) return 'restaurant';
        if (element && (element.closest('article') || findProductCard(element))) {
            const card = element.closest('article') || findProductCard(element);
            if ([screens.home, screens.explore].includes(page)) {
                return Array.from(card.querySelectorAll('button')).some(function (button) {
                    return /\badd\b/i.test(cleanText(button));
                }) ? 'food' : 'restaurant';
            }
            if ([screens.restaurant, screens.dining, screens.search].includes(page)) return 'food';
            if (page === screens.favourites) {
                const cardText = cleanText(element.closest('article'));
                return /restaurant|kitchen|view menu/i.test(cardText) ? 'restaurant' : 'food';
            }
            if (page === screens.offers) {
                return /restaurant|kitchen/i.test(cleanText(element.closest('article'))) ? 'restaurant' : 'food';
            }
        }
        return '';
    }

    function installNavigation() {
        let nav = document.querySelector('nav[data-active-classes], nav [data-path]');
        if (nav && nav.tagName !== 'NAV') nav = nav.closest('nav');
        if (!nav) {
            nav = document.createElement('nav');
            nav.setAttribute('aria-label', 'Primary navigation');
            nav.className = 'fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-4px_20px_rgba(33,26,20,0.06)]';
            nav.setAttribute('data-active-classes', 'text-primary font-bold');
            nav.innerHTML = '<div class="flex justify-around items-center h-16 px-space-xs">' +
                navLink('explore', 'explore', 'Explore') +
                navLink('search', 'search', 'Search') +
                navLink('dining', 'restaurant', 'Dining') +
                navLink('orders', 'receipt_long', 'Orders') +
                navLink('cart', 'shopping_bag', 'Cart') + '</div>';
            document.body.appendChild(nav);
        }

        const activeTab = mainTabForPage();
        const activeClasses = (nav.getAttribute('data-active-classes') || 'text-primary font-bold')
            .split(/\s+/).filter(Boolean);
        nav.querySelectorAll('[data-path]').forEach(function (link) {
            const rawTab = link.getAttribute('data-path');
            const tab = rawTab === 'my-orders' ? 'orders' : rawTab;
            link.href = tab === 'explore' ? screens.home : screens[tab] || '#';
            if (tab === activeTab) {
                link.setAttribute('aria-current', 'page');
                link.classList.remove('text-on-surface-variant', 'text-secondary');
                activeClasses.forEach(function (className) { link.classList.add(className); });
            } else {
                link.removeAttribute('aria-current');
                activeClasses.forEach(function (className) { link.classList.remove(className); });
            }
        });
        document.querySelectorAll('a[data-path="profile-settings"]').forEach(function (link) {
            link.href = screens.profile;
        });
        document.querySelectorAll('a[href="#"]').forEach(function (link) {
            const destination = routeFromLabel(cleanText(link), link);
            if (destination) link.href = screens[destination];
        });
        liftFixedActionsAboveNavigation(nav);
        window.addEventListener('resize', function () {
            liftFixedActionsAboveNavigation(nav);
        });
    }

    function liftFixedActionsAboveNavigation(nav) {
        const navTop = nav.getBoundingClientRect().top;
        const navHeight = nav.getBoundingClientRect().height;
        document.querySelectorAll('main [class*="bottom-0"]').forEach(function (element) {
            if (!element.querySelector('button')) return;
            const position = getComputedStyle(element).position;
            if (position !== 'fixed' && position !== 'sticky') return;
            if (element.getBoundingClientRect().bottom > navTop) {
                element.style.bottom = navHeight + 'px';
            }
        });
    }

    function navLink(tab, icon, label) {
        return '<a class="flex flex-col items-center justify-center min-w-[56px] h-12 text-on-surface-variant transition-colors" data-path="' + tab +
            '" href="#"><span class="material-symbols-outlined text-[24px]">' + icon +
            '</span><span class="font-label-sm text-label-sm mt-0.5">' + label + '</span></a>';
    }

    function selectAddress(label, fromSaved) {
        state.address = label;
        state.addressFromSaved = Boolean(fromSaved);
        saveState();
    }

    function addressKey(card) {
        const name = cleanText(card.querySelector('h3'));
        const address = cleanText(card.querySelector('p'));
        return name + '|' + address;
    }

    function renderAddresses() {
        if (page !== screens.addresses || !Array.isArray(state.deletedAddressKeys)) return;
        document.querySelectorAll('main .bg-surface-container-lowest').forEach(function (card) {
            if (card.querySelector('h3') && state.deletedAddressKeys.includes(addressKey(card))) card.hidden = true;
        });
    }

    function renderDemoOrders() {
        if (page !== screens.orders || !state.orders.length) return;
        const section = document.getElementById('section-ongoing');
        const template = section && section.querySelector('.bg-surface-container-lowest');
        if (!template) return;
        template.hidden = true;
        const orderCount = document.querySelector('#tab-ongoing span:last-child');
        if (orderCount) orderCount.textContent = '(' + state.orders.length + ')';
        const activeCount = section.querySelector('.text-primary.font-bold');
        if (activeCount) activeCount.textContent = state.orders.length + ' In Transit';
        state.orders.forEach(function (order, index) {
            const card = template.cloneNode(true);
            card.hidden = false;
            card.dataset.demoOrderIndex = String(index);
            const heading = card.querySelector('h3');
            const metadata = card.querySelector('h3 + p');
            const itemsLine = card.querySelector('.line-clamp-2');
            const total = card.querySelector('.font-bold.text-on-surface');
            const itemSummary = order.items.map(function (item) {
                return (Number(item.quantity) || 1) + '× ' + item.name;
            }).join(', ');
            if (heading) heading.textContent = 'Your NAURIO order';
            if (metadata) metadata.textContent = (order.address || 'Saved delivery address') + ' • #' + order.id;
            if (itemsLine) itemsLine.textContent = itemSummary || 'Order items';
            if (total) total.textContent = 'Total: ₹' + order.items.reduce(function (sum, item) {
                return sum + (Number(item.price) || 0) * (Number(item.quantity) || 1);
            }, 0);
            if (order.items[0] && order.items[0].image) {
                const image = card.querySelector('img');
                if (image) image.src = order.items[0].image;
            }
            section.insertBefore(card, template);
        });
    }

    function reorderFromCard(card) {
        const orderIndex = card.dataset.demoOrderIndex;
        const order = orderIndex === undefined ? null : state.orders[Number(orderIndex)];
        if (order && order.items.length) {
            order.items.forEach(function (item) {
                state.cart.push(Object.assign({}, item));
            });
        } else {
            const restaurant = cleanText(card.querySelector('h3')) || 'Previous NAURIO order';
            const summary = cleanText(card.querySelector('.line-clamp-1'));
            const amount = numberFromText(cleanText(card));
            const image = card.querySelector('img');
            if (amount > 0) {
                state.cart.push({
                    name: restaurant,
                    price: amount,
                    quantity: 1,
                    image: image ? image.getAttribute('src') : '',
                    customization: summary,
                    type: 'food'
                });
            }
        }
        state.cartInitialized = true;
        saveState();
        go('cart');
    }

    function nearestCard(element) {
        return element.closest('article') || element.closest('[role="button"]') || element.parentElement;
    }

    function showTicketConfirmation() {
        window.alert('Your support request has been saved in this demo. No support service is connected.');
    }

    function onClick(event) {
        const control = event.target.closest('a,button');
        if (!control) {
            if (event.target.closest('input,textarea,select')) return;
            const icon = event.target.closest('.material-symbols-outlined');
            if (page === screens.orders && icon && cleanText(icon) === 'person' && icon.closest('header')) {
                go('profile');
                return;
            }
            if (page === screens.addresses) {
                const addressCard = event.target.closest('.bg-surface-container-lowest');
                if (addressCard && addressCard.querySelector('h3')) {
                    const addressLines = Array.from(addressCard.querySelectorAll('p')).map(cleanText).filter(Boolean);
                    selectAddress(addressLines.join(', ') || cleanText(addressCard), true);
                    return;
                }
            }
            const actionable = event.target.closest('[onclick], [role="button"]');
            if (actionable && page === screens.checkout) {
                const paymentHandler = actionable.getAttribute('onclick') || '';
                const payment = paymentHandler.match(/switchPayment\(['"]([^'"]+)['"]\)/);
                if (payment) {
                    state.payment = payment[1];
                    saveState();
                }
            }
            const card = event.target.closest('article');
            if (card) {
                const destination = routeFromLabel(cleanText(card), card);
                if (destination) go(destination);
                return;
            }
            const productCard = findProductCard(event.target);
            if (productCard) {
                const destination = routeFromLabel(cleanText(productCard), productCard) ||
                    (page === screens.home || page === screens.explore ? 'restaurant' : 'food');
                go(destination);
            }
            return;
        }

        const rawLabel = cleanText(control);
        const label = visibleLabel(control);
        const iconName = cleanText(control.querySelector('.material-symbols-outlined'));
        const navLinkElement = control.closest('nav [data-path]');
        if (navLinkElement) {
            event.preventDefault();
            event.stopPropagation();
            let tab = navLinkElement.getAttribute('data-path');
            if (tab === 'my-orders') tab = 'orders';
            if (tab === 'explore') tab = 'home';
            go(tab === 'my-orders' ? 'orders' : tab);
            return;
        }

        if (page === screens.orders) {
            if (['tab-ongoing', 'tab-delivered', 'tab-cancelled'].includes(control.id)) return;
            if (iconName === 'search') {
                const searchInput = document.querySelector('input[placeholder*="Search orders" i]');
                if (searchInput) searchInput.focus();
                return;
            }
            if (control.getAttribute('aria-label') === 'Filter orders') {
                const filters = document.querySelector('main .overflow-x-auto.py-1');
                if (filters) filters.classList.toggle('hidden');
                return;
            }
            if (/^all orders$/i.test(label)) {
                document.querySelectorAll('#section-ongoing .bg-surface-container-lowest, #section-delivered .bg-surface-container-lowest, #section-cancelled .bg-surface-container-lowest').forEach(function (card) {
                    card.hidden = false;
                });
                return;
            }
            if (/^pure veg$/i.test(label)) {
                document.querySelectorAll('#section-ongoing .bg-surface-container-lowest, #section-delivered .bg-surface-container-lowest, #section-cancelled .bg-surface-container-lowest').forEach(function (card) {
                    const text = cleanText(card);
                    card.hidden = !/\bveg\b/i.test(text) || /non.?veg/i.test(text);
                });
                return;
            }
            const orderCard = control.closest('#section-ongoing .bg-surface-container-lowest, #section-delivered .bg-surface-container-lowest, #section-cancelled .bg-surface-container-lowest');
            if (/\btrack live\b|\btrack order\b/i.test(label)) {
                go('tracking');
                return;
            }
            if (/^view details$/i.test(label) || /^(receipt|info)$/.test(iconName)) {
                go('tracking');
                return;
            }
            if (/^reorder$/i.test(label) && orderCard) {
                reorderFromCard(orderCard);
                return;
            }
            if (/^invoice$/i.test(label)) {
                window.print();
                return;
            }
            if (/^rate order$/i.test(label)) {
                window.alert('Order rating is a demo. No review service is connected.');
                return;
            }
            if (/view refund breakdown/i.test(label)) {
                window.alert('This demo order was fully refunded to the original UPI payment method.');
                return;
            }
            if (/^chat now$/i.test(label)) {
                go('help');
                return;
            }
            if (iconName === 'more_horiz') {
                window.alert('Additional order actions are unavailable in this demo.');
                return;
            }
            if (control.tagName === 'BUTTON') return;
        }

        if (/^(arrow_back|arrow_back_ios_new|arrow_back_ios)$/.test(iconName || rawLabel) ||
            control.getAttribute('aria-label') === 'Go back') {
            event.preventDefault();
            event.stopPropagation();
            if (page === screens.tracking) {
                try {
                    if (sessionStorage.getItem('naurio-tracking-return') === 'orders') {
                        sessionStorage.removeItem('naurio-tracking-return');
                        go('orders');
                        return;
                    }
                } catch (error) {
                    console.error('Unable to read tracking navigation state:', error);
                }
            }
            if (history.length > 1) history.back();
            else go('home');
            return;
        }
        if (/back to home/i.test(label)) {
            event.preventDefault();
            event.stopPropagation();
            go('home');
            return;
        }

        const favoriteIcon = cleanText(control.querySelector('.material-symbols-outlined'));
        const favoriteControl = control.tagName === 'BUTTON' &&
            (/favorite|bookmark/.test((control.getAttribute('aria-label') || '') + ' ' + favoriteIcon) ||
                control.id === 'favouriteBtn');
        if (favoriteControl) {
            const product = getProduct(control);
            const saved = toggleFavourite(product);
            const icon = control.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = saved ? 'favorite' : 'favorite_border';
                icon.style.fontVariationSettings = saved ? "'FILL' 1" : "'FILL' 0";
            }
            if (page === screens.favourites && !saved) {
                const card = nearestCard(control);
                if (card && card !== document.body) card.hidden = true;
            }
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (/^(person|account_circle|account_box)\b/i.test(iconName || label)) {
            go('profile');
            return;
        }
        if (/^(shopping_bag|local_mall)\b/i.test(iconName || label)) {
            go('cart');
            return;
        }
        if (/^(location_on|edit_location)\b/i.test(iconName || label)) {
            go('addresses');
            return;
        }
        if (/^search$/i.test(iconName)) {
            go('search');
            return;
        }
        if (/^(tune|filter_list)$/i.test(iconName) && page === screens.home) {
            go('search');
            return;
        }
        if (/^mic$/i.test(iconName)) {
            go('search');
            return;
        }

        if (page === screens.addresses && /set as default/i.test(label)) {
            const addressCard = control.closest('.bg-surface-container-lowest, article') || control.parentElement;
            if (addressCard) {
                const addressLines = Array.from(addressCard.querySelectorAll('p')).map(cleanText).filter(Boolean);
                selectAddress(addressLines.join(', ') || cleanText(addressCard), true);
            }
            return;
        }
        if (page === screens.addresses && control.getAttribute('aria-label') === 'Delete address') {
            const addressCard = control.closest('.bg-surface-container-lowest');
            if (addressCard) {
                const key = addressKey(addressCard);
                state.deletedAddressKeys = Array.isArray(state.deletedAddressKeys) ? state.deletedAddressKeys : [];
                if (!state.deletedAddressKeys.includes(key)) state.deletedAddressKeys.push(key);
                if (state.address && state.address.includes(key.split('|')[1])) state.address = '';
                addressCard.hidden = true;
                saveState();
            }
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        if (page === screens.addresses && /edit details/i.test(label)) {
            const addressCard = control.closest('.bg-surface-container-lowest');
            const textInputs = Array.from(document.querySelectorAll('input[type="text"]'));
            const phoneInput = document.querySelector('input[type="tel"]');
            if (addressCard) {
                const name = addressCard.querySelector('h3');
                const addressLines = Array.from(addressCard.querySelectorAll('p')).map(cleanText).filter(Boolean);
                const phone = Array.from(addressCard.querySelectorAll('span')).map(cleanText)
                    .find(function (text) { return /^\+91/.test(text); });
                if (textInputs[0] && name) textInputs[0].value = cleanText(name);
                if (phoneInput && phone) phoneInput.value = phone.replace(/^\+91\s*/, '');
                if (textInputs[1] && addressLines[0]) textInputs[1].value = addressLines[0];
                if (textInputs[2] && addressLines[1]) textInputs[2].value = addressLines[1];
                state.addressFromSaved = false;
                saveState();
                textInputs[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        if (page === screens.addresses && /^sync$/i.test(label)) {
            window.alert('Address sync is unavailable in this demo. Your saved address remains on this device.');
            return;
        }
        if (control.id === 'open-edit-sheet-btn') {
            const backdrop = document.getElementById('edit-sheet-backdrop');
            if (backdrop) backdrop.style.zIndex = '60';
        }
        if (page === screens.addresses && /save address|deliver here/i.test(label)) {
            if (!state.addressFromSaved) {
                const textInputs = Array.from(document.querySelectorAll('input[type="text"]'))
                    .map(function (input) { return input.value.trim(); });
                const locationParts = textInputs.slice(1).filter(Boolean);
                const address = locationParts.join(', ') || state.address || 'Flat 402, Connaught Place';
                selectAddress(address);
            }
            go('checkout');
            return;
        }
        if (page === screens.addresses && /home|work|other/.test(label.toLowerCase())) {
            selectAddress(label.replace(/^(home|work|other)\s*/i, '') || label);
        }

        if (page === screens.offers) {
            const handler = control.getAttribute('onclick') || '';
            const applyMatch = handler.match(/triggerApplyPromo\(['"]([^'"]+)['"]\s*,\s*(\d+)/);
            if (applyMatch) {
                state.coupon = { code: applyMatch[1], discount: Number(applyMatch[2]) };
                state.couponInitialized = true;
                saveState();
                event.preventDefault();
                event.stopPropagation();
                let destination = 'checkout';
                try {
                    destination = sessionStorage.getItem('naurio-coupon-return') || destination;
                } catch (error) {
                    console.error('Unable to read coupon navigation state:', error);
                }
                go(destination);
                return;
            }
            const copyMatch = handler.match(/copyCouponCode\(['"]([^'"]+)['"]\)/);
            if (copyMatch && navigator.clipboard) {
                event.preventDefault();
                event.stopPropagation();
                navigator.clipboard.writeText(copyMatch[1]).then(function () {
                    window.alert('Coupon ' + copyMatch[1] + ' copied.');
                }).catch(function (error) {
                    console.error('Unable to copy coupon:', error);
                    window.prompt('Copy this coupon code:', copyMatch[1]);
                });
                return;
            }
        }

        if (page === screens.search && (control.id === 'tabFood' || control.id === 'tabRest')) {
            if (control.id === 'tabRest') go('explore');
            else productCards().forEach(function (card) { card.hidden = false; });
            return;
        }

        if (page === screens.cart && control.closest('[id^="cart-item-"]')) {
            const row = control.closest('[id^="cart-item-"]');
            const itemIndex = Number(row.id.replace('cart-item-', '')) - 1;
            const item = state.cart[itemIndex];
            if (item && /\bremove\b|delete_outline/.test(label.toLowerCase())) {
                event.preventDefault();
                event.stopPropagation();
                state.cart.splice(itemIndex, 1);
                saveState();
                renderCart();
                return;
            }
            if (item && /\bedit\b|tune/.test(label.toLowerCase())) {
                event.preventDefault();
                event.stopPropagation();
                state.editingIndex = itemIndex;
                saveState();
                go('food');
                return;
            }
            if (item && /\b(add|remove)\b/.test((label || iconName).toLowerCase())) {
                event.preventDefault();
                event.stopPropagation();
                const delta = /remove/.test((label || iconName).toLowerCase()) ? -1 : 1;
                item.quantity = Math.max(1, item.quantity + delta);
                saveState();
                renderCart();
                return;
            }
        }

        if (page === screens.cart && control.title === 'Remove promo') {
            event.preventDefault();
            event.stopPropagation();
            state.coupon = null;
            state.couponInitialized = true;
            saveState();
            renderCart();
            return;
        }

        if (page === screens.help && /raise ticket/i.test(label)) {
            const form = document.querySelector('form');
            if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        if (page === screens.profile && control.id === 'save-profile-btn') {
            state.profile = Array.from(document.querySelectorAll('#edit-profile-form input')).map(function (input) {
                return input.value;
            });
            saveState();
        }

        if (page === screens.help && /order issues/i.test(label)) {
            go('tracking');
            return;
        }

        if (/^(filters?|tune)\b/i.test(label) && page === screens.search) {
            const filters = document.querySelectorAll('main button');
            filters.forEach(function (button) {
                if (/^(all|veg|non-veg|rating|under|<|offers|pizzas|burgers|chaat|pasta|desserts)/i.test(cleanText(button))) {
                    button.hidden = !button.hidden;
                }
            });
            return;
        }

        if (/clear cart/.test(label.toLowerCase())) {
            state.cart = [];
            state.cartInitialized = true;
            saveState();
            renderCart();
            return;
        }

        if (/^(gpay|phonepe|paytm|google pay)/i.test(label)) {
            state.payment = label;
            saveState();
        }

        if (/\b(add to cart|add to crave cart|add|grab deal|order now)\b/i.test(label) &&
            !/address|add new|add location|add note|add to favourites/i.test(label)) {
            if ((control.getAttribute('onclick') || '').includes('customizer-sheet') &&
                !/add to cart/i.test(label)) {
                const customizer = document.getElementById('customizer-sheet');
                if (customizer) customizer.style.zIndex = '60';
                return;
            }
            addToCart(getProduct(control));
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (/place order/.test(label.toLowerCase())) {
            event.preventDefault();
            event.stopPropagation();
            const order = {
                id: 'NR' + Date.now().toString().slice(-8),
                placedAt: new Date().toISOString(),
                items: state.cart.slice(),
                address: state.address || 'Flat 402, Connaught Place',
                coupon: state.coupon,
                payment: state.payment
            };
            state.orders.unshift(order);
            state.cart = [];
            state.cartInitialized = true;
            state.coupon = null;
            state.couponInitialized = true;
            saveState();
            go('success');
            return;
        }

        if (/apply coupon|apply code|offers/.test(label.toLowerCase()) && page === screens.checkout) {
            go('offers');
            return;
        }
        if (/change/.test(label.toLowerCase()) && page === screens.checkout) {
            go('addresses');
            return;
        }
        if (/^continue shopping|explore menu/i.test(label)) {
            go('dining');
            return;
        }
        if (/sign out|logout/i.test(label.toLowerCase())) {
            go('login');
            return;
        }
        if (/view cart|view crave tray/.test(label.toLowerCase())) {
            go('cart');
            return;
        }

        if ([screens.dining, screens.search, screens.explore, screens.restaurant, screens.favourites].includes(page) &&
            control.tagName === 'BUTTON' &&
            !/\b(add|add to cart|order now|grab deal|view menu|view all|see all|search|continue|back)\b/i.test(label)) {
            filterCards(label);
            return;
        }

        const destination = routeFromLabel(label, control);
        if (destination) {
            if (destination === 'search' && page === screens.search) {
                const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]');
                if (searchInput) searchInput.focus();
                return;
            }
            if (control.tagName === 'A') {
                event.preventDefault();
                event.stopPropagation();
            }
            go(destination);
            return;
        }

        if (/start chat|call me|connect/i.test(label)) {
            window.alert('This contact option is a demo. No chat or call service is connected.');
            return;
        }
        if (/invoice\s*\(pdf\)|download invoice/i.test(label)) {
            window.print();
            return;
        }
        if (/contact driver/i.test(label)) {
            window.alert('Driver contact is unavailable in this demo. No delivery service is connected.');
            return;
        }
        if (control.getAttribute('aria-label') === 'More Options') {
            window.alert('Additional order actions are unavailable in this demo.');
            return;
        }

        const productCard = findProductCard(control);
        if (productCard) {
            if (control.tagName === 'A') event.preventDefault();
            go(page === screens.home || page === screens.explore ? 'restaurant' : 'food');
            return;
        }

        const clickableCard = control.closest('article');
        if (clickableCard && !control.closest('button')) {
            const route = routeFromLabel(cleanText(clickableCard), clickableCard);
            if (route) go(route);
        }
    }

    function onSubmit(event) {
        if (event.target.getAttribute('onsubmit')) return;
        event.preventDefault();
        showTicketConfirmation();
        event.target.reset();
    }

    function filterCards(label) {
        const category = label.replace(/[\d(),%★+]/g, '').trim().toLowerCase();
        if (/^(filter|filters|sort by|price|recently added)$/.test(category)) return;
        if (!category || /^all$/.test(category) || /^clear all$/.test(category)) {
            productCards().forEach(function (card) {
                card.hidden = false;
            });
            return;
        }
        if (/^non.?veg/.test(category)) {
            productCards().forEach(function (card) {
                card.hidden = !/non.?veg/i.test(cleanText(card));
            });
            return;
        }
        if (/^pure veg|^veg only/.test(category)) {
            productCards().forEach(function (card) {
                const text = cleanText(card);
                card.hidden = !/\bveg\b/i.test(text) || /non.?veg/i.test(text);
            });
            return;
        }
        if (/^bestseller/.test(category)) {
            productCards().forEach(function (card) {
                card.hidden = !/bestseller|best seller/i.test(cleanText(card));
            });
            return;
        }
        if (/^offers/.test(category)) {
            productCards().forEach(function (card) {
                card.hidden = !/off|deal|offer/i.test(cleanText(card));
            });
            return;
        }
        if (/^<\s*min|^min/.test(category)) {
            productCards().forEach(function (card) {
                const time = cleanText(card).match(/(\d+)\s*mins?/i);
                card.hidden = !time || Number(time[1]) >= 30;
            });
            return;
        }
        productCards().forEach(function (card) {
            const text = cleanText(card).toLowerCase();
            const price = numberFromText(text);
            if (category.includes('under')) {
                const amount = Number(category.match(/\d+/)?.[0]) || 0;
                card.hidden = !amount || !price || price >= amount;
                return;
            }
            if (category.includes('rating')) {
                card.hidden = !/4\.[5-9]|5\.0/.test(text);
                return;
            }
            card.hidden = !text.includes(category);
        });
    }

    function onSearch(event) {
        const input = event.target;
        if (page === screens.orders && input.matches('input[placeholder*="Search orders" i]')) {
            const query = input.value.trim().toLowerCase();
            document.querySelectorAll('#section-ongoing .bg-surface-container-lowest, #section-delivered .bg-surface-container-lowest, #section-cancelled .bg-surface-container-lowest').forEach(function (card) {
                card.hidden = query !== '' && !cleanText(card).toLowerCase().includes(query);
            });
            return;
        }
        if (!input.matches('input[type="search"], input[placeholder*="Search" i], input[placeholder*="search" i]')) return;
        const query = input.value.trim().toLowerCase();
        productCards().forEach(function (card) {
            card.hidden = query !== '' && !cleanText(card).toLowerCase().includes(query);
        });
    }

    function initialize() {
        installNavigation();
        parseExistingCart();
        initializeDemoCoupon();
        initializeFavourites();
        renderCart();
        renderFavourites();
        renderCheckout();
        renderAddresses();
        renderDemoOrders();
        if (page === screens.profile && Array.isArray(state.profile)) {
            document.querySelectorAll('#edit-profile-form input').forEach(function (input, index) {
                if (state.profile[index] !== undefined) input.value = state.profile[index];
            });
        }
        if (page === screens.checkout && state.payment) {
            const paymentLabel = document.getElementById('summary-pay-method');
            if (paymentLabel) paymentLabel.textContent = 'Pay via ' + state.payment;
        }
        updateCartBadges();
        document.addEventListener('click', onClick, true);
        document.addEventListener('submit', onSubmit);
        document.addEventListener('input', onSearch);
        document.addEventListener('change', function (event) {
            if (page === screens.cart && event.target.matches('input[type="checkbox"]')) renderCart();
        });
        document.addEventListener('focusin', function (event) {
            if (page === screens.home && event.target.matches('input[type="search"], input[placeholder*="search" i]')) {
                go('search');
            }
        });
        document.querySelectorAll('nav [data-path]').forEach(function (link) {
            link.addEventListener('click', function (event) {
                event.preventDefault();
            });
        });
    }

    initialize();
}());
