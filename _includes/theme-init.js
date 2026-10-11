try {
  var savedTheme = localStorage.getItem('theme-preference');
  if (['light', 'dark', 'claude', 'codex'].indexOf(savedTheme) >= 0) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
} catch (error) { /* The system theme remains available without storage. */ }
