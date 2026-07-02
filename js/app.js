// Datos iniciales de prueba basados en tus giras musicales de referencia
const eventosBase = [
    { name: 'cry baby tour', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400', location: 'Movistar Arena', date: '24 Oct', price: '$250.000' },
    { name: 'k-12 tour', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400', location: 'Movistar Arena', date: '25 Sep', price: '$280.000' },
    { name: 'portals tour', image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=400', location: 'Teatro Jorge Eliécer Gaitán', date: '18 Sep', price: '$320.000' },
    { name: 'hades tour', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400', location: 'Teatro Jorge Eliécer Gaitán', date: '11 Jul', price: '$190.000' }
];

document.addEventListener('DOMContentLoaded', () => {
    // Si no existen eventos en localStorage, guardamos los base
    if (!localStorage.getItem('eventos')) {
        localStorage.setItem('eventos', JSON.stringify(eventosBase));
    }

    renderizarEventos();
});

function renderizarEventos() {
    const contenedor = document.getElementById('events-container');
    const eventos = JSON.parse(localStorage.getItem('eventos'));

    if (!contenedor) return;
    contenedor.innerHTML = '';

    eventos.forEach(ev => {
        // Creamos la etiqueta de nuestro Web Component de forma dinámica
        const card = document.createElement('card-component');
        card.setAttribute('name', ev.name);
        card.setAttribute('image', ev.image);
        card.setAttribute('location', ev.location);
        card.setAttribute('date', ev.date);
        card.setAttribute('price', ev.price);
        
        contenedor.appendChild(card);
    });
}