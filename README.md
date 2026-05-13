# Mansehra Sport Arena Frontend

> A modern, responsive frontend application for Mansehra Sport Arena built with **Nuxt 3**, **Vue 3**, and **TypeScript**.

![Vue](https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vuedotjs)
![Nuxt](https://img.shields.io/badge/Nuxt-3-00DC82?style=flat-square&logo=nuxt.js)
![TypeScript](https://img.shields.io/badge/TypeScript-17.7%25-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## 🎯 Overview

Mansehra Sport Arena Frontend is a cutting-edge web application designed to provide an exceptional user experience for sports enthusiasts. The application leverages modern web technologies and best practices to deliver a fast, scalable, and maintainable solution.

## ✨ Features

- ⚡ **Lightning-fast Performance** - Optimized for speed with Nuxt 3's hybrid rendering
- 📱 **Fully Responsive Design** - Works seamlessly across all devices and screen sizes
- 🎨 **Modern UI/UX** - Clean and intuitive interface with excellent user experience
- 🔒 **Type-Safe Development** - Full TypeScript support for robust code quality
- 🔄 **Server-Side Rendering** - Improved SEO and initial page load performance
- 📦 **Auto-importing Components** - Nuxt's built-in component auto-discovery
- 🛠️ **Development Tools** - Integrated hot module replacement and debugging
- 🎭 **Composable Architecture** - Reusable logic with Vue 3 Composition API

## 🏗️ Tech Stack

### Frontend Framework
- **[Nuxt 3](https://nuxt.com/)** - The intuitive Vue framework for any scale
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[TypeScript](https://www.typescriptlang.org/)** - Typed superset of JavaScript

### Styling
- **CSS3** - Modern styling with responsive design
- **[Tailwind CSS](https://tailwindcss.com/)** (optional) - Utility-first CSS framework
- **SCSS/SASS** (optional) - CSS preprocessor support

### Development Tools
- **[Vite](https://vitejs.dev/)** - Next generation frontend tooling
- **[Node.js](https://nodejs.org/)** - JavaScript runtime
- **[npm](https://www.npmjs.com/)** - Package manager

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required
- **Node.js** - Version 18.0.0 or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version` and `npm --version`

### Recommended
- **Git** - Version 2.0 or higher (for version control)
- **Visual Studio Code** - With recommended extensions
  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Vue 3 language support
  - [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## 📦 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/umairmujtaba987/msa.git
cd msa
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

Or using pnpm:
```bash
pnpm install
```

### Step 3: Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Configure your environment variables as needed:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# Application Configuration
VITE_APP_NAME=Mansehra Sport Arena
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_LOGGING=true
```

## 🚀 Development

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Development with Additional Options

```bash
# With debug output
npm run dev -- --debug

# On specific port
npm run dev -- --port 8080
```

### Hot Module Replacement (HMR)

Changes to your Vue files, components, and styles will automatically reflect in the browser without full page reload.

### Available Development Commands

```bash
# Run development server with file watching
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type check
npm run typecheck

# Lint code (if configured)
npm run lint

# Format code with Prettier (if configured)
npm run format
```

## 🔨 Build & Deployment

### Production Build

```bash
npm run build
```

This command:
- Bundles and optimizes all assets
- Generates optimized JavaScript and CSS
- Creates a `.output` directory with the production build

### Preview Production Build

```bash
npm run preview
```

This allows you to test the production build locally before deploying.

### Generate Static Site (Optional)

For static site generation:

```bash
npm run generate
```

This creates a fully static version of your site in the `dist` directory.

### Deployment Options

#### 1. **Vercel** (Recommended for Nuxt)
```bash
npm i -g vercel
vercel
```

#### 2. **Netlify**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

#### 3. **Docker**
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
```

Build and run:
```bash
docker build -t msa-frontend .
docker run -p 3000:3000 msa-frontend
```

#### 4. **Traditional Server (Node.js)**
```bash
# Build the app
npm run build

# Transfer .output folder to server
# On server, install dependencies
npm ci --production

# Start the server
node .output/server/index.mjs
```

## 📁 Project Structure

```
msa/
├── app.vue                 # Root component
├── nuxt.config.ts          # Nuxt configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
│
├── components/             # Reusable Vue components (auto-imported)
│   ├── Header.vue
│   ├── Footer.vue
│   └── ...
│
├── pages/                  # Page components (auto-routed)
│   ├── index.vue           # Home page
│   ├── about.vue           # About page
│   └── ...
│
├── layouts/                # Layout components
│   ├── default.vue
│   └── ...
│
├── composables/            # Reusable composition functions
│   ├── useAuth.ts
│   ├── useFetch.ts
│   └── ...
│
├── utils/                  # Utility functions
│   ├── constants.ts
│   ├── helpers.ts
│   └── ...
│
├── public/                 # Static assets
│   ├── images/
│   ├── fonts/
│   └── ...
│
├── assets/                 # Dynamic assets (processed by build tool)
│   ├── styles/
│   ├── images/
│   └── ...
│
├── server/                 # Server routes (if using Nitro)
│   └── api/
│
├── middleware/             # Route middleware
│   └── ...
│
├── plugins/                # Vue plugins and setup
│   └── ...
│
└── dist/                   # Production build output (generated)
```

## ⚙️ Configuration

### Nuxt Configuration

Edit `nuxt.config.ts` to customize:

```typescript
export default defineNuxtConfig({
  // Modules
  modules: [
    // '@nuxt/ui',  // UI framework
    // '@pinia/nuxt', // State management
  ],

  // Styling
  css: ['~/assets/styles/main.css'],

  // Runtime config
  runtimeConfig: {
    apiSecret: '',
    public: {
      apiBase: process.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    },
  },

  // Nitro (Server) configuration
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/sitemap.xml', '/feed.xml'],
    },
  },

  // Build options
  build: {
    transpile: ['any-external-library'],
  },

  // Development server
  devServer: {
    port: 3000,
    host: 'localhost',
  },
})
```

### TypeScript Configuration

The project includes `tsconfig.json` with strict mode enabled. Adjust as needed in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  typescript: {
    strict: true,
    // tsconfig: {
    //   compilerOptions: {
    //     strict: false,
    //   },
    // },
  },
})
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
   ```bash
   git clone https://github.com/umairmujtaba987/msa.git
   cd msa
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Write clear commit messages
   - Add tests if applicable

4. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues

### Code Style Guidelines

- Use TypeScript for type safety
- Follow Vue 3 Composition API patterns
- Use PascalCase for components
- Use camelCase for variables and functions
- Add meaningful comments for complex logic
- Keep components focused and reusable

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue: Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Issue: Port 3000 already in use
```bash
# Start on a different port
npm run dev -- --port 8080

# Or kill the process on port 3000
# macOS/Linux:
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### Issue: TypeScript errors in IDE
```bash
# Restart TypeScript server in VSCode
# Command Palette → TypeScript: Restart TS Server

# Or regenerate type definitions
npm run build
```

#### Issue: Components not found
- Ensure components are in the `components/` directory
- Clear `.nuxt` directory: `rm -rf .nuxt`
- Restart dev server

#### Issue: API calls failing
- Check `VITE_API_BASE_URL` in `.env.local`
- Verify backend is running
- Check browser network tab for CORS issues
- Ensure proper error handling in composables

### Getting Help

- 📚 [Nuxt Documentation](https://nuxt.com/docs)
- 💬 [Vue Community Discord](https://discord.com/invite/vue)
- 🐛 [Report Issues](https://github.com/umairmujtaba987/msa/issues)
- 💡 [GitHub Discussions](https://github.com/umairmujtaba987/msa/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

- **Project Maintainer**: [@umairmujtaba987](https://github.com/umairmujtaba987)
- **Issues**: [GitHub Issues](https://github.com/umairmujtaba987/msa/issues)
- **Discussions**: [GitHub Discussions](https://github.com/umairmujtaba987/msa/discussions)

---

<div align="center">

**Built with ❤️ for Mansehra Sport Arena**

⭐ If you find this project helpful, please consider giving it a star on [GitHub](https://github.com/umairmujtaba987/msa)

</div>
