document.addEventListener('DOMContentLoaded', async () => {
  const contenedor = document.getElementById('categorias-list');
  const recetas = await obtenerRecetas(); // 👈 aquí estaba el problema

  const categorias = {};

  recetas.forEach(receta => {
    const categoria = receta.categoria || 'Sin Categoría';

    if (!categorias[categoria]) {
      categorias[categoria] = [];
    }

    categorias[categoria].push(receta);
  });

  Object.keys(categorias).forEach(nombre => {
    const seccion = document.createElement('section');
    seccion.classList.add('receta-card');

    seccion.innerHTML = `
      <h3>${nombre}</h3>
      <div class="recetas-grid">
        ${categorias[nombre]
          .map(
            r => `
          <article class="receta-card">
            <img src="${r.imagen}" alt="${r.titulo}" />
            <h4>${r.titulo}</h4>
            <p class="categoria-label">${r.categoria}</p>
            <a class="btn" href="receta.html?id=${r.id}">Ver receta</a>
          </article>
        `
          )
          .join('')}
      </div>
    `;

    contenedor.appendChild(seccion);
  });

  // Crear gráfico con Chart.js
  const nombresCategorias = Object.keys(categorias);
  const cantidades = nombresCategorias.map(c => categorias[c].length);

  const ctx = document.getElementById('graficoCategorias').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: nombresCategorias,
      datasets: [{
        label: 'Cantidad de recetas',
        data: cantidades,
        backgroundColor: 'rgba(139, 0, 0, 0.6)',
        borderColor: 'rgba(139, 0, 0, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: context => `${context.raw} receta(s)`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cantidad'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Categorías'
          }
        }
      }
    }
  });
});
