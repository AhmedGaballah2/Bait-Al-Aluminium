# 🏠 Beit Al-Aluminium | بيت الألومنيوم

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![Django REST Framework](https://img.shields.io/badge/DRF-A30000?style=for-the-badge&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare_Turnstile-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)

</div>

**Beit Al-Aluminium** is a full-featured e-commerce platform for a home goods & bridal trousseau store — selling plates, cookware, trays, glassware, and other household essentials for newlyweds ("جهاز العروسة").

The project follows a **decoupled architecture**: a Django REST API backend and a React (Vite) single-page frontend, fully containerized with Docker and deployed on Railway.

---

## ✨ Features

- 🛍️ **Product Catalog** — Browse products with detailed descriptions, images, and pricing
- 🗂️ **Categories** — Organized product categories for easy navigation
- ⭐ **Product Reviews** — Customers can rate and review products
- 🛒 **Shopping Cart** — Add, update, and remove items before checkout
- 📦 **Order Management** — Full order lifecycle from checkout to fulfillment
- 🚚 **Order Tracking** — Customers can track the status of their orders
- 🧑‍💼 **Admin Dashboard** — Manage products, categories, orders, and users
- 🔒 **Rate Limiting** — Protects the API from abuse and brute-force attacks
- 🛡️ **Cloudflare Turnstile** — Bot protection on sensitive forms (login, checkout, etc.)

---

## 🧰 Tech Stack

### Backend
- **Django** — Core backend framework
- **Django REST Framework (REST APIs)** — API layer for the React frontend
- **Django Templates** — Used for admin/server-rendered views where applicable
- **PostgreSQL** — Primary relational database

### Frontend
- **React** — UI library
- **Vite** — Frontend build tool & dev server
- **Bootstrap** — UI styling and responsive layout
- **Axios** — HTTP client for consuming the REST API

### Infrastructure & DevOps
- **Docker** — Containerization for consistent dev/prod environments
- **Railway** — Hosting & deployment platform

---

## 📁 Project Structure

```
beit-al-aluminium/
├── backend/                # Django project
│   ├── config/              # Django settings, urls, wsgi/asgi
│   ├── products/             # Products & categories app
│   ├── reviews/               # Product reviews app
│   ├── offers/                    # Offers app
│   ├── orders/                    # Order management & tracking app
│   ├── accounts/                    # User authentication & admin
|   ├── .....
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/           # Axios API calls
│   │   └── App.jsx
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

> ℹ️ Adjust the tree above to match your actual folder names if they differ.

---

## ⚙️ Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose
- Node.js (for local frontend dev without Docker)
- Python 3.11+ (for local backend dev without Docker)
- PostgreSQL (if running without Docker)

### 1. Clone the repository
```bash
git clone https://github.com/AhmedGaballah2/Bait-Al-Aluminium.git
cd Bait-Al-Aluminium
```

### 2. Set up environment variables
Copy the example env file and fill in your own values:
```bash
cp .env.example .env
```

Example variables:
```env
# Django
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgres://user:password@db:5432/beit_al_aluminium

# Cloudflare Turnstile
TURNSTILE_SITE_KEY=your-site-key
TURNSTILE_SECRET_KEY=your-secret-key

# Frontend
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Run with Docker (recommended)
```bash
docker-compose up --build
```
- Backend API → `http://localhost:8000`
- Frontend → `http://localhost:5173`

### 4. Run manually (without Docker)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 API Overview

The backend exposes a REST API consumed by the React frontend via Axios. Example endpoints:

| Method | Endpoint                     | Description                  |
|--------|-------------------------------|-------------------------------|
| GET    | `/api/products/`              | List all products             |
| GET    | `/api/products/<id>/`         | Retrieve a single product     |
| GET    | `/api/categories/`            | List all categories           |
| POST   | `/api/reviews/`               | Submit a product review       |
| GET    | `/api/cart/`                  | Get current user's cart       |
| POST   | `/api/cart/add/`              | Add item to cart              |
| POST   | `/api/orders/`                | Create a new order            |
| GET    | `/api/orders/<id>/track/`     | Track order status            |

> ℹ️ Update this table with your actual endpoints, or link to Swagger/Postman docs if available.

---

## 🚀 Deployment

The project is deployed on **[Railway](https://railway.app/)**:
- Separate services for the **backend (Django + PostgreSQL)** and **frontend (React build)**
- Environment variables configured directly in the Railway dashboard
- Docker images built and deployed automatically on push (if CI/CD is configured)

---

## 🔐 Security

- **Rate limiting** on API endpoints to prevent abuse
- **Cloudflare Turnstile** integration to block bots on forms like login/checkout
- Environment-based secrets management (`.env` — never committed to version control)

---

## 🖼️ Screenshots

> Add screenshots or a demo GIF of the homepage, product page, cart, and admin dashboard here.

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

For questions or support, feel free to reach out via GitHub Issues.
