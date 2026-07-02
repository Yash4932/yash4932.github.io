// ============================================
// YASH SHAH — PORTFOLIO SCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hide'), 500);
  });
  // fallback in case load event already fired
  setTimeout(() => loader && loader.classList.add('hide'), 2200);

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('ys-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  root.setAttribute('data-theme', savedTheme || (prefersLight ? 'light' : 'dark'));

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('ys-theme', next);
  });

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById('scroll-progress');
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('backTop');

  function onScroll(){
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
    navbar.classList.toggle('scrolled', h.scrollTop > 10);
    backTop.classList.toggle('show', h.scrollTop > 480);
  }
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  backTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  function closeNav(){
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('show');
    document.body.classList.remove('no-scroll');
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    if(isOpen){ closeNav(); }
    else {
      navToggle.classList.add('open');
      navLinks.classList.add('open');
      navOverlay.classList.add('show');
      document.body.classList.add('no-scroll');
    }
  });
  navOverlay.addEventListener('click', closeNav);
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  /* ---------- Scrollspy ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('nav.links a');
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => spyObserver.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Typing animation ---------- */
  const typingTarget = document.getElementById('typingText');
  const roles = [
    'Data Analyst',
    'SQL & Python Developer',
    'Power BI Dashboard Builder',
    'Turning raw data into insight',
    'ETL · DAX · Data Visualization'
  ];
  let roleIdx = 0, charIdx = 0, deleting = false;

  function typeLoop(){
    const current = roles[roleIdx];
    if (!deleting){
      charIdx++;
      typingTarget.textContent = current.slice(0, charIdx);
      if (charIdx === current.length){
        deleting = true;
        setTimeout(typeLoop, 1500);
        return;
      }
    } else {
      charIdx--;
      typingTarget.textContent = current.slice(0, charIdx);
      if (charIdx === 0){
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 65);
  }
  typeLoop();

  /* ---------- Animated KPI counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const decimals = el.dataset.count.includes('.') ? 1 : 0;
        const duration = 1200;
        const start = performance.now();
        function step(now){
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(decimals);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target.toFixed(decimals);
        }
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- Skill bars ---------- */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.style.width = entry.target.dataset.level + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillFills.forEach(f => skillObserver.observe(f));

  /* ---------- Project filter + search ---------- */
  const pills = document.querySelectorAll('.pill');
  const projCards = document.querySelectorAll('.proj-card');
  const searchInput = document.getElementById('projSearch');
  const noResults = document.getElementById('noResults');
  let activeFilter = 'all';

  function applyFilters(){
    const q = (searchInput.value || '').toLowerCase().trim();
    let visibleCount = 0;
    projCards.forEach(card => {
      const cats = card.dataset.category.split(' ');
      const text = card.dataset.search.toLowerCase();
      const matchesFilter = activeFilter === 'all' || cats.includes(activeFilter);
      const matchesSearch = !q || text.includes(q);
      const show = matchesFilter && matchesSearch;
      card.classList.toggle('hidden', !show);
      if (show) visibleCount++;
    });
    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.dataset.filter;
      applyFilters();
    });
  });
  searchInput.addEventListener('input', applyFilters);

  /* ---------- Contact form (Web3Forms) ---------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const origText = submitBtn.textContent;

    // Check access key is set
    const emailInput = form.querySelector('input[type="email"]');
const emailVal = emailInput.value.trim();
const emailPattern = /^[^\s@]+@[^\s@]+\.(com|in|net|org|edu|gov|co|io|me|info|biz|gmail|yahoo|outlook|hotmail)(\.[a-z]{2})?$/i;
if (!emailPattern.test(emailVal)) {
  formStatus.className = 'form-status show err';
  formStatus.textContent = '✕ Please enter a valid email address (e.g. name@gmail.com)';
  return;
}
    const keyField = document.getElementById('w3f_key');
    if (!keyField || keyField.value === 'YOUR_ACCESS_KEY') {
      formStatus.className = 'form-status show err';
      formStatus.textContent = '⚠ Contact form not yet activated. Please email me directly: yash4092003@gmail.com';
      return;
    }

    formStatus.className = 'form-status show';
    formStatus.textContent = '⏳ Sending…';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const data = new FormData(form);
      const json = Object.fromEntries(data.entries());

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(json)
      });
      const result = await res.json();

      if (result.success) {
        formStatus.className = 'form-status show ok';
        formStatus.textContent = '✓ Message sent — thanks! I\'ll get back to you soon.';
        form.reset();
      } else {
        throw new Error(result.message || 'Send failed');
      }
    } catch (err) {
      formStatus.className = 'form-status show err';
      formStatus.textContent = '✕ Something went wrong. Email me directly: yash4092003@gmail.com';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = origText;
    }
  });

  /* ---------- Visitor counter (local, per-browser) ---------- */
  const counterEl = document.getElementById('visitorCount');
  if (counterEl){
    let count = parseInt(localStorage.getItem('ys-visits') || '0', 10);
    count += 1;
    localStorage.setItem('ys-visits', count);
    counterEl.textContent = count;
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
