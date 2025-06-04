// statics/js/new-publication.js

document.addEventListener('DOMContentLoaded', () => {
    const imageUploadArea = document.getElementById('imageUploadArea');
    const imageUploadInput = document.getElementById('imageUpload');
    const imagePreviewsContainer = document.getElementById('imagePreviewsContainer');
    const uploadText = imageUploadArea.querySelector('.upload-text');
    const uploadIcon = imageUploadArea.querySelector('.upload-icon');

    const categoryButtons = document.querySelectorAll('.category-btn');
    const selectedMaterialsContainer = document.getElementById('selectedMaterialsContainer');
    const selectedMaterialsInput = document.getElementById('selectedMaterialsInput');
    const noSelectionText = selectedMaterialsContainer.querySelector('.no-selection-text');

    const newPublicationForm = document.getElementById('newPublicationForm');
    const titleInput = document.getElementById('title'); // Nuevo: campo de título
    const priceInput = document.getElementById('price'); // Cambiado a priceInput
    const descriptionInput = document.getElementById('description'); // Cambiado a descriptionInput

    const imageError = document.getElementById('imageError');
    const materialTypeError = document.getElementById('materialTypeError');
    const priceError = document.getElementById('priceError');
    const descriptionError = document.getElementById('descriptionError');

    let uploadedFiles = [];
    let selectedMaterials = new Set(); // Usar un Set para materiales para evitar duplicados

    // --- Funcionalidad de carga de imágenes ---
    imageUploadArea.addEventListener('click', () => {
        imageUploadInput.click();
    });

    imageUploadArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        imageUploadArea.classList.add('drag-over');
    });

    imageUploadArea.addEventListener('dragleave', () => {
        imageUploadArea.classList.remove('drag-over');
    });

    imageUploadArea.addEventListener('drop', (event) => {
        event.preventDefault();
        imageUploadArea.classList.remove('drag-over');
        handleFiles(event.dataTransfer.files);
    });

    imageUploadInput.addEventListener('change', (event) => {
        handleFiles(event.target.files);
    });

    function handleFiles(files) {
        imageError.style.display = 'none'; // Ocultar mensaje de error de imagen
        for (const file of files) {
            if (file.type.startsWith('image/') && uploadedFiles.length < 5) { // Limitar a 5 imágenes
                uploadedFiles.push(file);
                renderImagePreviews();
            } else if (!file.type.startsWith('image/')) {
                alert('Solo se permiten archivos de imagen.');
            } else if (uploadedFiles.length >= 5) {
                alert('Has alcanzado el límite máximo de 5 imágenes.');
            }
        }
        updateUploadAreaText();
    }

    function renderImagePreviews() {
        imagePreviewsContainer.innerHTML = '';
        if (uploadedFiles.length > 0) {
            uploadedFiles.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const previewWrapper = document.createElement('div');
                    previewWrapper.classList.add('image-preview-wrapper', 'position-relative', 'me-2', 'mb-2');

                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.classList.add('img-thumbnail', 'rounded');
                    img.style.width = '100px';
                    img.style.height = '100px';
                    img.style.objectFit = 'cover';

                    const deleteButton = document.createElement('button');
                    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'position-absolute', 'top-0', 'end-0', 'translate-middle', 'rounded-circle');
                    deleteButton.innerHTML = '&times;';
                    deleteButton.onclick = () => {
                        uploadedFiles.splice(index, 1);
                        renderImagePreviews();
                        updateUploadAreaText();
                    };

                    previewWrapper.appendChild(img);
                    previewWrapper.appendChild(deleteButton);
                    imagePreviewsContainer.appendChild(previewWrapper);
                };
                reader.readAsDataURL(file);
            });
        }
    }

    function updateUploadAreaText() {
        if (uploadedFiles.length > 0) {
            uploadText.textContent = `${uploadedFiles.length} imagen(es) seleccionada(s). Haz clic o arrastra para añadir más.`;
            uploadIcon.style.display = 'none';
        } else {
            uploadText.textContent = 'Arrastra y suelta imágenes aquí o haz clic para seleccionar';
            uploadIcon.style.display = 'block';
        }
    }

    // --- Funcionalidad de selección de materiales ---
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const material = button.dataset.material;
            if (selectedMaterials.has(material)) {
                selectedMaterials.delete(material);
                button.classList.remove('btn-primary');
                button.classList.add('btn-outline-primary');
            } else {
                selectedMaterials.add(material);
                button.classList.add('btn-primary');
                button.classList.remove('btn-outline-primary');
            }
            renderSelectedMaterials();
            materialTypeError.style.display = 'none'; // Ocultar mensaje de error de material
        });
    });

    function renderSelectedMaterials() {
        selectedMaterialsContainer.innerHTML = ''; // Limpiar
        if (selectedMaterials.size === 0) {
            noSelectionText.style.display = 'block';
            selectedMaterialsInput.value = ''; // Asegurarse de que el input oculto esté vacío
        } else {
            noSelectionText.style.display = 'none';
            selectedMaterials.forEach(material => {
                const badge = document.createElement('span');
                badge.classList.add('badge', 'bg-secondary', 'me-2', 'mb-2');
                badge.textContent = material;
                selectedMaterialsContainer.appendChild(badge);
            });
            // Actualizar el input oculto con los materiales seleccionados, separados por coma
            selectedMaterialsInput.value = Array.from(selectedMaterials).join(',');
        }
    }

    // --- Validaciones y Envío del Formulario ---
    newPublicationForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Detener el envío por defecto del formulario

        // Resetear mensajes de error
        imageError.style.display = 'none';
        materialTypeError.style.display = 'none';
        priceError.style.display = 'none';
        descriptionError.style.display = 'none';
        titleInput.classList.remove('is-invalid');
        descriptionInput.classList.remove('is-invalid');
        priceInput.classList.remove('is-invalid');

        let isValid = true;

        // Validación de título
        if (titleInput.value.trim() === '') {
            titleInput.classList.add('is-invalid');
            isValid = false;
        }

        // Validación de imágenes
        if (uploadedFiles.length === 0) {
            imageError.style.display = 'block';
            isValid = false;
        }

        // Validación de tipo de material
        if (selectedMaterials.size === 0) {
            materialTypeError.style.display = 'block';
            isValid = false;
        }

        // Validación de descripción
        if (descriptionInput.value.trim() === '') {
            descriptionInput.classList.add('is-invalid');
            descriptionError.style.display = 'block';
            isValid = false;
        }

        // Validación de precio (si se ingresa, que no sea negativo)
        if (priceInput.value !== '' && parseFloat(priceInput.value) < 0) {
            priceInput.classList.add('is-invalid');
            priceError.style.display = 'block';
            isValid = false;
        }

        if (isValid) {
            const formData = new FormData();
            formData.append('titulo', titleInput.value.trim()); // Nuevo: Título
            formData.append('descripcion', descriptionInput.value.trim());
            formData.append('tipoMaterial', Array.from(selectedMaterials).join(','));
            formData.append('precio', priceInput.value === '' ? '' : parseFloat(priceInput.value));
            formData.append('negociable', document.getElementById('negotiablePrice').checked);

            uploadedFiles.forEach((file, index) => {
                formData.append(`images`, file); // Asegúrate de que el nombre del campo en el backend sea 'images'
            });

            // Agrega el ID del usuario (simulado por ahora)
            // En un sistema real, el backend obtendría el userId del token de sesión/autenticación
            // formData.append('userId', localStorage.getItem('currentUser') || '123'); // ID de usuario dummy o real

            const API_ENDPOINT = 'http://localhost:3000/api/publications'; // Ajusta a tu endpoint real

            try {
                const response = await fetch(API_ENDPOINT, {
                    method: 'POST',
                    body: formData // FormData se encarga del 'Content-Type' automáticamente
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                alert('Publicación creada con éxito!');
                console.log('Publicación creada:', result);

                // Opcional: Redirigir al usuario a la página de sus publicaciones o al detalle de la nueva publicación
                window.location.href = `../templates/publications.html`; // O `../templates/publication_detail.html?id=${result.id}`
                newPublicationForm.reset();
                uploadedFiles = [];
                selectedMaterials.clear();
                renderImagePreviews();
                renderSelectedMaterials();
                updateUploadAreaText();

            } catch (error) {
                console.error('Error al crear la publicación:', error);
                alert(`Error al crear la publicación: ${error.message || 'Hubo un problema.'}`);
            }

        } else {
            alert('Por favor, corrige los errores en el formulario.');
        }
    });

    // Carga inicial de elementos de materiales
    renderSelectedMaterials();
    updateUploadAreaText();
});