// Definición del Web Component para el modal
class CourseModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // HTML para el modal
        this.shadowRoot.innerHTML = `
            <style>
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
                    display: flex !important;
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
                    background-color: #1a2433;
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
                    background-color: white;
                    border-radius: 50%;
                    padding: 5px;
                }
                
                .modal-header h2 {
                    font-size: 1.5rem;
                    margin-bottom: 15px;
                    margin-top: 0;
                    font-weight: 500;
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
                    max-height: 400px;
                    overflow-y: auto;
                }
                
                .topic {
                    margin-bottom: 25px;
                }
                
                .topic h3 {
                    font-size: 1.2rem;
                    margin-bottom: 5px;
                    color: #333;
                    font-weight: 500;
                    margin-top: 0;
                }
                
                .topic p {
                    font-size: 0.9rem;
                    color: #7f8c8d;
                    margin-bottom: 10px;
                    margin-top: 0;
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
                    padding: 0;
                }
            </style>
            <div class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Course Title</h2>
                        <button class="close-btn">×</button>
                        <div class="modal-progress">
                            <div class="modal-progress-value"></div>
                        </div>
                        <div class="modal-completion">80% Complete</div>
                        <img class="course-icon" src="" alt="Course Icon">
                    </div>
                    <div class="modal-body">
                        <!-- Los temas del curso serán insertados aquí dinámicamente -->
                    </div>
                </div>
            </div>
        `;
        
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

        // Para depuración - log cuando el componente se inicializa
        console.log('CourseModal component initialized');
    }
    
    connectedCallback() {
        // Agregar listener para el evento personalizado
        document.addEventListener('show-modal', (e) => {
            console.log('show-modal event received', e.detail);
            this.show(e.detail);
        });

        // Para depuración
        console.log('CourseModal connected to DOM');
    }

    disconnectedCallback() {
        // Limpiar event listeners cuando el componente se elimina
        document.removeEventListener('show-modal', this.show);
    }
    
    show(data) {
        console.log('Showing modal with data:', data);
        
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
        
        // Mostrar el modal con un pequeño delay para asegurar que todo esté listo
        setTimeout(() => {
            modal.classList.add('show');
            console.log('Modal should be visible now');
        }, 50);
    }
    
    hide() {
        console.log('Hiding modal');
        const modal = this.shadowRoot.querySelector('.modal');
        modal.classList.remove('show');
    }
}

// Registrar el componente
customElements.define('course-modal', CourseModal);

// Para verificar que se ha cargado correctamente
console.log('CourseModal component defined and ready');

// Verificar si ya existe un componente course-card y agregar la funcionalidad si es necesario
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, checking for course cards');
    
    // Esta función ayudará a asegurar que las tarjetas de curso tengan el evento click
    const ensureCardClickEvents = () => {
        // Buscar todas las course-card que existan en el DOM
        const courseCards = document.querySelectorAll('course-card');
        
        console.log(`Found ${courseCards.length} course cards`);
        
        courseCards.forEach(card => {
            // Verificar si ya tiene un listener (usando un atributo de datos)
            if (!card.hasAttribute('data-click-initialized')) {
                // Agregar manualmente un event listener para asegurar el clic
                card.addEventListener('click', function() {
                    console.log('Card clicked, dispatching show-modal event');
                    
                    // Obtener los atributos necesarios
                    const title = card.getAttribute('title') || 'Course Title';
                    const progress = card.getAttribute('progress') || '0';
                    const icon = card.getAttribute('icon') || '';
                    const topics = JSON.parse(card.getAttribute('topics') || '[]');
                    
                    // Disparar el evento manualmente
                    const event = new CustomEvent('show-modal', {
                        bubbles: true,
                        composed: true,
                        detail: { title, progress, icon, topics }
                    });
                    
                    card.dispatchEvent(event);
                });
                
                // Marcar la tarjeta como inicializada
                card.setAttribute('data-click-initialized', 'true');
                console.log('Click event added to card:', title);
            }
        });
    };
    
    // Ejecutar la función al cargar la página
    ensureCardClickEvents();
    
    // Opcional: configurar un MutationObserver para detectar nuevas tarjetas
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                ensureCardClickEvents();
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
});