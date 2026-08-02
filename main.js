// Filtro dinámico de categorías sin recargar la página
document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.btn-filter');
  const productItems = document.querySelectorAll('.product-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remover clase active de todos los botones
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      productItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
});