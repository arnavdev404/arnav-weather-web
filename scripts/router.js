'use strict';
(() => {
  const routes = ['dashboard','search','hourly','fiveday','airquality','favorites','settings'];
  const titles = {dashboard:'Dashboard',search:'Search Cities',hourly:'Hourly Forecast',fiveday:'5 Day Forecast',airquality:'Air Quality',favorites:'Favorite Cities',settings:'Settings'};
  let current = 'dashboard';
  function navigate(route, push = true) {
    if (!routes.includes(route)) route = 'dashboard';
    current = route;
    document.querySelectorAll('.aw-view').forEach(el => el.classList.toggle('aw-view--active', el.id === `aw-view-${route}`));
    document.querySelectorAll('[data-route]').forEach(el => {
      const active = el.dataset.route === route;
      el.classList.toggle('aw-nav-item--active', active);
      if (active) el.setAttribute('aria-current','page'); else el.removeAttribute('aria-current');
    });
    const title = document.getElementById('aw-header-title'); if (title) title.textContent = titles[route];
    if (push) history.replaceState(null,'',`#${route}`);
    document.getElementById('aw-more-menu')?.classList.remove('is-open');
    window.dispatchEvent(new CustomEvent('aw:routechange',{detail:{route}}));
    window.scrollTo({top:0,behavior:'smooth'});
  }
  document.addEventListener('DOMContentLoaded', () => navigate(location.hash.slice(1) || 'dashboard', false));
  window.addEventListener('hashchange', () => navigate(location.hash.slice(1), false));
  window.awRouter = { navigate, get current(){return current;} };
})();
