# SBS (Service Booking System) - Frontend

Next.js-based frontend application for Service Booking System (SBS). Built with modern technologies including Next.js 15, React 19, TypeScript, and Tailwind CSS 4.

## 🚀 Features

- **Modern Stack**: Built with Next.js 15, React 19, and TypeScript
- **UI Components**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS 4 with custom theming support
- **Authentication**: Secure JWT-based authentication
- **API Integration**: Auto-generated TypeScript API client from OpenAPI
- **State Management**: Zustand for global state management
- **Data Tables**: Powerful interactive tables with TanStack Table
- **Type Safety**: Full TypeScript support with strict type checking

## 📋 Prerequisites

- Node.js 20+ or Bun
- npm, pnpm, or bun
- .NET Backend (SBS API) running

## 🛠️ Installation

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd SBS/Frontend
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_BASE=http://localhost:5000/api
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
.
├── app/                      # Next.js app directory
│   ├── (app)/               # Protected routes
│   │   ├── overview/        # Dashboard overview
│   │   ├── role-management/ # Role and permission management
│   │   ├── system-management/ # System settings
│   │   └── user-management/ # User and account management
│   ├── (public)/            # Public routes
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration
│   │   └── ...
│   ├── api/                 # API route handlers
│   └── globals.css          # Global styles & Tailwind config
├── components/              # React components
│   ├── ui/                  # shadcn/ui library
│   ├── features/            # Feature-specific components
│   └── layout/              # Layout and navigation components
├── lib/                     # Utilities and libraries
│   ├── api/                 # API client and generated hooks
│   ├── auth/                # Auth logic and session management
│   └── utils.ts             # Global helper functions
├── hooks/                   # Custom React hooks
├── store/                   # Global state (Zustand)
├── public/                  # Static assets
└── scripts/                 # Utility scripts (e.g., API generation)
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# API Generation
npm run generate:api     # Generate TypeScript API client from Backend OpenAPI spec
```

## 🎨 Theming

The application supports dynamic customization:
- Light/Dark mode support
- Customized color schemes and palettes
- Responsive layouts using Tailwind CSS 4 properties

## 🔐 Authentication & Security

- JWT-based authentication flow
- Permission-based access control (RBAC)
- Secure route guards and navigation middleware
- Protected session management

## 📡 API Integration

The frontend automatically syncs with the Backend API using OpenAPI:

```bash
npm run generate:api
```

This generates typed services and data models in `lib/api/generated/`.

## 📚 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **React**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Tables**: [TanStack Table](https://tanstack.com/table/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **API Generation**: [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen)

## 🔍 Key Modules

### Overview
Dashboard for monitoring system status and key performance indicators.

### Security & Access Control
Comprehensive management of users, roles, and granular permissions.

### System Management
Configuration and maintenance of core system parameters and integrations.

---

**Service Booking System (SBS)** - An integrated online scheduling and management solution.

