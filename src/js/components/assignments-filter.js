console.log('🔥 Loading assignment-filter.js');

class AssignmentFilter extends HTMLElement {
    constructor() {
        super();
        this.currentFilter = 'all';
        console.log('🔥 AssignmentFilter constructor called');
    }
    
    connectedCallback() {
        console.log('🔥 AssignmentFilter connected to DOM');
        this.render();
        this.attachEventListeners();
    }
    
    attachEventListeners() {
        this.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const filter = e.target.dataset.filter;
                console.log('🔥 Filter clicked:', filter);
                this.setActiveFilter(filter);
            }
        });
    }
    
    setActiveFilter(filter) {
        this.currentFilter = filter;
        
        this.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.dispatchEvent(new CustomEvent('filter-changed', {
            detail: { filter },
            bubbles: true
        }));
        
        console.log('🔥 Filter changed to:', filter);
    }
    
    render() {
        console.log('🔥 Rendering AssignmentFilter');
        
        this.innerHTML = `
            <div class="filter-container">
                <div class="filter-tabs">
                    <button class="filter-btn active" data-filter="all">
                        <span class="filter-icon">📋</span>
                        <span>All</span>
                    </button>
                    <button class="filter-btn" data-filter="pending">
                        <span class="filter-icon">⏳</span>
                        <span>Pending</span>
                    </button>
                    <button class="filter-btn" data-filter="completed">
                        <span class="filter-icon">✅</span>
                        <span>Completed</span>
                    </button>
                    <button class="filter-btn" data-filter="overdue">
                        <span class="filter-icon">⚠️</span>
                        <span>Overdue</span>
                    </button>
                    <button class="filter-btn" data-filter="locked">
                        <span class="filter-icon">🔒</span>
                        <span>Locked</span>
                    </button>
                </div>
            </div>
        `;
        
        // Agregar estilos directamente al elemento
        const style = document.createElement('style');
        style.textContent = `
            assignment-filter {
                display: block !important;
                width: 100% !important;
                margin: 20px 0 !important;
            }
            
            assignment-filter .filter-container {
                background: transparent;
                padding: 0;
                margin: 0;
                width: 100%;
            }
            
            assignment-filter .filter-tabs {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
                justify-content: flex-start;
                align-items: center;
            }
            
            assignment-filter .filter-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 20px;
                border: none;
                background: #f8f9fa;
                border-radius: 25px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                color: #6c757d;
                transition: all 0.2s ease;
                min-height: 44px;
                border: 2px solid transparent;
            }
            
            assignment-filter .filter-btn:hover {
                background: #e9ecef;
                transform: translateY(-1px);
                border-color: #007bff;
            }
            
            assignment-filter .filter-btn.active {
                background: #007bff;
                color: white;
                box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
                border-color: #007bff;
            }
            
            assignment-filter .filter-icon {
                font-size: 16px;
            }
        `;
        
        if (!document.querySelector('#assignment-filter-styles')) {
            style.id = 'assignment-filter-styles';
            document.head.appendChild(style);
        }
        
        console.log('🔥 AssignmentFilter rendered successfully');
    }
}

customElements.define('assignment-filter', AssignmentFilter);
console.log('🔥 AssignmentFilter defined successfully');