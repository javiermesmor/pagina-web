<div align="center">

# 🚀 Portfolio Personal

<p align="center">
  <em>Desarrollador Multiplataforma • Cloud & System Administration</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Activo-success?style=for-the-badge&logo=none" alt="Status">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
</p>

<p align="center">
  <a href="#-sobre-el-proyecto">Sobre el proyecto</a> •
  <a href="#%EF%B8%8F-tecnolog%C3%ADas">Tecnologías</a> •
  <a href="#-caracter%C3%ADsticas-destacadas">Características</a> •
  <a href="#-estructura-del-proyecto">Estructura</a> •
  <a href="#-ejecuci%C3%B3n-y-despliegue">Ejecución</a> •
  <a href="#%EF%B8%8F-roadmap--mejoras-futuras">Roadmap</a>
</p>

</div>

---

## 💡 Sobre el proyecto

Portfolio personal diseñado para presentar mi perfil profesional, trayectoria, herramientas favoritas y proyectos, ofreciendo además una experiencia interactiva, accesible y fluida para cualquier visitante.

---

## 🛠️ Tecnologías

Este proyecto está construido utilizando tecnologías modernas y ligeras para garantizar el máximo rendimiento:

| Categoría | Tecnologías |
| :--- | :--- |
| **Frontend Base** | HTML5, CSS3, JavaScript Vanilla |
| **Estilos & UI** | Tailwind CSS (CDN), Font Awesome, Google Fonts (*Inter*) |
| **Lógica & Servicios** | EmailJS (envío de correos desde modal), LocalStorage |

---

## ✨ Características Destacadas

* 🌐 **Multilenguaje:** Selector dinámico de idiomas integrado con soporte para **Español, Inglés, Francés, Japonés y Chino Simplificado**.
* 🌓 **Temas Dinámicos:** Soporte completo para modo claro y oscuro con persistencia automática de la preferencia en `localStorage`.
* 🎮 **Easter Egg Exclusivo:** Sorpresa oculta integrada mediante el código Konami.
* ⚡ **Experiencia Interactiva & UI:** 
  * Portada con presentación animada y frases motivacionales aleatorias al cargar.
  * Tarjetas interactivas de herramientas (VS Code, MySQL Workbench, Kali Linux, Docker, Git, VirtualBox).
  * Carrusel de proyectos, galerías de imágenes integradas y visor/descarga de currículum en PDF.
  * Formulario de contacto en ventana modal.
  * Animaciones de entrada, contadores, carga diferida de imágenes y efecto *parallax*.
  * Adaptabilidad total a dispositivos móviles con navegación suave y compatibilidad con preferencias de movimiento reducido.

---

## 📂 Estructura del Proyecto

```text
.
├── api/
│   └── enviar-correo.js      # Lógica del servidor para el envío de correos
├── 404.html                  # Página personalizada para rutas no encontradas
├── assets/
│   ├── images/               # Recursos gráficos e imágenes
│   └── pdf/                  # Archivo del currículum vitae en PDF
├── css/
│   └── styles.css            # Estilos personalizados y ajustes de UI
├── js/
│   ├── i18n.js               # Sistema de traducción e internacionalización
│   └── main.js               # Lógica principal, animaciones e interacciones
├── index.html                # Estructura principal de la web
└── README.md                 # Documentación del repositorio
```

---

## 🚀 Ejecución y Despliegue

Al tratarse de una interfaz estática que consume recursos externos vía CDN, puedes probarla de forma local sin necesidad de compilación:

1. Clona el repositorio en tu máquina local.
2. Sirve la carpeta raíz utilizando un servidor local (como la extensión *Live Server* en VS Code) o abre directamente el archivo `index.html` en tu navegador.

> 🔒 **Nota de seguridad:** El formulario utiliza un endpoint del servidor para enviar mensajes. Si despliegas la aplicación, configura las credenciales necesarias únicamente en el almacén de secretos del proveedor. No añadas credenciales, datos de contacto privados ni otros datos personales al repositorio.

---

## 🗺️ Roadmap & Mejoras Futuras

- **Filtros de proyectos por tecnología o categoría:** Para facilitar la localización de trabajos específicos.
-  **Páginas de detalle por proyecto:** Vistas dedicadas explicando retos, decisiones técnicas, capturas y demos.
- **Comprobaciones automáticas:** Pruebas de accesibilidad, rendimiento e interacciones principales.
- **Sección de artículos / notas técnicas:** Publicaciones centradas en desarrollo y administración de sistemas.
- **Analítica respetuosa con la privacidad:** Medición de visitas sin recopilación masiva de datos personales.

---

<div align="center">
  <small>Desarrollado con 💻 para presentar mi trayectoria profesional</small>
</div>
