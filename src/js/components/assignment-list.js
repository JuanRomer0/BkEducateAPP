console.log('Loading assignment-list.js');

class AssignmentList extends HTMLElement {
    constructor() {
        super();
        this.assignments = [];
        this.currentFilter = 'all';
        this.apiUrl = 'http://localhost:3000/assignments';
        this.useLocalStorage = true;
    }
    
    connectedCallback() {
        console.log('AssignmentList connected');
        this.addEventListener('filter-changed', this.handleFilterChange.bind(this));
        this.loadAssignments();
    }
    
    // Datos por defecto
    getDefaultAssignments() {
        return [
            {
                id: 1,
                title: "Final Project: E-commerce Platform",
                subtitle: "Full Stack Development",
                description: "Build a complete e-commerce platform using React, Node.js, and MongoDB. Implement user authentication, product management, shopping cart, and payment processing.",
                dueDate: "Mar 14, 2024",
                points: 100,
                type: "Project",
                status: "pending",
                subject: "Web Development",
                attachments: 2,
                requiredModules: "Frontend Development, Backend Integration, Database Design"
            },
            {
                id: 2,
                title: "Data Analysis Report",
                subtitle: "Data Science Fundamentals",
                description: "Analyze the provided dataset using Python and Pandas.",
                dueDate: "Mar 19, 2024",
                points: 50,
                type: "Report",
                status: "locked",
                subject: "Data Science",
                attachments: 1,
                requiredModules: "Data Analysis, Statistical Methods",
                courseProgress: 60
            },
            {
                id: 3,
                title: "UI/UX Case Study",
                subtitle: "User Interface Design",
                description: "Complete a case study on the redesign of a popular mobile application.",
                dueDate: "Feb 27, 2024",
                points: 75,
                type: "Case Study",
                status: "completed",
                subject: "Design",
                attachments: 3,
                requiredModules: "User Research, Interface Design"
            },
            {
                id: 4,
                title: "Algorithm Implementation",
                subtitle: "Advanced Algorithms",
                description: "Implement and optimize three different sorting algorithms.",
                dueDate: "Feb 24, 2024",
                points: 60,
                type: "Implementation",
                status: "locked",
                subject: "Computer Science",
                attachments: 0,
                requiredModules: "Algorithm Analysis, Data Structures",
                courseProgress: 40
            }
        ];
    }
    
    // Cargar desde localStorage
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('assignments');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Error loading from localStorage:', error);
        }
        return null;
    }
    
    // Guardar en localStorage
    saveToLocalStorage() {
        try {
            localStorage.setItem('assignments', JSON.stringify(this.assignments));
            console.log('Assignments saved to localStorage');
        } catch (error) {
            console.warn('Error saving to localStorage:', error);
        }
    }
    
    async loadAssignments() {
        console.log('Loading assignments...');
        
        // 1. Intentar cargar desde localStorage primero
        const localData = this.loadFromLocalStorage();
        if (localData) {
            this.assignments = localData;
            console.log('Assignments loaded from localStorage:', this.assignments.length);
            this.render();
        }
        
        // 2. Intentar cargar desde JSON server (opcional)
        try {
            console.log('Attempting to load from JSON server...');
            const response = await fetch(this.apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const serverData = await response.json();
                this.assignments = serverData;
                console.log('Assignments loaded from JSON server:', this.assignments.length);
                
                // Guardar en localStorage como backup
                this.saveToLocalStorage();
                this.render();
                return;
            }
        } catch (error) {
            console.log('JSON server not available:', error.message);
        }
        
        // 3. Si no hay datos locales ni servidor, usar datos por defecto
        if (!localData) {
            console.log('Using default assignments data');
            this.assignments = this.getDefaultAssignments();
            this.saveToLocalStorage();
            this.render();
        }
    }
    
    async updateAssignmentStatus(assignmentId, newStatus) {
        console.log(`Updating assignment ${assignmentId} to status: ${newStatus}`);
        
        // Actualizar localmente SIEMPRE
        const assignmentIndex = this.assignments.findIndex(a => a.id === assignmentId);
        if (assignmentIndex !== -1) {
            this.assignments[assignmentIndex].status = newStatus;
            console.log('Assignment updated locally');
        }
        
        // Guardar en localStorage
        this.saveToLocalStorage();
        
        // Intentar actualizar en servidor (opcional)
        try {
            const response = await fetch(`${this.apiUrl}/${assignmentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus })
            });
            
            if (response.ok) {
                console.log('Assignment updated on server');
                return true;
            }
        } catch (error) {
            console.log('Server update failed, but local update successful:', error.message);
        }
        
        return false;
    }
    
    async saveSubmission(assignmentId, submissionData) {
        console.log('Saving submission for assignment:', assignmentId);
        
        // Guardar en localStorage
        try {
            const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
            submissions.push({
                id: Date.now(),
                assignmentId: assignmentId,
                ...submissionData,
                submittedAt: new Date().toISOString()
            });
            localStorage.setItem('submissions', JSON.stringify(submissions));
            console.log('Submission saved to localStorage');
        } catch (error) {
            console.warn('Error saving submission to localStorage:', error);
        }
        
        // Intentar guardar en servidor (opcional)
        try {
            const response = await fetch('http://localhost:3000/submissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    assignmentId: assignmentId,
                    ...submissionData,
                    submittedAt: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                console.log('Submission saved to server');
                return true;
            }
        } catch (error) {
            console.log('Server submission failed, but local save successful:', error.message);
        }
        
        return false;
    }
    
    handleFilterChange(event) {
        this.currentFilter = event.detail.filter;
        console.log('AssignmentList: Filter changed to', this.currentFilter);
        this.render();
    }
    
        // 🔧 ACTUALIZADO: Pending incluye locked y overdue, Overdue incluye pending y locked
    getFilteredAssignments() {
        if (this.currentFilter === 'all') {
            return this.assignments;
        }
        
        // Si el filtro es "pending", incluir también locked y overdue
        if (this.currentFilter === 'pending') {
            return this.assignments.filter(assignment => 
                assignment.status === 'pending' || 
                assignment.status === 'locked' || 
                assignment.status === 'overdue'
            );
        }
        
        // Si el filtro es "overdue", incluir también pending y locked
        if (this.currentFilter === 'overdue') {
            return this.assignments.filter(assignment => 
                assignment.status === 'overdue' || 
                assignment.status === 'pending' || 
                assignment.status === 'locked'
            );
        }
    
    // Para otros filtros (completed, locked), comportamiento normal
        return this.assignments.filter(assignment => assignment.status === this.currentFilter);
    }
    
    getStatusConfig(status) {
        const configs = {
            pending: { emoji: '⏳', text: 'Pending', color: '#ffa000', bg: '#fff8e1', borderColor: 'red' },
            completed: { emoji: '✅', text: 'Completed', color: '#4caf50', bg: '#e8f5e8', borderColor: '#4caf50' },
            overdue: { emoji: '⚠️', text: 'Overdue', color: '#f44336', bg: '#ffebee', borderColor: '#F27166' },
            locked: { emoji: '🔒', text: 'Locked', color: '#ff9800', bg: '#fff3e0', borderColor: '#F27166' }
        };
        return configs[status] || configs.pending;
    }
    
    getSubjectIcon(subject) {
        const icons = {
            'Web Development': '💻',
            'Mobile Development': '📱',
            'Design': '🎨',
            'Data Science': '📊',
            'Computer Science': '⚡'
        };
        return icons[subject] || '📚';
    }
    
    openSubmitModal(assignment) {
        const modal = document.createElement('submit-modal');
        modal.setAssignment(assignment);
        document.body.appendChild(modal);
        
        modal.addEventListener('confirm-submit', async (event) => {
            const submissionData = event.detail;
            
            console.log('Processing submission for:', assignment.title);
            
            // Guardar submission
            const submissionSaved = await this.saveSubmission(assignment.id, submissionData);
            
            // Actualizar estado del assignment
            const statusUpdated = await this.updateAssignmentStatus(assignment.id, 'completed');
            
            // Mostrar mensaje de éxito
            this.showSuccessMessage(assignment.title, submissionSaved);
            
            // Cerrar modal y re-renderizar
            modal.remove();
            this.render();
        });
    }
    
    showSuccessMessage(title, savedToServer = false) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-weight: 500;
        `;
        
        message.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 18px;">✅</span>
                <div>
                    <div style="font-weight: 600;">Assignment Submitted!</div>
                    <div style="font-size: 14px; opacity: 0.9;">${title}</div>
                    <div style="font-size: 12px; opacity: 0.8;">
                        ${savedToServer ? 'Saved to server & locally' : 'Saved locally (server offline)'}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 4000);
    }
    
    render() {
        const filteredAssignments = this.getFilteredAssignments();
        console.log('Rendering assignments:', filteredAssignments.length, 'for filter:', this.currentFilter);
        
        if (filteredAssignments.length === 0) {
            this.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📭</div>
                    <h3 style="margin: 0 0 8px 0; color: #495057;">No assignments found</h3>
                    <p style="margin: 0;">No assignments match the current filter.</p>
                </div>
            `;
            return;
        }
        
        const groupedAssignments = {};
        filteredAssignments.forEach(assignment => {
            if (!groupedAssignments[assignment.subject]) {
                groupedAssignments[assignment.subject] = [];
            }
            groupedAssignments[assignment.subject].push(assignment);
        });
        
        let html = '';
        
        Object.keys(groupedAssignments).forEach(subject => {
            const assignments = groupedAssignments[subject];
            const icon = this.getSubjectIcon(subject);
            
            html += `
                <div style="margin: 40px 0 20px 0; display: flex; align-items: center; gap: 12px; border-bottom: 2px solid #e9ecef; padding-bottom: 12px;">
                    <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                        ${icon}
                    </div>
                    <h2 style="font-size: 24px; font-weight: 600; color: #495057; margin: 0; border-bottom: 2px solid #007bff; padding-bottom: 4px;">${subject}</h2>
                </div>
            `;
            
            assignments.forEach(assignment => {
                const statusConfig = this.getStatusConfig(assignment.status);
                
                html += `
                    <div style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 24px; overflow: hidden; border-left: 4px solid ${statusConfig.borderColor};">
                        <div style="padding: 24px;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                                <div style="background: ${statusConfig.bg}; color: ${statusConfig.color}; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                                    ${statusConfig.emoji} ${statusConfig.text}
                                </div>
                            </div>
                            
                            <h3 style="font-size: 20px; font-weight: 600; color: #212529; margin: 0 0 8px 0; line-height: 1.3;">${assignment.title}</h3>
                            <div style="color: #007bff; font-size: 15px; font-weight: 500; margin-bottom: 12px;">${assignment.subtitle}</div>
                            
                            ${assignment.status === 'locked' ? 
                                `<div style="background: #fff3cd; color: #856404; padding: 8px 12px; border-radius: 6px; font-size: 14px; margin-bottom: 12px; border-left: 3px solid #ffc107;">
                                    🔒 Complete the course to unlock (${parseInt(assignment.courseProgress) || 0}% completed)
                                </div>` : ''
                            }
                            
                            <div style="color: #6c757d; font-size: 14px; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                                📅 <span style="font-weight: 500;">Due: ${assignment.dueDate}</span>
                            </div>
                            
                            <p style="color: #6c757d; margin-bottom: 16px; line-height: 1.6; font-size: 15px;">${assignment.description}</p>
                            
                            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
                                <span style="background: #f8f9fa; color: #e83e8c; font-size: 12px; padding: 4px 10px; border-radius: 12px; font-weight: 500; display: flex; align-items: center; gap: 4px;">
                                    🎯 Points: ${assignment.points}
                                </span>
                                <span style="background: #f8f9fa; color: #fd7e14; font-size: 12px; padding: 4px 10px; border-radius: 12px; font-weight: 500; display: flex; align-items: center; gap: 4px;">
                                    📄 Type: ${assignment.type}
                                </span>
                                <span style="background: #f8f9fa; color: #20c997; font-size: 12px; padding: 4px 10px; border-radius: 12px; font-weight: 500; display: flex; align-items: center; gap: 4px;">
                                    📚 Required Modules: ${assignment.requiredModules || 'N/A'}
                                </span>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
                                <div style="color: #6c757d; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                                    📎 ${assignment.attachments || 0} attachment(s)
                                </div>
                                
                                ${this.getActionButton(assignment)}
                            </div>
                        </div>
                    </div>
                `;
            });
        });
        
        this.innerHTML = html;
        
        this.querySelectorAll('.submit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const assignmentId = parseInt(btn.dataset.id);
                const assignment = this.assignments.find(a => a.id === assignmentId);
                if (assignment) {
                    this.openSubmitModal(assignment);
                }
            });
        });
    }
    
    getActionButton(assignment) {
        switch(assignment.status) {
            case 'pending':
            case 'overdue':
                return `<button class="submit-btn" data-id="${assignment.id}" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer; font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 8px; transition: all 0.2s;">
                    📤 Submit Assignment
                </button>`;
            
            case 'completed':
                return `<div style="background: #d4edda; color: #155724; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                    ✅ Submitted
                </div>`;
            
            case 'locked':
                return `<button style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 25px; cursor: not-allowed; font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 8px;" disabled>
                    🔒 Complete Course to Submit
                </button>`;
            
            default:
                return '';
        }
    }
}

customElements.define('assignment-list', AssignmentList);
console.log('AssignmentList defined');