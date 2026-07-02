class NavbarComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .navbar {
                    background: linear-gradient(135deg, #b977d6, #5b2c6f);
                    padding: 20px 40px;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                    border-bottom: 4px dashed #e8daef;
                }

                .nav-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .logo {
                    font-size: 2.2rem;
                    font-weight: bold;
                    color: white;
                    text-shadow: 3px 3px 0px #4a235a;
                    letter-spacing: -1px;
                }

                .nav-links {
                    display: flex;
                    gap: 20px;
                }

                .nav-links a {
                    color: #f5eeec;
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 1.1rem;
                    text-transform: lowercase;
                    transition: color 0.3s;
                }

                .nav-links a:hover {
                    color: #f5cba7;
                }

                .search-filter-bar {
                    display: flex;
                    background: white;
                    border: 3px solid #d4af37; /* Borde dorado antiguo */
                    border-radius: 30px;
                    padding: 5px;
                    align-items: center;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }

                .filter-select {
                    border: none;
                    border-right: 1px solid #e5e7e9;
                    padding: 10px 15px;
                    font-family: 'Courier New', monospace;
                    font-size: 0.9rem;
                    outline: none;
                    background: transparent;
                    color: #555;
                }

                .search-input {
                    flex: 1;
                    border: none;
                    padding: 10px 20px;
                    font-family: 'Courier New', monospace;
                    outline: none;
                    font-size: 1rem;
                }

                .search-btn {
                    background: #f39c12;
                    border: none;
                    color: white;
                    padding: 10px 25px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background 0.3s;
                }

                .search-btn:hover {
                    background: #e67e22;
                }
            </style>

            <nav class="navbar">
                <div class="nav-top">
                    <div class="logo">melimarket</div>
                    <div class="nav-links">
                        <a href="#">concierto</a>
                        <a href="#">teatro</a>
                        <a href="#">cry baby tour</a>
                        <a href="#">ventas</a>
                        <a href="#">más...</a>
                    </div>
                </div>

                <div class="search-filter-bar">
                    <select class="filter-select" id="city-filter">
                        <option value="">📍 Ciudad</option>
                        <option value="Bogotá">Bogotá</option>
                        <option value="Medellín">Medellín</option>
                        <option value="Barranquilla">Barranquilla</option>
                        <option value="Bucaramanga">Bucaramanga</option>
                    </select>

                    <select class="filter-select" id="category-filter">
                        <option value="">🔑 Categoría</option>
                        <option value="Tour">Tours</option>
                        <option value="Teatro">Teatro</option>
                    </select>

                    <input type="text" class="search-input" id="search-input" placeholder="Buscar por artista, evento...">
                    <button class="search-btn">🔍</button>
                </div>
            </nav>
        `;
    }
}
customElements.define('navbar-component', NavbarComponent);