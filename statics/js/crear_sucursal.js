document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const formTitle = document.getElementById('formTitle');
    const branchForm = document.getElementById('branchForm');
    const branchNameInput = document.getElementById('branchNameInput');
    const branchAddressInput = document.getElementById('branchAddress');
    const branchPhoneInput = document.getElementById('branchPhone');
    const branchScheduleInput = document.getElementById('branchSchedule');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const locationInfo = document.getElementById('locationInfo');
    const submitBranchBtn = document.getElementById('submitBranchBtn');
    const clearFormBtn = document.getElementById('clearFormBtn');

    // Materiales
    const categoryButtons = document.querySelectorAll('.category-btn');
    const selectedMaterialsContainer = document.getElementById('selectedMaterialsContainer');
    const selectedMaterialsInput = document.getElementById('selectedMaterialsInput');
    const noSelectionText = selectedMaterialsContainer.querySelector('.no-selection-text');
    let selectedMaterials = new Set();

    // Mensajes de error
    const materialTypeError = document.getElementById('materialTypeError');
    const locationError = document.getElementById('locationError');

    // --- Configuración del endpoint de la API ---
    const API_BASE_URL = 'http://localhost:3000/api'; // Ajusta según tu backend
    // Simulación de usuario logueado (reemplazar con lógica de autenticación real)
    const CURRENT_USER_ID = localStorage.getItem('loggedUserId') || 'user123'; 

    // --- Parámetros de URL para edición ---
    const urlParams = new URLSearchParams(window.location.search);
    const branchId = urlParams.get('id');
    const isEditMode = urlParams.get('edit') === 'true' && branchId;

    // --- Inicializar el mapa ---
    // Maipú, Mendoza: latitud aproximada -34.6644, longitud -68.7909
    const initialLat = -34.6644;
    const initialLng = -68.7909;
    const initialZoom = 13;

    const map = L.map('map').setView([initialLat, initialLng], initialZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let marker; // Variable para almacenar el marcador

    // Función para agregar o mover el marcador
    function placeMarker(lat, lng) {
        if (marker) {
            marker.setLatLng([lat, lng]);
        } else {
            marker = L.marker([lat, lng], { draggable: true }).addTo(map);
            marker.on('dragend', onMarkerDragEnd); // Escuchar el evento dragend
        }
        map.setView([lat, lng], map.getZoom() > 15 ? map.getZoom() : 15); // Centrar y hacer zoom si es necesario

        latitudeInput.value = lat;
        longitudeInput.value = lng;
        locationInfo.textContent = `Latitud: ${lat.toFixed(6)}, Longitud: ${lng.toFixed(6)}`;
        locationError.style.display = 'none'; // Ocultar mensaje de error
    }

    // Evento de clic en el mapa
    map.on('click', (e) => {
        placeMarker(e.latlng.lat, e.latlng.lng);
    });

    // Evento al arrastrar el marcador
    function onMarkerDragEnd(e) {
        const coords = e.target.getLatLng();
        placeMarker(coords.lat, coords.lng);
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

    // --- Carga de datos para edición ---
    async function loadBranchForEdit(id) {
        formTitle.textContent = "Editar Sucursal de Reciclaje";
        submitBranchBtn.textContent = "Guardar Cambios";

        try {
            const response = await fetch(`${API_BASE_URL}/branches/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    alert('Sucursal no encontrada.');
                    window.location.href = '../templates/my_posts.html'; // Redirigir si no se encuentra
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const branch = await response.json();

            branchNameInput.value = branch.nombre || '';
            branchAddressInput.value = branch.direccion || '';
            branchPhoneInput.value = branch.telefono || '';
            branchScheduleInput.value = branch.horario || '';

            // Cargar materiales seleccionados
            if (branch.materialesAceptados && Array.isArray(branch.materialesAceptados)) {
                branch.materialesAceptados.forEach(material => {
                    selectedMaterials.add(material);
                    const button = document.querySelector(`.category-btn[data-material="${material}"]`);
                    if (button) {
                        button.classList.remove('btn-outline-primary');
                        button.classList.add('btn-primary');
                    }
                });
            }
            renderSelectedMaterials();

            // Cargar ubicación en el mapa
            if (branch.latitud && branch.longitud) {
                placeMarker(branch.latitud, branch.longitud);
            }

        } catch (error) {
            console.error('Error al cargar la sucursal para edición:', error);
            alert('Error al cargar los datos de la sucursal para edición.');
        }
    }

    // --- Envío del formulario ---
    branchForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Resetear mensajes de error
        branchNameInput.classList.remove('is-invalid');
        branchAddressInput.classList.remove('is-invalid');
        branchPhoneInput.classList.remove('is-invalid');
        branchScheduleInput.classList.remove('is-invalid');
        materialTypeError.style.display = 'none';
        locationError.style.display = 'none';

        let isValid = true;

        // Validaciones básicas del formulario
        if (branchNameInput.value.trim() === '') { branchNameInput.classList.add('is-invalid'); isValid = false; }
        if (branchAddressInput.value.trim() === '') { branchAddressInput.classList.add('is-invalid'); isValid = false; }
        if (branchPhoneInput.value.trim() === '') { branchPhoneInput.classList.add('is-invalid'); isValid = false; }
        if (branchScheduleInput.value.trim() === '') { branchScheduleInput.classList.add('is-invalid'); isValid = false; }
        if (selectedMaterials.size === 0) { materialTypeError.style.display = 'block'; isValid = false; }
        if (!latitudeInput.value || !longitudeInput.value) { locationError.style.display = 'block'; isValid = false; }

        if (!isValid) {
            alert('Por favor, completa todos los campos requeridos y selecciona una ubicación en el mapa.');
            return;
        }

        const branchData = {
            userId: CURRENT_USER_ID, // Asociar la sucursal al usuario actual
            nombre: branchNameInput.value.trim(),
            direccion: branchAddressInput.value.trim(),
            telefono: branchPhoneInput.value.trim(),
            horario: branchScheduleInput.value.trim(),
            materialesAceptados: Array.from(selectedMaterials),
            latitud: parseFloat(latitudeInput.value),
            longitud: parseFloat(longitudeInput.value)
        };

        const method = isEditMode ? 'PUT' : 'POST';
        const endpoint = isEditMode ? `${API_BASE_URL}/branches/${branchId}` : `${API_BASE_URL}/branches`;

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}` // Envía un token de autenticación
                },
                body: JSON.stringify(branchData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            alert(`Sucursal ${isEditMode ? 'actualizada' : 'registrada'} con éxito!`);
            console.log('Sucursal guardada:', result);

            window.location.href = '../templates/my_posts.html?tab=branch'; // Redirige a la pestaña de sucursal en My Posts

        } catch (error) {
            console.error(`Error al ${isEditMode ? 'actualizar' : 'registrar'} la sucursal:`, error);
            alert(`Error al ${isEditMode ? 'actualizar' : 'registrar'} la sucursal: ${error.message || 'Hubo un problema.'}`);
        }
    });

    // Limpiar formulario
    clearFormBtn.addEventListener('click', () => {
        branchForm.reset();
        selectedMaterials.clear();
        renderSelectedMaterials();
        if (marker) {
            map.removeLayer(marker);
            marker = null;
        }
        map.setView([initialLat, initialLng], initialZoom);
        locationInfo.textContent = '';
        latitudeInput.value = '';
        longitudeInput.value = '';
        // Resetear validación
        branchNameInput.classList.remove('is-invalid');
        branchAddressInput.classList.remove('is-invalid');
        branchPhoneInput.classList.remove('is-invalid');
        branchScheduleInput.classList.remove('is-invalid');
        materialTypeError.style.display = 'none';
        locationError.style.display = 'none';
        formTitle.textContent = "Registrar Nueva Sucursal de Reciclaje";
        submitBranchBtn.textContent = "Registrar Sucursal";
    });

    // --- Lógica de inicio ---
    renderSelectedMaterials(); // Renderiza los materiales inicialmente (vacío o cargado para edición)
    if (isEditMode) {
        loadBranchForEdit(branchId);
    }
});