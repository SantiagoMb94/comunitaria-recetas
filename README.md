# 🍽️ Recetas Gourmet

## 📄 Descripción

Este proyecto fue desarrollado en el marco de la asignatura **PSP - Proceso de Software Personal**.  
Es una aplicación web moderna, funcional y adaptable que permite a los usuarios **consultar, agregar, editar y eliminar recetas de cocina**, explorándolas por categorías y visualizándolas de manera dinámica e intuitiva.

Además, se ha optimizado para mejorar la experiencia del usuario con **modo oscuro, animaciones suaves, validaciones en tiempo real y diseño responsive**.

---

## 🛠 Tecnologías empleadas

<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" />
</div>

---

## ✨ Principales características

- ✅ **Agregar recetas** con título, imagen, ingredientes, pasos y categoría.
- ✏️ **Editar recetas** creadas por el usuario directamente desde el detalle.
- 🗑️ **Eliminar recetas** con confirmación visual.
- 📂 **Almacenamiento separado** entre recetas base del sistema y las del usuario (`recetas.json` + `localStorage`).
- 📊 **Gráfico dinámico** de distribución por categoría con **Chart.js**, animado y con colores personalizados.
- 🌙 **Modo oscuro automático y manual**, persistente entre sesiones.
- ⚡ **Interfaz responsiva** adaptada para escritorio y dispositivos móviles.
- 🧼 **Validaciones inteligentes**: longitud mínima, estructura, duplicados, URL válidas.
- 🔍 **Buscador con filtros** por título y categoría.
- 🎉 **Modal de éxito** al guardar una receta y prevención de duplicados.

---

## 🧱 Estructura del proyecto

```plaintext
recetas-gourmet/
├── index.html
├── agregar.html
├── receta.html
├── categorias.html
├── css/
│   ├── variables.css
│   └── styles.css
├── js/
│   ├── recetas.js
│   ├── categorias.js
│   ├── validaciones.js
│   └── main.js
├── data/
│   └── recetas.json
├── assets/
│   └── img/  (opcional para imágenes locales)
└── README.md


```
🚀 Cómo ejecutar el proyecto
Debido al uso de fetch() para cargar archivos locales (data/recetas.json), necesitas ejecutar el proyecto en un servidor local:

# Con Python 3
python -m http.server
Luego abre en tu navegador:
http://localhost:8000/index.html


📌 Estado actual y extensiones futuras
Este proyecto está preparado para crecer. Algunas funcionalidades consideradas para versiones futuras:

📥 Importar recetas desde archivo .json (opcional, actualmente omitido).

📤 Exportar recetas del usuario a archivo .json.

☁️ Conexión con base de datos en la nube (Firebase o Supabase).

🧩 Modal personalizado de confirmación.

🔐 Autenticación de usuarios y modo administrador oculto.

🛜 Conversión a aplicación PWA para uso sin conexión.

👨‍💻 Créditos
Desarrollado por los estudiantes del grupo B07-6 del Politécnico Grancolombiano como parte de la entrega del escenario 3 del curso PSP.
