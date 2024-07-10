document.querySelector('.menu-hamburger').addEventListener('click', function() {
    var sidebar = document.querySelector('.sidebar');
    if (sidebar.style.width === '270px') {
        sidebar.style.width = '50px'; // O cualquier otro valor que represente el estado cerrado
    } else {
        sidebar.style.width = '270px';
    }
});


