document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form[action="/login"]');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                alert('Por favor, complete todos los campos.');
                return;
            }
            
            // Autenticación mejorada con roles
            const user = authenticateUser(username, password);
            
            if (user) {
                // Guardar datos de usuario en sessionStorage
                sessionStorage.setItem('authenticated', 'true');
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('userRole', user.role);
                
                // Redirigir al menú de cursos
                window.location.href = 'cursosMenu.html';
            } else {
                alert('Usuario o contraseña incorrectos.');
            }
        });
    }
    
    // Función de autenticación mejorada con roles
    function authenticateUser(username, password) {
        // Usuarios de ejemplo con roles
        const validUsers = {
            'admin': { password: 'admin123', role: 'admin' },
            'profesor': { password: 'profesor123', role: 'profesor' },
            'alumno': { password: 'alumno123', role: 'alumno' }
        };
        
        const user = validUsers[username];
        
        if (user && user.password === password) {
            return user;
        }
        return null;
    }
});