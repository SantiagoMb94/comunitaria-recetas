import { mostrarError, limpiarErrores } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('form-receta');
  const modal = document.getElementById('modal-exito');

  if (!formulario) return;

  // === Validaciones en vivo por campo ===
  formulario.querySelectorAll('input, textarea, select').forEach((campo) => {
    campo.addEventListener('blur', () => {
      if (!campo.value.trim()) {
        campo.style.borderColor = '#dc3545';
      } else {
        campo.style.borderColor = '';
      }
    });
  });

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const campos = ['titulo', 'autor', 'imagen', 'categoria', 'ingredientes', 'preparacion'];
    limpiarErrores(campos);

    const titulo = document.getElementById('titulo').value.trim();
    const autor = document.getElementById('autor').value.trim();
    const imagen = document.getElementById('imagen').value.trim();
    const categoria = document.getElementById('categoria').value;
    const ingredientes = document.getElementById('ingredientes').value.trim().split('\n').filter(l => l.trim());
    const preparacion = document.getElementById('preparacion').value.trim().split('\n').filter(l => l.trim());

    let hayError = false;

    if (titulo.length < 3) {
      mostrarError('titulo', 'El título debe tener al menos 3 caracteres.');
      hayError = true;
    }
    if (autor.length < 2) {
      mostrarError('autor', 'El autor debe tener al menos 2 caracteres.');
      hayError = true;
    }
    if (!categoria) {
      mostrarError('categoria', 'Por favor, selecciona una categoría.');
      hayError = true;
    }
    if (ingredientes.length === 0) {
      mostrarError('ingredientes', 'Debes agregar al menos un ingrediente.');
      hayError = true;
    }
    if (preparacion.length === 0) {
      mostrarError('preparacion', 'Debes agregar al menos un paso de preparación.');
      hayError = true;
    }
    if (imagen && !esURLValida(imagen)) {
      mostrarError('imagen', 'La URL de la imagen no es válida.');
      hayError = true;
    }
    const recetas = await obtenerRecetas();
    const existe = recetas.some(r => r.titulo.trim().toLowerCase() === titulo.toLowerCase());
    if (existe) {
      mostrarError('titulo', 'Ya existe una receta con este título. Por favor usa otro nombre.');
      hayError = true;
    }
    if (hayError) return;

    // === Objeto receta ===
    const nuevaReceta = {
      titulo,
      autor,
      imagen: imagen || 'https://via.placeholder.com/300x200?text=Sin+imagen',
      categoria,
      ingredientes,
      preparacion
    };

    await guardarRecetaUsuario(nuevaReceta);

    formulario.reset();
    mostrarModalExito(modal);
  });
});

// === Funciones auxiliares ===
function esURLValida(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

function mostrarModalExito(modal) {
  if (!modal) return;
  modal.classList.remove('oculto');
  setTimeout(() => {
    modal.classList.add('oculto');
    window.location.href = 'index.html';
  }, 2000);
}
