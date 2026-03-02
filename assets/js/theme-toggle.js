;(function() {
  var STORAGE_KEY = 'theme-preference'
  var MODES = ['auto', 'light', 'dark']

  function normalizeMode(mode) {
    return MODES.indexOf(mode) >= 0 ? mode : 'auto'
  }

  function getStoredMode() {
    try {
      return normalizeMode(localStorage.getItem(STORAGE_KEY))
    } catch (err) {
      return 'auto'
    }
  }

  function setStoredMode(mode) {
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch (err) {
      // Ignore localStorage failures.
    }
  }

  function getModeLabel(mode) {
    if (mode === 'light') {
      return 'Light'
    }
    if (mode === 'dark') {
      return 'Dark'
    }
    return 'Auto'
  }

  function updateButton(mode) {
    var button = document.getElementById('theme-toggle')
    if (!button) {
      return
    }
    var label = getModeLabel(mode)
    button.textContent = label
    button.setAttribute('data-mode', mode)
    button.setAttribute('aria-label', 'Theme mode: ' + label)
    button.setAttribute('title', 'Theme: ' + label + ' (click to switch)')
  }

  function applyMode(mode) {
    var root = document.documentElement
    if (mode === 'auto') {
      root.removeAttribute('data-theme')
      root.style.colorScheme = 'light dark'
    } else {
      root.setAttribute('data-theme', mode)
      root.style.colorScheme = mode
    }
    updateButton(mode)
  }

  function getNextMode(mode) {
    var index = MODES.indexOf(mode)
    return MODES[(index + 1) % MODES.length]
  }

  function bindSystemChangeListener(getCurrentMode) {
    if (typeof window.matchMedia !== 'function') {
      return
    }

    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    var onChange = function() {
      if (getCurrentMode() === 'auto') {
        applyMode('auto')
      }
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', onChange)
      return
    }
    if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(onChange)
    }
  }

  function initThemeToggle() {
    var mode = getStoredMode()
    applyMode(mode)

    var button = document.getElementById('theme-toggle')
    if (button) {
      button.addEventListener('click', function() {
        mode = getNextMode(mode)
        setStoredMode(mode)
        applyMode(mode)
      })
    }

    bindSystemChangeListener(function() {
      return mode
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle)
  } else {
    initThemeToggle()
  }
})()
