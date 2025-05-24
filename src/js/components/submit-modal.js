console.log('Loading submit-modal.js');

class SubmitModal extends HTMLElement {
    constructor() {
        super();
        this.assignment = null;
    }
    
    setAssignment(assignment) {
        this.assignment = assignment;
        this.render();
    }
    
    render() {
        if (!this.assignment) return;
        
        this.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Submit Assignment</h2>
                        <button class="close-btn">&times;</button>
                    </div>
                    
                    <div class="assignment-info">
                        <div class="course-tag">${this.assignment.subtitle}</div>
                        <div class="due-date">Due: ${this.assignment.dueDate}</div>
                        <h3>${this.assignment.title}</h3>
                        <p>${this.assignment.description}</p>
                        <div class="assignment-meta">
                            <span>Points: ${this.assignment.points}</span>
                            <span>Type: ${this.assignment.type}</span>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <label for="submission-notes">Submission Notes <span class="required">*</span></label>
                        <textarea id="submission-notes" placeholder="Describe your work and any important notes about your submission..." required></textarea>
                    </div>
                    
                    <div class="form-section">
                        <label>Attachments <span class="optional">(optional)</span></label>
                        <div class="file-upload-area">
                            <div class="upload-icon">📎</div>
                            <div class="upload-text">
                                <div>Drag and drop files here or</div>
                                <button type="button" class="browse-btn">Browse Files</button>
                            </div>
                            <input type="file" id="file-input" multiple style="display: none;">
                        </div>
                        <div class="file-info">Supported files: PDF, DOC, DOCX, TXT, ZIP, RAR, 7Z, JPG, PNG</div>
                        <div class="selected-files"></div>
                    </div>
                    
                    <div class="warning-message" id="warning-message">
                        ⚠️ Please fill in all required fields before submitting
                    </div>
                    
                    <div class="modal-actions">
                        <button class="cancel-btn">Cancel</button>
                        <button class="submit-btn" id="submit-btn" disabled>Submit Assignment</button>
                    </div>
                </div>
            </div>
            
            <style>
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    animation: fadeIn 0.2s ease;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .modal-content {
                    background: white;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 600px;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: slideUp 0.3s ease;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                }
                
                @keyframes slideUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 24px;
                    border-bottom: 1px solid #e9ecef;
                }
                
                .modal-header h2 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 600;
                    color: #212529;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #6c757d;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s;
                }
                
                .close-btn:hover {
                    background: #f8f9fa;
                    color: #495057;
                }
                
                .assignment-info {
                    padding: 20px 24px;
                    border-bottom: 1px solid #f8f9fa;
                    background: #f8f9fa;
                }
                
                .course-tag {
                    background: #e3f2fd;
                    color: #1976d2;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 14px;
                    display: inline-block;
                    margin-bottom: 8px;
                    font-weight: 500;
                }
                
                .due-date {
                    color: #dc3545;
                    font-size: 14px;
                    margin-bottom: 12px;
                    font-weight: 500;
                }
                
                .assignment-info h3 {
                    margin: 0 0 8px 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #212529;
                }
                
                .assignment-info p {
                    color: #6c757d;
                    margin: 0 0 12px 0;
                    line-height: 1.5;
                }
                
                .assignment-meta {
                    display: flex;
                    gap: 16px;
                    font-size: 14px;
                }
                
                .assignment-meta span {
                    background: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    color: #495057;
                    font-weight: 500;
                }
                
                .form-section {
                    padding: 20px 24px;
                }
                
                .form-section label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #212529;
                    font-size: 14px;
                }
                
                .required {
                    color: #dc3545;
                }
                
                .optional {
                    color: #6c757d;
                    font-weight: normal;
                }
                
                textarea {
                    width: 100%;
                    min-height: 120px;
                    padding: 12px;
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    font-family: inherit;
                    resize: vertical;
                    box-sizing: border-box;
                    font-size: 14px;
                    transition: border-color 0.2s;
                }
                
                textarea:focus {
                    outline: none;
                    border-color: #007bff;
                }
                
                .file-upload-area {
                    border: 2px dashed #dee2e6;
                    border-radius: 8px;
                    padding: 40px 20px;
                    text-align: center;
                    background: #f8f9fa;
                    margin-bottom: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .file-upload-area:hover {
                    border-color: #007bff;
                    background: #f3f9ff;
                }
                
                .upload-icon {
                    font-size: 32px;
                    margin-bottom: 12px;
                    color: #6c757d;
                }
                
                .upload-text {
                    color: #6c757d;
                    font-size: 14px;
                }
                
                .browse-btn {
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 500;
                    margin-top: 8px;
                    transition: background 0.2s;
                }
                
                .browse-btn:hover {
                    background: #0056b3;
                }
                
                .file-info {
                    font-size: 12px;
                    color: #6c757d;
                    margin-bottom: 12px;
                    text-align: center;
                }
                
                .warning-message {
                    background: #fff3cd;
                    color: #856404;
                    padding: 12px 24px;
                    border-left: 4px solid #ffc107;
                    margin: 0 24px;
                    border-radius: 0 4px 4px 0;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s;
                }
                
                .warning-message.hidden {
                    opacity: 0;
                    height: 0;
                    padding: 0 24px;
                    margin: 0 24px;
                    overflow: hidden;
                }
                
                .modal-actions {
                    padding: 20px 24px;
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    border-top: 1px solid #f8f9fa;
                }
                
                .cancel-btn, .submit-btn {
                    padding: 10px 20px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    font-size: 14px;
                    transition: all 0.2s;
                }
                
                .cancel-btn {
                    background: #f8f9fa;
                    color: #6c757d;
                    border: 1px solid #dee2e6;
                }
                
                .cancel-btn:hover {
                    background: #e9ecef;
                }
                
                .submit-btn {
                    background: #007bff;
                    color: white;
                }
                
                .submit-btn:hover:not(:disabled) {
                    background: #0056b3;
                }
                
                .submit-btn:disabled {
                    background: #dee2e6;
                    color: #6c757d;
                    cursor: not-allowed;
                }
                
                .selected-files {
                    margin-top: 12px;
                }
                
                .file-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    background: #f8f9fa;
                    border-radius: 6px;
                    margin-bottom: 8px;
                    border: 1px solid #e9ecef;
                }
                
                .file-remove {
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            </style>
        `;
        
        this.attachEventListeners();
    }
    
    attachEventListeners() {
        // Cerrar modal
        this.querySelector('.close-btn').addEventListener('click', () => this.remove());
        this.querySelector('.cancel-btn').addEventListener('click', () => this.remove());
        
        // Cerrar al hacer clic fuera
        this.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.remove();
        });
        
        // Validación en tiempo real
        const textarea = this.querySelector('#submission-notes');
        const submitBtn = this.querySelector('#submit-btn');
        const warningMessage = this.querySelector('#warning-message');
        
        textarea.addEventListener('input', () => {
            const hasText = textarea.value.trim().length > 0;
            
            if (hasText) {
                submitBtn.disabled = false;
                warningMessage.classList.add('hidden');
            } else {
                submitBtn.disabled = true;
                warningMessage.classList.remove('hidden');
            }
        });
        
        // Manejo de archivos
        const fileInput = this.querySelector('#file-input');
        const uploadArea = this.querySelector('.file-upload-area');
        const browseBtn = this.querySelector('.browse-btn');
        
        browseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });
        
        uploadArea.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#007bff';
            uploadArea.style.background = '#f3f9ff';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#dee2e6';
            uploadArea.style.background = '#f8f9fa';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#dee2e6';
            uploadArea.style.background = '#f8f9fa';
            this.handleFiles(e.dataTransfer.files);
        });
        
        // Submit
        submitBtn.addEventListener('click', () => this.handleSubmit());
    }
    
    handleFiles(files) {
        const selectedFilesDiv = this.querySelector('.selected-files');
        
        Array.from(files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span>📄 ${file.name}</span>
                <button class="file-remove" onclick="this.parentElement.remove()">×</button>
            `;
            selectedFilesDiv.appendChild(fileItem);
        });
    }
    
    handleSubmit() {
        const notes = this.querySelector('#submission-notes').value.trim();
        
        if (!notes) {
            return;
        }
        
        const submissionData = {
            assignmentId: this.assignment.id,
            notes: notes,
            files: Array.from(this.querySelectorAll('.file-item')).map(item => 
                item.querySelector('span').textContent.replace('📄 ', '')
            ),
            submittedAt: new Date().toISOString()
        };
        
        this.dispatchEvent(new CustomEvent('confirm-submit', {
            detail: submissionData,
            bubbles: true
        }));
    }
}

customElements.define('submit-modal', SubmitModal);
console.log('SubmitModal defined');