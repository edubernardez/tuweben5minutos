/* =========================================
   SISTEMA DE CARRITO (CART SYSTEM)
   ========================================= */

const cart = {
    items: [],
    total: 0,

    init: () => {
        // 1. CARGA SEGURA (Proteccion contra datos corruptos)
        try {
            const saved = localStorage.getItem("cart_v1");
            if (saved) {
                const parsed = JSON.parse(saved);
                // Validamos que sea un array y que las cantidades sean numeros
                const esValido = Array.isArray(parsed) && parsed.every(i => typeof i.qty === 'number' && !isNaN(i.qty));
                
                if (esValido) {
                    cart.items = parsed;
                } else {
                    console.warn("Datos del carrito corruptos. Reseteando...");
                    localStorage.removeItem("cart_v1");
                    cart.items = [];
                }
            }
        } catch (e) {
            console.error("Error cargando carrito:", e);
            localStorage.removeItem("cart_v1");
            cart.items = [];
        }

        // 2. Calcular totales iniciales
        cart.updateCounter();

        // 3. EVENTOS DE APERTURA (Botones del header y flotante)
        const openBtns = [document.getElementById("cartOpenBtn"), document.getElementById("floatCartBtn")];
        openBtns.forEach(btn => {
            if(btn) btn.addEventListener("click", () => cart.toggleModal());
        });

        const closeBtn = document.getElementById("cartCloseBtn");
        if(closeBtn) closeBtn.addEventListener("click", () => cart.toggleModal());

        // 4. EVENTOS INTERNOS DEL CARRITO (Delegacion de eventos)
        // Esto permite que los botones de + y - funcionen aunque se redibuje el carrito
        const container = document.getElementById("cartItemsContainer");
        if (container) {
            container.addEventListener("click", (e) => {
                const btn = e.target.closest("button");
                if (!btn) return;

                const id = parseInt(btn.dataset.id);
                const action = btn.dataset.action;

                if (action === "add") cart.add(id);
                if (action === "sub") cart.subtract(id);
                if (action === "del") cart.remove(id);
                if (action === "close") cart.toggleModal(); // Boton "Ver productos" si esta vacio
            });
        }

        // 5. Boton Checkout (Finalizar Compra)
        const checkoutBtn = document.getElementById("cartCheckoutBtn");
        if(checkoutBtn) checkoutBtn.addEventListener("click", cart.checkout);
    },

    add: (id) => {
        // Buscamos en la base de datos global (PRODUCTOS)
        const product = PRODUCTOS.find(p => p.id === id);
        if (!product) return;

        const existing = cart.items.find(i => i.id === id);

        if (existing) {
            existing.qty++;
        } else {
            // Guardamos una copia del producto para no depender de si cambia el catalogo despues
            cart.items.push({ 
                id: product.id,
                nombre: product.nombre,
                precio: product.precio,
                imagen: product.imagen,
                qty: 1 
            });
        }

        cart.save();
        cart.render(); 
        cart.animarBoton();
    },

    subtract: (id) => {
        const item = cart.items.find(i => i.id === id);
        if (!item) return;

        item.qty--;
        if (item.qty <= 0) {
            cart.remove(id);
        } else {
            cart.save();
            cart.render();
        }
    },

    remove: (id) => {
        cart.items = cart.items.filter(i => i.id !== id);
        cart.save();
        cart.render();
    },

    save: () => {
        localStorage.setItem("cart_v1", JSON.stringify(cart.items));
        cart.updateCounter();
    },

    updateCounter: () => {
        let totalQty = 0;
        let totalPrice = 0;

        cart.items.forEach(item => {
            const q = Number(item.qty) || 0;
            const p = Number(item.precio) || 0;
            totalQty += q;
            totalPrice += (p * q);
        });

        cart.total = totalPrice;

        // Actualizar UI (Burbujas y textos de total)
        const badge = document.getElementById("headerCartBadge");
        const countHeader = document.getElementById("cartCountHeader");
        const totalEl = document.getElementById("cartFinalTotal");
        const floatTotal = document.getElementById("floatTotal");
        const floatBtn = document.getElementById("floatCartBtn");

        const qtyDisplay = isNaN(totalQty) ? "0" : String(totalQty);

        if (badge) badge.textContent = qtyDisplay;
        if (countHeader) countHeader.textContent = qtyDisplay;
        
        // Usamos la moneda definida en data.js
        const moneda = (typeof INFO_NEGOCIO !== 'undefined') ? INFO_NEGOCIO.moneda : "$";
        const totalFormatted = moneda + cart.total.toLocaleString("es-ES");
        
        if (totalEl) totalEl.textContent = totalFormatted;
        if (floatTotal) floatTotal.textContent = totalFormatted;

        // Mostrar/Ocultar boton flotante segun si hay productos
        if (floatBtn) {
            if (totalQty > 0) floatBtn.classList.remove("hidden");
            else floatBtn.classList.add("hidden");
        }
    },

    animarBoton: () => {
        const btn = document.getElementById("floatCartBtn");
        const badge = document.getElementById("headerCartBadge");
        
        if (btn && !btn.classList.contains("hidden")) {
            btn.classList.remove("shake");
            void btn.offsetWidth; // Trigger reflow para reiniciar animacion
            btn.classList.add("shake");
        }
        
        if (badge) {
            badge.style.transform = "scale(1.2)";
            setTimeout(() => badge.style.transform = "scale(1)", 200);
        }
    },

    render: () => {
        const container = document.getElementById("cartItemsContainer");
        const template = document.getElementById("cart-item-template");
        
        if (!container || !template) return;
        
        container.innerHTML = "";

        // Si esta vacio
        if (cart.items.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding:40px 20px; color:var(--text-muted); display:flex; flex-direction:column; align-items:center; gap:15px;">
                    <i class="ri-shopping-cart-2-line" style="font-size:3.5rem; opacity:0.2;"></i>
                    <p style="font-size:1.1rem; margin:0;">Tu carrito esta vacio</p>
                    <button data-action="close" style="background:none; border:none; color:var(--primary); font-weight:700; cursor:pointer; font-size:1rem; padding:10px;">
                        Ver productos
                    </button>
                </div>
            `;
            return;
        }

        const fragment = document.createDocumentFragment();
        const moneda = (typeof INFO_NEGOCIO !== 'undefined') ? INFO_NEGOCIO.moneda : "$";

        cart.items.forEach(item => {
            const clone = template.content.cloneNode(true);
            
            // --- AQUI ESTA EL ARREGLO DE LA IMAGEN ---
            const img = clone.querySelector(".cart-item__img");
            img.src = item.imagen || "https://placehold.co/100x100/e2e8f0/64748b?text=Sin+Foto";
            img.alt = item.nombre;
            
            // Si falla la carga, ponemos la imagen generica
            img.onerror = function() { 
                this.src = "https://placehold.co/100x100/e2e8f0/64748b?text=Sin+Foto"; 
            };
            // -----------------------------------------
            
            clone.querySelector(".cart-item__name").textContent = item.nombre;
            
            const precioTotalItem = (item.precio * item.qty).toLocaleString("es-ES");
            clone.querySelector(".cart-item__price").textContent = `${moneda}${precioTotalItem}`;
            
            clone.querySelector(".qty-control__qty").textContent = item.qty;

            // Asignamos IDs y Acciones a los botones
            const btnAdd = clone.querySelector(".btn-add");
            btnAdd.dataset.id = item.id;
            btnAdd.dataset.action = "add";

            const btnSub = clone.querySelector(".btn-sub");
            btnSub.dataset.id = item.id;
            btnSub.dataset.action = "sub";

            const btnDel = clone.querySelector(".cart-item__delete");
            btnDel.dataset.id = item.id;
            btnDel.dataset.action = "del";

            fragment.appendChild(clone);
        });

        container.appendChild(fragment);
    },

    // ... dentro de const cart = { ...

    toggleModal: () => {
        const modal = document.getElementById("modalCart");
        if (!modal) return;
        
        const isActive = modal.classList.contains("active");
        
        if (!isActive) {
            // ABRIR CARRITO
            cart.render();
            modal.classList.add("active");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open"); 
            
            // --- NUEVO: AVISAR AL EDITOR QUE ESCONDA EL BOTÓN ---
            window.parent.postMessage({ action: "TOGGLE_UI_BUTTONS", show: false }, "*");
            // ----------------------------------------------------

            const panel = modal.querySelector(".modal-panel");
            if (panel) {
                setTimeout(() => { panel.style.transform = "translateX(0)"; }, 10);
            }

        } else {
            // CERRAR CARRITO
            const panel = modal.querySelector(".modal-panel");
            if (panel) {
                panel.style.transform = "translateX(100%)";
            }

            setTimeout(() => {
                modal.classList.remove("active");
                modal.setAttribute("aria-hidden", "true");
                document.body.classList.remove("modal-open");

                // --- NUEVO: AVISAR AL EDITOR QUE MUESTRE EL BOTÓN ---
                window.parent.postMessage({ action: "TOGGLE_UI_BUTTONS", show: true }, "*");
                // ----------------------------------------------------

            }, 300);
        }
    },
    // ... resto del código ...

    checkout: () => {
        if (cart.items.length === 0) return;

        const moneda = (typeof INFO_NEGOCIO !== 'undefined') ? INFO_NEGOCIO.moneda : "$";
        // Usamos el WhatsApp actualizado o el por defecto
        const telefono = (typeof INFO_NEGOCIO !== 'undefined') ? INFO_NEGOCIO.whatsapp : "59899000000";

        let mensaje = `Hola! Quiero realizar el siguiente pedido:\n\n`;

        cart.items.forEach(item => {
            const subtotal = (item.precio * item.qty).toLocaleString("es-ES");
            mensaje += `• (${item.qty}) ${item.nombre} - ${moneda}${subtotal}\n`;
        });

        const totalFinal = cart.total.toLocaleString("es-ES");
        mensaje += `\n*Total: ${moneda}${totalFinal}*`;
        mensaje += `\n\nQuedo a la espera de confirmacion. Gracias!`;

        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    }
};

// Iniciamos el carrito cuando el DOM este listo
document.addEventListener("DOMContentLoaded", cart.init);