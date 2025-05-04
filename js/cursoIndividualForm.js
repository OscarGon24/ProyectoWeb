document.addEventListener('DOMContentLoaded', function() {
    // Mostrar nombre de usuario en el navbar
    const username = sessionStorage.getItem('username');
    if (username) {
        document.getElementById('usernameDisplay').textContent = username;
    }

    // Manejar el botón de añadir contenido
    const addSectionBtn = document.querySelector('.add-section');
    if (addSectionBtn) {
        addSectionBtn.addEventListener('click', function() {
            addContentSection();
        });
    }

    // Manejar el botón de guardar
    const saveBtn = document.querySelector('.btn.editar');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveCourseData();
        });
    }

    function loadExistingData() {
        const savedData = localStorage.getItem('currentCourseData');
        if (savedData) {
            const courseData = JSON.parse(savedData);
            
            // Rellenar campos del formulario
            document.getElementById('nombreCurso').value = courseData.nombre || '';
            document.getElementById('nombreProfesor').value = courseData.profesor || '';
            document.querySelector('textarea').value = courseData.descripcion || '';
            
            // Limpiar contenidos existentes
            const contenidosDiv = document.getElementById('contenidos');
            contenidosDiv.innerHTML = '';
            
            // Añadir secciones de contenido
            if (courseData.contenidos && courseData.contenidos.length > 0) {
                courseData.contenidos.forEach(contenido => {
                    addContentSection(contenido.titulo, contenido.temas.join('\n'));
                });
            } else {
                addContentSection(); // Añadir una sección vacía por defecto
            }
        } else {
            addContentSection(); // Añadir una sección vacía por defecto
        }
    }

    // Función para añadir nueva sección de contenido
    function addContentSection(titulo = '', temas = '') {
        const contenidosDiv = document.getElementById('contenidos');
        const newSection = document.createElement('div');
        newSection.className = 'contenido-section mt-3';
        newSection.innerHTML = `
            <label>Título del contenido:</label>
            <input type="text" class="form-control" value="${titulo}" placeholder="Ej. Fundamentos del lenguaje" />
            <label>Temas:</label>
            <textarea class="form-control" placeholder="Ej. Variables, tipos de datos, estructuras...">${temas}</textarea>
            <button type="button" class="btn btn-danger btn-sm mt-2 remove-section">Eliminar sección</button>
        `;
        contenidosDiv.appendChild(newSection);
    
        // Agregar evento al botón de eliminar
        newSection.querySelector('.remove-section').addEventListener('click', function() {
            contenidosDiv.removeChild(newSection);
        });
    }

    // Función para guardar los datos del curso
    function saveCourseData() {
        const courseData = {
            nombre: document.getElementById('nombreCurso').value,
            profesor: document.getElementById('nombreProfesor').value,
            descripcion: document.querySelector('textarea').value,
            contenidos: []
        };
    
        // Recoger todos los contenidos
        const sections = document.querySelectorAll('.contenido-section');
        sections.forEach(section => {
            const inputs = section.querySelectorAll('input, textarea');
            courseData.contenidos.push({
                titulo: inputs[0].value,
                temas: inputs[1].value.split('\n').filter(tema => tema.trim() !== '')
            });
        });
    
        // Guardar en localStorage para persistencia
        localStorage.setItem('currentCourseData', JSON.stringify(courseData));
        
        alert('Cambios guardados exitosamente');
        window.location.href = 'cursosIndividual.html';
    }

    loadExistingData();
});