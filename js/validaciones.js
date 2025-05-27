document.getElementById('form-receta').addEventListener('submit', function (e) {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value.trim();
  const imagen = document.getElementById('imagen').value.trim();
  const ingredientes = document.getElementById('ingredientes').value.trim().split('\n');
  const preparacion = document.getElementById('preparacion').value.trim().split('\n');

  if (titulo && imagen && ingredientes.length > 0 && preparacion.length > 0) {
    guardarReceta({
      titulo,
      imagen,
      ingredientes,
      preparacion
    });

    document.getElementById('mensaje-exito').style.display = 'block';
    this.reset();
  } else {
    alert('Por favor completa todos los campos correctamente.');
  }
});
