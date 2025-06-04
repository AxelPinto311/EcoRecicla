document.addEventListener('DOMContentLoaded', function() {
    // --- Elementos del DOM para Publicaciones ---
    const misPublicacionesContainer = document.getElementById('misPublicacionesContainer');
    const noPublicationsMessage = document.getElementById('noPublicationsMessage');
    const searchMyPublicationsForm = document.getElementById('searchMyPublicationsForm');
    const myPublicationsSearchInput = document.getElementById('myPublicationsSearchInput');
    const dropdownFilterStatus = document.getElementById('dropdownFilterStatus');

    // --- Elementos del DOM para Sucursal ---
    const sucursalInfoCard = document.getElementById('sucursalInfoCard');
    const registerBranchMessage = document.getElementById('registerBranchMessage');
    const sucursalTab = document.getElementById('sucursal-tab');

    // --- Simulación de datos (Reemplazar con llamadas a la API) ---
    // NOTA: Los estados ahora son 'disponible' o 'vendido'
    const dummyPublications = [
        { id: 1, titulo: "Lote de Botellas PET", tipoMaterial: "Plástico PET", precio: 500, estado: "disponible", imagenUrl: "../statics/img/lote_aluminion.png", fechaPublicacion: "01/06/2025" },
        { id: 2, titulo: "Cartón Ondulado Limpio", tipoMaterial: "Cartón", precio: 350, estado: "disponible", imagenUrl: "../statics/img/carton.png", fechaPublicacion: "28/05/2025" },
        { id: 3, titulo: "Latas de Aluminio", tipoMaterial: "Metal Aluminio", precio: 700, estado: "disponible", imagenUrl: "../statics/img/lote_aluminion.png", fechaPublicacion: "25/05/2025" },
        { id: 4, titulo: "Periódicos y Revistas", tipoMaterial: "Papel", precio: 200, estado: "vendido", imagenUrl: "../statics/img/diario.png", fechaPublicacion: "20/05/2025" },
        { id: 5, titulo: "Envases de Vidrio Transparente", tipoMaterial: "Vidrio", precio: 450, estado: "disponible", imagenUrl: "../statics/img/carton.png", fechaPublicacion: "15/05/2025" },
        { id: 6, titulo: "Componentes Electrónicos Varios", tipoMaterial: "Electrónicos", precio: 1200, estado: "disponible", imagenUrl: "../statics/img/lote_aluminion.png", fechaPublicacion: "10/05/2025" },
    ];

    let dummyBranch = {
        id: 101,
        nombre: "Punto Verde Central",
        direccion: "Av. Siempre Viva 742",
        ciudad: "Mendoza",
        telefono: "261-555-1234",
        horarios: "Lun-Vie: 9:00-18:00, Sáb: 9:00-13:00",
        materialesAceptados: ["Plástico", "Cartón", "Papel", "Vidrio", "Metal"],
        latitud: -32.88946,
        longitud: -68.84589
    };
    // let dummyBranch = null;

    let currentPublications = [...dummyPublications];
    let currentFilterStatus = 'todas';
    let currentSearchTerm = '';

    // --- Funciones para Publicaciones ---

    function crearCardPublicacion(publicacion) {
        // Lógica de texto y clase para el estado de la publicación
        let estadoTexto = '';
        let estadoBadgeClass = '';
        let botonEditarDisabled = ''; // Por defecto no deshabilitado

        if (publicacion.estado === 'disponible') {
            estadoTexto = 'Disponible';
            estadoBadgeClass = 'bg-success';
            botonEditarDisabled = ''; // Habilitado para editar
        } else if (publicacion.estado === 'vendido') {
            estadoTexto = 'Vendido';
            estadoBadgeClass = 'bg-secondary';
            botonEditarDisabled = 'disabled'; // Deshabilitado para editar
        } else {
            // Un estado por defecto si hubiese alguno inesperado, aunque no debería ocurrir con solo 2 opciones
            estadoTexto = 'Desconocido';
            estadoBadgeClass = 'bg-info';
            botonEditarDisabled = 'disabled';
        }

        return `
            <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${publicacion.imagenUrl || '../statics/img/placeholder.png'}" class="card-img-top" alt="${publicacion.titulo}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${publicacion.titulo} <span class="badge ${estadoBadgeClass}">${estadoTexto}</span></h5>
                        <p class="card-text tipo_material">Tipo de material: ${publicacion.tipoMaterial}</p>
                        <p class="card-text precio_card">Precio: $${publicacion.precio}</p>
                        <p class="card-text text-muted small mt-auto">Publicado: ${publicacion.fechaPublicacion}</p>
                        <div class="d-flex justify-content-between mt-3">
                            <button class="btn btn-primary btn-sm flex-grow-1 me-2" ${botonEditarDisabled} onclick="editarPublicacion(${publicacion.id})">
                                <i class="bi bi-pencil-square"></i> Editar
                            </button>
                            <button class="btn btn-danger btn-sm flex-grow-1" onclick="eliminarPublicacion(${publicacion.id})">
                                <i class="bi bi-trash"></i> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderizarPublicaciones(publicacionesAmostrar) {
        misPublicacionesContainer.innerHTML = '';
        if (publicacionesAmostrar.length > 0) {
            publicacionesAmostrar.forEach(publicacion => {
                misPublicacionesContainer.innerHTML += crearCardPublicacion(publicacion);
            });
            noPublicationsMessage.style.display = 'none';
        } else {
            noPublicationsMessage.style.display = 'block';
        }
    }

    function cargarYFiltrarPublicaciones() {
        let filteredPublications = [...dummyPublications];

        // Aplicar filtro por estado
        if (currentFilterStatus !== 'todas') {
            // El filtro ahora es directo a 'disponible' o 'vendido'
            filteredPublications = filteredPublications.filter(pub => pub.estado === currentFilterStatus);
        }

        // Aplicar filtro por búsqueda
        if (currentSearchTerm) {
            const searchTermLower = currentSearchTerm.toLowerCase();
            filteredPublications = filteredPublications.filter(pub =>
                pub.titulo.toLowerCase().includes(searchTermLower) ||
                pub.tipoMaterial.toLowerCase().includes(searchTermLower)
            );
        }
        renderizarPublicaciones(filteredPublications);
    }

    // --- Funciones para Sucursal (sin cambios en esta parte) ---

    function crearCardSucursal(sucursal) {
        if (!sucursal) {
            return `
                <div class="card-body text-center">
                    <p class="card-text text-muted">No hay información de sucursal disponible.</p>
                </div>
            `;
        }

        return `
            <div class="card-header bg-success text-white">
                <h5 class="mb-0"><i class="bi bi-shop"></i> ${sucursal.nombre}</h5>
            </div>
            <div class="card-body">
                <p class="card-text"><strong>Dirección:</strong> ${sucursal.direccion}, ${sucursal.ciudad}</p>
                <p class="card-text"><strong>Teléfono:</strong> ${sucursal.telefono}</p>
                <p class="card-text"><strong>Horarios:</strong> ${sucursal.horarios}</p>
                <p class="card-text"><strong>Materiales aceptados:</strong> ${sucursal.materialesAceptados.join(', ')}</p>
                <div class="d-flex justify-content-between mt-3">
                    <button class="btn btn-primary btn-sm flex-grow-1 me-2" onclick="editarSucursal(${sucursal.id})">
                        <i class="bi bi-pencil-square"></i> Editar Sucursal
                    </button>
                    <button class="btn btn-danger btn-sm flex-grow-1" onclick="eliminarSucursal(${sucursal.id})">
                        <i class="bi bi-trash"></i> Eliminar Sucursal
                    </button>
                </div>
            </div>
        `;
    }

    function renderizarSucursal() {
        if (dummyBranch) {
            sucursalInfoCard.innerHTML = crearCardSucursal(dummyBranch);
            sucursalInfoCard.style.display = 'block';
            registerBranchMessage.style.display = 'none';
        } else {
            sucursalInfoCard.innerHTML = crearCardSucursal(null); // Para mostrar el mensaje interno de la card si no hay sucursal
            sucursalInfoCard.style.display = 'none'; // Oculta la card
            registerBranchMessage.style.display = 'block'; // Muestra el mensaje para registrar
        }
    }

    // --- Manejadores de eventos para Publicaciones ---
    searchMyPublicationsForm.addEventListener('submit', function(event) {
        event.preventDefault();
        currentSearchTerm = myPublicationsSearchInput.value.trim();
        cargarYFiltrarPublicaciones();
    });

    document.querySelectorAll('#dropdownFilterStatus + .dropdown-menu .dropdown-item').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            currentFilterStatus = this.dataset.filterStatus;
            // Actualiza el texto del botón del dropdown
            dropdownFilterStatus.innerHTML = `<i class="bi bi-funnel"></i> Filtrar por estado: ${this.textContent}`;
            cargarYFiltrarPublicaciones();
        });
    });

    // --- Manejadores de eventos para Tabs ---
    const myTabs = document.getElementById('myTabs');
    myTabs.addEventListener('shown.bs.tab', function (event) {
        if (event.target.id === 'sucursal-tab') {
            renderizarSucursal();
        } else if (event.target.id === 'publicaciones-tab') {
            cargarYFiltrarPublicaciones();
        }
    });

    // --- Funciones de acción para Publicaciones (globales) ---
    window.editarPublicacion = function(idPublicacion) {
        console.log('Editar publicación con ID:', idPublicacion);
        alert(`Simulando: Redirigiendo para editar la publicación ${idPublicacion}`);
        // En una aplicación real, redirigirías a la página de edición con el ID:
        // window.location.href = `/templates/edit_publication.html?id=${idPublicacion}`;
    };

    window.eliminarPublicacion = function(idPublicacion) {
        if (confirm('¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.')) {
            const index = dummyPublications.findIndex(pub => pub.id === idPublicacion);
            if (index > -1) {
                dummyPublications.splice(index, 1);
                cargarYFiltrarPublicaciones();
                alert('Publicación eliminada con éxito (simulado).');
            } else {
                alert('Publicación no encontrada.');
            }
            // Aquí iría tu fetch real (DELETE /api/publicaciones/{id})
        }
    };

    // --- Funciones de acción para Sucursal (globales) ---
    window.editarSucursal = function(idSucursal) {
        console.log('Editar sucursal con ID:', idSucursal);
        alert(`Simulando: Redirigiendo para editar la sucursal ${idSucursal}`);
        // window.location.href = `/templates/edit_branch.html?id=${idSucursal}`;
    };

    window.eliminarSucursal = function(idSucursal) {
        if (confirm('¿Estás seguro de que quieres eliminar tu sucursal? Esta acción no se puede deshacer.')) {
            console.log('Eliminar sucursal con ID:', idSucursal);
            dummyBranch = null; // Simulación: establece la sucursal a null
            renderizarSucursal(); // Vuelve a renderizar para mostrar el estado "no hay sucursal"
            alert('Sucursal eliminada con éxito (simulado).');
            // Aquí iría tu fetch real (DELETE /api/sucursales/{id})
        }
    };

    // --- Carga inicial al cargar la página ---
    cargarYFiltrarPublicaciones();
});