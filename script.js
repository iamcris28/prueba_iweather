document.addEventListener('DOMContentLoaded', function () {
    
    // =================================================================
    // --- CÓDIGO ORIGINAL (Menús, Popups y Modales) ---
    // =================================================================

    // Elementos de Modals/Popups
    const loginModal = document.getElementById('login-modal');
    const optionsMenu = document.getElementById('options-menu');
    const searchModal = document.getElementById('search-modal');
    const languageModal = document.getElementById('language-modal');
    const metricModal = document.getElementById('metric-modal');
    const profileModal = document.getElementById('profile-modal');
    
    // Grupos de popups para un manejo más fácil
    const allPopups = document.querySelectorAll('.modal-overlay, .side-menu, .menu-popup');
    const subMenuPopups = [languageModal, metricModal, profileModal];
    
    // Elementos que disparan acciones (triggers)
    const loginBtn = document.getElementById('login-btn');
    const menuBtn = document.getElementById('menu-btn');
    const searchTriggerBtn = document.getElementById('search-trigger-btn');
    const languageLink = document.getElementById('language-link');
    const metricLink = document.getElementById('metric-link');
    const profileLink = document.getElementById('profile-link');
    
    // Función principal para ocultar todos los overlays y menús
    function hideAllPopups() {
        allPopups.forEach(p => p.classList.add('hidden'));
        // Manejar específicamente la animación de deslizamiento para el menú lateral
        if (optionsMenu) {
           optionsMenu.classList.add('-translate-x-full');
        }
    }
    
    // Función genérica para abrir un popup principal (y cerrar todos los demás)
    function showPopup(popup) {
        hideAllPopups();
        popup.classList.remove('hidden');
        if (popup.id === 'options-menu') {
            // Disparar animación de deslizamiento hacia adentro
            setTimeout(() => popup.classList.remove('-translate-x-full'), 10);
        }
    }

    // --- Funciones auxiliares para convertir datos del clima ---
    function convertirVelocidadViento(metrosPorSegundo) {
        // Convierte m/s a km/h
        return Math.round(metrosPorSegundo * 3.6);
    }

    function convertirGradosADireccion(grados) {
        // Convierte grados a puntos cardinales
        const direcciones = ['Norte', 'Noreste', 'Este', 'Sureste', 'Sur', 'Suroeste', 'Oeste', 'Noroeste'];
        const indice = Math.round(grados / 45) % 8;
        return direcciones[indice];
    }

    // --- Event Listeners para los triggers principales ---
    
    loginBtn.addEventListener('click', (e) => { e.stopPropagation(); showPopup(loginModal); });
    menuBtn.addEventListener('click', (e) => { e.stopPropagation(); showPopup(optionsMenu); });
    
    searchTriggerBtn.addEventListener('click', (e) => { 
        e.stopPropagation(); 
        const wasOpen = !searchModal.classList.contains('hidden');
        hideAllPopups(); 
        if (!wasOpen) {
            searchModal.classList.remove('hidden'); 
            const rect = e.currentTarget.getBoundingClientRect();
            searchModal.style.top = `${rect.bottom + 5}px`;
            searchModal.style.left = `${rect.left}px`;
        }
    });

    // --- Event Listeners para los links de submenús dentro del Menú de Opciones ---
    
    function openSubMenu(targetMenu, triggerElement) {
        // Ocultar otros submenús
        subMenuPopups.forEach(menu => {
            if (menu !== targetMenu) {
                menu.classList.add('hidden');
            }
        });
        
        // Posicionar y mostrar el submenú objetivo
        const rect = triggerElement.getBoundingClientRect();
        targetMenu.style.top = `${rect.top}px`;
        targetMenu.style.left = `${optionsMenu.offsetWidth + 12}px`; // posicionar al lado del menú abierto con un pequeño espacio
        
        targetMenu.classList.remove('hidden');
    }
    
    languageLink.addEventListener('click', (e) => { e.stopPropagation(); openSubMenu(languageModal, e.currentTarget); });
    metricLink.addEventListener('click', (e) => { e.stopPropagation(); openSubMenu(metricModal, e.currentTarget); });
    profileLink.addEventListener('click', (e) => { e.stopPropagation(); openSubMenu(profileModal, e.currentTarget); });


    // --- Lógica de Cierre ---

    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const parentPopup = btn.closest('.modal-overlay, .side-menu, .menu-popup');
            if (parentPopup) {
                 parentPopup.classList.add('hidden');
                 // Si cerramos el menú lateral principal, también ocultar sus submenús y resetear la animación
                 if(parentPopup.id === 'options-menu') {
                    hideAllPopups();
                 }
            }
        });
    });

    // Un clic fuera de cualquier elemento interactivo cierra todo
    document.documentElement.addEventListener('click', (e) => {
        hideAllPopups();
    });

    allPopups.forEach(p => p.addEventListener('click', e => e.stopPropagation()));

    // =================================================================
    // --- NUEVO CÓDIGO (Cargar datos de la API del Clima) ---
    // =================================================================

    // ⚠️ REEMPLAZA ESTO con tu propia API Key de OpenWeatherMap
    const apiKey = 'f52d49ba3ec082b6ae5e9c8c8e2d2dc3'; 
    const ciudad = 'Veracruz';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Respuesta de red no fue exitosa');
            }
            return response.json();
        })
        .then(data => {
            // Depuración: Muestra todos los datos en la consola
            console.log(data); 

            // --- Actualizar el HTML ---
            // (Asegúrate de tener estos IDs en tu index.html)

            // Sección Principal
            document.getElementById('ciudad-nombre').innerText = data.name;
            document.getElementById('temp-actual').innerText = `${Math.round(data.main.temp)}°`;
            document.getElementById('temp-max').innerText = `/${Math.round(data.main.temp_max)}°`;
            
            const descripcion = data.weather[0].description;
            document.getElementById('clima-descripcion').innerText = descripcion.charAt(0).toUpperCase() + descripcion.slice(1);

            // Tarjetas de detalles
            // (Asumí los IDs, ¡revísalos!)
            document.getElementById('humedad-valor').innerText = `${data.main.humidity}%`;
            document.getElementById('presion-valor').innerText = `${data.main.pressure}`;
            document.getElementById('viento-velocidad').innerText = `${convertirVelocidadViento(data.wind.speed)} Km/h`;
            document.getElementById('viento-direccion').innerText = convertirGradosADireccion(data.wind.deg);

            // Nota: El índice UV no viene en esta llamada de API.
            // Se necesita la "One Call API" de OpenWeatherMap, que es un poco más compleja.
            // Por ahora, puedes dejar el valor de UV como estático.
        })
        .catch(error => {
            console.error('Error al obtener los datos del clima:', error);
            document.getElementById('ciudad-nombre').innerText = "Error de API";
            document.getElementById('clima-descripcion').innerText = "No se pudieron cargar los datos.";
        });

}); // <-- FIN DEL DOMContentLoaded (Todo tu código queda dentro)