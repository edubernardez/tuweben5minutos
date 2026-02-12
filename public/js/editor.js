let productos = JSON.parse(localStorage.getItem('datos_productos')) || [];
let editandoIndex = -1;

// AL CARGAR LA PÁGINA
window.onload = function() {
    renderizarGrid();
};

// 1. CARGAR DATOS MANUALES
function cargarDesdeCodigo() {
    const texto = document.getElementById('inputCode').value;
    try {
        let jsonStr = texto;
        if (texto.includes('=')) jsonStr = texto.split('=')[1];
        if (jsonStr.trim().endsWith(';')) jsonStr = jsonStr.trim().slice(0, -1);
        
        const nuevos = eval(jsonStr); 
        if (!Array.isArray(nuevos)) throw new Error("Lista inválida");
        
        productos = nuevos;
        guardarEnMemoria(); // <--- CLAVE: Guardamos al cargar
        renderizarGrid();
        alert(`¡Éxito! Se cargaron ${productos.length} productos.`);
    } catch (e) {
        alert("Error al leer el código.");
    }
}

// 2. RENDERIZAR GRID
function renderizarGrid() {
    const grid = document.getElementById('gridProductos');
    document.getElementById('count').innerText = productos.length;
    grid.innerHTML = "";

    if(productos.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:50px;color:#666">No hay productos. Agrega uno.</div>';
        return;
    }

    productos.forEach((p, index) => {
        const img = p.foto || 'https://placehold.co/300x300/222/999?text=Sin+Foto';
        grid.innerHTML += `
            <div class="product-card-edit">
                <img src="${img}" alt="Foto">
                <div class="info">
                    <h4>${p.nombre}</h4>
                    <p>$${p.precio}</p>
                </div>
                <div class="actions">
                    <button onclick="editar(${index})">✏️</button>
                    <button class="delete" onclick="eliminar(${index})">🗑️</button>
                </div>
            </div>
        `;
    });
    generarCodigoFinal();
}

// 3. ABM
function abrirModal() {
    document.getElementById('editIndex').value = -1;
    document.getElementById('pNombre').value = "";
    document.getElementById('pPrecio').value = "";
    document.getElementById('pPromo').value = "";
    document.getElementById('pFoto').value = "";
    document.getElementById('pDesc').value = "";
    document.getElementById('modalProducto').classList.add('open');
    editandoIndex = -1;
}

function editar(index) {
    const p = productos[index];
    editandoIndex = index;
    document.getElementById('pNombre').value = p.nombre;
    document.getElementById('pPrecio').value = p.precio;
    document.getElementById('pPromo').value = p.precioPromo || "";
    document.getElementById('pFoto').value = p.foto || "";
    document.getElementById('pDesc').value = p.descripcion || "";
    document.getElementById('modalProducto').classList.add('open');
}

function cerrarModal() {
    document.getElementById('modalProducto').classList.remove('open');
}

function guardarProducto() {
    const nuevoProd = {
        id: Date.now(),
        nombre: document.getElementById('pNombre').value,
        precio: parseFloat(document.getElementById('pPrecio').value) || 0,
        precioPromo: parseFloat(document.getElementById('pPromo').value) || null,
        foto: document.getElementById('pFoto').value,
        descripcion: document.getElementById('pDesc').value
    };

    if (editandoIndex === -1) {
        productos.push(nuevoProd);
    } else {
        nuevoProd.id = productos[editandoIndex].id; 
        productos[editandoIndex] = nuevoProd;
    }

    guardarEnMemoria(); // <--- IMPORTANTE
    cerrarModal();
    renderizarGrid();
}

function eliminar(index) {
    if (confirm("¿Borrar?")) {
        productos.splice(index, 1);
        guardarEnMemoria(); // <--- IMPORTANTE
        renderizarGrid();
    }
}

// 4. GUARDADO AUTOMÁTICO (EL PUENTE)
function guardarEnMemoria() {
    localStorage.setItem('datos_productos', JSON.stringify(productos));
    generarCodigoFinal();
}

function generarCodigoFinal() {
    const jsonStr = JSON.stringify(productos, null, 4);
    document.getElementById('outputCode').value = `const PRODUCTOS = ${jsonStr};`;
}

function copiarOutput() {
    const copyText = document.getElementById("outputCode");
    copyText.select();
    document.execCommand("copy");
    alert("Código copiado.");
}