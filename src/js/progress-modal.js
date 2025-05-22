// Definición del Web Component para tarjetas de curso
class ProgressCard extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })

    // Obtener el template y clonarlo
    const template = document.getElementById("course-card-template")
    const clone = template.content.cloneNode(true)

    // Estilos específicos del componente
    const style = document.createElement("style")
    style.textContent = `
      /* Estilos para la tarjeta */
      .course-card {
        background-color: #fff;
        border-radius: 0;
        padding: 20px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        width: 99.5%;
        height: 80%;
        border: 1px solid #eee;
      }
      
      .course-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }
      
      .course-card h2 {
        font-size: 2.8rem;
        margin-bottom: 1px;
        margin-top: -10px;
        color: #000000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: normal;
      }
      
      .progress-bar {
        height: 8px;
        background-color: #ecf0f1;
        border-radius: 4px;
        margin-bottom: 8px;
        overflow: hidden;
      }
      
      .progress-value {
        height: 100%;
        background-color: #3498db;
        border-radius: 4px;
      }
      
      .completion-text {
        font-size: 0.85rem;
        color: #7f8c8d;
        margin-bottom: 15px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      
      .view-topics {
        color: #3498db;
        text-decoration: none;
        font-size: 0.85rem;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
    `

    // Agregar los estilos al shadow DOM
    this.shadowRoot.appendChild(style)

    // Agregar el contenido clonado al shadow DOM
    this.shadowRoot.appendChild(clone)

    // Agregar event listener para el clic
    this.shadowRoot.querySelector(".course-card").addEventListener("click", () => {
      this.showModal()
    })
  }

  connectedCallback() {
    // Obtener los atributos
    const title = this.getAttribute("title") || "Course Title"
    const progress = this.getAttribute("progress") || "0"

    // Actualizar el contenido
    this.shadowRoot.querySelector("h2").textContent = title
    this.shadowRoot.querySelector(".progress-value").style.width = `${progress}%`
    this.shadowRoot.querySelector(".completion-text").textContent = `${progress}% Complete`
  }

  showModal() {
    // Disparar un evento personalizado para mostrar el modal
    const event = new CustomEvent("show-modal", {
      bubbles: true,
      composed: true,
      detail: {
        title: this.getAttribute("title"),
        progress: this.getAttribute("progress"),
        icon: this.getAttribute("icon"),
        topics: JSON.parse(this.getAttribute("topics") || "[]"),
      },
    })

    this.dispatchEvent(event)
  }

  static get observedAttributes() {
    return ["title", "progress", "topics", "icon"]
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === "title") {
        this.shadowRoot.querySelector("h2").textContent = newValue
      } else if (name === "progress") {
        this.shadowRoot.querySelector(".progress-value").style.width = `${newValue}%`
        this.shadowRoot.querySelector(".completion-text").textContent = `${newValue}% Complete`
      }
    }
  }
}

// Definición del Web Component para el modal
class ProgressModal extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })

    // Obtener el template y clonarlo
    const template = document.getElementById("course-modal-template")
    const clone = template.content.cloneNode(true)

    // Estilos específicos del componente
    const style = document.createElement("style")
    style.textContent = `
      /* Estilos para el modal */
      .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        justify-content: center;
        align-items: center;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        z-index: 1000;
      }
      
      .modal.show {
        display: flex;
      }
      
      .modal-content {
        background-color: white;
        width: 100%;
        max-width: 550px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
      }
      
      .modal-header {
        padding: 20px;
        background-color: #2c3e50;
        color: white;
        position: relative;
      }
      
      .course-icon {
        position: absolute;
        right: -40px;
        top: 50%;
        transform: translateX(-12.5%) translateY(-50%) scale(1.1);
        background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
        width: 99%;
        height: 180px;
        z-index: 1;
        object-fit: cover;
        object-position: -20% 70%;
      }

      .gradient-overlay {
        position: absolute;
        bottom: -15px;
        left: 0;
        right: 0;
        margin-top: -50px;
        height: 100%;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
        z-index: 1;
      }

      .modal-header h2 {
        font-size: 1.6rem;
        margin-top: 60px;
        position: relative;
        z-index: 2;
        font-weight: 900;
      }

      .modal-progress {
        height: 6px;
        background-color: rgba(255, 255, 255, 0.2);
        margin-top: 15px;
        border-radius: 3px;
        overflow: hidden;
        position: relative;
        width: 70%;
        z-index: 2;
      }

      .modal-progress-value {
        height: 100%;
        background-color: rgba(0,255,0);
        border-radius: 3px;
      }

      .modal-completion {
        font-size: 0.9rem;
        position: absolute;
        right: 20px;
        bottom: 9px;
        font-weight: 900;
        z-index: 2;
      }

      .modal-body {
        padding: 20px;
        max-height: 60vh;
        overflow-y: auto;
      }

      .topic {
        margin-bottom: 25px;
      }

      .topic h3 {
        font-size: 1.5rem;
        margin-bottom: -11px;
        color: #000000;
        font-weight: bold;
      }

      .topic p {
        font-size: 1rem;
        color: #7f8c8d;
        margin-bottom: 10px;
      }

      .topic-progress {
        height: 6px;
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
        z-index: 10;
      }
    `

    // Agregar los estilos al shadow DOM
    this.shadowRoot.appendChild(style)

    // Agregar el contenido clonado al shadow DOM
    this.shadowRoot.appendChild(clone)

    // Agregar event listener para el botón de cerrar
    this.shadowRoot.querySelector(".close-btn").addEventListener("click", () => {
      this.hide()
    })

    // Agregar event listener para cerrar al hacer clic fuera del modal
    this.shadowRoot.querySelector(".modal").addEventListener("click", (e) => {
      if (e.target === this.shadowRoot.querySelector(".modal")) {
        this.hide()
      }
    })
  }

  connectedCallback() {
    // Agregar listener para el evento personalizado
    document.addEventListener("show-modal", (e) => {
      this.show(e.detail)
    })
  }

  show(data) {
    // Actualizar los datos del modal
    const modal = this.shadowRoot.querySelector(".modal")
    const title = this.shadowRoot.querySelector(".modal-header h2")
    const icon = this.shadowRoot.querySelector(".course-icon", ".course-icon-wrapper")
    const progressValue = this.shadowRoot.querySelector(".modal-progress-value")
    const completion = this.shadowRoot.querySelector(".modal-completion")
    const modalBody = this.shadowRoot.querySelector(".modal-body")

    // Establecer los valores
    title.textContent = data.title || "Course Title"
    icon.src = data.icon || ""
    icon.alt = data.title || "Course Icon"
    progressValue.style.width = `${data.progress}%`
    completion.textContent = `${data.progress}% Complete`

    // Limpiar el contenido anterior
    modalBody.innerHTML = ""

    // Agregar los temas
    if (data.topics && data.topics.length > 0) {
      data.topics.forEach((topic) => {
        const topicElement = document.createElement("div")
        topicElement.className = "topic"

        const topicTitle = document.createElement("h3")
        topicTitle.textContent = topic.title

        const topicDescription = document.createElement("p")
        topicDescription.textContent = topic.description

        const topicProgress = document.createElement("div")
        topicProgress.className = "topic-progress"

        const topicProgressValue = document.createElement("div")
        topicProgressValue.className = "topic-progress-value"
        topicProgressValue.style.width = `${topic.progress}%`

        const topicCompletion = document.createElement("div")
        topicCompletion.className = "topic-completion"
        topicCompletion.textContent = `${topic.progress}% Complete`

        topicProgress.appendChild(topicProgressValue)

        topicElement.appendChild(topicTitle)
        topicElement.appendChild(topicDescription)
        topicElement.appendChild(topicProgress)
        topicElement.appendChild(topicCompletion)

        modalBody.appendChild(topicElement)
      })
    }

    // Mostrar el modal
    modal.classList.add("show")
  }

  hide() {
    const modal = this.shadowRoot.querySelector(".modal")
    modal.classList.remove("show")
  }
}

// Registrar los componentes
customElements.define("course-card", ProgressCard)
customElements.define("progress-modal", ProgressModal)