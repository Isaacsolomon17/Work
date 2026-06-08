// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
  });
}

// Search tab toggle
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Property card builder
function buildPropertyCard(p) {
  return `
    <div class="property-card" onclick="window.location='property.html?id=${p.id}'">
      <div class="property-image" style="background:linear-gradient(135deg,${p.color} 0%,${p.color}cc 100%)">
        <div class="property-image-text">
          <span>${p.name.charAt(0)}</span>
        </div>
        <div class="property-badges">
          <span class="badge ${p.tagClass}">${p.tag}</span>
          <span class="badge badge-type">${p.type.charAt(0).toUpperCase()+p.type.slice(1)}</span>
        </div>
      </div>
      <div class="property-body">
        <div class="property-status ${p.status === 'For Sale' ? 'status-sale' : 'status-lease'}">${p.status}</div>
        <h3 class="property-name">${p.name}</h3>
        <p class="property-address">📍 ${p.address}</p>
        <div class="property-meta">
          <span>📐 ${parseInt(p.size).toLocaleString()} sq ft</span>
          <span>🏗️ Built ${p.year}</span>
        </div>
        <div class="property-price">${p.price}</div>
        <div class="property-footer">
          <span class="property-link">View Details →</span>
        </div>
      </div>
    </div>
  `;
}

// Render featured (first 6) on homepage
const featuredGrid = document.getElementById('featuredGrid');
if (featuredGrid && typeof PROPERTIES !== 'undefined') {
  const featured = PROPERTIES.filter(p => p.tag === 'Featured').slice(0, 6);
  featuredGrid.innerHTML = featured.map(buildPropertyCard).join('');
}

// Render all properties on properties page
const allGrid = document.getElementById('allPropertiesGrid');
if (allGrid && typeof PROPERTIES !== 'undefined') {
  renderProperties(PROPERTIES);

  // Filter controls
  const filterBtns = document.querySelectorAll('[data-filter]');
  const searchInput = document.getElementById('propSearch');
  const statusFilter = document.getElementById('statusFilter');
  const sortSelect = document.getElementById('sortSelect');

  let activeType = 'all';

  function getFiltered() {
    let list = [...PROPERTIES];
    if (activeType !== 'all') list = list.filter(p => p.type === activeType);
    if (searchInput && searchInput.value.trim()) {
      const q = searchInput.value.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q));
    }
    if (statusFilter && statusFilter.value !== 'all') {
      list = list.filter(p => p.status === statusFilter.value);
    }
    if (sortSelect) {
      if (sortSelect.value === 'size-desc') list.sort((a,b) => parseInt(b.size.replace(/,/g,'')) - parseInt(a.size.replace(/,/g,'')));
      else if (sortSelect.value === 'size-asc') list.sort((a,b) => parseInt(a.size.replace(/,/g,'')) - parseInt(b.size.replace(/,/g,'')));
      else if (sortSelect.value === 'newest') list.sort((a,b) => b.year - a.year);
    }
    return list;
  }

  function renderProperties(list) {
    const countEl = document.getElementById('propCount');
    if (countEl) countEl.textContent = `${list.length} properties`;
    allGrid.innerHTML = list.length
      ? list.map(buildPropertyCard).join('')
      : '<p class="no-results">No properties match your search. Try adjusting filters.</p>';
  }

  function update() { renderProperties(getFiltered()); }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeType = btn.dataset.filter;
      update();
    });
  });
  if (searchInput) searchInput.addEventListener('input', update);
  if (statusFilter) statusFilter.addEventListener('change', update);
  if (sortSelect) sortSelect.addEventListener('change', update);

  // Handle URL param pre-filter
  const params = new URLSearchParams(window.location.search);
  if (params.get('type')) {
    const matchBtn = document.querySelector(`[data-filter="${params.get('type')}"]`);
    if (matchBtn) matchBtn.click();
  }
}

// Property detail page
const detailRoot = document.getElementById('propertyDetail');
if (detailRoot && typeof PROPERTIES !== 'undefined') {
  const id = parseInt(new URLSearchParams(window.location.search).get('id'));
  const p = PROPERTIES.find(x => x.id === id) || PROPERTIES[0];

  document.title = `${p.name} | Apex Commercial Realty`;

  detailRoot.innerHTML = `
    <div class="detail-hero" style="background:linear-gradient(135deg,${p.color} 0%,${p.color}aa 100%)">
      <div class="detail-hero-text">
        <span class="badge ${p.tagClass}">${p.tag}</span>
        <h1>${p.name}</h1>
        <p>📍 ${p.address}</p>
      </div>
    </div>
    <div class="container">
      <div class="detail-grid">
        <div class="detail-main">
          <div class="detail-card">
            <h2>Property Overview</h2>
            <p class="detail-desc">${p.description}</p>
            <div class="detail-specs">
              <div class="spec"><span class="spec-icon">📐</span><div><strong>${parseInt(p.size).toLocaleString()} sq ft</strong><span>Total Space</span></div></div>
              <div class="spec"><span class="spec-icon">🏢</span><div><strong>${p.floors}</strong><span>Floors</span></div></div>
              <div class="spec"><span class="spec-icon">🏗️</span><div><strong>${p.year}</strong><span>Year Built</span></div></div>
              <div class="spec"><span class="spec-icon">🚗</span><div><strong>${p.parking}</strong><span>Parking</span></div></div>
            </div>
          </div>
          <div class="detail-card">
            <h2>Amenities & Features</h2>
            <div class="amenity-list">
              ${p.amenities.map(a => `<span class="amenity-chip">✓ ${a}</span>`).join('')}
            </div>
          </div>
          <div class="detail-card">
            <h2>Location</h2>
            <div class="map-placeholder">
              <div class="map-pin">📍</div>
              <p>${p.address}</p>
              <p class="map-sub">Interactive map coming soon</p>
            </div>
          </div>
        </div>
        <div class="detail-sidebar">
          <div class="sidebar-card price-card">
            <div class="sidebar-status ${p.status === 'For Sale' ? 'status-sale' : 'status-lease'}">${p.status}</div>
            <div class="sidebar-price">${p.price}</div>
            <div class="sidebar-size">${parseInt(p.size).toLocaleString()} sq ft</div>
            <a href="contact.html?property=${encodeURIComponent(p.name)}" class="btn btn-primary btn-block">Schedule a Tour</a>
            <a href="contact.html?property=${encodeURIComponent(p.name)}&type=info" class="btn btn-outline btn-block">Request Info</a>
            <div class="sidebar-divider"></div>
            <div class="sidebar-contact">
              <strong>Your Broker</strong>
              <div class="broker-info">
                <div class="broker-avatar">JM</div>
                <div>
                  <p>James Monroe</p>
                  <a href="tel:+15551234567">(555) 123-4567</a>
                </div>
              </div>
            </div>
          </div>
          <div class="sidebar-card">
            <h4>Similar Properties</h4>
            <div class="similar-list">
              ${PROPERTIES.filter(x => x.type === p.type && x.id !== p.id).slice(0,3).map(s => `
                <a href="property.html?id=${s.id}" class="similar-item">
                  <div class="similar-dot" style="background:${s.color}"></div>
                  <div>
                    <strong>${s.name}</strong>
                    <span>${s.price}</span>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
      <a href="properties.html" class="btn btn-outline back-btn">← Back to All Properties</a>
    </div>
  `;
}

// Contact form pre-fill
const propInput = document.getElementById('propertyInterest');
if (propInput) {
  const params = new URLSearchParams(window.location.search);
  if (params.get('property')) propInput.value = params.get('property');
}

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type=submit]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      contactForm.innerHTML = `
        <div class="form-success">
          <div class="success-icon">✓</div>
          <h3>Message Received!</h3>
          <p>Thank you for reaching out. A member of our team will contact you within 24 hours.</p>
        </div>
      `;
    }, 1200);
  });
}

// Animate on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.property-card, .category-card, .testimonial-card, .feature').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});
