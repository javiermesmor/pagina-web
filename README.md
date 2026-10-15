# Portfolio web

Portfolio personal para presentar mi perfil como desarrollador multiplataforma, mi trayectoria, mis herramientas favoritas y mis proyectos, además de ofrecer una vía de contacto profesional.

## Tecnologías

- HTML5 y CSS3
- JavaScript vanilla
- Tailwind CSS mediante CDN
- Font Awesome
- Google Fonts (Inter)
- EmailJS para el envío del formulario de contacto

## Funcionalidades

- Portada con presentación animada y una cita motivadora aleatoria al cargar.
- Selector de idioma para español, inglés, francés, japonés y chino simplificado.
- Tema claro y oscuro, con preferencia guardada en `localStorage`.
- Secciones de perfil, trayectoria, estadísticas, herramientas favoritas y proyectos.
- Tarjetas animadas de herramientas: VS Code, MySQL Workbench, Kali Linux, Docker, Git y VirtualBox.
- Carrusel de proyectos y galerías de imágenes.
- Visor y descarga del currículum en PDF.
- Formulario de contacto en una ventana modal.
- Navegación adaptable a móviles y desplazamiento suave entre secciones.
- Animaciones de entrada, contadores, carga diferida de imágenes y efecto parallax.
- Botón para volver al inicio y compatibilidad con la preferencia de movimiento reducido.
- Easter egg con el código Konami.

## Estructura del proyecto

```text
.
├── api/
│   └── enviar-correo.js
├── assets/
│   ├── images/
│   └── pdf/
├── css/
│   └── styles.css
├── js/
│   ├── i18n.js
│   └── main.js
├── index.html
└── README.md
```

## Ejecución y despliegue

La interfaz es una web estática y utiliza recursos externos cargados desde CDN. Para probarla, sirve la carpeta raíz con un servidor web local o ábrela en el navegador.

El formulario utiliza un endpoint del servidor para enviar mensajes. Si lo despliegas, configura las credenciales necesarias únicamente en el almacén de secretos del proveedor. No añadas credenciales, datos de contacto privados ni otros datos personales al repositorio.

## Mejoras futuras

- **[ ] Filtros de proyectos por tecnología o categoría**, para encontrar trabajos con más facilidad.
- **[ ] Páginas de detalle para cada proyecto**, con retos, decisiones técnicas, capturas y enlaces a demos.
- **[ ] Comprobaciones automáticas de accesibilidad y rendimiento**, e integración de pruebas básicas para las interacciones principales.
- **[ ] Sección de artículos o notas técnicas**, con publicaciones sobre desarrollo y administración de sistemas.
- **[ ] Analítica respetuosa con la privacidad**, para conocer las visitas sin recopilar más datos de los necesarios.# Portfolio web

Portfolio personal para presentar mi perfil como desarrollador multiplataforma, mi trayectoria, mis herramientas favoritas y mis proyectos, además de ofrecer una vía de contacto profesional.

## Tecnologías

- HTML5 y CSS3
- JavaScript vanilla
- Tailwind CSS mediante CDN
- Font Awesome
- Google Fonts (Inter)
- EmailJS para el envío del formulario de contacto

## Funcionalidades

- Portada con presentación animada y una cita motivadora aleatoria al cargar.
- Selector de idioma para español, inglés, francés, japonés y chino simplificado.
- Tema claro y oscuro, con preferencia guardada en `localStorage`.
- Secciones de perfil, trayectoria, estadísticas, herramientas favoritas y proyectos.
- Tarjetas animadas de herramientas: VS Code, MySQL Workbench, Kali Linux, Docker, Git y VirtualBox.
- Carrusel de proyectos y galerías de imágenes.
- Visor y descarga del currículum en PDF.
- Formulario de contacto en una ventana modal.
- Navegación adaptable a móviles y desplazamiento suave entre secciones.
- Animaciones de entrada, contadores, carga diferida de imágenes y efecto parallax.
- Botón para volver al inicio y compatibilidad con la preferencia de movimiento reducido.
- Easter egg con el código Konami.

## Estructura del proyecto

```text
.
├── api/
│   └── enviar-correo.js
├── assets/
│   ├── images/
│   └── pdf/
├── css/
│   └── styles.css
├── js/
│   ├── i18n.js
│   └── main.js
├── index.html
└── README.md
```

## Ejecución y despliegue

La interfaz es una web estática y utiliza recursos externos cargados desde CDN. Para probarla, sirve la carpeta raíz con un servidor web local o ábrela en el navegador.

El formulario utiliza un endpoint del servidor para enviar mensajes. Si lo despliegas, configura las credenciales necesarias únicamente en el almacén de secretos del proveedor. No añadas credenciales, datos de contacto privados ni otros datos personales al repositorio.

## Mejoras futuras

- **[ ] Filtros de proyectos por tecnología o categoría**, para encontrar trabajos con más facilidad.
- **[ ] Páginas de detalle para cada proyecto**, con retos, decisiones técnicas, capturas y enlaces a demos.
- **[ ] Comprobaciones automáticas de accesibilidad y rendimiento**, e integración de pruebas básicas para las interacciones principales.
- **[ ] Sección de artículos o notas técnicas**, con publicaciones sobre desarrollo y administración de sistemas.
- **[ ] Analítica respetuosa con la privacidad**, para conocer las visitas sin recopilar más datos de los necesarios.



