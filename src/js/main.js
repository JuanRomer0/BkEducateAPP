const buttonColor = document.getElementById('botonColor');
const header = document.getElementById('headerColor');

// Verifica si ya se guardó el modo oscuro previamente
const darkMode = localStorage.getItem('darkMode');

if (darkMode === 'enabled') {
    header.classList.add('dark');
    buttonColor.innerHTML = '🌞';
} else {
    buttonColor.innerHTML = '🌙';
}

// Evento del botón
buttonColor.addEventListener('click', () => {
    header.classList.toggle('dark');
    
    if (header.classList.contains('dark')) {
        localStorage.setItem('darkMode', 'enabled'); // Guardar modo oscuro
        buttonColor.innerHTML = '🌞';
    } else {
        localStorage.setItem('darkMode', 'disabled'); // Guardar modo claro
        buttonColor.innerHTML = '🌙';
    }
});


const userMenu = document.querySelector('.user-menu');
const langSelector = document.querySelector('.language-selector');

document.querySelector('.user-info').addEventListener('click', () => {
  userMenu.classList.toggle('active');
  langSelector.classList.remove('active');
});

document.querySelector('.language-selector select').addEventListener('click', (e) => {
  langSelector.classList.toggle('active');
  userMenu.classList.remove('active');
  e.stopPropagation();
});

// Cerrar menús al hacer clic fuera
document.addEventListener('click', (e) => {
  if (!userMenu.contains(e.target)) userMenu.classList.remove('active');
  if (!langSelector.contains(e.target)) langSelector.classList.remove('active');
});
