# Item Management System

A full-stack web application for managing items inventory with image upload, search, and enquiry functionality. Built with React TypeScript frontend and Node.js Express backend.

## 🚀 Features

- **Item Management**: Add, view, and manage items with detailed information
- **Image Upload**: Support for cover image and multiple additional images via Cloudinary
- **Search & Filter**: Search items by name/description and filter by type
- **Email Notifications**: Automated enquiry emails with item details
- **Responsive Design**: Mobile-friendly interface with modern UI
- **Type Safety**: Full TypeScript implementation for better development experience

## 🛠 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **React Router Dom** for client-side routing
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL database
- **Cloudinary** for image storage
- **Nodemailer** for email functionality
- **Multer** for file upload handling

### Database
- **PostgreSQL** with Prisma ORM

### External Services
- **Cloudinary** for image storage and optimization
- **Gmail SMTP** for email notifications

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v18 or higher)
- PostgreSQL database
- Cloudinary account
- Gmail account with app password

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

#### Environment Variables (.env)

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
PORT=3001

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@example.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Or push schema to database
npm run db:push
```

#### Start Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

#### Environment Variables (.env)

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

#### Start Frontend Development Server

```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 📱 Usage

### Adding Items

1. Navigate to "Add Item" page
2. Fill in item details (name, type, description)
3. Upload a cover image (required)
4. Optionally upload additional images
5. Click "Add Item" to save

### Viewing Items

1. Browse all items on the homepage
2. Use search to find specific items
3. Filter by item type
4. Click on any item to view detailed information

### Sending Enquiries

1. Open any item's detail page
2. Click "Send Enquiry" button
3. An email with item details will be sent to the admin

## 🔌 API Documentation

### Items Endpoints

#### GET /api/items
Get all items with pagination and sorting.

**Response:**
```json
[
  {
    "id": "item-id",
    "name": "Item Name",
    "type": "Item Type",
    "description": "Item description",
    "coverImage": "https://cloudinary-url",
    "images": ["https://cloudinary-url1", "https://cloudinary-url2"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET /api/items/:id
Get specific item by ID.

#### POST /api/items
Create a new item with image upload.

**Content-Type:** `multipart/form-data`

**Body:**
- `name`: string (required)
- `type`: string (required)
- `description`: string (required)
- `coverImage`: file (required)
- `images`: file[] (optional)

#### POST /api/items/:id/enquire
Send enquiry email for specific item.

### Health Check

#### GET /api/health
Check server status.

## 📁 Project Structure

```
project/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── items.ts
│   │   ├── utils/
│   │   │   ├── cloudinary.ts
│   │   │   └── email.ts
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   ├── ItemCard.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── pages/
│   │   │   ├── AddItem.tsx
│   │   │   ├── ViewItems.tsx
│   │   │   └── ItemDetail.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🚀 Deployment

### Backend Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set up production database and environment variables**

3. **Deploy to platforms like:**
   - Heroku
   - Railway
   - DigitalOcean
   - AWS EC2

### Frontend Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to platforms like:**
   - Vercel
   - Netlify
   - AWS S3 + CloudFront

### Environment Setup for Production

Make sure to update:
- Database URL for production database
- Cloudinary credentials
- Email service credentials
- CORS settings for production domain
- API base URL in frontend

## 🔧 Development

### Running Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Code Formatting

Both projects use ESLint for code formatting and quality checks.

```bash
# Frontend linting
cd frontend
npm run lint
```

### Database Management

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Create and apply new migration
npm run db:migrate

# Push schema changes without migration
npm run db:push
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🤝 Support

For support, email [mittalvaibhav73@gmail.com] or create an issue in the repository.

## 🙏 Acknowledgments

- React team for the amazing framework
- Prisma for the excellent ORM
- Cloudinary for image management
- Tailwind CSS for utility-first styling
```
