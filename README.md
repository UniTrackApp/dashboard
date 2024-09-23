<div align="center">

![unitrack-compressed](https://github.com/user-attachments/assets/dfaafa5d-691f-40c0-96e0-9d764341c426)

# 📊 UniTrack Dashboard - Attendance Monitoring Platform for Universities

<p>Easily track and analyze student attendance through a robust dashboard. Gain valuable insights and manage academic administration more effectively with powerful data analytics and visualizations.</p>

<a href="#-introduction">Introduction</a>
<span>&nbsp;&nbsp;✦&nbsp;&nbsp;</span>
<a href="#-features">Features</a>
<span>&nbsp;&nbsp;✦&nbsp;&nbsp;</span>
<a href="#-tech-stack">Tech Stack</a>
<span>&nbsp;&nbsp;✦&nbsp;&nbsp;</span>
<a href="#-directory-structure">Directory Structure</a>
<span>&nbsp;&nbsp;✦&nbsp;&nbsp;</span>
<a href="#-getting-started">Getting Started</a>
<span>&nbsp;&nbsp;✦&nbsp;&nbsp;</span>
<a href="#-roadmap">Roadmap</a>

![Next JS](https://img.shields.io/badge/Next.JS-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-black?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Prisma](https://img.shields.io/badge/Prisma-black?style=for-the-badge&logo=Prisma&logoColor=3982CE)
![tRPC](https://img.shields.io/badge/tRPC-black.svg?style=for-the-badge&logo=tRPC&logoColor=2596BE)
![TailwindCSS](https://img.shields.io/badge/tailwind-black?style=for-the-badge&logo=tailwind-css&logoColor=2338B2AC)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-black?style=for-the-badge&logo=shadcnui&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-black?style=for-the-badge&logo=Railway&logoColor=white)

</div>

## 📝 Introduction

UniTrack Dashboard is an admin tool for tracking and analyzing student attendance in universities. It offers a user-friendly interface for managing students, classes, and lectures, with detailed attendance analytics. Built with Next.js, Tailwind CSS, and Prisma.

## ✨ Features

- 🔍 **Attendance Analytics**: View visualizations and insights on university-wide attendance.
- 📊 **Data Tables**: Access, filter, and manage data for students, classes, and lectures.
- ⚙️ **Admin Controls**: Manage courses, users, and more with full control.
- 🛠️ **Real-Time Data**: Live updates for attendance metrics using React Query and tRPC.
- 📈 **Customizable Dashboards**: Tailor the platform to show the most relevant data to administrators.

## 🛠️ Tech Stack

- **[Next.js](https://nextjs.org/)** - Fullstack framework for server-side rendering and API routes
- **[React](https://react.dev/)** - UI framework with server components for dynamic UIs
- **[TypeScript](https://www.typescriptlang.org/)** - Strongly typed language for safer, maintainable code
- **[Prisma](https://www.prisma.io/)** - ORM for interacting with the database efficiently
- **[tRPC](https://trpc.io/)** - End-to-end type-safe API layer for smooth client-server communication
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework for rapid UI development
- **[Radix UI](https://www.radix-ui.com/)** - Modular and accessible UI components
- **[TanStack Table](https://tanstack.com/table/latest)** - Powerful table data management for UI
- **[Next-Auth.js](https://next-auth.js.org/)** - Authentication management
- **[Railway](https://railway.app/)** - Database hosting for scalable deployments

## 📂 Project Structure

```bash
.
├── .github              # GitHub Actions CI/CD workflows
│    └── workflows
│        ├── build       # Build the project on every push to the main branch
│        └── lint-pr     # Lint PR titles to enforce conventional commits
│
├── .vscode              # Recommended extensions and settings for VSCode
├── prisma               # Prisma schema and migrations
│
├── src                  # Main source code
│   ├── app              # Next.js App Router directory for pages and API routes
│   ├── components       # UI and shared components, with shadcn-ui
│   ├── lib              # Shared utility functions and hooks
│   ├── pages            # (deprecated) Next.js Pages Router directory
│   ├── server           # tRPC Routers, Prisma Client, and NextAuth server-side code
│   ├── styles           # Global styles, Tailwind CSS configuration, and custom font imports
│   └── env.mjs          # Type-safe environment variables using t3-env
│
├── .nvmrc               # Node Version Manager (nvm/fnm) file for setting a specific Node version
└── package.json         # Project metadata and dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js v16.x or higher
- PostgreSQL (or equivalent) database
- Vercel (optional for deployment)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/UniTrackApp/dashboard.git
cd dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables by copying `.env.example` to `.env` and adding your credentials:

```bash
cp .env.example .env
```

4. Apply database migrations:

```bash
npx prisma migrate dev
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## ✌️ Team

- [Aryan Prince](https://x.com/aryxnprince)
- [Andrea La Fauci De Leo](https://github.com/Bosurgi)
- [Lewis Johnson](https://github.com/lewisj576)

## 🎯 Roadmap

- [ ] Implement some advanced charts using Recharts and shadcn-ui charts
- [ ] Add multi-campus support
- [ ] Enable real-time student location tracking
- [ ] Expand data export capabilities (CSV, PDF)
- [ ] See [GitHub Issues](https://github.com/UniTrackApp/dashboard/issues?q=sort:updated-desc+is:issue+is:open) for more details and upcoming features

## 🔑 License

- [GNU GPLv3](https://github.com/UniTrackApp/dashboard/blob/main/COPYING).
