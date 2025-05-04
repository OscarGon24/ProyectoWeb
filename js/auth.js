document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación en cada página protegida
    const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
    
    if (!isAuthenticated) {
        // Redirigir al login si no está autenticado
        window.location.href = 'index.html';
    }
    
    // Mostrar información del usuario (opcional)
    const username = sessionStorage.getItem('username');
    const userRole = sessionStorage.getItem('userRole');
    
    if (username) {
        // Puedes usar esta información para personalizar la UI
        console.log(`Usuario autenticado: ${username} (${userRole})`);
    }
    
    // Cerrar sesión (añade esto donde necesites, por ejemplo en el navbar)
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            sessionStorage.clear();
            window.location.href = 'index.html';
        });
    }

    // Mostrar nombre de usuario en el navbar
    const usernameDisplay = document.getElementById('usernameDisplay');
    if (usernameDisplay) {
        usernameDisplay.textContent = sessionStorage.getItem('username');
    }
});