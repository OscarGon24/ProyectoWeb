document.addEventListener('DOMContentLoaded', function() {
    // Mostrar nombre de usuario en el navbar
    const username = sessionStorage.getItem('username');
    if (username) {
        document.getElementById('usernameDisplay').textContent = username;
    }

    // Datos de cursos disponibles (en una app real vendrían de una API)
    let cursosDisponibles = JSON.parse(localStorage.getItem('cursos')) || [];
    
    // Si no hay cursos, cargar algunos de ejemplo
    if (cursosDisponibles.length === 0) {
        cursosDisponibles = [
            {
                id: 1,
                nombre: "Introducción a la Programación",
                profesor: "Dr. Carlos Méndez",
                horario: "Lunes y Miércoles 14:00 - 16:00",
                facultad: "Ingeniería",
                creditos: 4,
                cuposDisponibles: 15,
                cuposTotales: 30
            },
            {
                id: 2,
                nombre: "Historia del Arte Contemporáneo",
                profesor: "Dra. Laura Fernández",
                horario: "Martes y Jueves 10:00 - 12:00",
                facultad: "Artes",
                creditos: 3,
                cuposDisponibles: 8,
                cuposTotales: 25
            },
            // ... otros cursos de ejemplo
        ];
        localStorage.setItem('cursos', JSON.stringify(cursosDisponibles));
    }

    // Variables para paginación
    let currentPage = 1;
    const itemsPerPage = 5;
    let filteredCursos = [...cursosDisponibles];

    // Inicializar la tabla
    renderTable();
    setupEventListeners();

    function renderTable() {
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';

        // Calcular índices para la paginación
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const cursosToShow = filteredCursos.slice(startIndex, endIndex);

        if (cursosToShow.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">No se encontraron cursos disponibles</td>
                </tr>
            `;
            return;
        }

        // Renderizar cada curso
        cursosToShow.forEach(curso => {
            const porcentajeCupos = Math.round((curso.cuposDisponibles / curso.cuposTotales) * 100);
            let barColor = 'bg-success';
            
            if (porcentajeCupos < 20) {
                barColor = 'bg-danger';
            } else if (porcentajeCupos < 50) {
                barColor = 'bg-warning';
            }

            // Determinar color del badge según facultad
            let badgeColor = 'bg-primary';
            switch(curso.facultad) {
                case 'Artes': badgeColor = 'bg-success'; break;
                case 'Ciencias Sociales': badgeColor = 'bg-warning text-dark'; break;
                case 'Medicina': badgeColor = 'bg-danger'; break;
                case 'Derecho': badgeColor = 'bg-secondary'; break;
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${curso.nombre}</strong></td>
                <td>${curso.profesor}</td>
                <td>${curso.horario}</td>
                <td><span class="badge ${badgeColor}">${curso.facultad}</span></td>
                <td>${curso.creditos}</td>
                <td>
                    <div class="progress" style="height: 20px;">
                        <div class="progress-bar ${barColor}" style="width: ${porcentajeCupos}%;">
                            ${curso.cuposDisponibles}/${curso.cuposTotales}
                        </div>
                    </div>
                </td>
                <td>
                    <button class="btn btn-primary btn-inscribir" ${curso.cuposDisponibles <= 0 ? 'disabled' : ''}>
                        ${curso.cuposDisponibles <= 0 ? 'Cupo lleno' : 'Inscribir'}
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Actualizar paginación
        updatePagination();
    }

    function updatePagination() {
        const totalPages = Math.ceil(filteredCursos.length / itemsPerPage);
        const pagination = document.querySelector('.pagination');
        pagination.innerHTML = '';

        // Botón Anterior
        const prevItem = document.createElement('li');
        prevItem.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prevItem.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
        prevItem.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        });
        pagination.appendChild(prevItem);

        // Números de página
        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
            pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageItem.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                renderTable();
            });
            pagination.appendChild(pageItem);
        }

        // Botón Siguiente
        const nextItem = document.createElement('li');
        nextItem.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        nextItem.innerHTML = `<a class="page-link" href="#">Siguiente</a>`;
        nextItem.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
            }
        });
        pagination.appendChild(nextItem);
    }

    function setupEventListeners() {
        // Buscar curso
        document.querySelector('.btn-outline-secondary').addEventListener('click', function() {
            const searchTerm = document.querySelector('.form-control').value.toLowerCase();
            filterCursos(searchTerm);
        });

        // Filtro por facultad
        document.querySelectorAll('.form-select')[0].addEventListener('change', function() {
            filterCursos();
        });

        // Filtro por horario
        document.querySelectorAll('.form-select')[1].addEventListener('change', function() {
            filterCursos();
        });

        // Manejar clic en botones de inscripción (delegación de eventos)
        document.querySelector('tbody').addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-inscribir') && !e.target.disabled) {
                inscribirCurso(e);
            }
        });
    }

    function filterCursos(searchTerm = '') {
        const facultad = document.querySelectorAll('.form-select')[0].value;
        const horario = document.querySelectorAll('.form-select')[1].value;

        filteredCursos = cursosDisponibles.filter(curso => {
            const matchesSearch = curso.nombre.toLowerCase().includes(searchTerm) || 
                                 curso.profesor.toLowerCase().includes(searchTerm);
            const matchesFacultad = facultad === 'Filtrar por facultad' || curso.facultad === facultad;
            const matchesHorario = horario === 'Filtrar por horario' || 
                                 (horario === 'Mañana' && curso.horario.includes('8:00')) ||
                                 (horario === 'Tarde' && (curso.horario.includes('14:00') || curso.horario.includes('16:00'))) ||
                                 (horario === 'Noche' && curso.horario.includes('19:00'));

            return matchesSearch && matchesFacultad && matchesHorario;
        });

        currentPage = 1;
        renderTable();
    }

    function inscribirCurso(e) {
        // Verificar si hay usuario logueado
        if (!sessionStorage.getItem('username')) {
            alert('Debes iniciar sesión para inscribirte en un curso');
            return;
        }

        const row = e.target.closest('tr');
        const nombreCurso = row.querySelector('td:first-child strong').textContent;
        
        // Confirmar inscripción
        if (confirm(`¿Estás seguro que deseas inscribirte en ${nombreCurso}?`)) {
            // Encontrar el curso en el array
            const cursoIndex = cursosDisponibles.findIndex(c => c.nombre === nombreCurso);
            
            if (cursoIndex !== -1 && cursosDisponibles[cursoIndex].cuposDisponibles > 0) {
                // Reducir cupos disponibles
                cursosDisponibles[cursoIndex].cuposDisponibles--;
                
                // Actualizar localStorage
                localStorage.setItem('cursos', JSON.stringify(cursosDisponibles));
                
                // Actualizar tabla
                filterCursos();
                
                // Guardar inscripción en el perfil del usuario (simulado)
                const userInscripciones = JSON.parse(localStorage.getItem('inscripciones')) || {};
                const username = sessionStorage.getItem('username');
                
                if (!userInscripciones[username]) {
                    userInscripciones[username] = [];
                }
                
                userInscripciones[username].push({
                    curso: nombreCurso,
                    fecha: new Date().toLocaleDateString(),
                    estado: 'Inscrito'
                });
                
                localStorage.setItem('inscripciones', JSON.stringify(userInscripciones));
                
                alert(`¡Inscripción exitosa en ${nombreCurso}!`);
            } else {
                alert('No hay cupos disponibles para este curso');
            }
        }
    }
});