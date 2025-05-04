document.addEventListener('DOMContentLoaded', function() {
    // Mostrar nombre de usuario en el navbar
    const username = sessionStorage.getItem('username');
    if (username) {
        document.getElementById('usernameDisplay').textContent = username;
    }

    // Datos de localStorage
    let cursos = JSON.parse(localStorage.getItem('cursos')) || [];
    if (cursos.length === 0 && sessionStorage.getItem('userRole') === 'admin') {
        cursos = [
            {
                id: 1,
                nombre: "Introducción a la Programación",
                profesor: "Dr. Carlos Méndez",
                horario: "Lunes y Miércoles 14:00 - 16:00",
                facultad: "Ingeniería",
                creditos: 4,
                cuposDisponibles: 60,
                cuposTotales: 60
            },
            {
                id: 2,
                nombre: "Matemáticas Avanzadas",
                profesor: "Dra. Laura Fernández",
                horario: "Martes y Jueves 10:00 - 12:00",
                facultad: "Ingeniería",
                creditos: 5,
                cuposDisponibles: 45,
                cuposTotales: 50
            },
            {
                id: 3,
                nombre: "Historia del Arte",
                profesor: "Prof. Javier Ruiz",
                horario: "Lunes y Miércoles 18:00 - 20:00",
                facultad: "Artes",
                creditos: 3,
                cuposDisponibles: 30,
                cuposTotales: 30
            },
            {
                id: 4,
                nombre: "Psicología Social",
                profesor: "Dra. Ana López",
                horario: "Martes y Jueves 16:00 - 18:00",
                facultad: "Ciencias Sociales",
                creditos: 4,
                cuposDisponibles: 25,
                cuposTotales: 30
            },
            {
                id: 5,
                nombre: "Derecho Civil",
                profesor: "Dr. Roberto Sánchez",
                horario: "Viernes 09:00 - 13:00",
                facultad: "Derecho",
                creditos: 6,
                cuposDisponibles: 40,
                cuposTotales: 40
            }
        ];
        localStorage.setItem('cursos', JSON.stringify(cursos));
    }
    
    // Ocultar/mostrar botón de agregar según el rol
    const userRole = sessionStorage.getItem('userRole');
        if (userRole !== 'admin') {
            document.querySelector('.agregarCurso').style.display = 'none';
    }

    // Variables para paginación
    let currentPage = 1;
    const itemsPerPage = 3;
    let filteredCursos = [...cursos];

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
                    <td colspan="6" class="text-center py-4">No se encontraron cursos que coincidan con los filtros</td>
                </tr>
            `;
            return;
        }

        // Renderizar cada curso
        cursosToShow.forEach(curso => {
            const porcentajeCupos = Math.round((curso.cuposDisponibles / curso.cuposTotales) * 100);
            let barColor = 'bg-success';
            
            if (porcentajeCupos < 30) {
                barColor = 'bg-danger';
            } else if (porcentajeCupos < 60) {
                barColor = 'bg-warning';
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${curso.nombre}</strong></td>
                <td>${curso.profesor}</td>
                <td>${curso.horario}</td>
                <td><span class="badge bg-primary">${curso.facultad}</span></td>
                <td>${curso.creditos}</td>
                <td>
                    <div class="progress" style="height: 20px;">
                        <div class="progress-bar ${barColor}" style="width: ${porcentajeCupos}%;">
                            ${curso.cuposDisponibles}/${curso.cuposTotales}
                        </div>
                    </div>
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
        document.querySelector('.btn-primary').addEventListener('click', function() {
            const searchTerm = document.getElementById('buscarCurso').value.toLowerCase();
            filterCursos(searchTerm);
        });

        // Filtro por facultad
        document.getElementById('facultad').addEventListener('change', function() {
            filterCursos();
        });

        // Filtro por horario
        document.getElementById('horario').addEventListener('change', function() {
            filterCursos();
        });
    }

    function filterCursos(searchTerm = '') {
        const facultad = document.getElementById('facultad').value;
        const horario = document.getElementById('horario').value;
        let matchesHorario = true;
        if (horario !== 'Elegir horario') {
            const horaPart = curso.horario.split(' ')[2]; // Obtiene "HH:MM"
            const hora = parseInt(horaPart.split(':')[0]);
        if (horario === 'Mañana') {
            matchesHorario = hora >= 6 && hora < 12;
        } else if (horario === 'Tarde') {
            matchesHorario = hora >= 12 && hora < 19;
        } else if (horario === 'Noche') {
            matchesHorario = hora >= 19 || hora < 6;
        }
        }
    
        filteredCursos = cursos.filter(curso => {
            const matchesSearch = curso.nombre.toLowerCase().includes(searchTerm) || 
                                 curso.profesor.toLowerCase().includes(searchTerm);
            const matchesFacultad = facultad === 'Elegir facultad' || curso.facultad === facultad;
            
            // Mejorar la coincidencia de horario
            let matchesHorario = true;
            if (horario !== 'Elegir horario') {
                const hora = curso.horario.split(' ')[2]; // Obtiene la hora de inicio
                if (horario === 'Mañana') {
                    matchesHorario = parseInt(hora) < 12;
                } else if (horario === 'Tarde') {
                    matchesHorario = parseInt(hora) >= 12 && parseInt(hora) < 18;
                } else if (horario === 'Noche') {
                    matchesHorario = parseInt(hora) >= 18;
                }
            }
    
            return matchesSearch && matchesFacultad && matchesHorario;
        });
    
        currentPage = 1;
        renderTable();
    }
});