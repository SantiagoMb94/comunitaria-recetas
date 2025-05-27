document.getElementById('form-receta').addEventListener('submit', function (e) {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value.trim();
  const imagen = document.getElementById('imagen').value.trim();
  const ingredientes = document.getElementById('ingredientes').value.trim().split('\n');
  const preparacion = document.getElementById('preparacion').value.trim().split('\n');
  const categoria = document.getElementById('categoria').value.trim();

  if (titulo && imagen && ingredientes.length > 0 && preparacion.length > 0 && categoria) {
    guardarReceta({
      titulo,
      imagen,
      ingredientes,
      preparacion,
      categoria
    });

    document.getElementById('mensaje-exito').style.display = 'block';
    this.reset();
  } else {
    alert('Por favor completa todos los campos correctamente.');
  }
});
