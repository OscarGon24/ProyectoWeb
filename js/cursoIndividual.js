document.addEventListener('DOMContentLoaded', function() {
    // Mostrar nombre de usuario en el navbar
    const username = sessionStorage.getItem('username');
    if (username) {
        document.getElementById('usernameDisplay').textContent = username;
    }

    // Control de acceso basado en roles
    const userRole = sessionStorage.getItem('userRole');
    
    // Ocultar botón de edición si no es profesor o admin
    if (userRole !== 'teacher' && userRole !== 'admin') {
        const editButton = document.querySelector('.btn.editar');
        if (editButton) {
            editButton.style.display = 'none';
        }
    }

    // Aquí podrías cargar los datos del curso desde una API
    // Por ahora simulamos datos cargados
    loadCourseData();
    
    function loadCourseData() {
        // Intentar cargar datos guardados
        const savedData = localStorage.getItem('currentCourseData');
        let courseData;
    
        if (savedData) {
            // Usar datos guardados si existen
            courseData = JSON.parse(savedData);
        } else {
            // Datos por defecto si no hay guardados
            courseData = {
                nombre: "Programación Web",
                profesor: "Juan Pérez",
                descripcion: "Aprende los fundamentos del desarrollo web moderno con HTML, CSS, JavaScript y frameworks. Este curso proporciona una base sólida para construir sitios web interactivos y responsivos.",
                contenidos: [
                    {
                        titulo: "Fundamentos",
                        temas: ["HTML Básico", "CSS para estilos", "JavaScript esencial"]
                    },
                    {
                        titulo: "Interactividad",
                        temas: ["Eventos DOM", "Manipulación dinámica", "Validaciones de formularios"]
                    },
                    {
                        titulo: "Proyecto Final",
                        temas: ["Maquetado completo", "Interacción con APIs", "Subida a GitHub Pages"]
                    }
                ]
            };
        }
    
        // Actualizar la UI con los datos del curso
        document.querySelector('.titulo').textContent = `Curso: ${courseData.nombre}`;
        document.querySelector('.enlace h5').textContent = `Profesor: ${courseData.profesor}`;
        document.querySelector('section.cursos p').textContent = courseData.descripcion;
    
        // Limpiar contenidos existentes
        const contentsContainer = document.querySelector('.container');
        const existingContents = document.querySelectorAll('.mb-4:not(:first-child)');
        existingContents.forEach(content => content.remove());
    
        // Añadir contenidos dinámicamente
        courseData.contenidos.forEach((contenido, index) => {
            const contentDiv = document.createElement('div');
            contentDiv.className = 'mb-4';
            contentDiv.innerHTML = `
                <h4 class="titulo">${contenido.titulo}</h4>
                <ul>
                    ${contenido.temas.map(tema => `<li>${tema}</li>`).join('')}
                </ul>
            `;
            contentsContainer.appendChild(contentDiv);
        });
    }
});