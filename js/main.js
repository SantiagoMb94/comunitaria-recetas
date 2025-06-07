// === TEMA CLARO/OSCURO UNIVERSAL ===
const toggleBtn = document.getElementById('toggle-tema');
const body = document.body;

function aplicarTema(tema) {
  if (tema === 'oscuro') {
    body.classList.add('tema-oscuro');
  } else {
    body.classList.remove('tema-oscuro');
  }
  localStorage.setItem('tema', tema);
}

function alternarTema() {
  const temaActual = body.classList.contains('tema-oscuro') ? 'oscuro' : 'claro';
  const nuevoTema = temaActual === 'oscuro' ? 'claro' : 'oscuro';
  aplicarTema(nuevoTema);
}

function detectarTemaSistema() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'oscuro'
    : 'claro';
}

function inicializarTema() {
  const temaGuardado = localStorage.getItem('tema');
  const temaInicial = temaGuardado || detectarTemaSistema();
  aplicarTema(temaInicial);
  if (toggleBtn) {
    toggleBtn.addEventListener('click', alternarTema);
  }
}

// === VERIFICAR SOPORTE LOCALSTORAGE ===
function almacenamientoDisponible() {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.warn('localStorage no disponible');
    return false;
  }
}

// === BUSCADOR Y FILTRO DE CATEGORÍAS (Index) ===
function inicializarBuscadorYFiltro() {
  const inputBuscar = document.getElementById('buscador-recetas');
  const filtroCategoria = document.getElementById('filtro-categoria');
  const contenedor = document.getElementById('recetas-list');

  if (!inputBuscar || !filtroCategoria || !contenedor) return;

  inputBuscar.addEventListener('input', filtrarRecetas);
  filtroCategoria.addEventListener('change', filtrarRecetas);

  async function filtrarRecetas() {
    const termino = inputBuscar.value.toLowerCase();
    const categoria = filtroCategoria.value;
    const recetas = await obtenerRecetas();

    const filtradas = recetas.filter(r => {
      const coincideNombre = r.titulo.toLowerCase().includes(termino);
      const coincideCategoria = !categoria || r.categoria === categoria;
      return coincideNombre && coincideCategoria;
    });

    contenedor.innerHTML = '';

    if (filtradas.length === 0) {
      contenedor.innerHTML = '<p>No se encontraron recetas.</p>';
      return;
    }

    filtradas.forEach(receta => {
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
}

// === BOTÓN LIMPIAR RECETAS DEL USUARIO ===
function manejarBotonLimpiar() {
  const btnLimpiar = document.getElementById('btn-limpiar-recetas');
  const modal = document.getElementById('modal-confirmacion');
  const confirmarBtn = document.getElementById('confirmar-limpieza');
  const cancelarBtn = document.getElementById('cancelar-limpieza');

  if (!btnLimpiar || !modal || !confirmarBtn || !cancelarBtn) return;

  btnLimpiar.addEventListener('click', () => {
    modal.classList.remove('oculto');
  });

  confirmarBtn.addEventListener('click', () => {
    localStorage.removeItem('recetasUsuario');
    location.reload();
  });

  cancelarBtn.addEventListener('click', () => {
    modal.classList.add('oculto');
  });
}


// === DETECTAR Y CARGAR SEGÚN PÁGINA ===
document.addEventListener('DOMContentLoaded', () => {
  if (!almacenamientoDisponible()) {
    alert('Tu navegador no soporta almacenamiento local. Algunas funciones no estarán disponibles.');
    return;
  }

  inicializarTema();
  inicializarBuscadorYFiltro();
  manejarBotonLimpiar();
});
