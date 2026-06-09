/* ============================================================
   G-Y-M — Main JavaScript
   Three.js | GSAP | Motion One | Nav | Scroll
============================================================ */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
const { animate, inView } = Motion;

/* ── THREE.JS: Hero Particles ─────────────────────────────── */
(function () {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;';
  document.getElementById('hero').appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 5;

  // Particles
  const COUNT = 200;
  const geo   = new THREE.BufferGeometry();
  const pos   = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    pos[i*3]   = (Math.random() - 0.5) * 20;
    pos[i*3+1] = (Math.random() - 0.5) * 12;
    pos[i*3+2] = (Math.random() - 0.5) * 8;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xD4A017, size: 0.06, transparent: true, opacity: 0.5 })));

  // Wireframe icosahedron
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.4, 1),
    new THREE.MeshBasicMaterial({ color: 0xD4A017, wireframe: true, transparent: true, opacity: 0.07 })
  );
  ico.position.set(3, 0, -1);
  scene.add(ico);

  // Torus
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.8, 0.02, 8, 60),
    new THREE.MeshBasicMaterial({ color: 0xC0392B, transparent: true, opacity: 0.1 })
  );
  torus.position.set(-3.5, 1, -1);
  scene.add(torus);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / innerWidth  - 0.5) * 2;
    my = (e.clientY / innerHeight - 0.5) * 2;
  });

  function resize() {
    const h = document.getElementById('hero');
    renderer.setSize(h.offsetWidth, h.offsetHeight);
    camera.aspect = h.offsetWidth / h.offsetHeight;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  let t = 0;
  (function tick() {
    requestAnimationFrame(tick);
    t += 0.005;
    scene.children[0].rotation.y = t * 0.15 + mx * 0.1;
    scene.children[0].rotation.x = my * 0.06;
    ico.rotation.x   += 0.004;  ico.rotation.y   += 0.006;
    torus.rotation.x  += 0.008; torus.rotation.z  += 0.003;
    const s = 1 + Math.sin(t * 1.2) * 0.04;
    ico.scale.set(s, s, s);
    renderer.render(scene, camera);
  })();
})();

/* ── GSAP: Hero Entrance ──────────────────────────────────── */
gsap.timeline({ defaults: { ease: 'power4.out' } })
  .from('.hero-tag',              { y: 40, opacity: 0, duration: 0.7, delay: 0.3 })
  .from('.hero-h1',               { y: 60, opacity: 0, duration: 0.8 }, '-=0.4')
  .from('.hero-sub',              { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
  .from('.hero-btns a',           { y: 20, opacity: 0, duration: 0.5, stagger: 0.15 }, '-=0.3')
  .from('.hero-stats .hero-stat', { y: 30, opacity: 0, duration: 0.5, stagger: 0.1  }, '-=0.2')
  .from('.hero-img',              { x: 80, opacity: 0, duration: 1,   ease: 'power3.out' }, 0.5);

/* ── GSAP ScrollTrigger: Section Animations ──────────────── */
gsap.from('.feature-card',      { scrollTrigger: { trigger: '#about',        start: 'top 70%' }, x: -60, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' });
gsap.from('.program-card',      { scrollTrigger: { trigger: '#programs',     start: 'top 70%' }, scale: 0.85, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(1.2)' });
gsap.from('.process-card',      { scrollTrigger: { trigger: '#process',      start: 'top 75%' }, rotationY: -40, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out', transformPerspective: 800 });
gsap.from('.pricing-card',      { scrollTrigger: { trigger: '#pricing',      start: 'top 75%' }, y: 80, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'back.out(1.3)' });
gsap.from('.testi-card',        { scrollTrigger: { trigger: '#testimonials', start: 'top 75%' }, x: 60, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out' });
gsap.from('.trainer-card',      { scrollTrigger: { trigger: '#trainers',     start: 'top 80%' }, x: 80, opacity: 0, duration: 0.6, stagger: 0.1,  ease: 'power2.out' });
gsap.from('.contact-info-item', { scrollTrigger: { trigger: '#contact',      start: 'top 75%' }, x: -50, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' });
gsap.from('.contact-form',      { scrollTrigger: { trigger: '#contact',      start: 'top 75%' }, x: 50, opacity: 0, duration: 0.8, ease: 'power2.out' });
gsap.from('.cta-banner h2, .cta-banner p, .cta-banner-btns', { scrollTrigger: { trigger: '.cta-banner', start: 'top 80%' }, y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out' });

// Section title clip reveal
gsap.utils.toArray('.section-title').forEach(el => {
  gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 85%' }, clipPath: 'inset(0 100% 0 0)', opacity: 0, duration: 0.9, ease: 'power3.out' });
});

// Hero image parallax
gsap.to('.hero-img', { scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 }, y: -60, ease: 'none' });

/* ── Motion One: 3D Card Tilt ─────────────────────────────── */
document.querySelectorAll('.feature-card, .pricing-card, .testi-card').forEach(card => {
  card.addEventListener('mouseenter', () => animate(card, { scale: 1.03, translateY: -8 }, { duration: 0.3, easing: [0.34, 1.56, 0.64, 1] }));
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 16;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 16;
    animate(card, { rotateY: x, rotateX: -y }, { duration: 0.08, easing: 'linear' });
  });
  card.addEventListener('mouseleave', () => animate(card, { rotateY: 0, rotateX: 0, scale: 1, translateY: 0 }, { duration: 0.5, easing: [0.25, 0.46, 0.45, 0.94] }));
});

/* ── Motion One: Button Spring ────────────────────────────── */
document.querySelectorAll('.btn-primary, .btn-outline, .btn-plan, .nav-cta').forEach(btn => {
  btn.addEventListener('mouseenter', () => animate(btn, { scale: 1.06 }, { duration: 0.25, easing: [0.34, 1.56, 0.64, 1] }));
  btn.addEventListener('mouseleave', () => animate(btn, { scale: 1   }, { duration: 0.2 }));
  btn.addEventListener('mousedown',  () => animate(btn, { scale: 0.95 }, { duration: 0.1 }));
  btn.addEventListener('mouseup',    () => animate(btn, { scale: 1.04 }, { duration: 0.2, easing: [0.34, 1.56, 0.64, 1] }));
});

/* ── Motion One: Footer inView ────────────────────────────── */
inView('.footer-grid > div', ({ target }) => {
  animate(target, { opacity: [0, 1], y: [40, 0] }, { duration: 0.6, easing: [0.25, 0.46, 0.45, 0.94] });
});

/* ── Navbar ───────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));

/* ── Mobile Nav ───────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
hamburger.addEventListener('click', () => mobileNav.classList.toggle('open'));
function closeMobileNav() { mobileNav.classList.remove('open'); }

/* ── Smooth Anchor Scroll ─────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    closeMobileNav();
    gsap.to(window, { scrollTo: { y: target, offsetY: 72 }, duration: 1, ease: 'power3.inOut' });
  });
});
