
        document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el mapa
    // Maipú, Mendoza: latitud aproximada -34.6644, longitud -68.7909
    const initialLat = -34.6644;
    const initialLng = -68.7909;
    const initialZoom = 13; // Un buen nivel de zoom para empezar en una ciudad

    const map = L.map('map').setView([initialLat, initialLng], initialZoom);

    // Añadir capa de tiles de OpenStreetMap
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
    }

    // Evento de clic en el mapa
    map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        placeMarker(lat, lng);
        await reverseGeocode(lat, lng);
    });

    // Evento al arrastrar el marcador
    async function onMarkerDragEnd(e) {
        const { lat, lng } = e.target.getLatLng();
        await reverseGeocode(lat, lng);
    }

    // Función para geocodificación inversa (coordenadas a dirección)
    async function reverseGeocode(lat, lng) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Geocodificación inversa exitosa:", data);

            // Rellenar el formulario
            document.getElementById('addressStreet').value = data.address.road || '';
            document.getElementById('addressNumber').value = data.address.house_number || '';
            document.getElementById('addressFloor').value = ''; // Nominatim no siempre da piso/depto directamente
            document.getElementById('addressCity').value = data.address.city || data.address.town || data.address.village || '';
            document.getElementById('addressProvince').value = data.address.state || '';
            document.getElementById('addressPostalCode').value = data.address.postcode || '';
            document.getElementById('addressCountry').value = data.address.country || '';

            // Guardar latitud y longitud en campos ocultos
            document.getElementById('latitude').value = lat;
            document.getElementById('longitude').value = lng;

            // Mostrar información en el div
            document.getElementById('locationInfo').textContent = `Ubicación seleccionada: ${data.display_name}`;

        } catch (error) {
            console.error("Error en geocodificación inversa:", error);
            document.getElementById('locationInfo').textContent = "No se pudo obtener la dirección para esta ubicación.";
            // Limpiar campos de dirección en caso de error
            document.getElementById('addressStreet').value = '';
            document.getElementById('addressNumber').value = '';
            document.getElementById('addressFloor').value = '';
            document.getElementById('addressCity').value = '';
            document.getElementById('addressProvince').value = '';
            document.getElementById('addressPostalCode').value = '';
            document.getElementById('addressCountry').value = '';
        }
    }

    // Función para geocodificación (dirección a coordenadas)
    document.getElementById('geocodeAddressBtn').addEventListener('click', async () => {
        const street = document.getElementById('addressStreet').value;
        const number = document.getElementById('addressNumber').value;
        const city = document.getElementById('addressCity').value;
        const province = document.getElementById('addressProvince').value;
        const country = document.getElementById('addressCountry').value;

        if (!street || !number || !city || !province || !country) {
            alert('Por favor, complete al menos Calle, Número, Ciudad, Provincia y País para buscar en el mapa.');
            return;
        }

        const address = `${number} ${street}, ${city}, ${province}, ${country}`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Geocodificación exitosa:", data);

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                placeMarker(parseFloat(lat), parseFloat(lon));
                document.getElementById('latitude').value = lat;
                document.getElementById('longitude').value = lon;
                document.getElementById('locationInfo').textContent = `Ubicación encontrada: ${data[0].display_name}`;
            } else {
                alert('No se encontraron resultados para la dirección ingresada. Intente ser más específico o ajuste los datos.');
                document.getElementById('locationInfo').textContent = "No se encontró una ubicación para la dirección.";
            }

        } catch (error) {
            console.error("Error en geocodificación:", error);
            alert('Ocurrió un error al buscar la dirección en el mapa. Intente de nuevo.');
            document.getElementById('locationInfo').textContent = "Error al buscar la dirección.";
        }
    });

    // Manejo del envío del formulario
    document.getElementById('branchForm').addEventListener('submit', (e) => {
        e.preventDefault(); // Prevenir el envío por defecto

        // Validar que se haya seleccionado una ubicación en el mapa
        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;
        if (!latitude || !longitude) {
            alert('Por favor, seleccione la ubicación de la sucursal en el mapa o busque una dirección.');
            return;
        }

        // Recopilar todos los datos del formulario
        const formData = {
            branchName: document.getElementById('branchName').value,
            address: {
                street: document.getElementById('addressStreet').value,
                number: document.getElementById('addressNumber').value,
                floor: document.getElementById('addressFloor').value,
                city: document.getElementById('addressCity').value,
                province: document.getElementById('addressProvince').value,
                postalCode: document.getElementById('addressPostalCode').value,
                country: document.getElementById('addressCountry').value,
                latitude: latitude,
                longitude: longitude
            },
            contact: {
                phone: document.getElementById('contactPhone').value,
                email: document.getElementById('contactEmail').value
            },
            materialsAccepted: Array.from(document.querySelectorAll('input[name="materials"]:checked')).map(cb => cb.value),
            openingHours: document.getElementById('openingHours').value,
            additionalComments: document.getElementById('additionalComments').value
        };

        console.log('Datos a enviar:', formData);

        // Aquí es donde enviarías `formData` a tu backend (ej. usando fetch API)
        // Ejemplo (no funcional sin un backend real):
        /*
        fetch('/api/branches', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Sucursal registrada exitosamente!');
            console.log('Respuesta del servidor:', data);
            // Opcional: limpiar formulario o redirigir
            document.getElementById('branchForm').reset();
            map.setView([initialLat, initialLng], initialZoom); // Resetear vista del mapa
            if (marker) {
                map.removeLayer(marker);
                marker = null;
            }
            document.getElementById('locationInfo').textContent = '';
        })
        .catch(error => {
            alert('Hubo un error al registrar la sucursal.');
            console.error('Error al enviar el formulario:', error);
        });
        */

        alert('Formulario listo para enviar. Revisa la consola para ver los datos. Implementa tu backend para el envío real.');
        document.getElementById('branchForm').reset();
        map.setView([initialLat, initialLng], initialZoom);
        if (marker) {
            map.removeLayer(marker);
            marker = null;
        }
        document.getElementById('locationInfo').textContent = '';
        document.getElementById('latitude').value = '';
        document.getElementById('longitude').value = '';
    });

    // Limpiar formulario
    document.getElementById('clearFormBtn').addEventListener('click', () => {
        document.getElementById('branchForm').reset();
        if (marker) {
            map.removeLayer(marker);
            marker = null;
        }
        map.setView([initialLat, initialLng], initialZoom);
        document.getElementById('locationInfo').textContent = '';
        document.getElementById('latitude').value = '';
        document.getElementById('longitude').value = '';
    });

    // Colocar un marcador inicial si quieres que aparezca desde el principio
    // placeMarker(initialLat, initialLng);
});
    