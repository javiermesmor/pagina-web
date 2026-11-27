 <div align="center">

# 🚀 Portfolio Personal

**Desarrollador Multiplataforma • Cloud & System Administration**

[![Portfolio](https://img.shields.io/badge/Portfolio-Visitar_Web-2563EB?style=for-the-badge&logo=vercel&logoColor=white)](https://javiermesoneromoro.vercel.app)
![Status](https://img.shields.io/badge/Status-Activo-success?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.19-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

[Sobre el proyecto](#-sobre-el-proyecto) •
[ Tecnologías](#️-stack-tecnológico) •
[Características](#-características) •
[Estructura](#-estructura-del-proyecto) •
[Instalación](#-instalación-y-desarrollo-local) •
[Despliegue](#-despliegue-en-vercel) •
[Roadmap](#️-roadmap)

</div>

---

## 💡 Sobre el proyecto

Portfolio personal desarrollado para presentar mi perfil profesional, trayectoria, conocimientos técnicos y proyectos.

El objetivo es ofrecer una experiencia web moderna, interactiva y adaptable a diferentes dispositivos, combinando tecnologías web nativas con herramientas de desarrollo actuales.

El proyecto está construido con **HTML5, CSS3 y JavaScript Vanilla**, utilizando Tailwind CSS para agilizar el desarrollo de interfaces y Node.js para gestionar su proceso de compilación.

🌐 **[Visitar portfolio](https://javiermesoneromoro.vercel.app)**

---

## 🛠️ Stack tecnológico

El proyecto utiliza una arquitectura ligera, sin frameworks frontend adicionales, apoyándose en herramientas especializadas para los estilos y los servicios externos.

| Categoría | Tecnologías |
|---|---|
| Estructura web | HTML5 |
| Estilos | CSS3, Tailwind CSS 3.4.19 |
| Programación | JavaScript Vanilla (ES Modules) |
| Entorno de desarrollo | Node.js, npm |
| Iconografía | Font Awesome |
| Tipografía | Google Fonts (Inter) |
| Internacionalización | JavaScript |
| Persistencia local | LocalStorage |
| Servicio de correo | EmailJS mediante endpoint API |
| Control de versiones | Git, GitHub |
| Hosting y despliegue | Vercel |

### ⚙️ Gestión de estilos con Tailwind CSS

Tailwind CSS está instalado como dependencia de desarrollo mediante npm.

La compilación se realiza localmente utilizando su CLI y una configuración personalizada (`tailwind.config.js`).

Se utilizan dos scripts:

- `npm run dev`: inicia la compilación en modo vigilancia, detectando cambios en los archivos del proyecto.
- `npm run build`: genera una versión optimizada y minificada de la hoja de estilos.

---

## ✨ Características

### 🌐 Internacionalización
- Interfaz disponible en cinco idiomas:
  - Español.
  - Inglés.
  - Francés.
  - Japonés.
  - Chino simplificado.
- Selector dinámico de idioma.
- Sistema de traducciones centralizado.

### 🌓 Personalización visual
- Modo claro y oscuro.
- Persistencia de preferencias mediante `localStorage`.
- Diseño responsive para diferentes tamaños de pantalla.
- Compatibilidad con preferencias de movimiento reducido.

### ⚡ Experiencia interactiva
- Portada con presentación animada.
- Frases motivacionales aleatorias.
- Tarjetas interactivas de herramientas y tecnologías.
- Carrusel de proyectos.
- Galerías de imágenes integradas.
- Contadores y animaciones de entrada.
- Carga diferida de imágenes (*lazy loading*).
- Efecto parallax.
- Navegación fluida entre secciones.

### 📄 Recursos profesionales
- Visualización del currículum en PDF.
- Descarga del currículum.
- Formulario de contacto mediante ventana modal.
- Endpoint propio para gestionar el envío de mensajes.

### 🎮 Easter Egg
- Código Konami integrado como elemento oculto de interacción.

---

## 📂 Estructura del proyecto

```text
pagina-web/
│
├── api/
│   └── enviar-correo.js       # Endpoint para el envío de correos
│
├── assets/
│   ├── images/                # Recursos gráficos e imágenes
│   └── pdf/                   # Documentación y currículum
│
├── css/
│   ├── styles.css             # Estilos personalizados
│   ├── tailwind-input.css     # Archivo de entrada de Tailwind
│   └── tailwind.css           # CSS generado por Tailwind
│
├── js/
│   ├── i18n.js                # Sistema de internacionalización
│   └── main.js                # Lógica e interacciones principales
│
├── index.html                 # Página principal
├── 404.html                   # Página de error personalizada
│
├── package.json               # Dependencias y scripts npm
├── package-lock.json          # Bloqueo de versiones
├── tailwind.config.js         # Configuración de Tailwind CSS
├── vercel.json                # Configuración del despliegue
│
└── README.md                  # Documentación del proyecto
```

---

## 🚀 Instalación y desarrollo local

### Requisitos previos

Antes de comenzar, necesitas tener instalados:

- [Node.js](https://nodejs.org/)
- npm (incluido con Node.js).
- Git.

### 1. Clonar el repositorio

```bash
git clone https://github.com/javiermesmor/pagina-web.git
```

Accede al directorio:

```bash
cd pagina-web
```

### 2. Instalar dependencias

```bash
npm install
```

Este comando instala las dependencias definidas en `package.json`, incluyendo Tailwind CSS.

### 3. Iniciar el entorno de desarrollo

```bash
npm run dev
```

Este comando inicia la compilación de Tailwind CSS en modo vigilancia (`--watch`), actualizando los estilos cuando detecta cambios en los archivos configurados.

Para visualizar la página, utiliza un servidor web local, por ejemplo, **Live Server** en Visual Studio Code.

### 4. Generar la versión de producción

Cuando quieras generar los estilos optimizados para producción, ejecuta:

```bash
npm run build
```

Este proceso compila y minifica el CSS generado en `css/tailwind.css`.

---

## ☁️ Despliegue en Vercel

El proyecto está desplegado en Vercel y conectado con su repositorio de GitHub.

El flujo de despliegue permite mantener actualizada la página mediante nuevas versiones del código.

### Configuración

- **Repositorio:** GitHub.
- **Plataforma:** Vercel.
- **Rama principal:** `main`.
- **Configuración adicional:** `vercel.json`.

El archivo `vercel.json` incorpora configuraciones relacionadas con:

- URLs limpias (`cleanUrls`).
- Cabeceras HTTP de seguridad.
- Políticas de caché para recursos estáticos.
- Configuración de comportamiento de los recursos de la aplicación.

### Variables de entorno

El endpoint de contacto necesita la configuración correspondiente para comunicarse con el servicio de correo.

Las credenciales y claves necesarias deben configurarse mediante variables de entorno en Vercel, sin incluir secretos directamente en el código fuente.

---

## 🔒 Seguridad y buenas prácticas

El proyecto incorpora diferentes medidas de configuración orientadas a mejorar la seguridad y el rendimiento:

- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy` para restringir determinadas capacidades del navegador.
- `X-Frame-Options: SAMEORIGIN`.
- Políticas de caché diferenciadas para recursos estáticos.
- Separación del endpoint de contacto respecto al código del frontend.
- Gestión de credenciales mediante variables de entorno.

---

## 🗺️ Roadmap

Estas son algunas de las mejoras previstas para futuras versiones:

- [ ] Incorporar filtros de proyectos por tecnología y categoría.
- [ ] Crear páginas individuales para documentar cada proyecto.
- [ ] Añadir pruebas automatizadas de accesibilidad y funcionamiento.
- [ ] Incorporar una sección de artículos y notas técnicas.
- [ ] Mejorar las métricas de rendimiento y optimización.
- [ ] Integrar analítica respetuosa con la privacidad.

---

## 👨‍💻 Autor

**Javier Mesonero Moro**

Desarrollador Multiplataforma con interés en desarrollo web, administración de sistemas, Cloud Computing, ciberseguridad y automatización.

- 🌐 [Portfolio personal](https://javiermesoneromoro.vercel.app)
- 💻 [GitHub](https://github.com/javiermesmor)

---

<div align="center">

**Desarrollado con 💻, dedicación y pasión por la tecnología.**

⭐ Si te gusta el proyecto, puedes dejar una estrella en el repositorio.

</div>