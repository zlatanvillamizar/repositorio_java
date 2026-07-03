import { DataService } from '../data-service.js';

class CategoryModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    saveCategory() {
        const name = this.shadowRoot.querySelector('#name').value;
        const desc = this.shadowRoot.querySelector('#desc').value;
        
        if (name && desc) {
            const db = DataService.getDB();
            db.categories.push({ id: Date.now(), name, description: desc });
            DataService.saveDB(db);
            alert("Categoría guardada con éxito");
            this.remove(); // Cierra el modal
            // Recargar la vista o emitir evento aquí
        } else {
            alert("Por favor completa todos los campos");
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; }
                .content { background: white; padding: 20px; border-radius: 8px; width: 300px; }
                input { display: block; width: 100%; margin-bottom: 10px; padding: 8px; }
            </style>
            <div class="modal">
                <div class="content">
                    <h3>Nueva Categoría</h3>
                    <input type="text" id="name" placeholder="Nombre de categoría">
                    <input type="text" id="desc" placeholder="Descripción">
                    <button id="save">Guardar</button>
                    <button id="close">Cancelar</button>
                </div>
            </div>
        `;
        this.shadowRoot.querySelector('#save').onclick = () => this.saveCategory();
        this.shadowRoot.querySelector('#close').onclick = () => this.remove();
    }
}
customElements.define('category-modal', CategoryModal);