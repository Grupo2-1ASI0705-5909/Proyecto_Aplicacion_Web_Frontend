# 🚀 Guía de Instalación y Configuración - PulsePay Frontend

Esta guía detalla los pasos necesarios para configurar el entorno de desarrollo y ejecutar el proyecto Frontend de PulsePay.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:

1.  **Node.js**: Versión 18.13.0 o superior (Recomendado v20 LTS).
    *   Descargar: [https://nodejs.org/](https://nodejs.org/)
    *   Verificar instalación: `node -v` y `npm -v`
2.  **Angular CLI**: Herramienta de línea de comandos para Angular.
    *   Instalación global: `npm install -g @angular/cli`
    *   Verificar instalación: `ng version`

---

## 🛠️ Instalación del Proyecto

Sigue estos pasos una vez hayas clonado o descargado el repositorio:

1.  **Navegar al directorio del proyecto:**
    ```bash
    cd FRONTEND
    ```

2.  **Instalar dependencias:**
    Este comando leerá el archivo `package.json` e instalará todas las librerías necesarias automáticamente.
    ```bash
    npm install
    ```

---

## 📦 Librerías y Dependencias Utilizadas

El proyecto utiliza las siguientes tecnologías y librerías clave. Al ejecutar `npm install`, todas estas se instalan automáticamente, pero aquí se detallan para referencia:

### **Core**
*   **Angular v19**: Framework principal.
*   **RxJS**: Programación reactiva (Observables).
*   **TypeScript**: Lenguaje base.

### **UI & Diseño**
*   **Angular Material** (`@angular/material`): Componentes visuales (Cards, Inputs, Buttons, Sidenav, etc.).
*   **Angular CDK** (`@angular/cdk`): Herramientas de desarrollo de componentes.
*   **Angular Animations** (`@angular/animations`): Sistema de animaciones.

### **Seguridad & Utilidades**
*   **Auth0 Angular JWT** (`@auth0/angular-jwt`): Manejo y decodificación de tokens JWT para la autenticación.

---

## ▶️ Ejecutar el Proyecto

Para levantar el servidor de desarrollo:

1.  **Comando estándar:**
    ```bash
    ng serve
    ```
    O alternativamente:
    ```bash
    npm start
    ```

2.  **Acceder a la aplicación:**
    Abre tu navegador y ve a: [http://localhost:4200/](http://localhost:4200/)

---

## ⚠️ Solución de Problemas Comunes

### **Error: `ng` no se reconoce como un comando interno**
*   **Solución:** Asegúrate de haber instalado Angular CLI globalmente (`npm install -g @angular/cli`) y que las variables de entorno de tu sistema estén configuradas correctamente. Si no quieres instalarlo globalmente, usa `npm start` en su lugar.

### **Error de compatibilidad de versiones (Node/Angular)**
*   **Solución:** Este proyecto usa Angular 19. Asegúrate de que tu versión de Node.js sea compatible (v18.13.0+ o v20+).

### **Errores de dependencias tras `git pull`**
*   **Solución:** Si alguien agrega una nueva librería, es posible que tu proyecto falle. Siempre ejecuta `npm install` después de bajar cambios del repositorio.

---

## 🏗️ Comandos Útiles

*   **Generar componente:** `ng g c nombre-componente`
*   **Generar servicio:** `ng g s nombre-servicio`
*   **Construir para producción:** `ng build` (genera la carpeta `dist/`)
