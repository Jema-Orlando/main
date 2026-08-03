document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxTitle = lightbox ? lightbox.querySelector('.lightbox-title') : null;
  const lightboxTag = lightbox ? lightbox.querySelector('.lightbox-tag') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  // --- 1. Gallery Filtering Logic ---
  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle Active Class on buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        // Filter cards
        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          // If category matches filter or filter is 'all'
          if (filterValue === 'all' || category.split(' ').includes(filterValue)) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300); // match transition speed
          }
        });
      });
    });
  }

  // --- 2. Lightbox Logic ---
  if (lightbox && galleryItems.length > 0) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('.gallery-img-wrap img');
        const title = item.querySelector('.gallery-info h4');
        const categoryLabel = item.querySelector('.gallery-info p');

        if (img && lightboxImg) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          if (lightboxTitle && title) lightboxTitle.textContent = title.textContent;
          if (lightboxTag && categoryLabel) lightboxTag.textContent = categoryLabel.textContent;

          // Open Modal
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden'; // Lock screen scroll
        }
      });
    });

    // Close Modal
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Release scroll
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close on clicking backdrop overlay (not content)
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on ESC key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
});
