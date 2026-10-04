try {
  var savedTheme = localStorage.getItem('theme-preference');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
} catch (error) { /* The system theme remains available without storage. */ }
