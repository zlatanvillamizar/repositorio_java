// ============================================================
// EXPORTAR E IMPORTAR VENTAS CON JSON
// ============================================================

// ===== EXPORTAR VENTAS =====
function exportarVentas() {
    // Obtener todas las ventas
    const ventas = Storage.getVentas();
    
    if (ventas.length === 0) {
        alert('⚠️ No hay ventas para exportar');
        return;
    }

    // Crear el archivo JSON
    const datos = {
        fechaExportacion: new Date().toISOString(),
        totalVentas: ventas.length,
        ventas: ventas
    };

    // Convertir a JSON
    const json = JSON.stringify(datos, null, 2);
    
    // Crear blob y descargar
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ventas_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast(`✅ ${ventas.length} ventas exportadas`, 'success');
    console.log('📦 Ventas exportadas:', ventas.length);
}

// ===== IMPORTAR VENTAS =====
function importarVentas() {
    // Crear input de tipo file
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                // Leer el JSON
                const datos = JSON.parse(event.target.result);
                
                // Verificar que tenga ventas
                if (!datos.ventas || !Array.isArray(datos.ventas)) {
                    alert('❌ El archivo no contiene ventas válidas');
                    return;
                }

                // Preguntar si quiere reemplazar o agregar
                const opcion = confirm(
                    `📊 Se encontraron ${datos.ventas.length} ventas.\n` +
                    `Fecha de exportación: ${datos.fechaExportacion || 'No especificada'}\n\n` +
                    `¿Quieres REEMPLAZAR las ventas actuales?\n` +
                    `(Cancelar = Agregar a las existentes)`
                );

                let ventasActuales = Storage.getVentas();
                
                if (opcion) {
                    // Reemplazar
                    Storage.setVentas(datos.ventas);
                    showToast(`✅ ${datos.ventas.length} ventas importadas (reemplazo)`, 'success');
                } else {
                    // Agregar (evitar duplicados por ID)
                    const idsExistentes = new Set(ventasActuales.map(v => v.id));
                    const ventasNuevas = datos.ventas.filter(v => !idsExistentes.has(v.id));
                    
                    if (ventasNuevas.length === 0) {
                        alert('⚠️ Todas las ventas ya existen (mismos IDs)');
                        return;
                    }
                    
                    ventasActuales = ventasActuales.concat(ventasNuevas);
                    Storage.setVentas(ventasActuales);
                    showToast(`✅ ${ventasNuevas.length} nuevas ventas importadas (agregadas)`, 'success');
                }
                
                // Recargar la página para ver los cambios
                location.reload();
                
            } catch (error) {
                alert('❌ Error al leer el archivo: ' + error.message);
                console.error('Error:', error);
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// ===== VER VENTAS EN CONSOLA =====
function verVentasEnConsola() {
    const ventas = Storage.getVentas();
    console.log('========================================');
    console.log('📊 VENTAS GUARDADAS');
    console.log('========================================');
    console.log('Total:', ventas.length);
    console.table(ventas);
    return ventas;
}

// ===== BOTONES EN ADMIN =====
function agregarBotonesExportImport() {
    setTimeout(function() {
        const adminContent = document.getElementById('adminContent');
        if (!adminContent) return;
        
        const sectionHeader = adminContent.querySelector('.section-header');
        if (sectionHeader) {
            const buttons = document.createElement('div');
            buttons.style.cssText = 'display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.5rem;';
            buttons.innerHTML = `
                <button onclick="exportarVentas()" 
                        style="background:linear-gradient(135deg,#2e7d32,#43a047);color:white;border:none;padding:0.5rem 1.2rem;border-radius:40px;cursor:pointer;font-weight:600;font-size:0.85rem;">
                    <i class="fas fa-download"></i> Exportar Ventas
                </button>
                <button onclick="importarVentas()" 
                        style="background:linear-gradient(135deg,#6a1b4d,#9f3b7a);color:white;border:none;padding:0.5rem 1.2rem;border-radius:40px;cursor:pointer;font-weight:600;font-size:0.85rem;">
                    <i class="fas fa-upload"></i> Importar Ventas
                </button>
                <button onclick="verVentasEnConsola()" 
                        style="background:rgba(212,175,55,0.8);color:white;border:none;padding:0.5rem 1.2rem;border-radius:40px;cursor:pointer;font-weight:600;font-size:0.85rem;">
                    <i class="fas fa-terminal"></i> Ver en Consola
                </button>
            `;
            sectionHeader.appendChild(buttons);
        }
    }, 500);
}

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', agregarBotonesExportImport);
} else {
    agregarBotonesExportImport();
}