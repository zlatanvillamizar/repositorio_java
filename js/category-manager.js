import { DataService } from '../data-service.js';

class CategoryManager extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const db = DataService.getDB();
        const categories = db.categories;

        this.shadowRoot.innerHTML = `
            <style>
                .container { padding: 20px; font-family: sans-serif; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .btn-add { background: #7d3c98; color: white; padding: 10px; border: none; cursor: pointer; }
            </style>
            <div class="container">
                <h2>Categorías</h2>
                <button class="btn-add" id="open-modal">Agregar Categoría</button>
                <table>
                    <thead>
                        <tr><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                        ${categories.map(cat => `
                            <tr>
                                <td>${cat.name}</td>
                                <td>${cat.description}</td>
                                <td><button>Editar</button> <button>Eliminar</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        // ... dentro de render() en category-manager.js
this.shadowRoot.querySelector('#open-modal').onclick = () => {
    const modal = document.createElement('category-modal');
    document.body.appendChild(modal);
};
    }
}
customElements.define('category-manager', CategoryManager);

