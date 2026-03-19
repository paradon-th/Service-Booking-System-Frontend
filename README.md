# Denso PC Reforming Frontend

Next.js-based frontend application for Denso PC Reforming system. Built with modern technologies including Next.js 15, React 19, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Stack**: Built with Next.js 15, React 19, and TypeScript
- **UI Components**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom theming support
- **Authentication**: Secure authentication with JWT tokens
- **API Integration**: Auto-generated TypeScript API client
- **Docker Support**: Production-ready Docker configuration
- **Type Safety**: Full TypeScript support with strict type checking

## 📋 Prerequisites

- Node.js 20+ or Bun
- npm, yarn, pnpm, or bun
- Docker & Docker Compose (for containerized deployment)

## 🛠️ Installation

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/iCubeDevTeam/Denso_PCReforming_Frontend.git
cd Denso_PCReforming_Frontend
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

2. Run in detached mode:
```bash
docker-compose up -d
```

3. View logs:
```bash
docker-compose logs -f
```

4. Stop containers:
```bash
docker-compose down
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
.
├── app/                      # Next.js app directory
│   ├── (app)/               # Protected routes
│   │   ├── dashboard/
│   │   ├── tag/
│   │   ├── security/
│   │   └── ...
│   ├── (public)/            # Public routes (login, register, etc.)
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── features/            # Feature-specific components
│   ├── layout/              # Layout components
│   └── custom-component/    # Custom reusable components
├── lib/                     # Utilities and libraries
│   ├── api/                 # API client and generated types
│   ├── auth/                # Authentication utilities
│   ├── services/            # Service functions
│   └── utils.ts             # Helper functions
├── hooks/                   # Custom React hooks
├── store/                   # State management (Zustand)
├── public/                  # Static assets
├── docs/                    # Documentation
└── docker-compose.yml       # Docker Compose configuration
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# API Generation
npm run generate:api     # Generate TypeScript API client from OpenAPI spec
```

## 🐳 Docker Configuration

### Dockerfile
- Multi-stage build for optimized production images
- Node.js 20 Alpine base image
- Standalone Next.js output for minimal image size

### docker-compose.yml
- Service configuration for frontend
- Port mapping: 3000:3000
- Custom network setup
- Auto-restart policy

### .dockerignore
- Excludes unnecessary files from Docker build context
- Reduces build time and image size

## 🎨 Theming

The application supports custom theming with:
- Multiple color schemes
- Light/Dark mode
- Customizable radius and scale
- Persistent theme preferences

Access theme customizer from the sidebar.

## 🔐 Authentication

- JWT-based authentication
- Secure token storage in HTTP-only cookies
- Role-based access control
- Permission-based routing
- Automatic token refresh

## 📡 API Integration

API client is auto-generated from OpenAPI specifications:

```bash
# Generate API client
npm run generate:api
```

Generated files are located in `lib/api/generated/`

## 🧪 Environment Variables

Required environment variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE=http://localhost:8080
API_BASE_URL=http://localhost:8080

# Add other environment variables as needed
```

## 🚢 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Docker Production

```bash
docker-compose up -d
```

### Vercel Deployment

The application can be deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/iCubeDevTeam/Denso_PCReforming_Frontend)

## 📚 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **React**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Tables**: [TanStack Table](https://tanstack.com/table/latest)
- **Charts**: [Recharts](https://recharts.org/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **API Generation**: [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen)

## 🔍 Key Features

### Tag Management
- Tag configuration and monitoring
- Tag relation management
- Real-time tag value updates
- Data visualization

### Security
- User management
- Role and permission management
- Group management
- Token provider management

### Integration
- Interface configuration
- Provider and publisher setup
- Event monitoring
- Scheduler configuration

### Data Management
- Tag value editor
- Relation value editor
- Bulk operations
- Import/Export functionality

## 📝 Development Notes

### Next.js 15 Changes

This project uses Next.js 15 with the following considerations:

- `searchParams` and `params` are now Promises in page components
- API route handlers receive params as Promises
- TypeScript strict mode enabled
- ESLint and TypeScript errors can be ignored during builds (configured in `next.config.ts`)

### Code Generation

API client is generated from OpenAPI spec. Do not manually edit files in `lib/api/generated/`.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software owned by iCube Dev Team.

## 👥 Team

Developed by [iCube Dev Team](https://github.com/iCubeDevTeam)

## 📞 Support

For support and questions, please contact the development team.

---

**Note**: This is a production application. Always follow security best practices and keep dependencies up to date.
