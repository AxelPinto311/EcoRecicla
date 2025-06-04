document.addEventListener('DOMContentLoaded', function() {
    const publicationsContainer = document.getElementById('publicationsContainer');
    const noPublicationsMessage = document.getElementById('noPublicationsMessage');
    const mainSearchForm = document.getElementById('mainSearchForm');
    const mainSearchInput = document.getElementById('mainSearchInput');
    const filterButtons = document.querySelectorAll('.filtro_container .btn');

    // --- Configuración del endpoint de la API (ajusta según tu backend) ---
    const API_BASE_URL = 'http://localhost:3000/api'; // O la URL de tu backend
    let allPublications = []; // Almacenará todas las publicaciones obtenidas de la API

    let currentFilterMaterial = 'todas'; // Estado actual del filtro de material
    let currentSearchTerm = ''; // Estado actual del término de búsqueda

    // --- Función para obtener publicaciones de la API ---
    async function fetchPublications() {
        try {
            // Podrías añadir parámetros de búsqueda o filtro directamente a la URL de la API si tu backend los soporta
            // const response = await fetch(`${API_BASE_URL}/publications?material=${currentFilterMaterial}&search=${currentSearchTerm}`);
            const response = await fetch(`${API_BASE_URL}/publications`); // Simplemente obtenemos todas por ahora
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allPublications = data; // Guardamos todas las publicaciones
            renderizarPublicaciones(); // Una vez que los datos están cargados, los renderizamos
        } catch (error) {
            console.error('Error al obtener las publicaciones:', error);
            publicationsContainer.innerHTML = '<p class="text-danger">Error al cargar las publicaciones. Intenta de nuevo más tarde.</p>';
            noPublicationsMessage.style.display = 'none'; // Asegurarse de que el mensaje de "no publicaciones" no se muestre en caso de error de red
        }
    }

    // --- Función para crear una card de publicación ---
    function crearCardPublicacion(publicacion) {
        // Enlace de la card que lleva a la página de detalle
        const detailLink = `../templates/publication_detail.html?id=${publicacion.id}`;

        // Asumiendo que la imagen es opcional y podría faltar, o que el backend devuelve un path completo
        const imageUrl = publicacion.imagenUrl || '../statics/img/placeholder.png';
        const priceText = publicacion.precio ? `Precio $${publicacion.precio}` : 'Precio a convenir';

        return `
            <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                <div class="card h-100 shadow-sm">
                    <a href="${detailLink}" class="text-decoration-none text-dark">
                        <img src="${imageUrl}" class="card-img-top" alt="${publicacion.titulo}">
                        <div class="card-body">
                            <h5 class="card-title">${publicacion.titulo}</h5>
                            <p class="card-text tipo_material">Tipo de material: ${publicacion.tipoMaterial || 'No especificado'}</p>
                            <p class="card-text precio_card">${priceText}</p>
                        </div>
                    </a>
                </div>
            </div>
        `;
    }

    // --- Función para renderizar publicaciones basado en filtros y búsqueda ---
    function renderizarPublicaciones() {
        publicationsContainer.innerHTML = ''; // Limpiar el contenedor
        let filteredPublications = [...allPublications]; // Trabajar con una copia de los datos completos

        // 1. Filtrar por tipo de material
        if (currentFilterMaterial !== 'todas') {
            filteredPublications = filteredPublications.filter(pub =>
                pub.tipoMaterial && pub.tipoMaterial.toLowerCase().includes(currentFilterMaterial.toLowerCase())
            );
        }

        // 2. Filtrar por término de búsqueda (título, tipo de material o descripción)
        if (currentSearchTerm) {
            const searchTermLower = currentSearchTerm.toLowerCase();
            filteredPublications = filteredPublications.filter(pub =>
                (pub.titulo && pub.titulo.toLowerCase().includes(searchTermLower)) ||
                (pub.tipoMaterial && pub.tipoMaterial.toLowerCase().includes(searchTermLower)) ||
                (pub.descripcion && pub.descripcion.toLowerCase().includes(searchTermLower))
            );
        }

        let availablePublicationsCount = 0;
        filteredPublications.forEach(publicacion => {
            // Solo mostrar publicaciones "disponibles" en la vista principal
            if (publicacion.estado === 'disponible' || !publicacion.estado) { // Asume "disponible" si no se especifica
                publicationsContainer.innerHTML += crearCardPublicacion(publicacion);
                availablePublicationsCount++;
            }
        });

        // Mostrar u ocultar el mensaje de "no publicaciones"
        if (availablePublicationsCount === 0) {
            noPublicationsMessage.style.display = 'block';
        } else {
            noPublicationsMessage.style.display = 'none';
        }
    }

    // --- Event Listeners ---

    // 1. Para los botones de filtro de material
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('btn-primary'));
            this.classList.add('btn-primary');

            currentFilterMaterial = this.dataset.material;
            renderizarPublicaciones(); // Volver a renderizar con el nuevo filtro
        });
    });

    // 2. Para el buscador principal de la navbar
    mainSearchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        currentSearchTerm = mainSearchInput.value.trim();
        renderizarPublicaciones(); // Volver a renderizar con el nuevo término de búsqueda
    });

    // 3. Opcional: Limpiar búsqueda al borrar el input
    mainSearchInput.addEventListener('input', function() {
        if (this.value.trim() === '' && currentSearchTerm !== '') {
            currentSearchTerm = '';
            renderizarPublicaciones();
        }
    });

    // --- Carga inicial de publicaciones ---
    fetchPublications(); // Llama a la API al cargar la página
});