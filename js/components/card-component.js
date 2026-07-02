class CardComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['name', 'image', 'location', 'date', 'price'];
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const name = this.getAttribute('name') || 'Tour Desconocido';
        const image = this.getAttribute('image') || 'https://via.placeholder.com/300';
        const location = this.getAttribute('location') || 'Movistar Arena';
        const date = this.getAttribute('date') || 'Próximamente';
        const price = this.getAttribute('price') || '$0';

        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    background: #fcf9f2;
                    border: 4px solid #bda374; /* Marco metálico/dorado envejecido */
                    border-radius: 12px;
                    padding: 15px;
                    box-shadow: 5px 5px 15px rgba(0,0,0,0.12);
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.3s ease;
                }

                .card:hover {
                    transform: translateY(-5px);
                }

                /* Detalle ornamental simulando hongos o flores en la esquina */
                .card::before {
                    content: '🍄';
                    position: absolute;
                    top: 5px;
                    right: 8px;
                    font-size: 1.2rem;
                    z-index: 3;
                }

                .image-container {
                    width: 100%;
                    height: 240px;
                    overflow: hidden;
                    border-radius: 6px;
                    border: 2px solid #e5d8b4;
                }

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .info-panel {
                    margin-top: 15px;
                    position: relative;
                }

                .title {
                    font-size: 1.4rem;
                    font-weight: bold;
                    margin: 0 0 5px 0;
                    color: #2c3e50;
                    text-transform: lowercase;
                }

                .venue, .city {
                    font-size: 0.85rem;
                    color: #7f8c8d;
                    margin: 2px 0;
                }

                .footer-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 15px;
                    padding-top: 10px;
                    border-top: 1px dashed #d5dbdb;
                }

                .price {
                    font-weight: bold;
                    color: #5b2c6f;
                    font-size: 1.1rem;
                }

                .date-badge {
                    font-size: 0.8rem;
                    color: #c0392b;
                    font-weight: bold;
                    text-align: right;
                }

                .buy-btn {
                    width: 100%;
                    background: #5b2c6f;
                    color: white;
                    border: 2px solid #d4af37;
                    border-radius: 20px;
                    padding: 8px;
                    margin-top: 12px;
                    cursor: pointer;
                    font-family: 'Courier New', monospace;
                    font-weight: bold;
                    transition: all 0.3s;
                }

                .buy-btn:hover {
                    background: #8e44ad;
                    box-shadow: 0 0 8px rgba(212, 175, 55, 0.5);
                }
            </style>

            <div class="card">
                <div class="image-container">
                    <img src="${image}" alt="${name}">
                </div>
                <div class="info-panel">
                    <h3 class="title">${name}</h3>
                    <p class="venue">${location}</p>
                    <p class="city">Bogotá</p>
                    
                    <div class="footer-row">
                        <span class="price">${price}</span>
                        <span class="date-badge">${date}</span>
                    </div>

                    <button class="buy-btn">agregar al carrito</button>
                </div>
            </div>
        `;
    }
}
customElements.define('card-component', CardComponent);