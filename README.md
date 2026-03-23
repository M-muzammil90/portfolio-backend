# Portfolio Backend API

A complete backend API for the portfolio website with admin panel functionality.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **File Uploads:** Multer

## 📁 Project Structure

```
backend/
├── controllers/      # Business logic
├── middleware/       # Auth, upload middleware
├── models/          # Database models
├── routes/          # API routes
├── uploads/         # Uploaded files
├── server.js        # Main server file
└── package.json
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start MongoDB

Make sure MongoDB is running on your system or use MongoDB Atlas.

### 4. Run the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Projects
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/projects` | Get all projects | No |
| GET | `/api/projects/:id` | Get single project | No |
| POST | `/api/projects` | Create project | Yes (Admin) |
| PUT | `/api/projects/:id` | Update project | Yes (Admin) |
| DELETE | `/api/projects/:id` | Delete project | Yes (Admin) |

### Blog Posts
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/blogs` | Get all blog posts | No |
| GET | `/api/blogs/:id` | Get single blog post | No |
| POST | `/api/blogs` | Create blog post | Yes (Admin) |
| PUT | `/api/blogs/:id` | Update blog post | Yes (Admin) |
| DELETE | `/api/blogs/:id` | Delete blog post | Yes (Admin) |

### Contact Messages
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/contacts` | Get all messages | Yes (Admin) |
| GET | `/api/contacts/stats` | Get message stats | Yes (Admin) |
| POST | `/api/contacts` | Submit contact form | No |
| PUT | `/api/contacts/:id/status` | Update message status | Yes (Admin) |
| DELETE | `/api/contacts/:id` | Delete message | Yes (Admin) |

### Testimonials
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/testimonials` | Get all testimonials | No |
| POST | `/api/testimonials` | Create testimonial | Yes (Admin) |
| PUT | `/api/testimonials/:id` | Update testimonial | Yes (Admin) |
| DELETE | `/api/testimonials/:id` | Delete testimonial | Yes (Admin) |

## 🔐 Authentication

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📤 File Uploads

Images can be uploaded using `multipart/form-data` with the field name `image`.

Supported formats: JPEG, PNG, WebP
Max size: 5MB

## 📝 Example Usage

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer <token>" \
  -F "title=My Project" \
  -F "description=Project description" \
  -F "category=Web App" \
  -F "image=@project-image.jpg"
```

### Submit Contact Form
```bash
curl -X POST http://localhost:5000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com", "subject": "Hello", "message": "Hi there!"}'
```

## 🗄️ Database Models

### User
- username (String, unique)
- email (String, unique)
- password (String)
- role (String: admin/user)
- name (String)
- avatar (String)

### Project
- title (String)
- description (String)
- image (String)
- tags (Array)
- liveUrl (String)
- githubUrl (String)
- category (String)
- featured (Boolean)
- order (Number)

### Blog
- title (String)
- excerpt (String)
- content (String)
- image (String)
- author (String)
- category (String)
- readTime (String)
- tags (Array)
- published (Boolean)
- views (Number)

### Contact
- name (String)
- email (String)
- subject (String)
- message (String)
- status (String: new/read/replied/archived)
- ipAddress (String)

### Testimonial
- name (String)
- role (String)
- company (String)
- image (String)
- content (String)
- rating (Number)
- active (Boolean)
- order (Number)

## 📄 License

MIT
