// statics/js/new-publication.js

document.addEventListener('DOMContentLoaded', () => {
    const imageUploadArea = document.getElementById('imageUploadArea');
    const imageUploadInput = document.getElementById('imageUpload');
    const imagePreviewsContainer = document.getElementById('imagePreviewsContainer'); // Nuevo contenedor
    const uploadText = imageUploadArea.querySelector('.upload-text');
    const uploadIcon = imageUploadArea.querySelector('.upload-icon');

    // Elementos para la selección de materiales
    const categoryButtons = document.querySelectorAll('.category-btn');
    const selectedMaterialsContainer = document.getElementById('selectedMaterialsContainer');
    const selectedMaterialsInput = document.getElementById('selectedMaterialsInput');
    const noSelectionText = selectedMaterialsContainer.querySelector('.no-selection-text');

    // Validaciones
    const newPublicationForm = document.getElementById('newPublicationForm');
    const price = document.getElementById('price');
    const description = document.getElementById('description');

    const imageError = document.getElementById('imageError');
    const materialTypeError = document.getElementById('materialTypeError');
    const priceError = document.getElementById('priceError');
    const descriptionError = document.getElementById('descriptionError');

    // Array para almacenar las imágenes seleccionadas
    let uploadedFiles = []; // Array para almacenar los objetos File

    // Array para almacenar los materiales seleccionados
    let selectedMaterials = new Set();

    // Función para mostrar/ocultar mensajes de error (sin cambios)
    const showError = (element, message) => {
        element.textContent = message;
        element.classList.remove('d-none');
    };

    const hideError = (element) => {
        element.classList.add('d-none');
    };

    // Lógica para arrastrar y soltar imágenes (modificado para múltiples)
    imageUploadArea.addEventListener('click', () => {
        imageUploadInput.click();
    });

    imageUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadArea.classList.add('dragging');
    });

    imageUploadArea.addEventListener('dragleave', () => {
        imageUploadArea.classList.remove('dragging');
    });

    imageUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadArea.classList.remove('dragging');
        if (e.dataTransfer.files.length > 0) {
            handleImageUpload(e.dataTransfer.files); // Pasar todos los archivos
        }
    });

    imageUploadInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageUpload(e.target.files); // Pasar todos los archivos
        }
    });

    // Función para manejar la carga de múltiples imágenes
    function handleImageUpload(files) {
        let filesAdded = false;
        for (const file of files) {
            if (file && file.type.startsWith('image/') && !uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
                // Verificar si el archivo es una imagen y no está ya en la lista (por nombre y tamaño)
                uploadedFiles.push(file);
                filesAdded = true;
            } else if (file && !file.type.startsWith('image/')) {
                alert(`El archivo "${file.name}" no es una imagen válida y no se agregará.`);
            }
        }

        if (filesAdded) {
            updateImagePreviews();
            hideError(imageError); // Ocultar error si se sube al menos una imagen
        }
        // Limpiar el input file para que se pueda volver a subir el mismo archivo si es necesario
        imageUploadInput.value = '';
    }

    // Función para actualizar las previsualizaciones de imágenes
    function updateImagePreviews() {
        imagePreviewsContainer.innerHTML = ''; // Limpiar el contenedor actual

        if (uploadedFiles.length > 0) {
            uploadText.classList.add('d-none');
            uploadIcon.classList.add('d-none');
            imageUploadArea.classList.add('has-images'); // Añadir clase para ocultar ícono/texto
        } else {
            uploadText.classList.remove('d-none');
            uploadIcon.classList.remove('d-none');
            imageUploadArea.classList.remove('has-images'); // Remover clase
        }

        uploadedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const thumbnailDiv = document.createElement('div');
                thumbnailDiv.classList.add('image-thumbnail');
                thumbnailDiv.dataset.index = index; // Guardar el índice para fácil eliminación

                thumbnailDiv.innerHTML = `
                    <img src="${e.target.result}" alt="Vista previa de imagen">
                    <button type="button" class="remove-image-thumbnail-btn">&times;</button>
                `;
                imagePreviewsContainer.appendChild(thumbnailDiv);
            };
            reader.readAsDataURL(file);
        });
    }

    // Lógica para eliminar una miniatura de imagen
    imagePreviewsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-image-thumbnail-btn')) {
            const thumbnailDiv = e.target.closest('.image-thumbnail');
            if (thumbnailDiv) {
                const indexToRemove = parseInt(thumbnailDiv.dataset.index);
                // Eliminar el archivo del array uploadedFiles
                uploadedFiles.splice(indexToRemove, 1);
                // Re-asignar índices a los elementos restantes si es necesario (para que dataset.index sea siempre correlativo)
                // Es más simple simplemente volver a renderizar todo el contenedor
                updateImagePreviews(); // Volver a renderizar las miniaturas
                
                if (uploadedFiles.length === 0) {
                    showError(imageError, 'Por favor, sube al menos una imagen del material.');
                }
            }
        }
    });


    // Lógica para la selección múltiple de materiales (sin cambios importantes)
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const materialValue = button.dataset.material;
            //const materialName = button.textContent; // Texto visible del botón (no se usa directamente aquí, solo para getMaterialName)

            if (selectedMaterials.has(materialValue)) {
                selectedMaterials.delete(materialValue);
                button.classList.remove('selected');
            } else {
                selectedMaterials.add(materialValue);
                button.classList.add('selected');
            }
            updateSelectedMaterialsDisplay();
            hideError(materialTypeError);
        });
    });

    function updateSelectedMaterialsDisplay() {
        selectedMaterialsContainer.innerHTML = '';

        if (selectedMaterials.size === 0) {
            noSelectionText.classList.remove('d-none');
            selectedMaterialsContainer.appendChild(noSelectionText);
        } else {
            noSelectionText.classList.add('d-none');
            selectedMaterials.forEach(materialValue => {
                const materialName = getMaterialName(materialValue);

                const tag = document.createElement('span');
                tag.classList.add('selected-material-tag');
                tag.innerHTML = `
                    ${materialName}
                    <button type="button" class="btn btn-secondary remove-tag-btn" data-material="${materialValue}">&times;</button>
                `;
                selectedMaterialsContainer.appendChild(tag);
            });
        }
        selectedMaterialsInput.value = Array.from(selectedMaterials).join(',');
    }

    selectedMaterialsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-tag-btn')) {
            const materialToRemove = e.target.dataset.material;
            selectedMaterials.delete(materialToRemove);

            const correspondingButton = document.querySelector(`.category-btn[data-material="${materialToRemove}"]`);
            if (correspondingButton) {
                correspondingButton.classList.remove('selected');
            }
            updateSelectedMaterialsDisplay();
        }
    });

    function getMaterialName(value) {
        const names = {
            'papel': 'Papel',
            'carton': 'Cartón',
            'plastico': 'Plástico',
            'vidrio': 'Vidrio',
            'metal': 'Metal',
            'electronicos': 'Electrónicos',
            'organicos': 'Orgánicos',
            'textiles': 'Textiles'
        };
        return names[value] || value;
    }

    // Inicializar el display de materiales seleccionados al cargar la página
    updateSelectedMaterialsDisplay();


    // Validación del formulario al enviar (modificada para imágenes)
    newPublicationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;

        // Validar imágenes
        if (uploadedFiles.length === 0) {
            showError(imageError, 'Por favor, sube al menos una imagen del material.');
            isValid = false;
        } else {
            hideError(imageError);
        }

        // Validar tipo de material
        if (selectedMaterials.size === 0) {
            showError(materialTypeError, 'Por favor, selecciona al menos un tipo de material.');
            isValid = false;
        } else {
            hideError(materialTypeError);
        }

        // Validar precio
        if (price.value === '' || parseFloat(price.value) < 0) {
            showError(priceError, 'Por favor, ingresa un precio válido.');
            isValid = false;
        } else {
            hideError(priceError);
        }

        // Validar descripción
        if (description.value.trim() === '') {
            showError(descriptionError, 'Por favor, ingresa una descripción del material.');
            isValid = false;
        } else {
            hideError(descriptionError);
        }

        if (isValid) {
            alert('Formulario enviado correctamente (simulado).');
            console.log('Datos a enviar:', {
                images: uploadedFiles, // Ahora es un array de archivos
                selectedMaterials: Array.from(selectedMaterials),
                price: price.value,
                negotiable: document.getElementById('negotiablePrice').checked,
                description: description.value
            });
            // Aquí iría tu lógica para enviar los datos al backend.
            // Para enviar múltiples archivos, usualmente se usa FormData:
            /*
            const formData = new FormData();
            uploadedFiles.forEach(file => {
                formData.append('images', file); // 'images' sería el nombre del campo en el backend
            });
            formData.append('materials', Array.from(selectedMaterials).join(','));
            formData.append('price', price.value);
            formData.append('negotiable', document.getElementById('negotiablePrice').checked);
            formData.append('description', description.value);

            fetch('/tu-endpoint-de-publicacion', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => console.log('Éxito:', data))
            .catch(error => console.error('Error:', error));
            */
        } else {
            alert('Por favor, completa todos los campos requeridos.');
        }
    });
});