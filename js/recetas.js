// Clave para guardar en localStorage
const STORAGE_KEY = 'recetasComunitarias';

// Carga recetas desde localStorage o crea una base inicial
function obtenerRecetas() {
  const datos = localStorage.getItem(STORAGE_KEY);
  if (datos) return JSON.parse(datos);

  // Recetas por defecto si no hay datos guardados
  const recetasBase = [
    {
      id: 1,
      titulo: 'Arepas rellenas de queso',
      imagen: 'https://example.com/arepa.jpg',
      ingredientes: ['2 tazas de harina de maíz', 'Agua tibia', 'Sal', 'Queso rallado'],
      preparacion: ['Mezclar harina y agua', 'Formar arepas', 'Rellenar con queso', 'Asar hasta dorar']
    }
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(recetasBase));
  return recetasBase;
}

// Guarda una nueva receta
function guardarReceta(receta) {
  const recetas = obtenerRecetas();
  receta.id = Date.now(); // ID único con timestamp
  recetas.push(receta);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recetas));
}

// Renderiza recetas en index.html
function mostrarRecetas() {
  const contenedor = document.getElementById('recetas-list');
  if (!contenedor) return;

  const recetas = obtenerRecetas();
  contenedor.innerHTML = '';

  recetas.forEach(receta => {
    const card = document.createElement('article');
    card.className = 'receta-card';
    card.innerHTML = `
     <img src="${receta.imagen}" alt="Imagen de ${receta.titulo}" />
    <h4>${receta.titulo}</h4>
    <p class="categoria-label">${receta.categoria}</p>
    <a class="btn" href="receta.html?id=${receta.id}">Ver receta</a>
    `;
    contenedor.appendChild(card);
  });
}

// Carga una receta en receta.html
function mostrarDetalleReceta() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  if (!id) return;

  const receta = obtenerRecetas().find(r => r.id === id);
  if (!receta) return;

  document.querySelector('.receta-titulo').textContent = receta.titulo;
  const categoria = document.createElement('p');
    categoria.textContent = `Categoría: ${receta.categoria}`;
    categoria.classList.add('categoria-label');
    document.querySelector('.receta-titulo').insertAdjacentElement('afterend', categoria);
    document.querySelector('.receta-descripcion').textContent = receta.descripcion || 'Descripción no disponible.'; 
  document.querySelector('.receta-imagen').src = receta.imagen;
  document.querySelector('.receta-imagen').alt = `Imagen de ${receta.titulo}`;

  const ul = document.getElementById('lista-ingredientes');
  receta.ingredientes.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });

  const ol = document.getElementById('lista-pasos');
  receta.preparacion.forEach(paso => {
    const li = document.createElement('li');
    li.textContent = paso;
    ol.appendChild(li);
  });
}

// Ejecutar automáticamente según el archivo
document.addEventListener('DOMContentLoaded', () => {
  mostrarRecetas();
  mostrarDetalleReceta();
});
