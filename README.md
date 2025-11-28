# 💳 PulsePay - Frontend

<div align="center">

**Plataforma de gestión de pagos con criptomonedas**

[![Angular](https://img.shields.io/badge/Angular-19.2-DD0031?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Material](https://img.shields.io/badge/Material-UI-0081CB?logo=mui)](https://material.angular.io/)

</div>

---

## 📋 Descripción

**PulsePay** es una aplicación web moderna para la gestión de transacciones, billeteras digitales, criptomonedas y sistemas de pago. Diseñada con Angular 19 y Material Design, ofrece una interfaz intuitiva y profesional para administradores, comercios y clientes.

---

## ✨ Características Principales

### 🔐 **Autenticación y Seguridad**
- ✅ Login con JWT (JSON Web Tokens)
- ✅ Registro público de usuarios
- ✅ Recuperación de contraseña
- ✅ Guards de autenticación y autorización basados en roles
- ✅ Interceptor HTTP para manejo inteligente de errores
- ✅ Validación de expiración de token
- ✅ Cierre de sesión automático al expirar token

### 👥 **Gestión de Usuarios** (Solo Admin)
- ✅ Listar usuarios con paginación
- ✅ Crear nuevos usuarios
- ✅ Editar usuarios existentes
- ✅ Eliminar usuarios
- ✅ Validaciones de email y RUC
- ✅ Asignación de roles (Admin, Cliente, Comercio)

### 🏪 **Gestión de Comercios**
- ✅ Listar todos los comercios (Admin)
- ✅ Crear y editar comercios (Admin y Comercio)
- ✅ Ver detalles del comercio
- ✅ Validación asíncrona de RUC
- ✅ Gestión de información comercial

### 💸 **Operaciones y Transacciones**
- ✅ Crear transacciones
- ✅ Listar transacciones con filtros
- ✅ Ver detalles de transacciones
- ✅ Gestión de planes de pago
- ✅ Pago de cuotas
- ✅ Métodos de pago configurables
- ✅ Historial completo de operaciones

### 💰 **Finanzas y Cripto**
- ✅ Gestión de Wallets (billeteras)
- ✅ Ver saldo y transacciones de wallet
- ✅ Crear y editar wallets
- ✅ Listar criptomonedas disponibles
- ✅ Crear/editar criptomonedas (Solo Admin)
- ✅ Gestión de tipos de cambio (Solo Admin)
- ✅ Conversión de monedas

### 📊 **Dashboard Interactivo**
- ✅ KPIs principales (usuarios, transacciones, wallets)
- ✅ Actividad reciente
- ✅ Acciones rápidas
- ✅ Gráficos y estadísticas
- ✅ Vista personalizada por rol

### 🔔 **Sistema de Notificaciones**
- ✅ Notificaciones en tiempo real
- ✅ Historial de notificaciones
- ✅ Marcar como leídas/no leídas
- ✅ Snackbars para feedback instantáneo

### 🎨 **Diseño y UX**
- ✅ Material Design 3
- ✅ Sidebar responsivo con navegación por roles
- ✅ Tema personalizado PulsePay (naranja #FF8000)
- ✅ Animaciones suaves
- ✅ Diseño mobile-first
- ✅ Estados vacíos informativos
- ✅ Scrollbar personalizado

---

## 🗂️ Estructura del Proyecto

```
FRONTEND/
├── src/
│   ├── app/
│   │   ├── autenticador/           # Login, registro, recuperación
│   │   ├── component/
│   │   │   ├── comercio/           # Gestión de comercios
│   │   │   ├── dashboard/          # Dashboard principal
│   │   │   ├── finanzas/           # Wallets, cripto, tipos cambio
│   │   │   ├── operaciones/        # Transacciones, planes, métodos pago
│   │   │   ├── sistema/            # Notificaciones
│   │   │   └── usuario/            # Gestión de usuarios, perfil
│   │   ├── guard/                  # Guards de autorización
│   │   ├── interceptors/           # Interceptor HTTP
│   │   ├── model/                  # Interfaces y modelos
│   │   ├── service/                # Servicios HTTP
│   │   ├── validators/             # Validadores custom
│   │   ├── environment/            # Variables de entorno
│   │   ├── app.routes.ts           # Configuración de rutas
│   │   └── app.component.*         # Componente raíz con sidebar
│   ├── styles.css                  # Estilos globales
│   └── index.html
├── angular.json                    # Configuración de Angular
├── package.json                    # Dependencias
└── tsconfig.json                   # Configuración TypeScript
```

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Angular** | 19.2.19 | Framework principal |
| **TypeScript** | ~5.7.3 | Lenguaje de programación |
| **Angular Material** | ^19.0.0 | Componentes UI |
| **RxJS** | ~7.8.0 | Programación reactiva |
| **@auth0/angular-jwt** | ^6.0.0 | Manejo de JWT |
| **Zone.js** | ~0.15.0 | Change detection |

---

## 🚀 Instalación y Uso

### **Prerrequisitos**
- Node.js >= 18.x
- npm >= 9.x
- Angular CLI 19.x

### **Instalación**

```bash
# Clonar el repositorio
git clone https://github.com/Grupo2-1ASI0705-5909/Proyecto_Aplicacion_Web_Frontend.git

# Navegar al directorio
cd FRONTEND

# Instalar dependencias
npm install
```

### **Configuración**

Editar `src/app/environment/environment.ts` con las URLs del backend:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',  // URL base del backend
  loginUrl: 'http://localhost:8080/login'  // URL de login
};
```

### **Ejecutar en Desarrollo**

```bash
ng serve
```

Navegar a `http://localhost:4200/`

### **Build para Producción**

```bash
ng build --configuration production
```

Los archivos compilados estarán en `dist/`

---

## 🔑 Roles y Permisos

| Funcionalidad | Admin | Cliente | Comercio |
|---------------|:-----:|:-------:|:--------:|
| **Dashboard** | ✅ | ✅ | ✅ |
| **Perfil** | ✅ | ✅ | ✅ |
| **Usuarios (CRUD)** | ✅ | ❌ | ❌ |
| **Comercios (Listar)** | ✅ | ❌ | ❌ |
| **Comercios (Crear/Editar)** | ✅ | ❌ | ✅* |
| **Transacciones** | ✅ | ✅ | ✅ |
| **Planes de Pago** | ✅ | ✅ | ✅ |
| **Métodos de Pago** | ✅ | ✅ | ❌ |
| **Wallets** | ✅ | ✅ | ✅ |
| **Criptomonedas (Listar)** | ✅ | ✅ | ✅ |
| **Criptomonedas (CRUD)** | ✅ | ❌ | ❌ |
| **Tipos Cambio (Listar)** | ✅ | ✅ | ✅ |
| **Tipos Cambio (CRUD)** | ✅ | ❌ | ❌ |
| **Notificaciones** | ✅ | ✅ | ✅ |

*\* Comercio puede editar solo su propio comercio*

---

## 📡 Conexión con Backend

El frontend consume una API REST desarrollada en Spring Boot. 

### **Endpoints Principales**

```
Base URL: http://localhost:8080/api

POST   /login                      # Autenticación
POST   /usuarios                   # Crear usuario
GET    /usuarios                   # Listar usuarios
GET    /transacciones              # Listar transacciones
POST   /transacciones              # Crear transacción
GET    /wallets                    # Listar wallets
GET    /criptomonedas              # Listar criptomonedas
GET    /tipos-cambio               # Listar tipos de cambio
...
```

**Repositorio Backend**: [Proyecto_Aplicacion_Web_Backend](https://github.com/Grupo2-1ASI0705-5909/Proyecto_Aplicacion_Web_Backend)

---

## 🎯 Funcionalidades Destacadas

### **1. Sistema de Guards en Cascada**
```typescript
// seguridadGuard: Verifica si está logueado
// roleGuard: Verifica si tiene el rol necesario
canActivate: [seguridadGuard, roleGuard],
data: { roles: ['ADMIN', 'ADMINISTRADOR'] }
```

### **2. Interceptor HTTP Inteligente**
- Diferencia entre token expirado y falta de permisos
- Solo cierra sesión cuando el token está realmente expirado
- Manejo centralizado de errores HTTP (401, 403, 404, 500)

### **3. Validadores Asíncronos**
- Email único
- RUC único
- Validación en tiempo real contra el backend

### **4. Sidebar Dinámico**
- Se muestra/oculta automáticamente según autenticación
- Menú adaptado al rol del usuario
- Secciones expandibles

---

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm start              # ng serve

# Build
npm run build         # ng build
npm run watch         # ng build --watch

# Testing
npm test              # ng test
```

---

## 🐛 Mejoras Pendientes

### **Alta Prioridad**
- [ ] Implementar internacionalización (i18n) para múltiples idiomas
- [ ] Agregar tests unitarios (actualmente 0% cobertura)
- [ ] Agregar tests E2E con Cypress o Playwright
- [ ] Implementar lazy loading en módulos para mejorar rendimiento
- [ ] Agregar PWA (Progressive Web App) capabilities
- [ ] Implementar refresh token automático

### **Media Prioridad**
- [ ] Agregar gráficos con Chart.js o ApexCharts
- [ ] Implementar exportación a PDF/Excel de reportes
- [ ] Agregar filtros avanzados en listas
- [ ] Mejorar accesibilidad (ARIA labels, navegación teclado)
- [ ] Agregar modo oscuro (dark theme)
- [ ] Implementar notificaciones push
- [ ] Agregar búsqueda global en navbar

### **Baja Prioridad**
- [ ] Agregar animaciones más complejas
- [ ] Implementar drag & drop en tablas
- [ ] Agregar tooltips informativos
- [ ] Mejorar estados de carga (skeleton screens)
- [ ] Agregar tutorial interactivo para nuevos usuarios
- [ ] Implementar shortcuts de teclado

### **Optimizaciones Técnicas**
- [ ] Implementar OnPush change detection strategy
- [ ] Lazy load de imágenes
- [ ] Reducir bundle size (tree shaking)
- [ ] Implementar Service Workers
- [ ] Agregar error boundary global
- [ ] Implementar logs centralizados

### **Seguridad**
- [ ] Implementar Content Security Policy (CSP)
- [ ] Agregar rate limiting visual
- [ ] Implementar 2FA (autenticación de dos factores)
- [ ] Agregar logs de auditoría en frontend
- [ ] Sanitización mejorada de inputs

---

## 📸 Capturas de Pantalla

> *Próximamente: se agregarán capturas del dashboard, login, y principales funcionalidades*

---

## 👨‍💻 Equipo de Desarrollo

**Grupo 2 - 1ASI0705-5909**

Curso: Arquitectura de Aplicaciones Web

---

## 📄 Licencia

Este proyecto es parte de un trabajo académico.

---

## 🔗 Enlaces Relacionados

- [Repositorio Backend](https://github.com/Grupo2-1ASI0705-5909/Proyecto_Aplicacion_Web_Backend)
- [Angular Documentation](https://angular.dev)
- [Material Design](https://material.angular.io)

---

<div align="center">

**Hecho con ❤️ usando Angular**

</div>
