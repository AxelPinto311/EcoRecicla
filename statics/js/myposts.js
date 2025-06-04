document.addEventListener('DOMContentLoaded', function() {
    // --- Elementos del DOM para Publicaciones ---
    const misPublicacionesContainer = document.getElementById('misPublicacionesContainer');
    const noPublicationsMessage = document.getElementById('noPublicationsMessage');
    const searchMyPublicationsForm = document.getElementById('searchMyPublicationsForm');
    const myPublicationsSearchInput = document.getElementById('myPublicationsSearchInput');
    const dropdownFilterStatus = document.getElementById('dropdownFilterStatus');
    const statusFilterLinks = document.querySelectorAll('#dropdownFilterStatus + .dropdown-menu .dropdown-item');

    // --- Elementos del DOM para Sucursal ---
    const sucursalInfoCard = document.getElementById('sucursalInfoCard');
    const registerBranchMessage = document.getElementById('registerBranchMessage');
    const branchName = document.getElementById('branchName');
    const branchAddress = document.getElementById('branchAddress');
    const branchSchedule = document.getElementById('branchSchedule');
    const branchPhone = document.getElementById('branchPhone');
    const branchMaterials = document.getElementById('branchMaterials');
    const editBranchBtn = document.getElementById('editBranchBtn');
    const deleteBranchBtn = document.getElementById('deleteBranchBtn');

    // --- Funciones para el buscador principal de la navbar (se redirige a publications.html) ---
    const mainSearchForm = document.getElementById('mainSearchForm');
    const mainSearchInput = document.getElementById('mainSearchInput');

    if (mainSearchForm) {
        mainSearchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const searchTerm = mainSearchInput.value.trim();
            // Redirige a la página de publicaciones con el término de búsqueda
            window.location.href = `../templates/publications.html?search=${encodeURIComponent(searchTerm)}`;
        });
    }

    // --- Configuración del endpoint de la API ---
    const API_BASE_URL = 'http://localhost:3000/api'; // Ajusta según tu backend

    // --- Simulación de usuario logueado (reemplazar con lógica de autenticación real) ---
    // En un sistema real, este userId vendría de un token JWT o una sesión.
    // Para propósitos de simulación, lo obtenemos de localStorage o definimos uno fijo.
    const CURRENT_USER_ID = localStorage.getItem('loggedUserId') || 'user123'; // Simula que 'user123' es el ID del usuario logueado

    let userPublications = []; // Almacenará las publicaciones del usuario
    let userBranch = null; // Almacenará la sucursal del usuario
    let currentFilterStatus = 'todos'; // Estado actual del filtro de publicaciones
    let currentSearchTerm = ''; // Estado actual del término de búsqueda de publicaciones

    // --- Funciones de Publicaciones ---

    // Función para crear una card de publicación del usuario
    function crearCardPublicacionUsuario(publicacion) {
        // Enlace al detalle de la publicación
        const detailLink = `../templates/publication_detail.html?id=${publicacion.id}`;
        // Enlace para editar publicación (asumiendo una página de edición como new_publication.html pero precargada)
        const editLink = `../templates/new_publication.html?id=${publicacion.id}&edit=true`;

        const imageUrl = publicacion.imagenUrl || '../statics/img/placeholder.png';
        const priceText = publicacion.precio ? `$${publicacion.precio}` : 'Precio a convenir';
        const statusClass = publicacion.estado === 'disponible' ? 'text-success' : 'text-danger';
        const statusText = publicacion.estado === 'disponible' ? 'Disponible' : 'Vendido';

        return `
            <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                <div class="card h-100 shadow-sm">
                    <a href="${detailLink}" class="text-decoration-none text-dark">
                        <img src="${imageUrl}" class="card-img-top" alt="${publicacion.titulo}">
                        <div class="card-body">
                            <h5 class="card-title">${publicacion.titulo}</h5>
                            <p class="card-text tipo_material">Tipo de material: ${publicacion.tipoMaterial || 'No especificado'}</p>
                            <p class="card-text precio_card">${priceText}</p>
                            <p class="card-text"><strong class="${statusClass}">Estado: ${statusText}</strong></p>
                            <p class="card-text"><small class="text-muted">Publicado el: ${publicacion.fechaPublicacion || 'N/A'}</small></p>
                        </div>
                    </a>
                    <div class="card-footer d-flex justify-content-around">
                        <a href="${editLink}" class="btn btn-sm btn-outline-info">Editar</a>
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarPublicacion(${publicacion.id})">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Función para renderizar las publicaciones del usuario
    function renderizarMisPublicaciones() {
        misPublicacionesContainer.innerHTML = '';
        let filtered = [...userPublications];

        // Aplicar filtro por estado
        if (currentFilterStatus !== 'todos') {
            filtered = filtered.filter(pub => pub.estado === currentFilterStatus);
        }

        // Aplicar filtro por búsqueda
        if (currentSearchTerm) {
            const searchTermLower = currentSearchTerm.toLowerCase();
            filtered = filtered.filter(pub =>
                (pub.titulo && pub.titulo.toLowerCase().includes(searchTermLower)) ||
                (pub.tipoMaterial && pub.tipoMaterial.toLowerCase().includes(searchTermLower)) ||
                (pub.descripcion && pub.descripcion.toLowerCase().includes(searchTermLower))
            );
        }

        if (filtered.length > 0) {
            filtered.forEach(publicacion => {
                misPublicacionesContainer.innerHTML += crearCardPublicacionUsuario(publicacion);
            });
            noPublicationsMessage.style.display = 'none';
        } else {
            noPublicationsMessage.style.display = 'block';
        }
    }

    // Función para obtener las publicaciones del usuario desde la API
    async function fetchUserPublications() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${CURRENT_USER_ID}/publications`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            userPublications = data; // Asumiendo que el backend devuelve un array de publicaciones
            renderizarMisPublicaciones();
        } catch (error) {
            console.error('Error al obtener las publicaciones del usuario:', error);
            misPublicacionesContainer.innerHTML = '<p class="text-danger">Error al cargar tus publicaciones.</p>';
            noPublicationsMessage.style.display = 'none';
        }
    }

    // Función global para eliminar publicación (accesible desde el HTML)
    window.eliminarPublicacion = async function(idPublicacion) {
        if (confirm('¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.')) {
            try {
                const response = await fetch(`${API_BASE_URL}/publications/${idPublicacion}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('userToken')}` // Envía un token de autenticación
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                alert('Publicación eliminada con éxito!');
                fetchUserPublications(); // Volver a cargar las publicaciones para actualizar la lista
            } catch (error) {
                console.error('Error al eliminar la publicación:', error);
                alert(`Error al eliminar la publicación: ${error.message || 'Hubo un problema.'}`);
            }
        }
    };

    // --- Funciones de Sucursal ---

    // Función para renderizar la información de la sucursal
    function renderizarSucursal() {
        if (userBranch) {
            branchName.textContent = userBranch.nombre || 'Sin nombre';
            branchAddress.textContent = userBranch.direccion || 'Sin dirección';
            branchSchedule.textContent = userBranch.horario || 'Sin horario';
            branchPhone.textContent = userBranch.telefono || 'Sin teléfono';
            branchMaterials.textContent = userBranch.materialesAceptados && userBranch.materialesAceptados.length > 0
                ? userBranch.materialesAceptados.join(', ')
                : 'Ninguno especificado';

            sucursalInfoCard.style.display = 'block';
            registerBranchMessage.style.display = 'none';

            // Configurar botones de editar/eliminar con el ID de la sucursal
            editBranchBtn.onclick = () => window.location.href = `../templates/crear_sucursal.html?id=${userBranch.id}&edit=true`;
            deleteBranchBtn.onclick = () => eliminarSucursal(userBranch.id);

        } else {
            sucursalInfoCard.style.display = 'none';
            registerBranchMessage.style.display = 'block';
        }
    }

    // Función para obtener la sucursal del usuario desde la API
    async function fetchUserBranch() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${CURRENT_USER_ID}/branch`);
            if (!response.ok) {
                if (response.status === 404) {
                    userBranch = null; // No hay sucursal para este usuario
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } else {
                userBranch = await response.json(); // Asumiendo que el backend devuelve un objeto de sucursal
            }
            renderizarSucursal();
        } catch (error) {
            console.error('Error al obtener la sucursal del usuario:', error);
            sucursalInfoCard.innerHTML = '<p class="text-danger">Error al cargar los datos de tu sucursal.</p>';
            registerBranchMessage.style.display = 'none';
        }
    }

    // Función global para eliminar sucursal (accesible desde el HTML)
    window.eliminarSucursal = async function(idSucursal) {
        if (confirm('¿Estás seguro de que quieres eliminar tu sucursal? Esta acción no se puede deshacer.')) {
            try {
                const response = await fetch(`${API_BASE_URL}/branches/${idSucursal}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('userToken')}` // Envía un token de autenticación
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                alert('Sucursal eliminada con éxito!');
                userBranch = null; // Establecer a null para que se muestre el botón de registrar
                renderizarSucursal(); // Actualizar la interfaz
            } catch (error) {
                console.error('Error al eliminar la sucursal:', error);
                alert(`Error al eliminar la sucursal: ${error.message || 'Hubo un problema.'}`);
            }
        }
    };


    // --- Event Listeners para filtros y búsqueda de publicaciones ---
    searchMyPublicationsForm.addEventListener('submit', function(event) {
        event.preventDefault();
        currentSearchTerm = myPublicationsSearchInput.value.trim();
        renderizarMisPublicaciones();
    });

    myPublicationsSearchInput.addEventListener('input', function() {
        if (this.value.trim() === '' && currentSearchTerm !== '') {
            currentSearchTerm = '';
            renderizarMisPublicaciones();
        }
    });

    statusFilterLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            currentFilterStatus = this.dataset.status;
            dropdownFilterStatus.textContent = `Filtrar por Estado: ${this.textContent}`;
            renderizarMisPublicaciones();
        });
    });

    // --- Carga inicial de datos al cargar la página ---
    fetchUserPublications();
    fetchUserBranch();

    // Simulación de login para pruebas (borrar en producción con un sistema de login real)
    if (!localStorage.getItem('loggedUserId')) {
        localStorage.setItem('loggedUserId', 'user123'); // Guarda un ID de usuario dummy al iniciar por primera vez
    }
});