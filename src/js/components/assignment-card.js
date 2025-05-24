class AssignmentCard extends HTMLElement {
    static get observedAttributes() {
        return ['assignment'];
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
        const assignmentData = JSON.parse(this.getAttribute('assignment') || '{}');
        const {
            id,
            title,
            subtitle,
            description,
            dueDate,
            points,
            type,
            requiredModules,
            attachments,
            status,
            courseProgress,
            submitted
        } = assignmentData;
        
        // Determine status color and emoji
        let statusClass = '';
        let statusEmoji = '';
        
        switch (status) {
            case 'pending':
                statusClass = 'status-pending';
                statusEmoji = '⏳';
                break;
            case 'completed':
                statusClass = 'status-completed';
                statusEmoji = '✅';
                break;
            case 'overdue':
                statusClass = 'status-overdue';
                statusEmoji = '⚠️';
                break;
            case 'locked':
                statusClass = 'status-locked';
                statusEmoji = '🔒';
                break;
        }
        
        // Determine action button
        let actionButton = '';
        if (status === 'locked') {
            actionButton = `
                <button class="btn btn-secondary locked-btn">
                    <span>🔒</span>
                    Complete Course to Submit
                </button>
            `;
        } else if (status === 'completed' && submitted) {
            actionButton = `
                <div class="status-indicator status-completed">
                    <span>✅</span>
                    Submitted
                </div>
            `;
        } else {
            actionButton = `
                <button class="btn btn-primary submit-btn" data-id="${id}">
                    <span>📤</span>
                    Submit Assignment
                </button>
            `;
        }
        
        this.innerHTML = `
            <div class="assignment-card ${status}">
                <div class="card-left-border"></div>
                <div class="card-content">
                    <div class="card-header">
                        <div class="status-indicator ${statusClass}">
                            <span class="status-emoji">${statusEmoji}</span>
                            ${status.charAt(0).toUpperCase() + status.slice(1)}
                        </div>
                        
                        <h3 class="assignment-title">${title}</h3>
                        <div class="assignment-subtitle">${subtitle}</div>
                        
                        ${dueDate ? `
                            <div class="due-date">
                                <span>📅</span>
                                Due: ${dueDate}
                            </div>
                        ` : ''}
                        
                        ${courseProgress ? `
                            <div class="course-progress">
                                <span>🔒</span>
                                Complete the course to unlock (${courseProgress} completed)
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="card-body">
                        <p class="assignment-description">${description}</p>
                        
                        <div class="assignment-tags">
                            <div class="tag tag-points">
                                <span>⭐</span>
                                Points: ${points}
                            </div>
                            
                            <div class="tag tag-type">
                                <span>📄</span>
                                Type: ${type}
                            </div>
                            
                            <div class="tag tag-modules">
                                <span>🧩</span>
                                Required Modules: ${requiredModules.join(', ')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-footer">
                        <div class="attachment-count">
                            <span>📎</span>
                            ${attachments} attachment(s)
                        </div>
                        
                        ${actionButton}
                    </div>
                </div>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .assignment-card {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                margin-bottom: 20px;
                display: flex;
                overflow: hidden;
                position: relative;
            }
            
            .card-left-border {
                width: 6px;
                background-color: #ccc;
            }
            
            .assignment-card.pending .card-left-border {
                background-color: #ffa000;
            }
            
            .assignment-card.completed .card-left-border {
                background-color: #43a047;
            }
            
            .assignment-card.overdue .card-left-border {
                background-color: #e53935;
            }
            
            .assignment-card.locked .card-left-border {
                background-color: #757575;
            }
            
            .card-content {
                flex: 1;
                padding: 20px;
            }
            
            .card-header {
                margin-bottom: 15px;
            }
            
            .assignment-title {
                font-size: 18px;
                font-weight: 600;
                color: #333;
                margin: 10px 0 5px 0;
            }
            
            .assignment-subtitle {
                color: #2196f3;
                font-size: 14px;
                margin-bottom: 10px;
            }
            
            .assignment-description {
                color: #666;
                margin-bottom: 15px;
                line-height: 1.5;
            }
            
            .assignment-tags {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 15px;
            }
            
            .card-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 15px;
            }
            
            .submit-btn {
                background-color: #2196f3;
            }
            
            .locked-btn {
                cursor: not-allowed;
                opacity: 0.8;
            }
            
            .status-emoji {
                font-size: 14px;
            }
        `;
        this.appendChild(style);
        
        // Add event listeners
        const submitBtn = this.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const assignmentId = submitBtn.dataset.id;
                this.openSubmitModal(assignmentData);
            });
        }
    }
    
    openSubmitModal(assignment) {
        // Crear y mostrar el modal
        const modal = document.createElement('submit-modal');
        modal.setAssignment(assignment);
        document.body.appendChild(modal);
        
        // Escuchar evento de confirmación
        modal.addEventListener('confirm-submit', (event) => {
            const { id, notes } = event.detail;
            this.submitAssignment(id, notes);
        });
    }
    
    submitAssignment(id, notes) {
        // Dispatch custom event
        const event = new CustomEvent('submit-assignment', {
            detail: { id, notes },
            bubbles: true
        });
        this.dispatchEvent(event);
    }
}

customElements.define('assignment-card', AssignmentCard);