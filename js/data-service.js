export const DataService = {
    // Inicializa la base de datos si no existe
    init() {
        if (!localStorage.getItem('restaurant_db')) {
            const initialData = {
                categories: [],
                events: [],
                sales: []
            };
            localStorage.setItem('restaurant_db', JSON.stringify(initialData));
        }
    },

    // Obtener todos los datos
    getDB() {
        return JSON.parse(localStorage.getItem('restaurant_db'));
    },

    // Guardar cambios
    saveDB(data) {
        localStorage.setItem('restaurant_db', JSON.stringify(data));
    }
};