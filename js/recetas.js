const STORAGE_KEY = 'recetasUsuario';

// === Cargar recetas ===
async function cargarRecetasDelSistema() {
  try {
    const response = await fetch('data/recetas.json');
    if (!response.ok) throw new Error('No se pudo cargar recetas.json');
    return await response.json();
  } catch (error) {
    console.error('Error al cargar recetas del sistema:', error);
    return [];
  }
}

function cargarRecetasDelUsuario() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function guardarRecetaUsuario(receta) {
  const recetasUsuario = cargarRecetasDelUsuario();
  receta.id = Date.now();
  recetasUsuario.push(receta);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recetasUsuario));
}

function editarRecetaUsuario(id, datosActualizados) {
  const recetas = cargarRecetasDelUsuario();
  const index = recetas.findIndex(r => r.id === id);
  if (index === -1) return false;

  recetas[index] = { ...recetas[index], ...datosActualizados };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recetas));
  return true;
}

function eliminarRecetaUsuario(id) {
  const recetas = cargarRecetasDelUsuario();
  const nuevas = recetas.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevas));
}

// === Obtener combinadas ===
async function obtenerRecetas() {
  const sistema = await cargarRecetasDelSistema();
  const usuario = cargarRecetasDelUsuario();

  const combinadas = [...usuario, ...sistema];
  const idsUnicos = new Set();
  return combinadas.filter(r => {
    if (idsUnicos.has(r.id)) return false;
    idsUnicos.add(r.id);
    return true;
  });
}

// === Favoritos ===
function obtenerFavoritos() {
  return JSON.parse(localStorage.getItem('favoritos')) || [];
}

function guardarFavoritos(lista) {
  localStorage.setItem('favoritos', JSON.stringify(lista));
}

function toggleFavorito(id) {
  let favoritos = obtenerFavoritos();
  favoritos = favoritos.includes(id)
    ? favoritos.filter(fav => fav !== id)
    : [...favoritos, id];
  guardarFavoritos(favoritos);
}

// === Mostrar recetas en el index ===
async function mostrarRecetas() {
  const contenedor = document.getElementById('recetas-list');
  if (!contenedor) return;

  const recetas = await obtenerRecetas();
  const favoritos = obtenerFavoritos();

  contenedor.innerHTML = '';
  recetas.forEach(receta => {
    const esFavorita = favoritos.includes(receta.id);
    const card = document.createElement('article');
    card.className = 'receta-card';
    card.innerHTML = `
      <button class="btn-favorito" data-id="${receta.id}" title="Marcar como favorita">
        ${esFavorita ? '⭐' : '☆'}
      </button>
      <img src="${receta.imagen}" alt="Imagen de ${receta.titulo}" loading="lazy" />
      <h4>${receta.titulo}</h4>
      <p class="categoria-label">${receta.categoria}</p>
      <a class="btn" href="receta.html?id=${receta.id}">Ver receta</a>
    `;
    contenedor.appendChild(card);
  });

  document.querySelectorAll('.btn-favorito').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      toggleFavorito(id);
      mostrarRecetas();
    });
  });
}

// === Mostrar detalle receta ===
async function mostrarDetalleReceta() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  if (!id) return;

  const receta = (await obtenerRecetas()).find(r => r.id === id);
  if (!receta) return;

  document.querySelector('.receta-titulo').textContent = receta.titulo;

  const categoria = document.createElement('p');
  categoria.textContent = `Categoría: ${receta.categoria}`;
  categoria.classList.add('categoria-label');
  document.querySelector('.receta-titulo').insertAdjacentElement('afterend', categoria);

  if (receta.autor) {
    const autor = document.createElement('p');
    autor.innerHTML = `<strong>Autor:</strong> ${receta.autor}`;
    document.querySelector('.receta-titulo').insertAdjacentElement('afterend', autor);
  }

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

  const recetasUsuario = cargarRecetasDelUsuario();
  const esEditable = recetasUsuario.some(r => r.id === receta.id);

  if (esEditable) {
    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar receta';
    btnEditar.className = 'btn';
    document.getElementById('detalle-receta').appendChild(btnEditar);
    btnEditar.addEventListener('click', () => mostrarFormularioEdicion(receta));

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar receta';
    btnEliminar.className = 'btn btn-reset';
    document.getElementById('detalle-receta').appendChild(btnEliminar);
    btnEliminar.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
        eliminarRecetaUsuario(receta.id);
        alert('Receta eliminada con éxito.');
        window.location.href = 'index.html';
      }
    });
  }
}

// === Formulario de edición ===
function mostrarFormularioEdicion(receta) {
  const contenedor = document.getElementById('detalle-receta');
  contenedor.innerHTML = `
    <h2 style="margin-bottom: 1.5rem;">Editar receta</h2>
    <form id="form-editar" class="formulario-receta">
      <div class="form-group">
        <label for="edit-titulo">Título</label>
        <input type="text" id="edit-titulo" value="${receta.titulo}" required />
      </div>

      <div class="form-group">
        <label for="edit-autor">Autor</label>
        <input type="text" id="edit-autor" value="${receta.autor || ''}" required />
      </div>

      <div class="form-group">
        <label for="edit-imagen">URL de imagen</label>
        <input type="url" id="edit-imagen" value="${receta.imagen}" />
      </div>

      <div class="form-group">
        <label for="edit-categoria">Categoría</label>
        <select id="edit-categoria">
          <option ${receta.categoria === 'Desayuno' ? 'selected' : ''}>Desayuno</option>
          <option ${receta.categoria === 'Almuerzo' ? 'selected' : ''}>Almuerzo</option>
          <option ${receta.categoria === 'Cena' ? 'selected' : ''}>Cena</option>
          <option ${receta.categoria === 'Postre' ? 'selected' : ''}>Postre</option>
          <option ${receta.categoria === 'Bebida' ? 'selected' : ''}>Bebida</option>
        </select>
      </div>

      <hr style="margin: 2rem 0; border: none; border-top: 1px solid var(--color-gris-claro);" />

      <div class="form-group">
        <label for="edit-ingredientes">Ingredientes (uno por línea)</label>
        <textarea id="edit-ingredientes" rows="5">${receta.ingredientes.join('\n')}</textarea>
      </div>

      <div class="form-group">
        <label for="edit-preparacion">Pasos de preparación (uno por línea)</label>
        <textarea id="edit-preparacion" rows="6">${receta.preparacion.join('\n')}</textarea>
      </div>

      <button type="submit" class="btn">Guardar cambios</button>
    </form>
  `;

  document.getElementById('form-editar').addEventListener('submit', (e) => {
    e.preventDefault();

    const editada = {
      titulo: document.getElementById('edit-titulo').value.trim(),
      autor: document.getElementById('edit-autor').value.trim(),
      imagen: document.getElementById('edit-imagen').value.trim() || 'https://via.placeholder.com/300x200?text=Sin+imagen',
      categoria: document.getElementById('edit-categoria').value,
      ingredientes: document.getElementById('edit-ingredientes').value.trim().split('\n').filter(l => l),
      preparacion: document.getElementById('edit-preparacion').value.trim().split('\n').filter(l => l)
    };

    const exito = editarRecetaUsuario(receta.id, editada);
    if (exito) {
      alert('Receta actualizada con éxito.');
      location.reload();
    } else {
      alert('Error al actualizar receta.');
    }
  });
}

// === Agregar receta desde formulario ===
document.addEventListener('DOMContentLoaded', () => {
  mostrarRecetas();
  mostrarDetalleReceta();
  const modal = document.getElementById('modal-exito');
  const form = document.getElementById('form-receta');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const nueva = {
        titulo: document.getElementById('titulo').value.trim(),
        autor: document.getElementById('autor').value.trim(),
        imagen: document.getElementById('imagen').value.trim() || 'https://via.placeholder.com/300x200?text=Sin+imagen',
        categoria: document.getElementById('categoria').value,
        ingredientes: document.getElementById('ingredientes').value.trim().split('\n').filter(Boolean),
        preparacion: document.getElementById('preparacion').value.trim().split('\n').filter(Boolean)
      };

      if (nueva.titulo.length < 3 || nueva.autor.length < 3) {
        alert('El título y el autor deben tener al menos 3 caracteres.');
        return;
      }
      

      guardarRecetaUsuario(nueva);
      form.reset();

      if (modal) {
        modal.classList.remove('oculto');

        setTimeout(() => {
          modal.classList.add('oculto');
          window.location.href = 'index.html';
        }, 2000);
      }
    });
  }
});

// === Comentarios por receta ===

function obtenerComentariosPorReceta(idReceta) {
  const comentarios = JSON.parse(localStorage.getItem('comentariosRecetas')) || {};
  return comentarios[idReceta] || [];
}

function guardarComentario(idReceta, nombre, texto) {
  const comentarios = JSON.parse(localStorage.getItem('comentariosRecetas')) || {};
  if (!comentarios[idReceta]) comentarios[idReceta] = [];

  comentarios[idReceta].push({
    nombre: nombre.trim(),
    texto: texto.trim(),
    fecha: new Date().toLocaleString()
  });

  localStorage.setItem('comentariosRecetas', JSON.stringify(comentarios));
}

function mostrarComentarios(idReceta) {
  const lista = document.getElementById('lista-comentarios');
  if (!lista) return;

  const comentarios = obtenerComentariosPorReceta(idReceta);
  lista.innerHTML = '';

  if (comentarios.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Aún no hay comentarios. ¡Sé el primero!';
    lista.appendChild(li);
    return;
  }

  comentarios.forEach(comentario => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${comentario.nombre}</strong>: ${comentario.texto}
      <small>${comentario.fecha}</small>
    `;
    lista.appendChild(li);
  });
}

function configurarFormularioComentarios(idReceta) {
  const form = document.getElementById('form-comentario');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre-comentario').value;
    const texto = document.getElementById('comentario-texto').value;

    if (!nombre || !texto) return alert('Debes completar ambos campos.');

    guardarComentario(idReceta, nombre, texto);
    mostrarComentarios(idReceta);

    form.reset();
  });
}
