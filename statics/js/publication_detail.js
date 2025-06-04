document.addEventListener('DOMContentLoaded', function() {
    // --- Elementos del DOM ---
    const publicationDetailSection = document.getElementById('publicationDetailSection');
    const notFoundMessage = document.getElementById('notFoundMessage');

    const carouselInner = document.getElementById('carouselInner');
    const publicationTitle = document.getElementById('publicationTitle');
    const publicationPrice = document.getElementById('publicationPrice');
    const publicationMaterialType = document.getElementById('publicationMaterialType');
    const publicationDescription = document.getElementById('publicationDescription');
    const publicationStatus = document.getElementById('publicationStatus');
    const publicationSellerName = document.getElementById('publicationSellerName');
    const publicationLocation = document.getElementById('publicationLocation');
    const publicationDate = document.getElementById('publicationDate'); // Nuevo campo para la fecha

    const buyButton = document.getElementById('buyButton');
    const buyButtonMessage = document.getElementById('buyButtonMessage');

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

    // --- Obtener el ID de la publicación de la URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const publicationId = urlParams.get('id');

    // --- Función para cargar los detalles de la publicación desde la API ---
    async function loadPublicationDetail(id) {
        try {
            // Asegúrate de que el ID es válido antes de hacer la llamada a la API
            if (!id || isNaN(id)) {
                showNotFoundMessage();
                return;
            }

            const response = await fetch(`${API_BASE_URL}/publications/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    showNotFoundMessage(); // Publicación no encontrada
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return;
            }
            const publication = await response.json();

            // Rellenar los elementos del DOM con los datos de la publicación
            publicationTitle.textContent = publication.titulo || 'Título no disponible';
            publicationPrice.textContent = publication.precio ? `$${publication.precio}` : 'Precio a convenir';
            publicationMaterialType.textContent = publication.tipoMaterial || 'No especificado';
            publicationDescription.textContent = publication.descripcion || 'Sin descripción.';
            publicationStatus.textContent = publication.estado ? (publication.estado === 'disponible' ? 'Disponible' : 'Vendido') : 'Estado desconocido';
            publicationSellerName.textContent = publication.vendedor && publication.vendedor.nombre ? publication.vendedor.nombre : 'Vendedor anónimo';
            publicationLocation.textContent = publication.ubicacion || 'Ubicación no especificada';
            publicationDate.textContent = publication.fechaPublicacion || 'Fecha no disponible';


            // Cargar imágenes del carrusel
            loadCarouselImages(publication.imagenes || [publication.imagenUrl]); // Asume 'imagenes' es un array de URLs, o fallback a 'imagenUrl'

            // Configurar botón de WhatsApp
            if (publication.vendedor && publication.vendedor.telefono) {
                const phoneNumber = publication.vendedor.telefono.replace(/\D/g, ''); // Limpia el número
                buyButton.onclick = () => {
                    window.open(`https://wa.me/${phoneNumber}?text=Hola,%20me%20interesa%20tu%20publicación:%20"${encodeURIComponent(publication.titulo)}"%20(ID:%20${publication.id})`, '_blank');
                };
                buyButton.style.display = 'block';
                buyButtonMessage.style.display = 'block';
            } else {
                buyButton.style.display = 'none';
                buyButtonMessage.textContent = 'Número de contacto no disponible.';
                buyButtonMessage.style.display = 'block';
            }

            publicationDetailSection.style.display = 'block'; // Mostrar la sección de detalles
            notFoundMessage.style.display = 'none'; // Ocultar el mensaje de no encontrado

        } catch (error) {
            console.error('Error al cargar la publicación:', error);
            showNotFoundMessage(); // Mostrar mensaje de error general
        }
    }

    // --- Función para cargar imágenes en el carrusel ---
    function loadCarouselImages(imageUrls) {
        carouselInner.innerHTML = ''; // Limpiar carrusel existente
        if (imageUrls && imageUrls.length > 0) {
            imageUrls.forEach((url, index) => {
                const carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item');
                if (index === 0) {
                    carouselItem.classList.add('active'); // La primera imagen es activa por defecto
                }

                const img = document.createElement('img');
                img.src = url;
                img.classList.add('d-block', 'w-100', 'img-fluid', 'rounded'); // Clases de Bootstrap
                img.alt = `Imagen ${index + 1} de la publicación`;

                carouselItem.appendChild(img);
                carouselInner.appendChild(carouselItem);
            });
        } else {
            // Si no hay imágenes, mostrar un placeholder
            const placeholderItem = document.createElement('div');
            placeholderItem.classList.add('carousel-item', 'active');
            const img = document.createElement('img');
            img.src = '../statics/img/placeholder.png'; // Tu imagen de placeholder
            img.classList.add('d-block', 'w-100', 'img-fluid', 'rounded');
            img.alt = 'Imagen no disponible';
            placeholderItem.appendChild(img);
            carouselInner.appendChild(placeholderItem);
        }
    }

    // --- Función para mostrar el mensaje de "Publicación no encontrada" ---
    function showNotFoundMessage() {
        publicationDetailSection.style.display = 'none';
        notFoundMessage.style.display = 'block';
    }

    // --- Lógica de inicio ---
    if (publicationId) {
        loadPublicationDetail(publicationId);
    } else {
        showNotFoundMessage(); // Si no hay ID en la URL, mostrar mensaje de no encontrado
    }
});