// ============================================================
// ADMIN - Panel de Administración
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Verificar sesión
    const session = sessionStorage.getItem('adminSession');

    // Elementos del DOM (usando la estructura HTML)
    const loginContainer = document.getElementById('loginContainer');
    const adminHeader = document.getElementById('adminHeader');
    const adminPanel = document.querySelector('.admin-panel');
    const adminContent = document.getElementById('adminContent');
    const tabs = document.querySelectorAll('.admin-tabs button');

    // Ocultar todo al inicio
    if (loginContainer) loginContainer.style.display = 'none';
    if (adminHeader) adminHeader.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'none';

    if (session === 'true') {
        mostrarDashboard();
    } else {
        mostrarLogin();
    }

    // ============================================================
    // 1. MOSTRAR LOGIN
    // ============================================================
    function mostrarLogin() {
        if (loginContainer) loginContainer.style.display = 'block';
        if (adminHeader) adminHeader.style.display = 'none';
        if (adminPanel) adminPanel.style.display = 'none';

        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                const admin = Storage.getAdmin();

                if (email === admin.email && password === admin.password) {
                    sessionStorage.setItem('adminSession', 'true');
                    showToast('✅ Bienvenido administrador', 'success');
                    mostrarDashboard();
                } else {
                    showToast('❌ Credenciales incorrectas', 'error');
                }
            });
        }
    }

    // ============================================================
    // 2. MOSTRAR DASHBOARD
    // ============================================================
    function mostrarDashboard() {
        if (loginContainer) loginContainer.style.display = 'none';
        if (adminHeader) adminHeader.style.display = 'flex';
        if (adminPanel) adminPanel.style.display = 'block';

        // Botón cerrar sesión
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                sessionStorage.removeItem('adminSession');
                showToast('Sesión cerrada', 'success');
                mostrarLogin();
            });
        }

        // Eventos de los tabs (ya existen en el HTML)
        tabs.forEach(function(btn) {
            btn.addEventListener('click', function() {
                tabs.forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                renderAdminTab(btn.dataset.tab);
            });
        });

        // Cargar la primera pestaña
        renderAdminTab('categorias');
    }

    // ============================================================
    // 3. RENDER TAB
    // ============================================================
    function renderAdminTab(tab) {
        if (tab === 'categorias') renderCategorias(adminContent);
        else if (tab === 'eventos') renderEventos(adminContent);
        else if (tab === 'ventas') renderVentas(adminContent);
        else if (tab === 'reporte') renderReporte(adminContent);
    }

    // ============================================================
    // 4. CATEGORÍAS
    // ============================================================
    function renderCategorias(container) {
        const cats = Storage.getCategories();

        container.innerHTML = `
            <div class="section-header">
                <h3><i class="fas fa-tags"></i> Categorías</h3>
                <button class="btn-add-cat" id="addCatBtn">
                    <i class="fas fa-plus"></i> Agregar categoría
                </button>
            </div>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th style="text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cats.length === 0 ? `
                            <tr class="empty-row">
                                <td colspan="4">No hay categorías registradas</td>
                            </tr>
                        ` : cats.map(function(c) {
                            return `
                                <tr>
                                    <td>${c.id}</td>
                                    <td><strong>${c.nombre}</strong></td>
                                    <td>${c.descripcion || '-'}</td>
                                    <td style="text-align:center;white-space:nowrap;">
                                        <button class="btn-action btn-edit" data-id="${c.id}">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-action btn-del" data-id="${c.id}">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('addCatBtn').addEventListener('click', function() {
            const nombre = prompt('Ingrese el nombre de la categoría:');
            if (!nombre) return;
            const desc = prompt('Ingrese una descripción (opcional):') || '';
            const cats = Storage.getCategories();
            const newId = cats.length ? Math.max.apply(null, cats.map(function(c) { return c.id; })) + 1 : 1;
            cats.push({ id: newId, nombre: nombre, descripcion: desc });
            Storage.setCategories(cats);
            showToast('✅ Categoría agregada', 'success');
            renderAdminTab('categorias');
        });

        container.querySelectorAll('.btn-edit').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const id = Number(this.dataset.id);
                const cats = Storage.getCategories();
                const cat = cats.find(function(c) { return c.id === id; });
                if (!cat) return;
                const nuevoNombre = prompt('Nuevo nombre:', cat.nombre);
                if (nuevoNombre === null) return;
                const nuevaDesc = prompt('Nueva descripción:', cat.descripcion);
                cat.nombre = nuevoNombre || cat.nombre;
                cat.descripcion = nuevaDesc !== null ? nuevaDesc : cat.descripcion;
                Storage.setCategories(cats);
                showToast('✅ Categoría actualizada', 'success');
                renderAdminTab('categorias');
            });
        });

        container.querySelectorAll('.btn-del').forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (!confirm('¿Eliminar esta categoría?')) return;
                const id = Number(this.dataset.id);
                let cats = Storage.getCategories().filter(function(c) { return c.id !== id; });
                Storage.setCategories(cats);
                showToast('🗑️ Categoría eliminada', 'success');
                renderAdminTab('categorias');
            });
        });
    }

    // ============================================================
    // 5. EVENTOS
    // ============================================================
    function renderEventos(container) {
        const evs = Storage.getEvents();

        container.innerHTML = `
            <div class="section-header">
                <h3><i class="fas fa-calendar-alt"></i> Eventos</h3>
                <button class="btn-add-cat" id="addEventBtn">
                    <i class="fas fa-plus"></i> Agregar evento
                </button>
            </div>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Fecha</th>
                            <th>Ciudad</th>
                            <th style="text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${evs.length === 0 ? `
                            <tr class="empty-row">
                                <td colspan="7">No hay eventos registrados</td>
                            </tr>
                        ` : evs.map(function(e) {
                            return `
                                <tr>
                                    <td>${e.id}</td>
                                    <td><strong>${e.nombre}</strong></td>
                                    <td>${e.categoria}</td>
                                    <td>$${e.precio.toLocaleString()}</td>
                                    <td>${e.fecha}</td>
                                    <td>${e.ciudad}</td>
                                    <td style="text-align:center;white-space:nowrap;">
                                        <button class="btn-action btn-edit" data-id="${e.id}">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-action btn-del" data-id="${e.id}">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('addEventBtn').addEventListener('click', function() {
            const nombre = prompt('Nombre del evento:');
            if (!nombre) return;
            const categoria = prompt('Categoría:') || 'Pop';
            const precio = prompt('Precio (número):') || '0';
            const fecha = prompt('Fecha (YYYY-MM-DD):') || '2026-12-01';
            const hora = prompt('Hora (HH:MM):') || '20:00';
            const ciudad = prompt('Ciudad (Barranquilla, Bogotá, Bucaramanga, Medellín):') || 'Bogotá';
            const descripcion = prompt('Descripción breve:') || '';

            const evs = Storage.getEvents();
            const newId = evs.length ? Math.max.apply(null, evs.map(function(e) { return e.id; })) + 1 : 1;
            evs.push({
                id: newId,
                nombre: nombre,
                categoria: categoria,
                precio: Number(precio) || 0,
                fecha: fecha,
                hora: hora,
                ciudad: ciudad,
                descripcion: descripcion
            });
            Storage.setEvents(evs);
            showToast('✅ Evento creado', 'success');
            renderAdminTab('eventos');
        });

        container.querySelectorAll('.btn-edit').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const id = Number(this.dataset.id);
                let evs = Storage.getEvents();
                const ev = evs.find(function(e) { return e.id === id; });
                if (!ev) return;

                const nombre = prompt('Nombre:', ev.nombre) || ev.nombre;
                const categoria = prompt('Categoría:', ev.categoria) || ev.categoria;
                const precio = prompt('Precio:', ev.precio) || ev.precio;
                const fecha = prompt('Fecha (YYYY-MM-DD):', ev.fecha) || ev.fecha;
                const hora = prompt('Hora (HH:MM):', ev.hora) || ev.hora;
                const ciudad = prompt('Ciudad:', ev.ciudad) || ev.ciudad;
                const descripcion = prompt('Descripción:', ev.descripcion) || ev.descripcion;

                ev.nombre = nombre;
                ev.categoria = categoria;
                ev.precio = Number(precio) || 0;
                ev.fecha = fecha;
                ev.hora = hora;
                ev.ciudad = ciudad;
                ev.descripcion = descripcion;

                Storage.setEvents(evs);
                showToast('✅ Evento actualizado', 'success');
                renderAdminTab('eventos');
            });
        });

        container.querySelectorAll('.btn-del').forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (!confirm('¿Eliminar este evento?')) return;
                const id = Number(this.dataset.id);
                let evs = Storage.getEvents().filter(function(e) { return e.id !== id; });
                Storage.setEvents(evs);
                showToast('🗑️ Evento eliminado', 'success');
                renderAdminTab('eventos');
            });
        });
    }

    // ============================================================
    // 6. VENTAS
    // ============================================================
    function renderVentas(container) {
        const ventas = Storage.getVentas().sort(function(a, b) {
            return new Date(b.fecha) - new Date(a.fecha);
        });

        const totalVentas = ventas.length;
        const totalIngresos = ventas.reduce(function(sum, v) { return sum + (v.total || 0); }, 0);
        const totalItems = ventas.reduce(function(sum, v) { return sum + (v.items ? v.items.length : 0); }, 0);

        if (ventas.length === 0) {
            container.innerHTML = `
                <div class="section-header">
                    <h3><i class="fas fa-shopping-cart"></i> Ventas</h3>
                </div>
                <div class="ventas-empty">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>No hay ventas registradas</h3>
                    <p>Cuando los clientes realicen compras, aparecerán aquí.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="section-header">
                <h3><i class="fas fa-shopping-cart"></i> Ventas</h3>
            </div>

            <div class="ventas-stats">
                <div class="stat-card">
                    <i class="fas fa-receipt"></i>
                    <div class="stat-info">
                        <span class="stat-number">${totalVentas}</span>
                        <span class="stat-label">Ventas totales</span>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-dollar-sign"></i>
                    <div class="stat-info">
                        <span class="stat-number">$${totalIngresos.toLocaleString()}</span>
                        <span class="stat-label">Ingresos totales</span>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-ticket-alt"></i>
                    <div class="stat-info">
                        <span class="stat-number">${totalItems}</span>
                        <span class="stat-label">Boletas vendidas</span>
                    </div>
                </div>
            </div>

            ${ventas.map(function(v) {
                const fecha = new Date(v.fecha);
                const fechaFormateada = fecha.toLocaleDateString('es', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const numItems = v.items ? v.items.length : 0;
                const cliente = v.cliente || { name: 'N/A', doc: 'N/A', email: 'N/A', address: 'N/A', phone: 'N/A' };

                return `
                    <div class="venta-card">
                        <div class="venta-header">
                            <div class="venta-id">
                                <strong>#${v.id}</strong>
                                <span class="venta-badge">${numItems} ${numItems === 1 ? 'boleta' : 'boletas'}</span>
                            </div>
                            <div class="venta-date">
                                <i class="fas fa-calendar-alt"></i>
                                ${fechaFormateada}
                            </div>
                            <div class="venta-total">$${v.total.toLocaleString()}</div>
                        </div>

                        <div class="venta-cliente">
                            <span class="cliente-info">
                                <i class="fas fa-user"></i>
                                <span class="cliente-name">${cliente.name}</span>
                            </span>
                            <span class="cliente-info">
                                <i class="fas fa-id-card"></i>
                                <span class="cliente-doc">${cliente.doc}</span>
                            </span>
                            <span class="cliente-info">
                                <i class="fas fa-envelope"></i>
                                <span class="cliente-email">${cliente.email}</span>
                            </span>
                            <span class="venta-ciudad">
                                <i class="fas fa-map-marker-alt"></i>
                                ${v.ciudad || 'N/A'}
                            </span>
                        </div>

                        <details>
                            <summary>
                                <i class="fas fa-eye"></i> Ver detalles del pedido
                            </summary>
                            <div class="venta-detalle">
                                <div class="detalle-header">
                                    <span>Producto</span>
                                    <span>Precio</span>
                                </div>
                                ${v.items && v.items.length > 0 ? v.items.map(function(item) {
                                    return `
                                        <div class="item">
                                            <span class="item-name">
                                                <span class="item-dot"></span>
                                                ${item.nombre || 'Producto'}
                                            </span>
                                            <span class="item-price">$${(item.precio || 0).toLocaleString()}</span>
                                        </div>
                                    `;
                                }).join('') : '<div class="item" style="color:#6a5b66;">No hay productos</div>'}
                                <div class="total-row">
                                    <span class="total-label">Total</span>
                                    <span class="total-amount">$${v.total.toLocaleString()}</span>
                                </div>
                                <div class="cliente-detalle">
                                    <span><i class="fas fa-address-card"></i> ${cliente.address}</span>
                                    <span><i class="fas fa-phone"></i> ${cliente.phone}</span>
                                    <span><i class="fas fa-envelope"></i> ${cliente.email}</span>
                                </div>
                            </div>
                        </details>
                    </div>
                `;
            }).join('')}
        `;
    }

    // ============================================================
    // 7. REPORTE DE VENTAS POR MES
    // ============================================================
    function renderReporte(container) {
        container.innerHTML = `
            <div class="reporte-container">
                <div class="section-header">
                    <h3><i class="fas fa-chart-bar"></i> Reporte de Ventas por Mes</h3>
                </div>

                <div class="reporte-filtros">
                    <div class="filtro-group">
                        <label><i class="fas fa-calendar"></i> Año</label>
                        <select id="reporteAño">
                            ${generarOpcionesAños()}
                        </select>
                    </div>
                    <div class="filtro-group">
                        <label><i class="fas fa-calendar-alt"></i> Mes</label>
                        <select id="reporteMes">
                            ${generarOpcionesMeses()}
                        </select>
                    </div>
                    <button class="btn-generar" id="btnGenerarReporte">
                        <i class="fas fa-file-alt"></i> Generar Reporte
                    </button>
                </div>

                <div id="reporteResultados"></div>
            </div>
        `;

        document.getElementById('btnGenerarReporte').addEventListener('click', function() {
            const año = parseInt(document.getElementById('reporteAño').value);
            const mes = parseInt(document.getElementById('reporteMes').value);
            generarReporte(año, mes);
        });

        const fecha = new Date();
        generarReporte(fecha.getFullYear(), fecha.getMonth() + 1);
    }

    // ===== GENERAR OPCIONES DE AÑOS =====
    function generarOpcionesAños() {
        const añoActual = new Date().getFullYear();
        let opciones = '';
        for (let año = añoActual; año >= 2020; año--) {
            opciones += `<option value="${año}">${año}</option>`;
        }
        return opciones;
    }

    // ===== GENERAR OPCIONES DE MESES =====
    function generarOpcionesMeses() {
        const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        const mesActual = new Date().getMonth();
        return meses.map(function(mes, index) {
            const selected = index === mesActual ? 'selected' : '';
            return `<option value="${index + 1}" ${selected}>${mes}</option>`;
        }).join('');
    }

    // ===== GENERAR REPORTE =====
    function generarReporte(año, mes) {
        const container = document.getElementById('reporteResultados');
        const ventas = Storage.getVentas();
        const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        
        const ventasFiltradas = ventas.filter(function(v) {
            const fecha = new Date(v.fecha);
            return fecha.getFullYear() === año && (fecha.getMonth() + 1) === mes;
        });

        if (ventasFiltradas.length === 0) {
            container.innerHTML = `
                <div class="reporte-vacio">
                    <i class="fas fa-inbox"></i>
                    <h3>No hay ventas en este período</h3>
                    <p>No se encontraron ventas para ${meses[mes-1]} de ${año}</p>
                </div>
            `;
            return;
        }

        const ventasPorEvento = {};
        ventasFiltradas.forEach(function(venta) {
            venta.items.forEach(function(item) {
                const key = item.id;
                if (!ventasPorEvento[key]) {
                    ventasPorEvento[key] = {
                        id: item.id,
                        nombre: item.nombre,
                        cantidad: 0,
                        total: 0
                    };
                }
                ventasPorEvento[key].cantidad += 1;
                ventasPorEvento[key].total += item.precio;
            });
        });

        const reporteData = Object.values(ventasPorEvento).sort(function(a, b) {
            return b.total - a.total;
        });

        const totalCantidad = reporteData.reduce(function(sum, item) { return sum + item.cantidad; }, 0);
        const totalVentas = reporteData.reduce(function(sum, item) { return sum + item.total; }, 0);
        const totalEventos = reporteData.length;
        const nombreMes = meses[mes-1];

        container.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;">
                <h4 style="color:#ffb3c6;font-family:'Georgia',serif;font-size:1.1rem;">
                    <i class="fas fa-calendar-alt" style="color:#d4af37;"></i>
                    ${nombreMes} ${año}
                </h4>
                <span style="color:#a07e92;font-size:0.85rem;">
                    <i class="fas fa-ticket-alt"></i> ${totalEventos} eventos · ${totalCantidad} boletas
                </span>
            </div>

            <div class="table-responsive">
                <table class="reporte-tabla">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Evento</th>
                            <th style="text-align:center;">Cantidad</th>
                            <th style="text-align:right;">Total Venta</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reporteData.map(function(item) {
                            return `
                                <tr>
                                    <td>#${item.id}</td>
                                    <td><strong>${item.nombre}</strong></td>
                                    <td style="text-align:center;">${item.cantidad}</td>
                                    <td style="text-align:right;color:#d4af37;font-weight:600;">
                                        $${item.total.toLocaleString()}
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                        <tr class="total-row">
                            <td colspan="2">TOTALES</td>
                            <td style="text-align:center;">${totalCantidad}</td>
                            <td style="text-align:right;">$${totalVentas.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="reporte-totales">
                <div class="total-card">
                    <i class="fas fa-ticket-alt"></i>
                    <div class="total-info">
                        <span class="total-number">${totalCantidad}</span>
                        <span class="total-label">Boletas vendidas</span>
                    </div>
                </div>
                <div class="total-card">
                    <i class="fas fa-dollar-sign"></i>
                    <div class="total-info">
                        <span class="total-number dorado">$${totalVentas.toLocaleString()}</span>
                        <span class="total-label">Total recaudado</span>
                    </div>
                </div>
                <div class="total-card">
                    <i class="fas fa-music"></i>
                    <div class="total-info">
                        <span class="total-number">${totalEventos}</span>
                        <span class="total-label">Eventos con ventas</span>
                    </div>
                </div>
            </div>
        `;
    }

    // ============================================================
    // 8. TOAST - Notificaciones
    // ============================================================
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(function() { toast.remove(); }, 3000);
    }
});