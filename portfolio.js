const root = document.documentElement;
const themeButton = document.querySelector('#portfolio-theme');
const menuButton = document.querySelector('#menu-button');
const mobileNav = document.querySelector('#mobile-nav');
const header = document.querySelector('.site-header');
const progress = document.querySelector('.page-progress span');
const savedTheme = localStorage.getItem('link-page-theme');

if (savedTheme === 'light' || savedTheme === 'dark') {
  root.dataset.theme = savedTheme;
}

themeButton?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = nextTheme;
  localStorage.setItem('link-page-theme', nextTheme);
});

function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Abrir menu');
  mobileNav?.classList.remove('is-open');
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  mobileNav?.classList.toggle('is-open', !isOpen);
});

mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

function updateScrollUi() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? scrollTop / scrollable : 0;
  progress.style.transform = `scaleX(${ratio})`;
  header?.classList.toggle('is-scrolled', scrollTop > 20);
}

window.addEventListener('scroll', updateScrollUi, { passive: true });
updateScrollUi();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -45px' });

  revealItems.forEach((item) => revealObserver.observe(item));
}

if (window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.setProperty('--tilt-x', `${x * 2.5}deg`);
      card.style.setProperty('--tilt-y', `${y * -2.5}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    });
  });
}

document.querySelector('#portfolio-year').textContent = new Date().getFullYear();
