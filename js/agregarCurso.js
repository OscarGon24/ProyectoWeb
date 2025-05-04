document.addEventListener('DOMContentLoaded', function() {
    // Mostrar nombre de usuario
    const username = sessionStorage.getItem('username');
    if (username) {
        document.getElementById('usernameDisplay').textContent = username;
    }

    // Manejar el envío del formulario
    document.getElementById('cursoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const cursoData = collectFormData();
            
            // Generar un ID único para el nuevo curso
            cursoData.id = Date.now();
            
            // Obtener cursos existentes o crear un nuevo array
            const cursosExistentes = JSON.parse(localStorage.getItem('cursos')) || [];
            
            // Agregar el nuevo curso
            cursosExistentes.push(cursoData);
            
            // Guardar en localStorage
            localStorage.setItem('cursos', JSON.stringify(cursosExistentes));
            
            alert('Curso guardado exitosamente');
            window.location.href = 'mostrarCursos.html'; // Redirigir a la vista de cursos
        }
    });

    // Función para validar el formulario
    function validateForm() {
        let isValid = true;
        const requiredFields = document.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        // Validación adicional para horas
        const horaInicio = document.getElementById('horaInicio').value;
        const horaFin = document.getElementById('horaFin').value;
        
        if (horaInicio && horaFin && horaInicio >= horaFin) {
            alert('La hora de inicio debe ser anterior a la hora de fin');
            isValid = false;
        }

        return isValid;
    }

    // Función para recolectar los datos del formulario
    function collectFormData() {
        const dias = document.getElementById('dias').value;
        const horaInicio = document.getElementById('horaInicio').value;
        const horaFin = document.getElementById('horaFin').value;
        
        // Formatear horario consistentemente
        const horarioFormateado = `${dias} ${formatTime(horaInicio)} - ${formatTime(horaFin)}`;
        
        // Función auxiliar para formatear tiempo
        function formatTime(timeString) {
            const [hours, minutes] = timeString.split(':');
            return `${hours.padStart(2, '0')}:${minutes}`;
        }
    
        return {
            id: Date.now(), // ID único aquí en lugar del submit
            nombre: document.getElementById('nombreCurso').value,
            profesor: `${document.getElementById('profesorNombre').value} ${document.getElementById('profesorApellidoP').value}`,
            horario: horarioFormateado,
            facultad: document.getElementById('facultad').value,
            creditos: parseInt(document.getElementById('creditos').value),
            cuposTotales: parseInt(document.getElementById('cuposTotales').value),
            cuposDisponibles: parseInt(document.getElementById('cuposDisponibles').value)
        };
    }
});