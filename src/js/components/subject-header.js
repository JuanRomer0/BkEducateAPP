class SubjectHeader extends HTMLElement {
    static get observedAttributes() {
        return ['subject', 'emoji'];
    }
    
    constructor() {
        super();
    }
    
    connectedCallback() {
        this.render();
    }
    
    attributeChangedCallback() {
        if (this.isConnected) {
            this.render();
        }
    }
    
    render() {
        const subject = this.getAttribute('subject') || '';
        const emoji = this.getAttribute('emoji') || '📚';
        
        this.innerHTML = `
            <div class="subject-header">
                <div class="subject-icon">
                    <span class="subject-emoji">${emoji}</span>
                </div>
                <h2>${subject}</h2>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .subject-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin: 30px 0 15px 0;
                border-bottom: 2px solid #e0e0e0;
                padding-bottom: 10px;
            }
            
            .subject-icon {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background-color: #f5f5f5;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
            }
            
            .subject-emoji {
                font-size: 20px;
            }
            
            h2 {
                font-size: 20px;
                font-weight: 600;
                color: #333;
                margin: 0;
            }
        `;
        this.appendChild(style);
    }
}

customElements.define('subject-header', SubjectHeader);
