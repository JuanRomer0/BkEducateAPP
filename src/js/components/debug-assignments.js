console.log('=== DEBUGGING ASSIGNMENTS ===');

// Verificar que los elementos están en el DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    
    // Verificar elementos
    const filter = document.querySelector('assignment-filter');
    const list = document.querySelector('assignment-list');
    
    console.log('assignment-filter element:', filter);
    console.log('assignment-list element:', list);
    
    // Verificar custom elements
    setTimeout(() => {
        console.log('Custom elements defined:');
        console.log('- submit-modal:', customElements.get('submit-modal'));
        console.log('- assignment-filter:', customElements.get('assignment-filter'));
        console.log('- assignment-list:', customElements.get('assignment-list'));
        
        // Test manual del modal
        window.testModal = function() {
            console.log('Testing modal creation...');
            try {
                const modal = document.createElement('submit-modal');
                modal.setAssignment({
                    id: 1,
                    title: "Test Assignment",
                    subtitle: "Test Course",
                    description: "Test description",
                    dueDate: "Test Date",
                    points: 100,
                    type: "Test"
                });
                document.body.appendChild(modal);
                console.log('Modal created successfully!');
            } catch (error) {
                console.error('Error creating modal:', error);
            }
        };
        
        console.log('Run testModal() in console to test modal creation');
    }, 2000);
});