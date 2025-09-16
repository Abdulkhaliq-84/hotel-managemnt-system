# 🏨 Hotel Management System

A comprehensive full-stack hotel management solution built with **React** (TypeScript) frontend and **ASP.NET Core** backend. This system streamlines hotel operations with modern UI/UX and robust API architecture.

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-9.0-512BD4?style=flat&logo=dotnet)](https://dotnet.microsoft.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)

## ✨ Features

### 🖥️ Frontend (React + TypeScript)
- **📊 Interactive Dashboard** - Real-time statistics and metrics
- **🛏️ Room Management** - Comprehensive room inventory system
- **👥 Guest Management** - Complete guest profiles and history
- **📅 Reservation System** - Advanced booking management with conflict detection
- **📈 Reports & Analytics** - Business intelligence and KPI tracking
- **🌍 Multi-language Support** - Internationalization with i18next
- **💱 Currency Support** - Multiple currency display options
- **📱 Responsive Design** - Mobile-friendly interface
- **🎨 Modern UI** - Clean and intuitive user experience

### 🛠️ Backend (ASP.NET Core API)
- **🔧 RESTful API** - Well-structured endpoints following REST principles
- **📊 PostgreSQL Database** - Robust data persistence with Entity Framework Core
- **📚 Swagger Documentation** - Interactive API documentation
- **✅ Data Validation** - Comprehensive input validation and business rules
- **🔒 Error Handling** - Graceful error responses with detailed messages
- **🏗️ Clean Architecture** - Separation of concerns and maintainable code structure

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **.NET 9.0 SDK**
- **PostgreSQL** (v12 or higher)
- **Git**

### 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/Abdulkhaliq-84/hotel-managemnt-system.git
cd hotel-managemnt-system
```

2. **Frontend Setup**
```bash
cd my-react-project
npm install
npm run dev
```

3. **Backend Setup**
```bash
cd HotelManagement.API

# Update connection string in appsettings.json
# Replace YOUR_PASSWORD with your PostgreSQL password
"DefaultConnection": "Host=localhost;Database=HotelManagementDB;Username=postgres;Password=YOUR_PASSWORD"

# Install dependencies and run migrations
dotnet restore
dotnet ef database update

# Start the API server
dotnet run
```

4. **Access the Application**
- Frontend: `http://localhost:5173`
- Backend API: `https://localhost:5001`
- Swagger Documentation: `https://localhost:5001/swagger`

## 🏗️ Project Structure

```
hotel-management-system/
├── my-react-project/              # React Frontend
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── features/              # Feature-based modules
│   │   │   ├── dashboard/         # Dashboard functionality
│   │   │   ├── guests/           # Guest management
│   │   │   ├── reservations/     # Booking system
│   │   │   ├── rooms/            # Room management
│   │   │   └── reports/          # Analytics & reports
│   │   ├── services/             # API services
│   │   ├── utils/                # Helper utilities
│   │   └── i18n/                 # Internationalization
│   ├── dist/                     # Production build
│   └── package.json
│
└── HotelManagement.API/          # .NET Core Backend
    ├── Controllers/              # API controllers
    ├── Models/                   # Data models and DTOs
    ├── Services/                 # Business logic services
    ├── Migrations/               # Database migrations
    └── Program.cs               # Application entry point
```

## 🔧 API Endpoints

### 👥 Guests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/guests` | Get all guests |
| GET | `/api/guests/{id}` | Get guest by ID |
| POST | `/api/guests` | Create new guest |
| PUT | `/api/guests/{id}` | Update guest |
| DELETE | `/api/guests/{id}` | Delete guest |

### 🛏️ Rooms
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rooms` | Get all rooms |
| GET | `/api/rooms/available` | Get available rooms |
| POST | `/api/rooms` | Create new room |
| PUT | `/api/rooms/{id}` | Update room |
| DELETE | `/api/rooms/{id}` | Delete room |

### 📅 Reservations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reservations` | Get all reservations |
| GET | `/api/reservations/{id}` | Get reservation details |
| POST | `/api/reservations` | Create new reservation |
| PUT | `/api/reservations/{id}` | Update reservation |
| DELETE | `/api/reservations/{id}` | Cancel reservation |

## 💡 Key Features Detail

### 📊 Dashboard
- Real-time occupancy rates
- Revenue tracking
- Check-in/check-out summaries
- Recent activity monitoring
- Key performance indicators

### 🛏️ Room Management
- Room type categorization
- Availability tracking
- Pricing management
- Room status updates
- Maintenance scheduling

### 👥 Guest Management
- Complete guest profiles
- Contact information management
- Reservation history
- Guest preferences tracking
- Search and filtering capabilities

### 📅 Advanced Reservations
- Date range validation
- Room availability checking
- Automatic pricing calculations
- Special request handling
- Status management (Pending, Confirmed, Checked-in, etc.)
- Payment tracking

## 🛠️ Technologies Used

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **i18next** - Internationalization
- **CSS3** - Custom styling

### Backend
- **ASP.NET Core 9.0** - Web API framework
- **Entity Framework Core** - ORM for database operations
- **PostgreSQL** - Primary database
- **Swagger/OpenAPI** - API documentation
- **AutoMapper** - Object mapping

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Git** - Version control

## 🚀 Deployment

### Docker Support
```bash
# Frontend
docker build -t hotel-frontend ./my-react-project
docker run -p 3000:80 hotel-frontend

# Backend
docker build -t hotel-api ./HotelManagement.API
docker run -p 5000:80 hotel-api
```

### Production Build
```bash
# Frontend
cd my-react-project
npm run build

# Backend
cd HotelManagement.API
dotnet publish -c Release
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abdulkhaliq**
- GitHub: [@Abdulkhaliq-84](https://github.com/Abdulkhaliq-84)
- LinkedIn: [Connect with me](https://linkedin.com/in/abdulkhaliq)

## 📞 Support

If you have any questions or need help getting started, please open an issue or reach out through GitHub.

---

⭐ **Star this repository if you found it helpful!**

## 📸 Screenshots

*Screenshots and demo videos will be added soon to showcase the application's features.*

---

<p align="center">
  <strong>Built with ❤️ for the hospitality industry</strong>
</p>