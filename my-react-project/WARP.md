# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Hotel Management System built with React, TypeScript, and Vite. The application provides functionality for managing hotel reservations, guests, and rooms with a dashboard for monitoring activities.

## Common Development Commands

### Core Development Tasks
```bash
# Start development server (runs on default Vite port)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint for code quality checks
npm run lint

# TypeScript type checking (part of build process)
npm run build
```

### Testing and Debugging
```bash
# Check TypeScript compilation without building
npx tsc --noEmit

# Run ESLint with auto-fix
npx eslint . --fix

# Check for TypeScript errors in specific files
npx tsc --noEmit src/features/reservations/components/ReservationPage.tsx
```

## Architecture Overview

### Technology Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router DOM v7
- **Styling**: CSS modules with component-specific stylesheets
- **State Management**: React hooks (useState, useEffect, custom hooks)
- **API Communication**: Custom API service with fetch

### Project Structure

The application follows a feature-based architecture:

```
src/
├── features/           # Feature modules (domain-driven structure)
│   ├── dashboard/     # Dashboard feature with activity monitoring
│   ├── guests/        # Guest management functionality
│   ├── navbar/        # Navigation component
│   ├── reservations/  # Reservation management
│   └── rooms/         # Room management
├── components/        # Shared UI components (Toast, Dialogs, Modals)
├── hooks/            # Custom React hooks (useToast)
├── services/         # API service layer
└── utils/            # Utility functions
```

### Key Architectural Patterns

#### 1. Feature Module Organization
Each feature follows a consistent structure:
- `components/` - React components specific to the feature
- `types/` - TypeScript type definitions
- `index.ts` - Public API exports

Example: The reservations feature exports components like `ReservationPage`, `ReservationForm`, `ReservationTable`, and types through a central index file.

#### 2. API Service Layer
Located in `src/services/api.ts`, the API service:
- Centralizes all backend communication
- Uses a singleton `ApiService` class with typed methods
- Handles error responses with appropriate error messages
- Communicates with backend at `http://localhost:5159/api`
- Implements DTOs matching the C# backend models

Key endpoints:
- `/guests` - Guest CRUD operations
- `/rooms` - Room management and availability
- `/reservations` - Reservation CRUD and status updates
- `/reservations/summary` - Reservation summaries with guest/room info

#### 3. Component Communication Pattern
- **Props Drilling**: Parent components manage state and pass callbacks down
- **Custom Hooks**: Shared logic like `useToast` for notifications
- **Direct API Calls**: Components fetch their own data using the API service

#### 4. UI Component Architecture
Shared components in `src/components/`:
- `Toast` - Notification system with success/error/info/warning types
- `ConfirmDialog` - Confirmation dialogs for destructive actions
- `PaymentStatusModal` - Payment status management
- `ReservationStatusModal` - Reservation status updates

Each component has its own CSS file for styling isolation.

#### 5. State Management Strategy
- **Local State**: Components manage their own state with useState
- **Data Fetching**: useEffect hooks for API calls on component mount
- **Form State**: Controlled components with local state
- **Toast Notifications**: Custom hook pattern for global notifications

### Data Flow

1. **Page Load**: Feature pages fetch data on mount using useEffect
2. **User Actions**: Components handle events and call API service methods
3. **API Communication**: Service layer handles requests/responses with proper typing
4. **State Updates**: Components update local state after successful API calls
5. **UI Feedback**: Toast notifications provide user feedback for actions

### Backend Integration

The application expects a C# ASP.NET Core backend running on `http://localhost:5159` with the following data models:

- **Guest**: id, name, email, phone, createdAt
- **Room**: id, roomNumber, roomType, pricePerNight, description, isAvailable
- **Reservation**: Complex model with guest/room relationships, dates, status, payment status

Status enums:
- Reservation Status: Pending, Confirmed, CheckedIn, CheckedOut, Cancelled
- Payment Status: Pending, Paid, Failed, Refunded

### Development Workflow

1. **Feature Development**: Create new features in `src/features/[feature-name]/`
2. **Shared Components**: Add reusable UI to `src/components/`
3. **API Integration**: Extend `src/services/api.ts` with new endpoints
4. **Type Safety**: Define interfaces for all API responses and component props
5. **Styling**: Create component-specific CSS files alongside components

### Error Handling

- API errors display user-friendly messages via toast notifications
- Network failures show connection error messages
- Form validation happens client-side before API calls
- Backend validation errors are displayed to users

### Key Files to Understand

1. **src/App.tsx** - Main routing configuration
2. **src/services/api.ts** - All API communication logic
3. **src/features/reservations/components/ReservationPage.tsx** - Complex feature example
4. **src/hooks/useToast.ts** - Custom hook pattern implementation
5. **src/features/dashboard/components/Dashboard.tsx** - Data aggregation and statistics
