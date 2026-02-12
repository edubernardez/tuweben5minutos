/* =========================================
   UI MANAGER (TOASTS, MODALS & ANUNCIOS)
   ========================================= */

const ui = {
    state: {
        indiceAnuncio: 0,
        intervaloAnuncio: null,
    },

    init: () => {
        ui.bindGlobalEvents();
        ui.iniciarRotacionAnuncios();
    },

    bindGlobalEvents: () => {
        document.getElementById("promoCloseBtn")?.addEventListener("click", ui.cerrarPromo);
        
        // Listener para botones de información
        document.querySelectorAll("[data-open-info]").forEach(btn => {
            btn.addEventListener("click", () => ui.abrirModalInfo(btn.getAttribute("data-open-info")));
        });
        
        document.getElementById("infoCloseBtn")?.addEventListener("click", ui.cerrarModalInfo);

        // Clic fuera del modal para cerrar
        window.addEventListener("click", (e) => {
            if (e.target.classList.contains("modal-backdrop")) {
                if (e.target.id === "modalInfo") ui.cerrarModalInfo();
                if (e.target.id === "modalCart" && window.cart) window.cart.toggleModal();
            }
        });
    },

    // --- ANUNCIOS (TIPO CARRUSEL INFINITO) ---
    iniciarRotacionAnuncios: () => {
        const promoText = document.getElementById("promoText");
        // Obtenemos los anuncios
        const anuncios = (typeof INFO_NEGOCIO !== 'undefined') ? INFO_NEGOCIO.anuncios : [];
        
        if (!promoText || !anuncios || anuncios.length === 0) return;
        
        // Limpiamos cualquier intervalo viejo si existiera para que no moleste
        if (ui.state.intervaloAnuncio) clearInterval(ui.state.intervaloAnuncio);
        
        // UNIMOS todos los anuncios en una sola frase larga con separadores
        // Usamos "&nbsp;" que son espacios en blanco para separar
        const textoLargo = anuncios.join("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
        
        // Lo inyectamos una sola vez (el CSS se encargará de moverlo)
        promoText.innerHTML = textoLargo;
        promoText.style.opacity = "1";
    },

    cerrarPromo: () => {
        const bar = document.getElementById("promoBar");
        if (bar) bar.style.display = "none";
    },

    // --- TOASTS ---
    toast: (mensaje, tipo = "info") => {
        const container = document.getElementById("toastContainer");
        if (!container) return;
        const toast = document.createElement("div");
        toast.className = "toast toast-enter";
        let icono = "ri-information-line";
        if (tipo === "success") icono = "ri-checkbox-circle-line";
        toast.innerHTML = `<i class="${icono}"></i><span>${mensaje}</span>`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    },

    // --- MODAL INFO (MEJORADO) ---
    abrirModalInfo: (tipo) => {
        const modal = document.getElementById("modalInfo");
        const content = document.getElementById("infoContent");
        const title = document.getElementById("infoTitle");
        
        if (!modal) return;

        // FIX: Bloquear scroll iOS
        document.body.classList.add("modal-open");

        let html = "";
        let tituloTexto = "Información"; 

        switch (tipo) {
            case "envios":
                tituloTexto = "Envíos y Entregas";
                html = `
                    <div class="info-section">
                        <div class="info-row">
                            <i class="ri-truck-line"></i>
                            <div class="info-text">
                                <h4>Envíos a todo el país</h4>
                                <p>Despachamos tu pedido dentro de las 24hs hábiles luego de confirmado el pago.</p>
                            </div>
                        </div>
                        <div class="info-row">
                            <i class="ri-map-pin-time-line"></i>
                            <div class="info-text">
                                <h4>Tiempos de entrega</h4>
                                <p>El tiempo estimado es de 24 a 72hs hábiles dependiendo de tu localidad.</p>
                            </div>
                        </div>
                        <div class="info-note">
                            <strong>Nota:</strong> Te enviaremos el código de seguimiento por WhatsApp apenas salga tu pedido.
                        </div>
                    </div>`;
                break;

            case "pagos":
                tituloTexto = "Métodos de Pago";
                html = `
                     <div class="info-section">
                        <div class="info-row">
                            <i class="ri-bank-card-2-line"></i>
                            <div class="info-text">
                                <h4>Tarjetas de Crédito/Débito</h4>
                                <p>Aceptamos todas las tarjetas. Podés pagar online de forma segura.</p>
                            </div>
                        </div>
                        <div class="info-row">
                            <i class="ri-smartphone-line"></i>
                            <div class="info-text">
                                <h4>Transferencia Bancaria</h4>
                                <p>Trabajamos con Brou, Santander e Itaú. (Verás los datos al finalizar).</p>
                            </div>
                        </div>
                        <div class="info-row">
                            <i class="ri-hand-coin-line"></i>
                            <div class="info-text">
                                <h4>Efectivo</h4>
                                <p>Podés abonar en redes de cobranza (Abitab/RedPagos) o al retirar.</p>
                            </div>
                        </div>
                    </div>`;
                break;

            case "cambios":
                tituloTexto = "Política de Cambios";
                html = `
                    <div class="info-section">
                        <div class="info-row">
                            <i class="ri-calendar-check-line"></i>
                            <div class="info-text">
                                <h4>Plazo de Cambio</h4>
                                <p>Tenés hasta 30 días corridos desde la fecha de compra para realizar cambios.</p>
                            </div>
                        </div>
                        <div class="info-row">
                            <i class="ri-shirt-line"></i>
                            <div class="info-text">
                                <h4>Condiciones</h4>
                                <p>La prenda debe estar sin uso, con etiqueta y en su bolsa original.</p>
                            </div>
                        </div>
                        <div class="info-note">
                            <strong>Importante:</strong> Los costos de envío por cambios corren por cuenta del cliente, salvo falla de fábrica.
                        </div>
                    </div>`;
                break;
        }
        
        if(title) title.textContent = tituloTexto;
        if(content) content.innerHTML = html;
        
        modal.classList.add("active");
    },

    // ESTA ES LA PARTE QUE FALTABA
    cerrarModalInfo: () => {
        const modal = document.getElementById("modalInfo");
        if (!modal) return;
        modal.classList.remove("active");
        
        // FIX: Desbloquear scroll iOS
        document.body.classList.remove("modal-open");
    }
}; // <--- IMPORTANTE: Cierre del objeto

// IMPORTANTE: Inicialización
document.addEventListener("DOMContentLoaded", ui.init);