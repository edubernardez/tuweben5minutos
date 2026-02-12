// CONFIGURACIÓN: Ruta corregida para salir de 'public' y entrar a 'themes'
const TEMPLATE_BASE_URL = "../themes/v1-base/index.html";

// VARIABLES DE ESTADO
let isMobilePanelOpen = false;

// 1. ABRIR EDITOR Y CARGAR DATOS
function abrirEditor() {
  const brandName = document.getElementById("brandName").value;
  const rubro = document.getElementById("businessType").value;
  const whatsapp = document.getElementById("whatsappNumber").value;

  if (!brandName) {
    alert("¡Escribe el nombre de tu marca para empezar la magia!");
    return;
  }

  // Mostrar el Overlay + bloquear scroll del fondo
  document.getElementById("editorOverlay").classList.add("active");
  document.body.classList.add("modal-open");

  // Cargar el Template
  const iframe = document.getElementById("previewFrame");

  if (iframe.getAttribute("src") === "about:blank") {
    iframe.src = TEMPLATE_BASE_URL; // Usamos la nueva ruta
    iframe.onload = function () {
      enviarDatosAlTemplate(brandName, rubro, "#3b82f6", whatsapp);
    };
  } else {
    enviarDatosAlTemplate(brandName, rubro, null, whatsapp);
  }
}

// 2. CERRAR EDITOR
function cerrarEditor() {
  if (window.innerWidth <= 768 && isMobilePanelOpen) {
    toggleMobileEditor();
    return;
  }

  document.getElementById("editorOverlay").classList.remove("active");
  document.body.classList.remove("modal-open");

  // Reset móvil
  const panel = document.getElementById("sidebarPanel");
  const btn = document.getElementById("mobileToggle");
  panel.classList.remove("mobile-open");
  if (btn) btn.style.display = "flex";
  isMobilePanelOpen = false;
}

// Vinculamos el botón de cerrar si existe en el DOM
document.querySelector(".close-btn")?.addEventListener("click", cerrarEditor);

// 3. TOGGLE MÓVIL
function toggleMobileEditor() {
  const panel = document.getElementById("sidebarPanel");
  const btn = document.getElementById("mobileToggle");

  isMobilePanelOpen = !isMobilePanelOpen;

  if (isMobilePanelOpen) {
    panel.classList.add("mobile-open");
    btn.style.display = "none";
  } else {
    panel.classList.remove("mobile-open");
    btn.style.display = "flex";
  }
}

// 4. COMUNICACIÓN CON EL IFRAME
function enviarDatosAlTemplate(nombre, rubro, color, whatsapp) {
  const iframe = document.getElementById("previewFrame");
  const targetOrigin = "*";

  const data = {
    action: "UPDATE_SITE",
    brand: nombre,
    niche: rubro,
    primaryColor: color,
    whatsapp: whatsapp
  };

  iframe.contentWindow.postMessage(data, targetOrigin);
}

// 5. CAMBIOS VISUALES (Colores y Temas)
function cambiarColor(colorHex, el) {
  document.querySelectorAll(".color-dot").forEach((dot) => dot.classList.remove("active"));
  if (el) el.classList.add("active");

  const iframe = document.getElementById("previewFrame");
  iframe.contentWindow.postMessage(
    { action: "CHANGE_COLOR", color: colorHex },
    "*"
  );
}

function cambiarTemplate(templateId, el) {
  document.querySelectorAll(".template-item").forEach((c) => c.classList.remove("active"));
  if (el) el.classList.add("active");

  const iframe = document.getElementById("previewFrame");
  iframe.contentWindow.postMessage(
    { action: "CHANGE_THEME", theme: templateId },
    "*"
  );
}

/* =========================================
   LISTENER DE UI (Ocultar botón personalizar)
   ========================================= */
window.addEventListener("message", (event) => {
    if (event.data.action === "TOGGLE_UI_BUTTONS") {
        const btnPersonalizar = document.getElementById("mobileToggle");
        
        if (btnPersonalizar) {
            if (event.data.show === false) {
                btnPersonalizar.style.transition = "opacity 0.3s ease";
                btnPersonalizar.style.opacity = "0";
                btnPersonalizar.style.pointerEvents = "none";
            } else {
                btnPersonalizar.style.opacity = "1";
                btnPersonalizar.style.pointerEvents = "auto";
            }
        }
    }
});