const themeToggle = document.getElementById('themeToggle');
const themeIcon   = themeToggle.querySelector('.theme-icon');

function setTheme(isLight) {
  document.body.classList.toggle('light', isLight);
  themeIcon.textContent = isLight ? '🌙' : '☀️';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

setTheme(localStorage.getItem('theme') === 'light');
themeToggle.addEventListener('click', () => setTheme(!document.body.classList.contains('light')));
