class AdminPanel {
    constructor() {
      this.courses = []
      this.assignments = []
      this.students = []
      this.currentStep = 1
      this.editingCourse = null
      this.editingAssignment = null
      this.editingStudent = null
  
      this.API_BASE = "http://localhost:3000"
  
      this.init()
    }
  
    async init() {
      this.bindEvents()
      await this.loadData()
      this.renderDashboard()
      this.renderAllSections()
    }
  
    bindEvents() {
      // Sidebar navigation
      document.querySelectorAll(".nav-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          this.switchSection(e.target.dataset.section)
        })
      })
  
      // Course modal events
      document.getElementById("create-course-btn").addEventListener("click", () => {
        this.openCourseModal()
      })
  
      document.getElementById("close-course-modal").addEventListener("click", () => {
        this.closeCourseModal()
      })
  
      // Assignment modal events
      document.getElementById("create-assignment-btn").addEventListener("click", () => {
        this.openAssignmentModal()
      })
  
      document.getElementById("close-assignment-modal").addEventListener("click", () => {
        this.closeAssignmentModal()
      })
  
      // Student modal events
      document.getElementById("add-student-btn").addEventListener("click", () => {
        this.openStudentModal()
      })
  
      document.getElementById("close-student-modal").addEventListener("click", () => {
        this.closeStudentModal()
      })
  
      // Modal overlay clicks
      document.querySelectorAll(".modal-overlay").forEach((overlay) => {
        overlay.addEventListener("click", (e) => {
          if (e.target.classList.contains("modal-overlay")) {
            this.closeAllModals()
          }
        })
      })
  
      // Course form navigation
      document.getElementById("next-step").addEventListener("click", () => {
        this.nextStep()
      })
  
      document.getElementById("prev-step").addEventListener("click", () => {
        this.prevStep()
      })
  
      // Form submissions
      document.getElementById("course-form").addEventListener("submit", (e) => {
        e.preventDefault()
        this.saveCourse()
      })
  
      document.getElementById("assignment-form").addEventListener("submit", (e) => {
        e.preventDefault()
        this.saveAssignment()
      })
  
      document.getElementById("student-form").addEventListener("submit", (e) => {
        e.preventDefault()
        this.saveStudent()
      })
  
      // Image preview
      document.getElementById("course-icon").addEventListener("change", (e) => {
        this.previewImage(e.target.files[0])
      })
  
      // Step navigation
      document.querySelectorAll(".nav-step").forEach((step) => {
        step.addEventListener("click", (e) => {
          const stepNumber = Number.parseInt(e.currentTarget.dataset.step)
          this.goToStep(stepNumber)
        })
      })
  
      // Topics management
      document.getElementById("add-topic-btn").addEventListener("click", () => {
        this.addTopicField()
      })
  
      // Filters
      document.getElementById("category-filter").addEventListener("change", () => {
        this.filterCourses()
      })
  
      document.getElementById("level-filter").addEventListener("change", () => {
        this.filterCourses()
      })
  
      document.getElementById("course-search").addEventListener("input", () => {
        this.filterCourses()
      })
  
      // Cancel buttons
      document.getElementById("cancel-assignment").addEventListener("click", () => {
        this.closeAssignmentModal()
      })
  
      document.getElementById("cancel-student").addEventListener("click", () => {
        this.closeStudentModal()
      })
    }
  
    // Data Loading
    async loadData() {
      try {
        await Promise.all([this.loadCourses(), this.loadAssignments(), this.loadStudents()])
      } catch (error) {
        console.error("Error loading data:", error)
        this.showNotification("Error al cargar los datos", "error")
      }
    }
  
    async loadCourses() {
      try {
        const response = await fetch(`${this.API_BASE}/courses`)
        if (!response.ok) throw new Error("Failed to load courses")
        this.courses = await response.json()
      } catch (error) {
        console.error("Error loading courses:", error)
        // Fallback to empty array
        this.courses = []
      }
    }
  
    async loadAssignments() {
      try {
        const response = await fetch(`${this.API_BASE}/assignments`)
        if (!response.ok) throw new Error("Failed to load assignments")
        this.assignments = await response.json()
      } catch (error) {
        console.error("Error loading assignments:", error)
        // Fallback to empty array
        this.assignments = []
      }
    }
  
    async loadStudents() {
      // Since students might not exist in your API yet, we'll create sample data
      this.students = [
        {
          id: "1",
          name: "Daniela Herrera",
          email: "daniherrerarojas5@gmail.com",
          phone: "+57 319 3671889",
          enrolledCourses: ["1", "2"],
          averageProgress: 75,
          registrationDate: "2024-01-15",
          status: "active",
        },
        {
          id: "2",
          name: "Brayden Poveda",
          email: "braydenpoveda@gmail.com",
          phone: "+57 350 8459988",
          enrolledCourses: ["2", "3"],
          averageProgress: 82,
          registrationDate: "2024-02-20",
          status: "active",
        },
        {
          id: "3",
          name: "Juan Romero",
          email: "juansebastianromerocepeda29@gmail.com",
          phone: "+57 311 5580907",
          enrolledCourses: ["1"],
          averageProgress: 45,
          registrationDate: "2024-03-14",
          status: "inactive",
        },
        {
            id: "4",
            name: "Jhineth Perez",
            email: "danielaperezzt79@gmail.com",
            phone: "+57 324 2516420",
            enrolledCourses: ["1"],
            averageProgress: 45,
            registrationDate: "2024-03-14",
            status: "inactive",
          },
      ]
    }
  
    // Navigation
    switchSection(section) {
      // Update sidebar navigation
      document.querySelectorAll(".nav-btn").forEach((btn) => {
        btn.classList.remove("active")
      })
      document.querySelector(`[data-section="${section}"]`).classList.add("active")
  
      // Update content sections
      document.querySelectorAll(".content-section").forEach((section) => {
        section.classList.remove("active")
      })
      document.getElementById(`${section}-section`).classList.add("active")
  
      // Render section-specific content
      switch (section) {
        case "dashboard":
          this.renderDashboard()
          break
        case "courses":
          this.renderCourses()
          break
        case "assignments":
          this.renderAssignments()
          break
        case "students":
          this.renderStudents()
          break
        case "analytics":
          this.renderAnalytics()
          break
      }
    }
  
    // Dashboard Rendering
    renderDashboard() {
      // Update stats
      document.getElementById("total-courses").textContent = this.courses.length
      document.getElementById("total-assignments").textContent = this.assignments.length
      document.getElementById("total-students").textContent = this.students.length
  
      const avgProgress =
        this.courses.length > 0
          ? Math.round(this.courses.reduce((sum, course) => sum + course.progress, 0) / this.courses.length)
          : 0
      document.getElementById("avg-progress").textContent = `${avgProgress}%`
  
      // Render category chart
      this.renderCategoryChart()
  
      // Render activity feed
      this.renderActivityFeed()
    }
  
    renderCategoryChart() {
      const categoryCount = {}
      this.courses.forEach((course) => {
        const category = course.category || "Sin categoría"
        categoryCount[category] = (categoryCount[category] || 0) + 1
      })
  
      const chartContainer = document.getElementById("category-chart")
      chartContainer.innerHTML = Object.entries(categoryCount)
        .map(
          ([category, count]) => `
          <div class="category-item">
            <span style="text-transform: capitalize;">${category}</span>
            <span>${count} curso${count !== 1 ? "s" : ""}</span>
          </div>
        `,
        )
        .join("")
    }
  
    renderActivityFeed() {
      const activities = [
        { icon: "fas fa-plus", text: "Nuevo curso creado", time: "2 horas ago" },
        { icon: "fas fa-edit", text: "Assignment actualizado", time: "4 horas ago" },
        { icon: "fas fa-user-plus", text: "Nuevo estudiante registrado", time: "1 día ago" },
        { icon: "fas fa-chart-line", text: "Progreso actualizado", time: "2 días ago" },
      ]
  
      const feedContainer = document.getElementById("activity-feed")
      feedContainer.innerHTML = activities
        .map(
          (activity) => `
        <div class="activity-item">
          <div class="activity-icon">
            <i class="${activity.icon}"></i>
          </div>
          <div class="activity-content">
            <p>${activity.text}</p>
            <span class="activity-time">${activity.time}</span>
          </div>
        </div>
      `,
        )
        .join("")
    }
  
    // Course Management
    renderCourses() {
      this.filterCourses()
    }
  
    filterCourses() {
      const categoryFilter = document.getElementById("category-filter").value
      const levelFilter = document.getElementById("level-filter").value
      const searchTerm = document.getElementById("course-search").value.toLowerCase()
  
      const filteredCourses = this.courses.filter((course) => {
        const matchesCategory = !categoryFilter || course.category === categoryFilter
        const matchesLevel = !levelFilter || course.level === levelFilter
        const matchesSearch =
          !searchTerm ||
          course.title.toLowerCase().includes(searchTerm) ||
          course.description?.toLowerCase().includes(searchTerm)
  
        return matchesCategory && matchesLevel && matchesSearch
      })
  
      this.renderCoursesGrid(filteredCourses)
    }
  
    renderCoursesGrid(courses) {
      const grid = document.getElementById("admin-courses-grid")
  
      if (courses.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <i class="fas fa-book"></i>
            <h3>No hay cursos</h3>
            <p>No se encontraron cursos que coincidan con los filtros seleccionados</p>
            <button class="btn-primary" onclick="adminPanel.openCourseModal()">
              <i class="fas fa-plus"></i>
              Crear Primer Curso
            </button>
          </div>
        `
        return
      }
  
      grid.innerHTML = courses
        .map(
          (course) => `
        <div class="admin-course-card">
          <div class="course-card-header">
            ${course.icon ? `<img src="${course.icon}" alt="${course.title}">` : '<i class="fas fa-book"></i>'}
            <div class="course-category-badge">${course.category || "Sin categoría"}</div>
            <div class="course-level-badge">${course.level || "Sin nivel"}</div>
          </div>
          <div class="course-card-content">
            <h3 class="course-card-title">${course.title}</h3>
            <div class="course-card-meta">
              <span><i class="fas fa-clock"></i> ${course.duration || "Sin duración"}</span>
              <span><i class="fas fa-users"></i> ${this.getEnrolledStudentsCount(course.id)} estudiantes</span>
            </div>
            <p class="course-card-description">${course.description || "Sin descripción"}</p>
            <div class="course-progress-bar">
              <div class="course-progress-fill" style="width: ${course.progress || 0}%"></div>
            </div>
            <div class="course-card-actions">
              <button class="btn-view" onclick="adminPanel.viewCourse('${course.id}')">
                <i class="fas fa-eye"></i>
                Ver
              </button>
              <button class="btn-edit" onclick="adminPanel.editCourse('${course.id}')">
                <i class="fas fa-edit"></i>
                Editar
              </button>
              <button class="btn-delete" onclick="adminPanel.deleteCourse('${course.id}')">
                <i class="fas fa-trash"></i>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      `,
        )
        .join("")
    }
  
    getEnrolledStudentsCount(courseId) {
      return this.students.filter((student) => student.enrolledCourses && student.enrolledCourses.includes(courseId))
        .length
    }
  
    // Course Modal Management
    openCourseModal(course = null) {
      this.editingCourse = course
      this.currentStep = 1
  
      const modal = document.getElementById("course-modal")
      const title = document.getElementById("course-modal-title")
  
      if (course) {
        title.textContent = "Editar Curso"
        this.populateCourseForm(course)
      } else {
        title.textContent = "Crear Nuevo Curso"
        this.resetCourseForm()
      }
  
      this.updateStepDisplay()
      modal.classList.add("active")
    }
  
    closeCourseModal() {
      document.getElementById("course-modal").classList.remove("active")
      this.resetCourseForm()
      this.editingCourse = null
    }
  
    populateCourseForm(course) {
      document.getElementById("course-category").value = course.category || ""
      document.getElementById("course-level").value = course.level || ""
      document.getElementById("course-title").value = course.title || ""
      document.getElementById("course-duration").value = course.duration || ""
      document.getElementById("course-progress").value = course.progress || 0
      document.getElementById("course-description").value = course.description || ""
      document.getElementById("course-prerequisites").value = course.prerequisites || ""
      document.getElementById("prerequisites-description").value = course.prerequisitesDescription || ""
      document.getElementById("what-learn").value = course.whatLearn || ""
      document.getElementById("learn-description").value = course.learnDescription || ""
      document.getElementById("course-structure").value = course.structure || ""
      document.getElementById("structure-description").value = course.structureDescription || ""
  
      // Populate topics
      this.populateTopics(course.topics || [])
  
      if (course.icon) {
        const preview = document.getElementById("image-preview")
        preview.innerHTML = `<img src="${course.icon}" alt="Preview">`
      }
    }
  
    populateTopics(topics) {
      const container = document.getElementById("topics-container")
      container.innerHTML = ""
  
      if (topics.length === 0) {
        this.addTopicField()
        return
      }
  
      topics.forEach((topic) => {
        this.addTopicField(topic)
      })
    }
  
    addTopicField(topic = null) {
      const container = document.getElementById("topics-container")
      const topicDiv = document.createElement("div")
      topicDiv.className = "topic-item"
  
      topicDiv.innerHTML = `
        <input type="text" placeholder="Título del topic" class="topic-title" value="${topic?.title || ""}">
        <textarea placeholder="Descripción del topic" class="topic-description">${topic?.description || ""}</textarea>
        <input type="number" placeholder="Progreso %" min="0" max="100" class="topic-progress" value="${topic?.progress || 0}">
        <button type="button" class="btn-remove-topic">
          <i class="fas fa-trash"></i>
        </button>
      `
  
      // Add remove functionality
      topicDiv.querySelector(".btn-remove-topic").addEventListener("click", () => {
        topicDiv.remove()
      })
  
      container.appendChild(topicDiv)
    }
  
    resetCourseForm() {
      document.getElementById("course-form").reset()
      const preview = document.getElementById("image-preview")
      preview.innerHTML = `
        <i class="fas fa-image"></i>
        <p>Selecciona una imagen para el curso</p>
      `
  
      // Reset topics
      const container = document.getElementById("topics-container")
      container.innerHTML = ""
      this.addTopicField()
  
      this.currentStep = 1
    }
  
    nextStep() {
      if (this.currentStep < 2) {
        this.currentStep++
        this.updateStepDisplay()
      }
    }
  
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
        this.updateStepDisplay()
      }
    }
  
    goToStep(stepNumber) {
      this.currentStep = stepNumber
      this.updateStepDisplay()
    }
  
    updateStepDisplay() {
      // Update step navigation
      document.querySelectorAll(".nav-step").forEach((step) => {
        step.classList.remove("active")
      })
      document.querySelector(`[data-step="${this.currentStep}"]`).classList.add("active")
  
      // Update form steps
      document.querySelectorAll(".form-step").forEach((step) => {
        step.classList.remove("active")
      })
      document.querySelector(`.form-step[data-step="${this.currentStep}"]`).classList.add("active")
  
      // Update buttons
      const prevBtn = document.getElementById("prev-step")
      const nextBtn = document.getElementById("next-step")
      const saveBtn = document.getElementById("save-course")
  
      prevBtn.style.display = this.currentStep === 1 ? "none" : "inline-flex"
      nextBtn.style.display = this.currentStep === 2 ? "none" : "inline-flex"
      saveBtn.style.display = this.currentStep === 2 ? "inline-flex" : "none"
    }
  
    previewImage(file) {
      const preview = document.getElementById("image-preview")
  
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`
        }
        reader.readAsDataURL(file)
      } else {
        preview.innerHTML = `
          <i class="fas fa-image"></i>
          <p>Selecciona una imagen para el curso</p>
        `
      }
    }
  
    async saveCourse() {
      const formData = this.getCourseFormData()
  
      if (!this.validateCourseForm(formData)) {
        return
      }
  
      try {
        let response
        if (this.editingCourse) {
          response = await fetch(`${this.API_BASE}/courses/${this.editingCourse.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          })
        } else {
          response = await fetch(`${this.API_BASE}/courses`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          })
        }
  
        if (!response.ok) throw new Error("Failed to save course")
  
        await this.loadCourses()
        this.renderCourses()
        this.renderDashboard()
        this.closeCourseModal()
  
        const action = this.editingCourse ? "actualizado" : "creado"
        this.showNotification(`Curso ${action} exitosamente`, "success")
      } catch (error) {
        console.error("Error saving course:", error)
        this.showNotification("Error al guardar el curso", "error")
      }
    }
  
    getCourseFormData() {
      const imageFile = document.getElementById("course-icon").files[0]
  
      // Collect topics
      const topics = []
      document.querySelectorAll(".topic-item").forEach((item) => {
        const title = item.querySelector(".topic-title").value.trim()
        const description = item.querySelector(".topic-description").value.trim()
        const progress = Number.parseInt(item.querySelector(".topic-progress").value) || 0
  
        if (title) {
          topics.push({ title, description, progress })
        }
      })
  
      return {
        id: this.editingCourse ? this.editingCourse.id : Date.now().toString(),
        category: document.getElementById("course-category").value,
        level: document.getElementById("course-level").value,
        title: document.getElementById("course-title").value,
        duration: document.getElementById("course-duration").value,
        progress: Number.parseInt(document.getElementById("course-progress").value) || 0,
        description: document.getElementById("course-description").value,
        prerequisites: document.getElementById("course-prerequisites").value,
        prerequisitesDescription: document.getElementById("prerequisites-description").value,
        whatLearn: document.getElementById("what-learn").value,
        learnDescription: document.getElementById("learn-description").value,
        structure: document.getElementById("course-structure").value,
        structureDescription: document.getElementById("structure-description").value,
        topics: topics,
        icon: imageFile ? URL.createObjectURL(imageFile) : this.editingCourse?.icon || null,
      }
    }
  
    validateCourseForm(formData) {
      const requiredFields = ["category", "level", "title", "duration", "description", "whatLearn", "structure"]
  
      for (const field of requiredFields) {
        if (!formData[field] || formData[field].trim() === "") {
          this.showNotification(`El campo ${field} es requerido`, "error")
          return false
        }
      }
  
      if (formData.topics.length === 0) {
        this.showNotification("Debe agregar al menos un topic", "error")
        return false
      }
  
      return true
    }
  
    viewCourse(courseId) {
      const course = this.courses.find((c) => c.id === courseId)
      if (course) {
        // For now, just open edit modal - you could create a separate view modal
        this.editCourse(courseId)
      }
    }
  
    editCourse(courseId) {
      const course = this.courses.find((c) => c.id === courseId)
      if (course) {
        this.openCourseModal(course)
      }
    }
  
    async deleteCourse(courseId) {
      if (!confirm("¿Estás seguro de que quieres eliminar este curso?")) {
        return
      }
  
      try {
        const response = await fetch(`${this.API_BASE}/courses/${courseId}`, {
          method: "DELETE",
        })
  
        if (!response.ok) throw new Error("Failed to delete course")
  
        await this.loadCourses()
        this.renderCourses()
        this.renderDashboard()
        this.showNotification("Curso eliminado exitosamente", "success")
      } catch (error) {
        console.error("Error deleting course:", error)
        this.showNotification("Error al eliminar el curso", "error")
      }
    }
  
    // Assignment Management
    renderAssignments() {
      const tbody = document.getElementById("assignments-tbody")
  
      if (this.assignments.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" class="empty-state">
              <i class="fas fa-tasks"></i>
              <h3>No hay assignments</h3>
              <p>Crea tu primer assignment para comenzar</p>
              <button class="btn-primary" onclick="adminPanel.openAssignmentModal()">
                <i class="fas fa-plus"></i>
                Crear Assignment
              </button>
            </td>
          </tr>
        `
        return
      }
  
      tbody.innerHTML = this.assignments
        .map(
          (assignment) => `
        <tr>
          <td>${assignment.id}</td>
          <td>${assignment.title}</td>
          <td>${assignment.subject}</td>
          <td>${assignment.type}</td>
          <td>${new Date(assignment.dueDate).toLocaleDateString()}</td>
          <td>${assignment.points}</td>
          <td>
            <span class="status-badge status-${assignment.status}">
              ${assignment.status}
            </span>
          </td>
          <td>
            <button class="btn-edit" onclick="adminPanel.editAssignment('${assignment.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-delete" onclick="adminPanel.deleteAssignment('${assignment.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `,
        )
        .join("")
    }
  
    openAssignmentModal(assignment = null) {
      this.editingAssignment = assignment
  
      const modal = document.getElementById("assignment-modal")
      const title = document.getElementById("assignment-modal-title")
  
      if (assignment) {
        title.textContent = "Editar Assignment"
        this.populateAssignmentForm(assignment)
      } else {
        title.textContent = "Crear Nuevo Assignment"
        this.resetAssignmentForm()
      }
  
      modal.classList.add("active")
    }
  
    closeAssignmentModal() {
      document.getElementById("assignment-modal").classList.remove("active")
      this.resetAssignmentForm()
      this.editingAssignment = null
    }
  
    populateAssignmentForm(assignment) {
      document.getElementById("assignment-title").value = assignment.title || ""
      document.getElementById("assignment-subtitle").value = assignment.subtitle || ""
      document.getElementById("assignment-description").value = assignment.description || ""
      document.getElementById("assignment-subject").value = assignment.subject || ""
      document.getElementById("assignment-type").value = assignment.type || ""
      document.getElementById("assignment-due-date").value = assignment.dueDate || ""
      document.getElementById("assignment-points").value = assignment.points || ""
      document.getElementById("assignment-status").value = assignment.status || "active"
      document.getElementById("assignment-attachments").value = assignment.attachments || 0
      document.getElementById("assignment-modules").value = assignment.requiredModules
        ? assignment.requiredModules.join(", ")
        : ""
    }
  
    resetAssignmentForm() {
      document.getElementById("assignment-form").reset()
      document.getElementById("assignment-status").value = "active"
      document.getElementById("assignment-attachments").value = 0
    }
  
    async saveAssignment() {
      const formData = this.getAssignmentFormData()
  
      if (!this.validateAssignmentForm(formData)) {
        return
      }
  
      try {
        let response
        if (this.editingAssignment) {
          response = await fetch(`${this.API_BASE}/assignments/${this.editingAssignment.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          })
        } else {
          response = await fetch(`${this.API_BASE}/assignments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          })
        }
  
        if (!response.ok) throw new Error("Failed to save assignment")
  
        await this.loadAssignments()
        this.renderAssignments()
        this.renderDashboard()
        this.closeAssignmentModal()
  
        const action = this.editingAssignment ? "actualizado" : "creado"
        this.showNotification(`Assignment ${action} exitosamente`, "success")
      } catch (error) {
        console.error("Error saving assignment:", error)
        this.showNotification("Error al guardar el assignment", "error")
      }
    }
  
    getAssignmentFormData() {
      const modules = document
        .getElementById("assignment-modules")
        .value.split(",")
        .map((m) => m.trim())
        .filter((m) => m.length > 0)
  
      return {
        id: this.editingAssignment ? this.editingAssignment.id : Date.now().toString(),
        title: document.getElementById("assignment-title").value,
        subtitle: document.getElementById("assignment-subtitle").value,
        description: document.getElementById("assignment-description").value,
        subject: document.getElementById("assignment-subject").value,
        type: document.getElementById("assignment-type").value,
        dueDate: document.getElementById("assignment-due-date").value,
        points: Number.parseInt(document.getElementById("assignment-points").value),
        status: document.getElementById("assignment-status").value,
        attachments: Number.parseInt(document.getElementById("assignment-attachments").value) || 0,
        requiredModules: modules,
        submitted: false,
      }
    }
  
    validateAssignmentForm(formData) {
      const requiredFields = ["title", "description", "subject", "type", "dueDate", "points"]
  
      for (const field of requiredFields) {
        if (!formData[field] || (typeof formData[field] === "string" && formData[field].trim() === "")) {
          this.showNotification(`El campo ${field} es requerido`, "error")
          return false
        }
      }
  
      return true
    }
  
    editAssignment(assignmentId) {
      const assignment = this.assignments.find((a) => a.id === assignmentId)
      if (assignment) {
        this.openAssignmentModal(assignment)
      }
    }
  
    async deleteAssignment(assignmentId) {
      if (!confirm("¿Estás seguro de que quieres eliminar este assignment?")) {
        return
      }
  
      try {
        const response = await fetch(`${this.API_BASE}/assignments/${assignmentId}`, {
          method: "DELETE",
        })
  
        if (!response.ok) throw new Error("Failed to delete assignment")
  
        await this.loadAssignments()
        this.renderAssignments()
        this.renderDashboard()
        this.showNotification("Assignment eliminado exitosamente", "success")
      } catch (error) {
        console.error("Error deleting assignment:", error)
        this.showNotification("Error al eliminar el assignment", "error")
      }
    }
  
    // Student Management
    renderStudents() {
      const tbody = document.getElementById("students-tbody")
  
      if (this.students.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" class="empty-state">
              <i class="fas fa-users"></i>
              <h3>No hay estudiantes</h3>
              <p>Agrega tu primer estudiante para comenzar</p>
              <button class="btn-primary" onclick="adminPanel.openStudentModal()">
                <i class="fas fa-user-plus"></i>
                Agregar Estudiante
              </button>
            </td>
          </tr>
        `
        return
      }
  
      tbody.innerHTML = this.students
        .map(
          (student) => `
        <tr>
          <td>${student.id}</td>
          <td>${student.name}</td>
          <td>${student.email}</td>
          <td>${student.enrolledCourses ? student.enrolledCourses.length : 0}</td>
          <td>${student.averageProgress || 0}%</td>
          <td>${new Date(student.registrationDate).toLocaleDateString()}</td>
          <td>
            <span class="status-badge status-${student.status}">
              ${student.status}
            </span>
          </td>
          <td>
            <button class="btn-edit" onclick="adminPanel.editStudent('${student.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-delete" onclick="adminPanel.deleteStudent('${student.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `,
        )
        .join("")
    }
  
    openStudentModal(student = null) {
      this.editingStudent = student
  
      const modal = document.getElementById("student-modal")
      const title = document.getElementById("student-modal-title")
  
      if (student) {
        title.textContent = "Editar Estudiante"
        this.populateStudentForm(student)
      } else {
        title.textContent = "Agregar Estudiante"
        this.resetStudentForm()
      }
  
      this.renderStudentCoursesList()
      modal.classList.add("active")
    }
  
    closeStudentModal() {
      document.getElementById("student-modal").classList.remove("active")
      this.resetStudentForm()
      this.editingStudent = null
    }
  
    renderStudentCoursesList() {
      const container = document.getElementById("student-courses-list")
  
      container.innerHTML = this.courses
        .map(
          (course) => `
        <div class="course-checkbox">
          <input type="checkbox" id="course-${course.id}" value="${course.id}">
          <label for="course-${course.id}">${course.title}</label>
        </div>
      `,
        )
        .join("")
    }
  
    populateStudentForm(student) {
      document.getElementById("student-name").value = student.name || ""
      document.getElementById("student-email").value = student.email || ""
      document.getElementById("student-phone").value = student.phone || ""
      document.getElementById("student-status").value = student.status || "active"
  
      // Check enrolled courses
      if (student.enrolledCourses) {
        student.enrolledCourses.forEach((courseId) => {
          const checkbox = document.getElementById(`course-${courseId}`)
          if (checkbox) checkbox.checked = true
        })
      }
    }
  
    resetStudentForm() {
      document.getElementById("student-form").reset()
      document.getElementById("student-status").value = "active"
    }
  
    async saveStudent() {
      const formData = this.getStudentFormData()
  
      if (!this.validateStudentForm(formData)) {
        return
      }
  
      try {
        if (this.editingStudent) {
          const index = this.students.findIndex((s) => s.id === this.editingStudent.id)
          this.students[index] = formData
        } else {
          this.students.push(formData)
        }
  
        this.renderStudents()
        this.renderDashboard()
        this.closeStudentModal()
  
        const action = this.editingStudent ? "actualizado" : "agregado"
        this.showNotification(`Estudiante ${action} exitosamente`, "success")
      } catch (error) {
        console.error("Error saving student:", error)
        this.showNotification("Error al guardar el estudiante", "error")
      }
    }
  
    getStudentFormData() {
      const enrolledCourses = []
      document.querySelectorAll('#student-courses-list input[type="checkbox"]:checked').forEach((checkbox) => {
        enrolledCourses.push(checkbox.value)
      })
  
      return {
        id: this.editingStudent ? this.editingStudent.id : Date.now().toString(),
        name: document.getElementById("student-name").value,
        email: document.getElementById("student-email").value,
        phone: document.getElementById("student-phone").value,
        status: document.getElementById("student-status").value,
        enrolledCourses: enrolledCourses,
        averageProgress: this.editingStudent ? this.editingStudent.averageProgress : 0,
        registrationDate: this.editingStudent
          ? this.editingStudent.registrationDate
          : new Date().toISOString().split("T")[0],
      }
    }
  
    validateStudentForm(formData) {
      const requiredFields = ["name", "email"]
  
      for (const field of requiredFields) {
        if (!formData[field] || formData[field].trim() === "") {
          this.showNotification(`El campo ${field} es requerido`, "error")
          return false
        }
      }
  
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        this.showNotification("El formato del email no es válido", "error")
        return false
      }
  
      return true
    }
  
    editStudent(studentId) {
      const student = this.students.find((s) => s.id === studentId)
      if (student) {
        this.openStudentModal(student)
      }
    }
  
    deleteStudent(studentId) {
      if (!confirm("¿Estás seguro de que quieres eliminar este estudiante?")) {
        return
      }
  
      try {
        this.students = this.students.filter((s) => s.id !== studentId)
        this.renderStudents()
        this.renderDashboard()
        this.showNotification("Estudiante eliminado exitosamente", "success")
      } catch (error) {
        console.error("Error deleting student:", error)
        this.showNotification("Error al eliminar el estudiante", "error")
      }
    }
  
    // Analytics
    renderAnalytics() {
      this.renderCoursePerformance()
      this.renderStudentProgress()
      this.renderAssignmentCompletion()
    }
  
    renderCoursePerformance() {
      const container = document.getElementById("course-performance")
  
      const performanceData = this.courses.map((course) => ({
        name: course.title,
        progress: course.progress || 0,
        students: this.getEnrolledStudentsCount(course.id),
      }))
  
      container.innerHTML = performanceData
        .map(
          (course) => `
        <div class="performance-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid var(--border-color);">
          <div>
            <strong>${course.name}</strong>
            <div style="color: var(--text-secondary); font-size: 0.9rem;">${course.students} estudiantes</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 600; color: var(--primary-color);">${course.progress}%</div>
            <div style="width: 100px; height: 6px; background: var(--light-bg); border-radius: 3px; margin-top: 4px;">
              <div style="width: ${course.progress}%; height: 100%; background: var(--primary-color); border-radius: 3px;"></div>
            </div>
          </div>
        </div>
      `,
        )
        .join("")
    }
  
    renderStudentProgress() {
      const container = document.getElementById("student-progress")
  
      container.innerHTML = this.students
        .map(
          (student) => `
        <div class="progress-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid var(--border-color);">
          <div>
            <strong>${student.name}</strong>
            <div style="color: var(--text-secondary); font-size: 0.9rem;">${student.enrolledCourses ? student.enrolledCourses.length : 0} cursos</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 600; color: var(--success-color);">${student.averageProgress || 0}%</div>
            <div style="width: 100px; height: 6px; background: var(--light-bg); border-radius: 3px; margin-top: 4px;">
              <div style="width: ${student.averageProgress || 0}%; height: 100%; background: var(--success-color); border-radius: 3px;"></div>
            </div>
          </div>
        </div>
      `,
        )
        .join("")
    }
  
    renderAssignmentCompletion() {
      const container = document.getElementById("assignment-completion")
  
      const completionStats = {
        completed: this.assignments.filter((a) => a.status === "completed").length,
        active: this.assignments.filter((a) => a.status === "active").length,
        locked: this.assignments.filter((a) => a.status === "locked").length,
      }
  
      const total = this.assignments.length
  
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Completados</span>
            <span style="font-weight: 600; color: var(--success-color);">${completionStats.completed}/${total}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Activos</span>
            <span style="font-weight: 600; color: var(--primary-color);">${completionStats.active}/${total}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Bloqueados</span>
            <span style="font-weight: 600; color: var(--danger-color);">${completionStats.locked}/${total}</span>
          </div>
        </div>
      `
    }
  
    // Utility Methods
    closeAllModals() {
      document.querySelectorAll(".modal-overlay").forEach((modal) => {
        modal.classList.remove("active")
      })
      this.editingCourse = null
      this.editingAssignment = null
      this.editingStudent = null
    }
  
    renderAllSections() {
      this.renderCourses()
      this.renderAssignments()
      this.renderStudents()
      this.renderAnalytics()
    }
  
    showNotification(message, type = "success") {
      const container = document.getElementById("notification-container")
  
      const notification = document.createElement("div")
      notification.className = `notification ${type}`
      notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
          <span>${message}</span>
        </div>
      `
  
      container.appendChild(notification)
  
      // Auto remove after 5 seconds
      setTimeout(() => {
        notification.remove()
      }, 5000)
  
      // Click to remove
      notification.addEventListener("click", () => {
        notification.remove()
      })
    }
  }
  
  // Initialize the admin panel when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    window.adminPanel = new AdminPanel()
  })
  