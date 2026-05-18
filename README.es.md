<div align="center">
  <img src="docs/logo.png" alt="UniMentor Logo" width="180"/>
  <h1>UniMentor</h1>
</div>

<p align="center">
  <strong>Plataforma de Mentorías Universitarias</strong> — Marketplace que conecta estudiantes con egresados para orientación profesional.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript_5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5.8"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS 4"/>
  <img src="https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6"/>
  <img src="https://img.shields.io/badge/InsForge-3ECF8E?style=for-the-badge&logo=insforge&logoColor=white" alt="InsForge"/>
</p>

> 📄 Leer en: [English](README.md) | **Español**

---

## Tabla de Contenidos

- [Qué Hace](#qué-hace)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Licencia](#licencia)

---

## Qué Hace

UniMentor es una plataforma EdTech que facilita la conexión entre estudiantes universitarios y egresados dispuestos a brindar mentoría profesional. Los estudiantes encuentran orientación sobre su carrera, mientras que los egresados comparten su experiencia y fortalecen la comunidad universitaria.

**Línea de producto:** Plataformas Educativas (EdTech) — Ingeniería de Software II.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **UI Framework** | React 19 |
| **Lenguaje** | TypeScript 5.8 |
| **Estilos** | Tailwind CSS 4 |
| **Build Tool** | Vite 6 |
| **Backend / BaaS** | InsForge (Postgres, Auth, Storage) |

---

## Arquitectura

El proyecto sigue la metodología **Atomic Design**, organizando los componentes en cuatro capas claramente separadas:

```
src/
├── components/
│   ├── atoms/          # Componentes base (bloques primitivos)
│   ├── molecules/      # Unidades de UI compuestas
│   ├── organisms/      # Componentes de funcionalidad compleja
│   └── screens/        # Páginas completas
├── services/           # Lógica de negocio y acceso a datos
├── hooks/              # Hooks personalizados
├── utils/              # Funciones utilitarias
├── types/              # Interfaces de TypeScript
├── backend/            # Cliente de InsForge
├── theme/              # Configuración del tema
└── main.tsx            # Punto de entrada de la app
```

### Vista previa

| Landing Page | Búsqueda de Mentores | Perfil de Mentor |
|:---:|:---:|:---:|
| ![Landing](docs/mockups/landing-page.png) | ![Search](docs/mockups/mentor-search.png) | ![Profile](docs/mockups/mentor-profile.png) |

---

## Instalación

### Requisitos

- Node.js 18+ y npm
- Una cuenta en [InsForge](https://insforge.dev) (el plan gratuito funciona)
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/AFB-9898/UniMentor.git
cd UniMentor
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto (ver [Variables de Entorno](#variables-de-entorno)).

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Corre en `http://localhost:5173`

### 5. Build para producción

```bash
npm run build    # Genera en dist/
npm run preview  # Vista previa del build de producción
```

---

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_INSFORGE_URL=https://your-project.insforge.dev
VITE_INSFORGE_PUBLISHABLE_KEY=sb_publishable_your-key-here
```

---

## Estructura del Proyecto

```
UniMentor/
├── public/
│   └── favicon.png
├── docs/
│   ├── logo.png
│   ├── mockups/
│   ├── componentes/
│   ├── arquitectura/
│   └── refactorizacion/
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── screens/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   ├── backend/
│   ├── theme/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── LICENSE
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── README.es.md
```

---

## Licencia

Este proyecto está licenciado bajo la licencia MIT — ver el archivo [LICENSE](LICENSE) para más detalles.
