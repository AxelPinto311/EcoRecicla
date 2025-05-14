// Selecciona todos los botones dentro del contenedor filtro_container
const buttons = document.querySelectorAll('.row .col-md-12 .filtro_container .btn');

// Agrega un evento de clic a cada botón
buttons.forEach(button => {
    button.addEventListener('click', () => {
        // Alterna la clase "active" en el botón clicado
        button.classList.toggle('active');
    });
});