/* --- 1. FUNCIONES VISUALES (Interacción del Formulario) --- */

function toggleForm() {
    // Muestra u oculta secciones según si venden Productos, Servicios o Ambos
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    const p = document.getElementById('seccion-productos');
    const s = document.getElementById('seccion-servicios');
    
    if (tipo === 'productos') { 
        p.style.display = 'block'; 
        s.style.display = 'none'; 
    } else if (tipo === 'servicios') { 
        p.style.display = 'none'; 
        s.style.display = 'block'; 
    } else { 
        p.style.display = 'block'; 
        s.style.display = 'block'; 
    }
}

function seleccionarColor(el, color) {
    // Marca el círculo de color seleccionado visualmente y guarda el valor
    document.getElementById('color').value = color;
    document.querySelectorAll('.color-swatch').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
}

function seleccionarEstilo(el, estilo) {
    // Marca la tarjeta de plantilla seleccionada visualmente y guarda el valor
    document.getElementById('estilo').value = estilo;
    document.querySelectorAll('.template-card').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
}

/* --- 2. MOTOR GENERADOR (El Enrutador) --- */

function generarWeb() {
    // A. CAPTURAR DATOS DEL CLIENTE
    const datosCliente = {
        marca: document.getElementById('marca').value || "Mi Tienda",
        rubro: document.getElementById('rubro').value,
        whatsapp: document.getElementById('whatsapp').value,
        color: document.getElementById('color').value,
        estilo: document.getElementById('estilo').value, // Importante: dark, moderno, luxury
        
        // Textos nuevos
        heroTitle: document.getElementById('heroTitle').value || "Bienvenidos",
        heroSubtitle: document.getElementById('heroSubtitle').value || "",
        instagram: document.getElementById('instagram').value,

        productos: [] 
    };

    // B. RECUPERAR PRODUCTOS (Prioridad: Editor Visual > Manual)
    const productosEnMemoria = JSON.parse(localStorage.getItem('datos_productos'));
    
    if (productosEnMemoria && productosEnMemoria.length > 0) {
        // Si usaron el Editor Visual, tomamos esos datos limpios
        datosCliente.productos = productosEnMemoria;
    } else {
        // Si escribieron a mano en el cuadro de texto, lo procesamos
        const textoManual = document.getElementById('listaProductos').value;
        datosCliente.productos = parsearProductosManuales(textoManual);
    }

    // C. GUARDAR EN LA "MOCHILA" (LocalStorage)
    // Esto permite que la plantilla reciba los datos al abrirse
    localStorage.setItem('DEMO_DATA', JSON.stringify(datosCliente));

    // D. REDIRECCIONAR A LA CARPETA CORRECTA
    const estilo = datosCliente.estilo;

    // Rutas relativas a donde está el generador.html
    if (estilo === 'dark' || estilo === 'impacto') {
        window.location.href = "templates/dark/index.html";
    } 
    else if (estilo === 'luxury') {
        // Si aún no creaste la carpeta luxury, puedes enviarlo a modern o dark mientras tanto
        window.location.href = "templates/luxury/index.html"; 
    } 
    else {
        // Por defecto (Moderno, Minimal) va a la carpeta modern
        window.location.href = "templates/modern/index.html";
    }
}

/* --- 3. FUNCIONES AUXILIARES --- */

// Convierte texto "Pizza, 1200" en objeto {nombre: "Pizza", precio: 1200}
function parsearProductosManuales(texto) {
    if (!texto) return [];
    return texto.split('\n').map(linea => {
        const partes = linea.split(',');
        if (partes.length >= 2) {
            return {
                nombre: partes[0].trim(),
                precio: partes[1].trim().replace('$', ''),
                foto: partes[2] ? partes[2].trim() : '' // La foto es opcional
            };
        }
        return null;
    }).filter(p => p !== null);
}