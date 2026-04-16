// Navigation
var pages = ['home','services','gallery','about','booking','contact','login','dashboard'];
function showPage(n) {
  pages.forEach(function(p) {
    var pg = document.getElementById('page-'+p);
    if (pg) pg.classList.remove('active');
    var b = document.getElementById('nav-'+p);
    if (b) b.classList.remove('active');
  });
  var pg = document.getElementById('page-'+n);
  if (pg) pg.classList.add('active');
  var b = document.getElementById('nav-'+n);
  if (b) b.classList.add('active');
  window.scrollTo({top:0, behavior:'smooth'});
  if (n === 'gallery') renderGallery();
  if (n === 'dashboard') { try { var u = auth.currentUser; if (u) loadDashboard(u); } catch(e) {} }
}
function toggleMobile() { document.getElementById('mobile-nav').classList.toggle('open'); }
function closeMobile()   { document.getElementById('mobile-nav').classList.remove('open'); }
function toggleFAQ(el)   { el.classList.toggle('open'); }
function showToast(m) {
  var t = document.getElementById('toast');
  t.textContent = m; t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 3500);
}

// Images
function gi(k) { return (typeof IMGS !== 'undefined' && IMGS[k]) ? IMGS[k] : ''; }
function applyImages() {
  function s(id, k) { var e = document.getElementById(id); if (e) e.src = gi(k); }
  s('hero-img','home');
  s('svc-bridal','bridal'); s('svc-saree','saree'); s('svc-party','party');
  ['bridal','saree','party','engagement','hair','trial'].forEach(function(k,i){ s('gp-'+i,k); });
  s('srv-bridal','bridal'); s('srv-saree','saree'); s('srv-party','party');
  s('srv-hair','hair'); s('srv-trial','trial'); s('srv-engagement','engagement');
  s('about-owner','owner');
}

// Gallery
var currentFilter = 'All';
var galleryData = [
  {k:'bridal',cat:'Bridal'},{k:'saree',cat:'Saree Draping'},{k:'party',cat:'Party'},
  {k:'engagement',cat:'Bridal'},{k:'hair',cat:'Hair'},{k:'trial',cat:'Bridal'},
  {k:'home',cat:'Bridal'},{k:'party',cat:'Party'},{k:'saree',cat:'Saree Draping'},
  {k:'hair',cat:'Hair'},{k:'engagement',cat:'Bridal'},{k:'trial',cat:'Party'}
];
function renderGallery(f) {
  if (f) currentFilter = f;
  var items = currentFilter === 'All' ? galleryData : galleryData.filter(function(i){ return i.cat === currentFilter; });
  var el = document.getElementById('gallery-masonry');
  if (el) el.innerHTML = items.map(function(item){
    return '<div class="masonry-item"><img src="'+gi(item.k)+'" alt="'+item.cat+'" loading="lazy"></div>';
  }).join('');
}
function filterGallery(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  renderGallery(cat);
}

// Init on load
window.addEventListener('load', function() {
  document.getElementById('year').textContent = new Date().getFullYear();
  applyImages();
  renderGallery();
});
