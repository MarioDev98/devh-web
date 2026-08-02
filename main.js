document.addEventListener('DOMContentLoaded', () => {
  let allProducts = [];
  let currentFilter = 'all';
  let currentSearchQuery = '';
  let visibleCount = 6; // Límite de productos iniciales
  const itemsPerPage = 6;

  const productGrid = document.getElementById('product-grid');
  const searchInput = document.getElementById('search-input');
  const filterBtns = document.querySelectorAll('.btn-filter');
  const btnLoadMore = document.getElementById('btn-load-more');

  // 1. Cargar datos del JSON
  fetch('productos.json')
    .then(response => response.json())
    .then(data => {
      allProducts = data;
      renderProducts();
    })
    .catch(error => console.error('Error al cargar productos:', error));

  // 2. Escuchar entrada del buscador
  searchInput.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value.toLowerCase().trim();
    visibleCount = itemsPerPage; // Resetear vista
    renderProducts();
  });

  // 3. Escuchar clic en los botones de filtro
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      visibleCount = itemsPerPage; // Resetear vista
      renderProducts();
    });
  });

  // 4. Escuchar clic en "Ver más productos"
  btnLoadMore.addEventListener('click', () => {
    visibleCount += itemsPerPage;
    renderProducts();
  });

  // Función principal para filtrar y renderizar las tarjetas
  function renderProducts() {
    // Filtrar por categoría y búsqueda
    const filteredProducts = allProducts.filter(product => {
      const matchesCategory = (currentFilter === 'all') || (product.categoria === currentFilter);
      const matchesSearch = product.titulo.toLowerCase().includes(currentSearchQuery) || 
                            product.descripcion.toLowerCase().includes(currentSearchQuery);
      return matchesCategory && matchesSearch;
    });

    // Limpiar grid
    productGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
      productGrid.innerHTML = `<div class="text-center py-5"><p class="text-muted fs-5">No se encontraron productos que coincidan.</p></div>`;
      btnLoadMore.style.display = 'none';
      return;
    }

    // Cortar array según límite visible
    const productsToShow = filteredProducts.slice(0, visibleCount);

    // Generar HTML de cada card
    productsToShow.forEach(product => {
      const cardCol = document.createElement('div');
      cardCol.className = 'col-md-6 col-lg-4 product-item';

      let imageHTML = '';

      // Si tiene más de una imagen, genera un carrusel Bootstrap
      if (product.imagenes.length > 1) {
        const carouselId = `carouselProduct${product.id}`;
        let indicators = '';
        let items = '';

        product.imagenes.forEach((imgSrc, idx) => {
          indicators += `<button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${idx}" class="${idx === 0 ? 'active' : ''}"></button>`;
          items += `
            <div class="carousel-item ${idx === 0 ? 'active' : ''} h-100">
              <img src="${imgSrc}" class="d-block w-100 product-img" alt="${product.titulo}">
            </div>`;
        });

        imageHTML = `
          <div id="${carouselId}" class="carousel slide card-img-wrapper" data-bs-ride="false">
            <div class="carousel-indicators">${indicators}</div>
            <div class="carousel-inner h-100">${items}</div>
            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
            </button>
          </div>`;
      } else {
        // Una sola imagen
        imageHTML = `
          <div class="card-img-wrapper">
            <img src="${product.imagenes[0]}" class="card-img-top product-img" alt="${product.titulo}">
          </div>`;
      }

      cardCol.innerHTML = `
        <div class="card h-100 border-0 shadow-sm product-card">
          ${imageHTML}
          <div class="card-body d-flex flex-column">
            <span class="text-uppercase text-muted small mb-1">${product.categoria}</span>
            <h5 class="card-title fw-bold">${product.titulo}</h5>
            <p class="card-text text-muted small flex-grow-1">${product.descripcion}</p>
            <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
              <span class="fs-5 fw-bold text-dark">${product.precio}</span>
              <a href="#contacto" class="btn btn-sm btn-outline-dark rounded-pill px-3">Consultar</a>
            </div>
          </div>
        </div>`;

      productGrid.appendChild(cardCol);
    });

    // Controlar visibilidad del botón "Ver más"
    if (visibleCount >= filteredProducts.length) {
      btnLoadMore.style.display = 'none';
    } else {
      btnLoadMore.style.display = 'inline-block';
    }
  }
});