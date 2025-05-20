// Definición del Web Component para tarjetas de curso
class CourseCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Obtener el template y clonarlo
        const template = document.getElementById('course-card-template');
        const clone = template.content.cloneNode(true);
        
        // Estilos específicos del componente
        const style = document.createElement('style');
        style.textContent = `
            /* Estilos para la tarjeta */
            .course-card {
                background-color: #fff;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                flex: 1;
                min-width: 280px;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .course-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }
            
            .course-card h2 {
                font-size: 1.5rem;
                margin-bottom: 15px;
                color: #333;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            .progress-bar {
                height: 8px;
                background-color: #ecf0f1;
                border-radius: 4px;
                margin-bottom: 8px;
                overflow: hidden;
            }
            
            .progress-value {
                height: 100%;
                background-color: #3498db;
                border-radius: 4px;
            }
            
            .completion-text {
                font-size: 0.85rem;
                color: #7f8c8d;
                margin-bottom: 15px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            .view-topics {
                color: #3498db;
                text-decoration: none;
                font-size: 0.85rem;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
        `;
        
        // Agregar los estilos al shadow DOM
        this.shadowRoot.appendChild(style);
        
        // Agregar el contenido clonado al shadow DOM
        this.shadowRoot.appendChild(clone);
        
        // Agregar event listener para el clic
        this.shadowRoot.querySelector('.course-card').addEventListener('click', () => {
            this.showModal();
        });
    }
    
    connectedCallback() {
        // Obtener los atributos
        const title = this.getAttribute('title') || 'Course Title';
        const progress = this.getAttribute('progress') || '0';
        
        // Actualizar el contenido
        this.shadowRoot.querySelector('h2').textContent = title;
        this.shadowRoot.querySelector('.progress-value').style.width = `${progress}%`;
        this.shadowRoot.querySelector('.completion-text').textContent = `${progress}% Complete`;
    }
    
    showModal() {
        // Disparar un evento personalizado para mostrar el modal
        const event = new CustomEvent('show-modal', {
            bubbles: true,
            composed: true,
            detail: {
                title: this.getAttribute('title'),
                progress: this.getAttribute('progress'),
                icon: this.getAttribute('icon'),
                topics: JSON.parse(this.getAttribute('topics') || '[]')
            }
        });
        
        this.dispatchEvent(event);
    }
    
    static get observedAttributes() {
        return ['title', 'progress', 'topics', 'icon'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'title') {
                this.shadowRoot.querySelector('h2').textContent = newValue;
            } else if (name === 'progress') {
                this.shadowRoot.querySelector('.progress-value').style.width = `${newValue}%`;
                this.shadowRoot.querySelector('.completion-text').textContent = `${newValue}% Complete`;
            }
        }
    }
}

// Definición del Web Component para el modal
class CourseModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Obtener el template y clonarlo
        const template = document.getElementById('course-modal-template');
        const clone = template.content.cloneNode(true);
        
        // Estilos específicos del componente
        const style = document.createElement('style');
        style.textContent = `
            /* Estilos para el modal */
            .modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                justify-content: center;
                align-items: center;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            .modal.show {
                display: flex;
            }
            
            .modal-content {
                background-color: white;
                width: 90%;
                max-width: 550px;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
            }
            
            .modal-header {
                padding: 20px;
                background-color: #2c3e50;
                color: white;
                position: relative;
            }
            
            .course-icon {
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                width: 70px;
                height: 70px;
            }
            
            .modal-header h2 {
                font-size: 1.5rem;
                margin-bottom: 5px;
            }
            
            .modal-progress {
                height: 6px;
                background-color: rgba(255, 255, 255, 0.2);
                margin-top: 15px;
                border-radius: 3px;
                overflow: hidden;
            }
            
            .modal-progress-value {
                height: 100%;
                background-color: #3498db;
                border-radius: 3px;
            }
            
            .modal-completion {
                font-size: 0.8rem;
                position: absolute;
                right: 20px;
                bottom: 15px;
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .topic {
                margin-bottom: 25px;
            }
            
            .topic h3 {
                font-size: 1.2rem;
                margin-bottom: 5px;
                color: #333;
            }
            
            .topic p {
                font-size: 0.9rem;
                color: #7f8c8d;
                margin-bottom: 10px;
            }
            
            .topic-progress {
                height: 8px;
                background-color: #ecf0f1;
                border-radius: 4px;
                margin-bottom: 8px;
                overflow: hidden;
            }
            
            .topic-progress-value {
                height: 100%;
                background-color: #3498db;
                border-radius: 4px;
            }
            
            .topic-completion {
                font-size: 0.8rem;
                color: #7f8c8d;
                text-align: right;
            }
            
            .close-btn {
                position: absolute;
                right: 15px;
                top: 15px;
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
            }
        `;
        
        // Agregar los estilos al shadow DOM
        this.shadowRoot.appendChild(style);
        
        // Agregar el contenido clonado al shadow DOM
        this.shadowRoot.appendChild(clone);
        
        // Agregar event listener para el botón de cerrar
        this.shadowRoot.querySelector('.close-btn').addEventListener('click', () => {
            this.hide();
        });
        
        // Agregar event listener para cerrar al hacer clic fuera del modal
        this.shadowRoot.querySelector('.modal').addEventListener('click', (e) => {
            if (e.target === this.shadowRoot.querySelector('.modal')) {
                this.hide();
            }
        });
    }
    
    connectedCallback() {
        // Agregar listener para el evento personalizado
        document.addEventListener('show-modal', (e) => {
            this.show(e.detail);
        });
    }
    
    show(data) {
        // Actualizar los datos del modal
        const modal = this.shadowRoot.querySelector('.modal');
        const title = this.shadowRoot.querySelector('.modal-header h2');
        const icon = this.shadowRoot.querySelector('.course-icon');
        const progressValue = this.shadowRoot.querySelector('.modal-progress-value');
        const completion = this.shadowRoot.querySelector('.modal-completion');
        const modalBody = this.shadowRoot.querySelector('.modal-body');
        
        // Establecer los valores
        title.textContent = data.title || 'Course Title';
        icon.src = data.icon || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K';
        progressValue.style.width = `${data.progress}%`;
        completion.textContent = `${data.progress}% Complete`;
        
        // Limpiar el contenido anterior
        modalBody.innerHTML = '';
        
        // Agregar los temas
        if (data.topics && data.topics.length > 0) {
            data.topics.forEach(topic => {
                const topicElement = document.createElement('div');
                topicElement.className = 'topic';
                
                const topicTitle = document.createElement('h3');
                topicTitle.textContent = topic.title;
                
                const topicDescription = document.createElement('p');
                topicDescription.textContent = topic.description;
                
                const topicProgress = document.createElement('div');
                topicProgress.className = 'topic-progress';
                
                const topicProgressValue = document.createElement('div');
                topicProgressValue.className = 'topic-progress-value';
                topicProgressValue.style.width = `${topic.progress}%`;
                
                const topicCompletion = document.createElement('div');
                topicCompletion.className = 'topic-completion';
                topicCompletion.textContent = `${topic.progress}% Complete`;
                
                topicProgress.appendChild(topicProgressValue);
                
                topicElement.appendChild(topicTitle);
                topicElement.appendChild(topicDescription);
                topicElement.appendChild(topicProgress);
                topicElement.appendChild(topicCompletion);
                
                modalBody.appendChild(topicElement);
            });
        }
        
        // Mostrar el modal
        modal.classList.add('show');
    }
    
    hide() {
        const modal = this.shadowRoot.querySelector('.modal');
        modal.classList.remove('show');
    }
}

// Registrar los componentes
customElements.define('course-card', CourseCard);
customElements.define('course-modal', CourseModal);

// Datos de ejemplo para los cursos
const coursesData = [
    {
        title: 'Web Development',
        progress: 80,
        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K',
        topics: [
            {
                title: 'HTML Fundamentals',
                description: 'Basic structure, elements, and semantic markup',
                progress: 100
            },
            {
                title: 'CSS Styling',
                description: 'Selectors, properties, layouts, and responsive design',
                progress: 85
            },
            {
                title: 'JavaScript Basics',
                description: 'Variables, functions, DOM manipulation',
                progress: 75
            },
            {
                title: 'Frontend Frameworks',
                description: 'Introduction to modern frameworks and libraries',
                progress: 60
            }
        ]
    },
    {
        title: 'Data Science',
        progress: 60,
        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICAgIDxwYXRoIGZpbGw9IiMzNDk4ZGIiIGQ9Ik0yMCwyMCBMODAsMjAgTDgwLDgwIEwyMCw4MCBMMjAsMjBaIiAvPgogICAgPGNpcmNsZSBjeD0iMzAiIGN5PSI0MCIgcj0iNSIgZmlsbD0id2hpdGUiIC8+CiAgICA8Y2lyY2xlIGN4PSI2MCIgY3k9IjMwIiByPSI3IiBmaWxsPSJ3aGl0ZSIgLz4KICAgIDxjaXJjbGUgY3g9IjcwIiBjeT0iNzAiIHI9IjEwIiBmaWxsPSJ3aGl0ZSIgLz4KICAgIDxjaXJjbGUgY3g9IjQwIiBjeT0iNjAiIHI9IjgiIGZpbGw9IndoaXRlIiAvPgogICAgPGxpbmUgeDE9IjMwIiB5MT0iNDAiIHgyPSI2MCIgeTI9IjMwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIC8+CiAgICA8bGluZSB4MT0iNjAiIHkxPSIzMCIgeDI9IjcwIiB5Mj0iNzAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgLz4KICAgIDxsaW5lIHgxPSI3MCIgeTE9IjcwIiB4Mj0iNDAiIHkyPSI2MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiAvPgogICAgPGxpbmUgeDE9IjQwIiB5MT0iNjAiIHgyPSIzMCIgeTI9IjQwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIC8+Cjwvc3ZnPg==',
        topics: [
            {
                title: 'Python for Data Science',
                description: 'Libraries like NumPy, Pandas, Matplotlib',
                progress: 90
            },
            {
                title: 'Statistics Fundamentals',
                description: 'Descriptive statistics, probability, distributions',
                progress: 75
            },
            {
                title: 'Machine Learning Basics',
                description: 'Supervised and unsupervised learning algorithms',
                progress: 50
            },
            {
                title: 'Data Visualization',
                description: 'Creating effective visualizations with Python tools',
                progress: 65
            }
        ]
    },
    {
        title: 'Mobile Development',
        progress: 45,
        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICAgIDxyZWN0IHg9IjI1IiB5PSIxMCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjgwIiByeD0iNSIgcnk9IjUiIGZpbGw9IiMzNDk4ZGIiIC8+CiAgICA8cmVjdCB4PSIzMCIgeT0iMTUiIHdpZHRoPSI0MCIgaGVpZ2h0PSI2MCIgZmlsbD0id2hpdGUiIC8+CiAgICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjgwIiByPSI1IiBmaWxsPSJ3aGl0ZSIgLz4KPC9zdmc+',
        topics: [
            {
                title: 'Mobile UI Design',
                description: 'User interface design principles for mobile apps',
                progress: 65
            },
            {
                title: 'React Native',
                description: 'Cross-platform development with React Native',
                progress: 40
            },
            {
                title: 'Native App Development',
                description: 'iOS development with Swift, Android with Kotlin',
                progress: 30
            }
        ]
    },
    {
        title: 'Cloud Computing',
        progress: 30,
        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICAgIDxwYXRoIGZpbGw9IiMzNDk4ZGIiIGQ9Ik0yNSw2NSBDMTUuNiw2NSA4LDU3LjQgOCw0OCBDOCwzOC42IDE1LjYsMzEgMjUsMzEgQzI1LDMxIDI1LDMxIDI1LDMxIEMyOC4zLDIwLjEgMzguNCwxMiA1MCwxMiBDNjQuNCwxMiA3NiwyMy42IDc2LDM4IEM3NiwzOCA3NiwzOCA3NiwzOCBDODQuOCwzOCA5Miw0NS4yIDkyLDU0IEM5Miw2Mi44IDg0LjgsNzAgNzYsNzAgTDI1LDcwIEwyNSw2NVoiIC8+Cjwvc3ZnPg==',
        topics: [
            {
                title: 'Cloud Fundamentals',
                description: 'Introduction to cloud computing concepts',
                progress: 65
            },
            {
                title: 'AWS Services',
                description: 'Amazon Web Services core services',
                progress: 30
            },
            {
                title: 'Azure and GCP',
                description: 'Microsoft Azure and Google Cloud Platform',
                progress: 15
            }
        ]
    }
];

// Función para inicializar las tarjetas de cursos
function initCourseCards() {
    const courseCardsContainer = document.querySelector('.course-cards');
    
    // Limpiar contenedor
    courseCardsContainer.innerHTML = '';
    
    // Crear tarjetas de cursos
    coursesData.forEach(course => {
        const courseCard = document.createElement('course-card');
        courseCard.setAttribute('title', course.title);
        courseCard.setAttribute('progress', course.progress);
        courseCard.setAttribute('icon', course.icon);
        courseCard.setAttribute('topics', JSON.stringify(course.topics));
        
        courseCardsContainer.appendChild(courseCard);
    });
}

// Inicializar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initCourseCards);