# 🐣 HatchHub

A full-stack social media web application where users can share authentic stories, connect with friends, and engage with posts — built with Next.js and Express.

🔗 **Live Demo:** [hatchhub.vercel.app](https://hatchhub.vercel.app)

---

## ✨ Features

- 👤 **User Authentication** — Secure signup and login with bcrypt password hashing
- 📝 **Posts** — Create, read, and interact with posts from the community
- 🖼️ **File Uploads** — Upload images and media via Multer
- 📄 **PDF Generation** — Generate PDFs using PDFKit
- 🗂️ **Redux State Management** — Centralized frontend state with Redux Toolkit
- 📱 **Responsive UI** — Clean, component-based layout with Next.js

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 15 | React framework with SSR/SSG |
| React 19 | UI library |
| Redux Toolkit + React-Redux | Global state management |
| Axios | HTTP requests to backend API |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express v5 | REST API server |
| MongoDB + Mongoose | Database |
| Multer | File/image upload handling |
| bcryptjs | Password hashing |
| PDFKit | PDF generation |
| dotenv | Environment variable management |

---

## 📁 Project Structure

```
HatchHub/
├── frontend/                     # Next.js app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.jsx         # Landing page
│   │   │   ├── login.jsx         # Login page
│   │   │   └── ...               # Other pages
│   │   ├── components/
│   │   │   └── Navbar.jsx        # Navbar component
│   │   ├── layouts/
│   │   │   └── UserLayout.jsx    # Shared page layout
│   │   ├── styles/               # CSS modules
│   │   └── store/                # Redux store & slices
│   └── package.json
│
└── backend/                      # Express API
    ├── routes/
    │   ├── post.routes.js        # Post-related routes
    │   └── user.routes.js        # User auth routes
    ├── models/                   # Mongoose models
    ├── uploads/                  # Uploaded files (served statically)
    ├── app.js                    # Entry point
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account

---

### Backend Setup

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=8080
   MONGO_URI=your_mongodb_atlas_connection_string
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

---

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the `frontend/` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Visit the app**

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛣️ Routes Overview

### Frontend Pages

| Path       | Description                  |
|------------|------------------------------|
| `/`        | Landing page                 |
| `/login`   | Login page                   |

### Backend API

| Method | Route         | Description               |
|--------|---------------|---------------------------|
| POST   | `/register`   | Register a new user       |
| POST   | `/login`      | Login & receive token     |
| GET    | `/posts`      | Fetch all posts           |
| POST   | `/posts`      | Create a new post         |

---

## 🔑 Environment Variables

### Backend `.env`

| Variable    | Description                     |
|-------------|---------------------------------|
| `PORT`      | Server port (default: 8080)     |
| `MONGO_URI` | MongoDB Atlas connection string |

### Frontend `.env.local`

| Variable              | Description               |
|-----------------------|---------------------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL      |

> ⚠️ Never commit `.env` or `.env.local` files. Ensure they are listed in `.gitignore`.

---

## 🌐 Deployment

| Layer    | Platform | Details                              |
|----------|----------|--------------------------------------|
| Frontend | Vercel   | Auto-deploys from `main` branch      |
| Backend  | Any      | `npm run prod` runs `node app.js`    |

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.
