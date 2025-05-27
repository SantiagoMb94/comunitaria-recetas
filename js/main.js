// Resaltar el enlace activo en el menú
document.addEventListener('DOMContentLoaded', () => {
  const current = window.location.pathname.split('/').pop();
  const links = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

// Scroll al top si el usuario vuelve a dar clic en "Inicio"
document.querySelectorAll('a.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    const current = window.location.pathname.split('/').pop();

    if (href === current || (href === 'index.html' && current === '')) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});
