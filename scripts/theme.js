'use strict';
(() => {
  const KEY = 'arnav-weather-theme';
  const meta = document.querySelector('meta[name="theme-color"]');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const getPreference = () => localStorage.getItem(KEY) || 'system';
  const resolved = pref => pref === 'system' ? (media.matches ? 'dark' : 'light') : pref;
  function apply(pref, persist = true) {
    if (!['light','dark','system'].includes(pref)) pref = 'system';
    if (persist) localStorage.setItem(KEY, pref);
    const theme = resolved(pref);
    document.documentElement.dataset.theme = theme;
    if (meta) meta.content = theme === 'dark' ? '#07111F' : '#F6FBFF';
    document.querySelectorAll('.aw-theme-switch__input').forEach(input => {
      input.checked = theme === 'dark';
      input.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
    document.querySelectorAll('.aw-theme-option').forEach(btn => btn.classList.toggle('is-active', btn.dataset.theme === pref));
    window.dispatchEvent(new CustomEvent('aw:themechange', { detail: { preference: pref, theme } }));
  }
  function toggle() { apply(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); }
  document.addEventListener('DOMContentLoaded', () => {
    apply(getPreference(), false);
    document.querySelectorAll('.aw-theme-switch__input').forEach(input => input.addEventListener('change', toggle));
    document.querySelectorAll('.aw-theme-option').forEach(btn => btn.addEventListener('click', () => apply(btn.dataset.theme)));
  });
  media.addEventListener?.('change', () => { if (getPreference() === 'system') apply('system', false); });
  window.awTheme = { apply, toggle, getPreference, get resolvedTheme(){ return document.documentElement.dataset.theme; } };
})();
