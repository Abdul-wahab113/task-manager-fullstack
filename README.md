<div align="center">
  <h1>Tasker: Full-Stack Task Management</h1>
  <p>A highly responsive, secure, and modern full-stack task management application featuring a drag-and-drop Kanban board, rich text editing, and productivity analytics.</p>

  <!-- Badges -->
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-success?style=for-the-badge&logo=nodedotjs" alt="Node" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql" alt="Postgres" />
  <img src="https://img.shields.io/badge/Docker-Multi--Stage-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions" alt="Actions" />

  <br /><br />

  <a href="https://task-manager-fullstack-eight-chi.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Click_Here-00C853?style=for-the-badge&logoColor=white" alt="Live Demo" />
  </a>
</div>

<br />

## 🌟 What is Tasker?
Tasker is a comprehensive web application designed to help users organize their daily tasks efficiently. Moving beyond simple to-do lists, Tasker implements a **Trello-style Kanban board** that allows users to seamlessly drag and drop tasks between statuses. It also features **Rich Text formatting**, real-time **productivity analytics**, and secure user authentication.

## 🧠 Why was it built?
This project was engineered from the ground up to demonstrate **enterprise-grade software development practices**. It proves mastery over complex systems, including:
- **Security:** JWT-based authentication (HttpOnly cookies), global rate-limiting, and strict CORS policies.
- **Infrastructure:** Multi-stage Docker builds utilizing layer caching and the Principle of Least Privilege (non-root users).
- **Automation:** Fully automated CI/CD pipelines via GitHub Actions that run tests and validate Docker builds on every push.
- **Database Architecture:** Modern ORM mapping using Drizzle ORM connected to a Serverless PostgreSQL instance on Neon.

## 🛠️ Tech Stack
### Frontend
- **Framework:** React 19 + Vite
- **UI/Styling:** Custom CSS Glassmorphism + Lucide Icons
- **Features:** `@hello-pangea/dnd` (Drag and Drop), `react-quill-new` (Rich Text)
- **Deployment:** Vercel

### Backend
- **Framework:** Node.js + Express.js
- **Database:** PostgreSQL (Neon Serverless DB) + Drizzle ORM
- **Authentication:** JSON Web Tokens (JWT) & bcrypt
- **Deployment:** Render (via Docker containers)

---

## 🚀 How to Run Locally

### Option 1: Run via Docker (Recommended)
You can spin up the entire full-stack application instantly using Docker Compose.

1. Clone the repository:
   ```bash
   git clone https://github.com/Abdul-wahab113/task-manager-fullstack.git
   cd task-manager-fullstack
   ```
2. Create `.env` files based on the provided `.env.example` configurations.
3. Start the containers:
   ```bash
   docker-compose up --build
   ```
4. Access the frontend at `http://localhost:8080`.

### Option 2: Run Manually (Local Development)

**1. Setup the Backend:**
```bash
cd node-backend
pnpm install
pnpm run db:push    # Push schema to your Postgres DB
pnpm run dev        # Starts server on port 8000
```

**2. Setup the Frontend:**
```bash
cd react-frontend
npm install
npm run dev        # Starts Vite server on port 5173
```

---

## 📸 Core Features
* **Authentication:** Secure Registration, Login, and Logout flows.
* **Kanban Board:** Visually track progress by dragging tasks across *To Do*, *In Progress*, and *Done* columns.
* **Productivity Analytics:** Live visual progress bar tracking task completion percentages.
* **Rich Text Editing:** Format descriptions with bolding, italics, bullet points, and more.
* **Search & Filters:** Instantly search through tasks by title or description.
* **Mobile Responsive:** Layout dynamically stacks and adjusts for flawless mobile usage.

<br />

<div align="center">
  <i>Engineered for Performance. Designed for Productivity.</i>
</div>
