class AssignmentList extends HTMLElement {
    constructor() {
      super()
      this.assignments = []
      this.currentFilter = "all"
      this.eventListenersAttached = false
    }
  
    connectedCallback() {
      this.addEventListener("filter-changed", this.handleFilterChange.bind(this))
      this.loadAssignments()
    }
  
    // Datos por defecto
    getDefaultAssignments() {
      return [
        {
          id: 1,
          title: "Final Project: E-commerce Platform",
          subtitle: "Full Stack Development",
          description:
            "Build a complete e-commerce platform using React, Node.js, and MongoDB. Implement user authentication, product management, shopping cart, and payment processing.",
          dueDate: "Mar 14, 2024",
          points: 100,
          type: "Project",
          status: "pending",
          subject: "Web Development",
          attachments: 2,
          requiredModules: "Frontend Development, Backend Integration, Database Design",
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
          courseProgress: 60,
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
          requiredModules: "User Research, Interface Design",
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
          courseProgress: 40,
        },
      ]
    }
  
    loadAssignments() {
      this.assignments = this.getDefaultAssignments()
      this.render()
    }
  
    updateAssignmentStatus(assignmentId, newStatus) {
      const assignmentIndex = this.assignments.findIndex((a) => Number.parseInt(a.id) === Number.parseInt(assignmentId))
  
      if (assignmentIndex !== -1) {
        this.assignments[assignmentIndex].status = newStatus
        return true
      }
      return false
    }
  
    handleFilterChange(event) {
      this.currentFilter = event.detail.filter
      this.render()
    }
  
    getFilteredAssignments() {
      if (this.currentFilter === "all") {
        return this.assignments
      }
  
      if (this.currentFilter === "pending") {
        return this.assignments.filter(
          (assignment) =>
            assignment.status === "pending" || assignment.status === "locked" || assignment.status === "overdue",
        )
      }
  
      if (this.currentFilter === "overdue") {
        return this.assignments.filter(
          (assignment) =>
            assignment.status === "overdue" || assignment.status === "pending" || assignment.status === "locked",
        )
      }
  
      return this.assignments.filter((assignment) => assignment.status === this.currentFilter)
    }
  
    getStatusConfig(status) {
      const configs = {
        pending: { emoji: "⏳", text: "Pending", color: "#ffa000", bg: "#fff8e1", borderColor: "#ff6b35" },
        completed: { emoji: "✅", text: "Completed", color: "#4caf50", bg: "#e8f5e8", borderColor: "#4caf50" },
        overdue: { emoji: "⚠️", text: "Overdue", color: "#f44336", bg: "#ffebee", borderColor: "#f44336" },
        locked: { emoji: "🔒", text: "Locked", color: "#ff9800", bg: "#fff3e0", borderColor: "#ff9800" },
      }
      return configs[status] || configs.pending
    }
  
    getSubjectIcon(subject) {
      const icons = {
        "Web Development": "💻",
        "Mobile Development": "📱",
        Design: "🎨",
        "Data Science": "📊",
        "Computer Science": "⚡",
      }
      return icons[subject] || "📚"
    }
  
    openSubmitModal(assignment) {
      if (!customElements.get("submit-modal")) {
        alert("Error: Modal component not loaded. Please refresh the page.")
        return
      }
  
      // Verificar si ya existe un modal abierto
      const existingModal = document.querySelector("submit-modal")
      if (existingModal) {
        existingModal.remove()
      }
  
      try {
        const modal = document.createElement("submit-modal")
        modal.setAssignment(assignment)
        document.body.appendChild(modal)
  
        const handleSubmission = (event) => {
          this.updateAssignmentStatus(assignment.id, "completed")
          this.showSuccessMessage(assignment.title)
  
          modal.removeEventListener("confirm-submit", handleSubmission)
          modal.remove()
          this.render()
        }
  
        modal.addEventListener("confirm-submit", handleSubmission)
      } catch (error) {
        alert("Error opening submission modal: " + error.message)
      }
    }
  
    showSuccessMessage(title) {
      const message = document.createElement("div")
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
          `
  
      message.innerHTML = `
              <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 18px;">✅</span>
                  <div>
                      <div style="font-weight: 600;">Assignment Submitted!</div>
                      <div style="font-size: 14px; opacity: 0.9;">${title}</div>
                  </div>
              </div>
          `
  
      document.body.appendChild(message)
      setTimeout(() => message.remove(), 3000)
    }
  
    handleSubmitClick(event) {
      if (event.target.classList.contains("submit-btn")) {
        event.preventDefault()
        event.stopPropagation()
  
        const assignmentId = Number.parseInt(event.target.dataset.id)
        const assignment = this.assignments.find((a) => Number.parseInt(a.id) === assignmentId)
  
        if (assignment) {
          this.openSubmitModal(assignment)
        } else {
          alert("Error: Assignment not found")
        }
      }
    }
  
    attachSubmitButtonListeners() {
      this.removeEventListener("click", this.handleSubmitClick)
      this.addEventListener("click", this.handleSubmitClick.bind(this))
      this.eventListenersAttached = true
    }
  
    render() {
      const filteredAssignments = this.getFilteredAssignments()
  
      if (filteredAssignments.length === 0) {
        this.innerHTML = `
                  <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
                      <div style="font-size: 48px; margin-bottom: 16px;">📭</div>
                      <h3 style="margin: 0 0 8px 0; color: #495057;">No assignments found</h3>
                      <p style="margin: 0;">No assignments match the current filter.</p>
                  </div>
              `
        return
      }
  
      const groupedAssignments = {}
      filteredAssignments.forEach((assignment) => {
        if (!groupedAssignments[assignment.subject]) {
          groupedAssignments[assignment.subject] = []
        }
        groupedAssignments[assignment.subject].push(assignment)
      })
  
      let html = ""
  
      Object.keys(groupedAssignments).forEach((subject) => {
        const assignments = groupedAssignments[subject]
        const icon = this.getSubjectIcon(subject)
  
        html += `
                  <div style="margin: 40px 0 20px 0; display: flex; align-items: center; gap: 12px; border-bottom: 2px solid #e9ecef; padding-bottom: 12px;">
                      <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                          ${icon}
                      </div>
                      <h2 style="font-size: 24px; font-weight: 600; color: #495057; margin: 0; border-bottom: 2px solid #007bff; padding-bottom: 4px;">${subject}</h2>
                  </div>
              `
  
        assignments.forEach((assignment) => {
          const statusConfig = this.getStatusConfig(assignment.status)
  
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
                              
                              ${
                                assignment.status === "locked"
                                  ? `<div style="background: #fff3cd; color: #856404; padding: 8px 12px; border-radius: 6px; font-size: 14px; margin-bottom: 12px; border-left: 3px solid #ffc107;">
                                      🔒 Complete the course to unlock (${Number.parseInt(assignment.courseProgress) || 0}% completed)
                                  </div>`
                                  : ""
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
                                      📚 Required Modules: ${assignment.requiredModules || "N/A"}
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
                  `
        })
      })
  
      this.innerHTML = html
      this.attachSubmitButtonListeners()
    }
  
    getActionButton(assignment) {
      switch (assignment.status) {
        case "pending":
        case "overdue":
          return `<button class="submit-btn" data-id="${assignment.id}" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer; font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 8px; transition: all 0.2s;">
                      📤 Submit Assignment
                  </button>`
  
        case "completed":
          return `<div style="background: #d4edda; color: #155724; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                      ✅ Submitted
                  </div>`
  
        case "locked":
          return `<button style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 25px; cursor: not-allowed; font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 8px;" disabled>
                      🔒 Complete Course to Submit
                  </button>`
  
        default:
          return ""
      }
    }
  }
  
  customElements.define("assignment-list", AssignmentList)
  