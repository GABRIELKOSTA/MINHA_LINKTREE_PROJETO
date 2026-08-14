const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
const shareButton = document.querySelector('#share-button');
const toast = document.querySelector('#toast');
const savedTheme = localStorage.getItem('link-page-theme');

if (savedTheme === 'light' || savedTheme === 'dark') {
  root.dataset.theme = savedTheme;
}

themeToggle.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = nextTheme;
  localStorage.setItem('link-page-theme', nextTheme);
});

document.querySelectorAll('.accordion__trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const accordion = trigger.closest('.accordion');
    const isOpen = accordion.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  });
});

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

async function copyCurrentUrl() {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(window.location.href);
    return;
  }

  const input = document.createElement('textarea');
  input.value = window.location.href;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  input.remove();
}

shareButton.addEventListener('click', async () => {
  const shareData = {
    title: document.title,
    text: 'Confira todos os meus links!',
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await copyCurrentUrl();
    showToast('Link copiado!');
  } catch (error) {
    if (error.name !== 'AbortError') showToast('Não foi possível compartilhar');
  }
});

document.querySelector('#current-year').textContent = new Date().getFullYear();
