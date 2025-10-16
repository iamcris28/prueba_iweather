JAVASCRIPT
document.addEventListener('DOMContentLoaded', function () {
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
});