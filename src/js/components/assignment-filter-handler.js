console.log('Loading assignment-filter-handler.js');

class AssignmentFilterHandler {
    constructor() {
        this.currentFilter = 'all';
        this.init();
    }
    
    init() {
        console.log('Initializing filter handler...');
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }
    
    setupEventListeners() {
        console.log('Setting up filter event listeners...');
        
        const filterContainer = document.getElementById('assignment-filters');
        if (filterContainer) {
            filterContainer.addEventListener('click', (event) => this.handleFilterClick(event));
            console.log('Filter event listener added successfully');
        } else {
            console.error('Filter container not found!');
        }
    }
    
    handleFilterClick(event) {
        if (event.target.classList.contains('filter-btn') || event.target.closest('.filter-btn')) {
            const button = event.target.closest('.filter-btn');
            const filter = button.dataset.filter;
            
            console.log('Filter clicked:', filter);
            
            // Actualizar botones activos
            this.updateActiveButton(button);
            
            // Actualizar filtro actual
            this.currentFilter = filter;
            
            // Notificar al assignment-list
            this.notifyFilterChange(filter);
            
            console.log('Filter changed to:', filter);
        }
    }
    
    updateActiveButton(activeButton) {
        // Remover clase active de todos los botones
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Agregar clase active al botón clickeado
        activeButton.classList.add('active');
    }
    
    notifyFilterChange(filter) {
        const assignmentList = document.querySelector('assignment-list');
        if (assignmentList) {
            assignmentList.dispatchEvent(new CustomEvent('filter-changed', {
                detail: { filter },
                bubbles: true
            }));
        } else {
            console.warn('assignment-list element not found');
        }
    }
    
    getCurrentFilter() {
        return this.currentFilter;
    }
    
    setFilter(filter) {
        const button = document.querySelector(`[data-filter="${filter}"]`);
        if (button) {
            this.handleFilterClick({ target: button });
        }
    }
}

// Crear instancia global del manejador de filtros
window.assignmentFilterHandler = new AssignmentFilterHandler();

console.log('AssignmentFilterHandler loaded and initialized');