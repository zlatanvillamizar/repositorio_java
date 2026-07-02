class LoginPanel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        // Lógica de validación
        this.shadowRoot.querySelector('#login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const user = this.shadowRoot.querySelector('#email').value;
            const pass = this.shadowRoot.querySelector('#password').value;

            if (user === "admin" && pass === "1234") {
                // Redirige a index.html
                window.location.href = "index.html";
            } else {
                alert("Usuario o contraseña incorrectos");
            }
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; width: 100%; height: 100vh; }
    
                .container {
                    position: relative;
                    width: 100vw;
                    height: 100vh;
                    background: #0c060f;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
    
                .background-layer {
                    width: 100%;
                    height: 100%;
                    background: url('../../img/melanie-login.jpg') no-repeat center center;
                    background-size: contain;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 1;
                }
    
                .title-box {
                    position: absolute;
                    top: 10%; 
                    width: 100%;
                    text-align: center;
                    z-index: 10;
                }

                .title-box h1 {
                    font-family: 'Times New Roman', serif !important;
                    font-size: 3.5rem !important;
                    color: #fca9da !important;
                    text-transform: lowercase !important;
                    margin: 0 !important;
                }
    
                .login-card {
                    position: absolute;
                    top: 45%;
                    background: rgba(255, 255, 255, 0.95);
                    padding: 40px;
                    border-radius: 25px;
                    width: 300px;
                    text-align: center;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.6);
                    z-index: 5;
                }
    
                input {
                    display: block;
                    width: 100%;
                    margin: 10px 0;
                    padding: 10px;
                    border: 1px solid #7d3c98;
                    border-radius: 8px;
                }
    
                button {
                    background: #4a155a;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 20px;
                    cursor: pointer;
                    margin-top: 10px;
                }
            </style>
    
            <div class="container">
                <div class="background-layer"></div>
                <div class="title-box">
                    <h1>just enjoy the show</h1>
                </div>
                <div class="login-card">
                    <form id="login-form">
                        <input type="text" id="email" placeholder="User ID" required>
                        <input type="password" id="password" placeholder="Password" required>
                        <button type="submit">login</button>
                    </form>
                </div>
            </div>
        `;
    }
}

customElements.define('login-panel', LoginPanel);