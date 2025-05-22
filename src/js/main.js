const buttonColor = document.getElementById('botonColor');
const header = document.getElementById('headerColor','mainMenu');

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


// API URL
const API_URL = "http://localhost:3000/courses"

// Función para cargar los datos de los cursos desde la API
async function loadCoursesData() {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error(`Error al cargar los cursos: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error al cargar los datos de cursos:", error)
    // Fallback a datos de ejemplo si no se puede cargar desde la API
    return coursesData
  }
}

// Función para actualizar el progreso de un curso en la API
async function updateCourseProgress(courseId, progress) {
  try {
    const response = await fetch(`${API_URL}/${courseId}/progress`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ progress }),
    })

    if (!response.ok) {
      throw new Error(`Error al actualizar el progreso: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error al actualizar el progreso del curso:", error)
    return null
  }
}

// Función para inicializar las tarjetas de cursos
async function initCourseCards() {
  const courseCardsContainer = document.querySelector(".course-cards")

  // Limpiar contenedor
  courseCardsContainer.innerHTML = ""

  // Cargar datos de cursos desde la API
  const courses = await loadCoursesData()

  // Crear tarjetas de cursos
  courses.forEach((course) => {
    const courseCard = document.createElement("course-card")
    courseCard.setAttribute("title", course.title)
    courseCard.setAttribute("progress", course.progress)
    courseCard.setAttribute("icon", course.icon)
    courseCard.setAttribute("topics", JSON.stringify(course.topics))
    courseCard.setAttribute("data-id", course.id)

    courseCardsContainer.appendChild(courseCard)
  })
}

// Inicializar cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", initCourseCards)