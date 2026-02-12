/* =========================================
   MOTOR HÍBRIDO: REAL (SUPABASE) + DEMO (LOCAL)
   ========================================= */

const app = {
  state: { categoriaActiva: "todos", productosVisibles: [], tienda: null },

  init: async () => {
    app.bindSearchEvents();
    app.bindGridEvents();
    app.bindGeneratorMessages();

    // DETECTOR DE MODO
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('s');

    if (slug) {
        console.log("🚀 Modo Real: DB");
        await app.fetchTienda(slug);
    } else {
        console.log("🎨 Modo Demo: Local");
        app.loadDemoData();
    }
  },

  // --- MODO REAL ---
  fetchTienda: async (slug) => {
    if(!window.supabase) return;
    const { data: tienda, error } = await window.supabase.from('tiendas').select('*').eq('slug', slug).single();
    if (error || !tienda) return;
    app.state.tienda = tienda;
    app.aplicarIdentidadReal(tienda);
    app.fetchProductos(tienda.id);
  },

  fetchProductos: async (tiendaId) => {
    const { data: prods } = await window.supabase.from('productos').select('*').eq('tienda_id', tiendaId).order('created_at', { ascending: false });
    if (prods) {
        window.PRODUCTOS = prods.map(p => ({ id: p.id, nombre: p.nombre, precio: p.precio, categoria: p.categoria || "todos", imagen: p.foto_url, stock: true }));
        app.renderizarTodo();
    }
  },

  aplicarIdentidadReal: (t) => {
    document.title = t.nombre_tienda;
    document.getElementById("brandName").textContent = t.nombre_tienda;
    document.getElementById("footerName").textContent = t.nombre_tienda;
    app.applyTheme(t.tema);
    if(t.color_primario) document.documentElement.style.setProperty("--primary", t.color_primario);
    if (typeof INFO_NEGOCIO !== "undefined") {
        INFO_NEGOCIO.nombre = t.nombre_tienda;
        INFO_NEGOCIO.whatsapp = t.whatsapp;
        const linkWsp = `https://wa.me/${t.whatsapp}`;
        document.getElementById("wspFloat").href = linkWsp;
        if(t.config_json?.promo_texto) {
            INFO_NEGOCIO.anuncios = [t.config_json.promo_texto];
            ui.iniciarRotacionAnuncios();
        }
    }
  },

  // --- MODO DEMO (Para el Generador) ---
  loadDemoData: () => {
    try {
        const saved = JSON.parse(localStorage.getItem("DEMO_DATA"));
        if(saved) {
            if(saved.marca) document.getElementById("brandName").textContent = saved.marca;
            if(saved.estilo) app.applyTheme(saved.estilo);
            if(saved.color) document.documentElement.style.setProperty("--primary", saved.color);
            if(saved.productos && saved.productos.length > 0) {
                // Si hay productos del generador, los usamos
                window.PRODUCTOS = saved.productos.map((p, i) => ({ id: i, nombre: p.nombre, precio: p.precio, imagen: p.foto, categoria: "todos" }));
            }
        }
    } catch(e) {}
    
    if(!window.PRODUCTOS) window.PRODUCTOS = CATALOGOS['moda']; // Fallback
    app.renderizarTodo();
  },

  // --- RENDER & UI ---
  renderizarTodo: () => {
    app.state.productosVisibles = [...window.PRODUCTOS];
    app.renderCategories();
    app.renderProducts(app.state.productosVisibles);
  },

  applyTheme: (theme) => {
    document.body.classList.remove("theme-dark", "theme-luxury");
    if(theme === "dark") document.body.classList.add("theme-dark");
    if(theme === "luxury") document.body.classList.add("theme-luxury");
  },

  renderCategories: () => {
    const container = document.getElementById("categoriasContainer");
    if (!container) return;
    const cats = new Set(["todos"]);
    window.PRODUCTOS.forEach(p => { if(p.categoria) cats.add(p.categoria.toLowerCase()); });
    container.innerHTML = "";
    cats.forEach(c => {
        const btn = document.createElement("button");
        btn.className = "cat-pill" + (c === "todos" ? " active" : "");
        btn.textContent = c.charAt(0).toUpperCase() + c.slice(1);
        btn.onclick = () => app.filterByCat(c, btn);
        container.appendChild(btn);
    });
  },

  filterByCat: (cat, btn) => {
    document.querySelectorAll(".cat-pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    app.renderProducts(cat === "todos" ? window.PRODUCTOS : window.PRODUCTOS.filter(p => p.categoria === cat));
  },

  renderProducts: (lista) => {
    const grid = document.getElementById("gridProductos");
    const temp = document.getElementById("card-template");
    grid.innerHTML = "";
    lista.forEach(p => {
        const clone = temp.content.cloneNode(true);
        clone.querySelector(".prod-img").src = p.imagen || "https://placehold.co/400?text=Sin+Foto";
        clone.querySelector(".prod-title").textContent = p.nombre;
        clone.querySelector(".price-main").textContent = `$${p.precio}`;
        clone.querySelector(".btn-add").onclick = () => cart.add(p.id);
        grid.appendChild(clone);
    });
  },

  bindSearchEvents: () => {
    document.getElementById("searchInput")?.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase();
        app.renderProducts(window.PRODUCTOS.filter(p => p.nombre.toLowerCase().includes(term)));
    });
  },

  bindGridEvents: () => {},

  bindGeneratorMessages: () => {
    window.addEventListener("message", (e) => {
        const d = e.data;
        if(d.action === "CHANGE_THEME") app.applyTheme(d.theme);
        if(d.action === "CHANGE_COLOR") document.documentElement.style.setProperty("--primary", d.color);
    });
  }
};

document.addEventListener("DOMContentLoaded", app.init);