# Campus Mart

A full-stack e-commerce marketplace platform designed for campus communities, allowing students to buy, sell, and auction items locally.

## 🚀 Features

### Frontend (Client)
- **Marketplace**: Browse and search for items (Books, Electronics, Stationery, etc.).
- **Smart Filtering**: Filter by category, price, and location.
- **Real-time Chat**: Integrated socket.io chat for buyers and sellers completely working.
- **Location Services**: Map integration for easy meetup coordination.
- **User Profiles**: Manage listings, orders, and favorites.

### Admin Dashboard
- **Analytics**: Visual charts for revenue, orders, and user growth.
- **User Management**: Monitor and manage user accounts.
- **Order Tracking**: View and update order statuses.
- **Content Moderation**: Manage listings and reviews.

### Backend (Server)
- **Secure Auth**: JWT authentication with role-based access control.
- **Real-time Engine**: Socket.io for instant messaging and notifications.
- **Cloud Storage**: Cloudinary integration for image uploads.
- **Robust API**: Express.js REST API with MongoDB.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Real-time**: Socket.io
- **Deployment**: Docker, Vercel, Render

---

## 🔧 Installation & Setup

### Option 1: Docker (Recommended)
The easiest way to run the entire app (Frontend, Admin, Backend, Database connection).

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/sde-saharsh/Campus_Mart.git
    cd Campus_Mart
    ```

2.  **Configure Environment**:
    Create a `.env` file in the root directory (copy from `.env.example`).
    ```bash
    cp .env.example .env
    ```
    *Open `.env` and verify your MongoDB URI and Cloudinary credentials.*

3.  **Run with Docker**:
    ```bash
    docker compose up --build
    ```

4.  **Access App**:
    -   Frontend: [http://localhost:5173](http://localhost:5173)
    -   Admin: [http://localhost:5174](http://localhost:5174)
    -   Backend: [http://localhost:8001](http://localhost:8001)

### Option 2: Manual Setup

1.  **Backend**:
    ```bash
    cd Backend
    npm install
    # Setup .env file in Backend/
    npm start
    ```

2.  **Frontend / Admin**:
    ```bash
    cd frontend # or cd Admin
    npm install
    npm run dev
    ```

---

## 📂 Project Structure

```
MyApp/
├── Backend/        # Node.js API Server
├── frontend/       # Student Marketplace Client
├── Admin/          # Management Dashboard
├── docker-compose.yml
├── DEPLOYMENT_GUIDE.md
└── README.md
```

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request

---

## 📧 Contact
Developed by **Saharsh**.
