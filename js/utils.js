// Utilidades para mostrar mensajes de error y éxito en formularios

export function mostrarError(idCampo, mensaje) {
  const errorDiv = document.getElementById(`error-${idCampo}`);
  if (errorDiv) {
    errorDiv.textContent = mensaje;
    const input = document.getElementById(idCampo);
    if (input) input.setAttribute('aria-describedby', `error-${idCampo}`);
    if (input) input.style.borderColor = '#e53935';
  }
}

export function limpiarErrores(campos) {
  campos.forEach(id => {
    const errorDiv = document.getElementById(`error-${id}`);
    if (errorDiv) errorDiv.textContent = '';
    const input = document.getElementById(id);
    if (input) input.removeAttribute('aria-describedby');
    if (input) input.style.borderColor = '';
  });
}

export function mostrarExito(mensaje) {
  let exitoDiv = document.getElementById('mensaje-exito-global');
  if (!exitoDiv) {
    exitoDiv = document.createElement('div');
    exitoDiv.id = 'mensaje-exito-global';
    exitoDiv.className = 'mensaje-exito';
    document.body.prepend(exitoDiv);
  }
  exitoDiv.textContent = mensaje;
  exitoDiv.style.display = 'block';
  setTimeout(() => {
    exitoDiv.style.display = 'none';
  }, 3000);
} 